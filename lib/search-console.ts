import { JWT } from "google-auth-library";

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const API = "https://searchconsole.googleapis.com/webmasters/v3";

export type SCRow = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};
export type SCSeriesPoint = SCRow & { date: string };
export type SCKeyed = SCRow & { key: string };

export type SearchConsoleData = {
  configured: true;
  site: string;
  range: { start: string; end: string };
  totals: SCRow;
  series: SCSeriesPoint[];
  topQueries: SCKeyed[];
  topPages: SCKeyed[];
};
export type SearchConsoleResult =
  | SearchConsoleData
  | { configured: false; reason: string };

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

function loadCredentials() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.trim();
  if (!raw) return null;
  try {
    // Accept either a base64-encoded JSON blob or raw JSON.
    const json = raw.startsWith("{")
      ? raw
      : Buffer.from(raw, "base64").toString("utf8");
    const creds = JSON.parse(json) as { client_email?: string; private_key?: string };
    if (!creds.client_email || !creds.private_key) return null;
    return creds;
  } catch {
    return null;
  }
}

async function query(
  client: JWT,
  site: string,
  body: Record<string, unknown>
): Promise<{ rows?: Array<{ keys?: string[] } & SCRow> }> {
  const url = `${API}/sites/${encodeURIComponent(site)}/searchAnalytics/query`;
  const res = await client.request<{ rows?: Array<{ keys?: string[] } & SCRow> }>({
    url,
    method: "POST",
    data: body,
  });
  return res.data;
}

/**
 * Fetch Search Console performance for a domain/URL property.
 * Returns `{ configured: false }` (never throws) when credentials or the
 * site are missing so the dashboard can render a setup prompt instead.
 */
export async function getSearchConsoleData(
  site: string,
  days = 28
): Promise<SearchConsoleResult> {
  if (!site) return { configured: false, reason: "no_site" };
  const creds = loadCredentials();
  if (!creds) return { configured: false, reason: "no_credentials" };

  // Search Console data lags ~2-3 days; end a couple days back to avoid empty tails.
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 2);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  const range = { start: ymd(start), end: ymd(end) };

  try {
    const client = new JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: [SCOPE],
    });

    const base = { startDate: range.start, endDate: range.end };
    const [totalsRes, seriesRes, queriesRes, pagesRes] = await Promise.all([
      query(client, site, base),
      query(client, site, { ...base, dimensions: ["date"], rowLimit: days + 5 }),
      query(client, site, { ...base, dimensions: ["query"], rowLimit: 10 }),
      query(client, site, { ...base, dimensions: ["page"], rowLimit: 10 }),
    ]);

    const totals: SCRow = totalsRes.rows?.[0]
      ? {
          clicks: totalsRes.rows[0].clicks,
          impressions: totalsRes.rows[0].impressions,
          ctr: totalsRes.rows[0].ctr,
          position: totalsRes.rows[0].position,
        }
      : { clicks: 0, impressions: 0, ctr: 0, position: 0 };

    const series: SCSeriesPoint[] = (seriesRes.rows ?? []).map((r) => ({
      date: r.keys?.[0] ?? "",
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    }));

    const keyed = (rows: typeof queriesRes.rows): SCKeyed[] =>
      (rows ?? []).map((r) => ({
        key: r.keys?.[0] ?? "",
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position,
      }));

    return {
      configured: true,
      site,
      range,
      totals,
      series,
      topQueries: keyed(queriesRes.rows),
      topPages: keyed(pagesRes.rows),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[search-console] query failed:", message);
    // Surface auth/permission problems distinctly so the UI can hint at the fix.
    if (/permission|403|forbidden/i.test(message)) {
      return { configured: false, reason: "no_access" };
    }
    return { configured: false, reason: "error" };
  }
}
