const API = "https://api.vercel.com/v1/query/web-analytics";

export type VercelTotals = { pageviews: number; visitors: number };
export type VercelSeriesPoint = { date: string; pageviews: number; visitors: number };
export type VercelRow = { label: string; pageviews: number; visitors: number };

export type VercelAnalyticsData = {
  configured: true;
  projectId: string;
  range: { start: string; end: string };
  totals: VercelTotals;
  series: VercelSeriesPoint[];
  topRoutes: VercelRow[];
  referrers: VercelRow[];
};
export type VercelAnalyticsResult =
  | VercelAnalyticsData
  | { configured: false; reason: string };

type AggregateRow = Record<string, unknown> & { pageviews?: number; visitors?: number };

const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const isoDay = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Read Vercel Web Analytics for the project. Mirrors the GA4 helper: never
 * throws, and reports `{ configured: false, reason }` so the dashboard can
 * explain what is missing instead of erroring.
 */
export async function getVercelAnalytics(days = 28): Promise<VercelAnalyticsResult> {
  const token = process.env.VERCEL_ANALYTICS_TOKEN?.trim();
  const projectId = process.env.VERCEL_PROJECT_ID?.trim();
  const teamId = process.env.VERCEL_TEAM_ID?.trim();

  if (!token) return { configured: false, reason: "no_token" };
  if (!projectId) return { configured: false, reason: "no_project" };

  const until = new Date();
  const since = new Date(until.getTime() - days * 24 * 60 * 60 * 1000);

  const query = (by: string, limit?: number) => {
    const p = new URLSearchParams({
      projectId,
      since: isoDay(since),
      until: isoDay(until),
      by,
    });
    if (teamId) p.set("teamId", teamId);
    if (limit) p.set("limit", String(limit));
    return p;
  };

  const run = async (by: string, limit?: number): Promise<AggregateRow[]> => {
    const res = await fetch(`${API}/visits/aggregate?${query(by, limit)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      const err = new Error(`${res.status} ${body.slice(0, 200)}`);
      (err as Error & { status?: number }).status = res.status;
      throw err;
    }
    const json = (await res.json()) as { data?: AggregateRow[] };
    return json.data ?? [];
  };

  try {
    const [dayRows, routeRows, referrerRows] = await Promise.all([
      run("day"),
      run("route", 8),
      run("referrerHostname", 6),
    ]);

    const series: VercelSeriesPoint[] = dayRows.map((r) => ({
      date: String(r.timestamp ?? "").slice(0, 10),
      pageviews: num(r.pageviews),
      visitors: num(r.visitors),
    }));

    // The aggregate endpoint returns rows, not a grand total — sum the daily
    // buckets so the headline figures always match the chart below them.
    const totals = series.reduce<VercelTotals>(
      (acc, p) => ({ pageviews: acc.pageviews + p.pageviews, visitors: acc.visitors + p.visitors }),
      { pageviews: 0, visitors: 0 }
    );

    const toRows = (rows: AggregateRow[], key: string): VercelRow[] =>
      rows.map((r) => ({
        label: String(r[key] ?? "") || "Direct",
        pageviews: num(r.pageviews),
        visitors: num(r.visitors),
      }));

    return {
      configured: true,
      projectId,
      range: { start: isoDay(since), end: isoDay(until) },
      totals,
      series,
      topRoutes: toRows(routeRows, "route"),
      referrers: toRows(referrerRows, "referrerHostname"),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const status = (err as Error & { status?: number })?.status;
    console.error("[vercel-analytics] query failed:", message);
    if (status === 401 || status === 403) return { configured: false, reason: "no_access" };
    if (status === 404) return { configured: false, reason: "bad_project" };
    return { configured: false, reason: "error" };
  }
}
