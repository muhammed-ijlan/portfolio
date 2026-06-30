import { makeJwtClient } from "./google-auth";

const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const API = "https://analyticsdata.googleapis.com/v1beta";

export type GA4Totals = {
  activeUsers: number;
  sessions: number;
  pageViews: number;
  engagementRate: number;
};
export type GA4SeriesPoint = { date: string; activeUsers: number; sessions: number };
export type GA4Channel = { channel: string; sessions: number };
export type GA4Page = { path: string; views: number };

export type GA4Data = {
  configured: true;
  propertyId: string;
  range: { start: string; end: string };
  totals: GA4Totals;
  series: GA4SeriesPoint[];
  channels: GA4Channel[];
  topPages: GA4Page[];
};
export type GA4Result = GA4Data | { configured: false; reason: string };

type GA4Row = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] };
type GA4Response = { rows?: GA4Row[] };

const num = (s?: string) => {
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};

// GA4's `date` dimension is "YYYYMMDD" — normalise to "YYYY-MM-DD".
const isoDate = (yyyymmdd: string) =>
  yyyymmdd.length === 8
    ? `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`
    : yyyymmdd;

/**
 * Fetch GA4 traffic for a property. Returns `{ configured: false, reason }`
 * (never throws) when the property id or service-account key is missing.
 */
export async function getGA4Data(propertyId: string, days = 28): Promise<GA4Result> {
  if (!propertyId) return { configured: false, reason: "no_property" };
  const client = makeJwtClient([SCOPE]);
  if (!client) return { configured: false, reason: "no_credentials" };

  const id = propertyId.replace(/^properties\//, "");
  const dateRanges = [{ startDate: `${days}daysAgo`, endDate: "today" }];
  const url = `${API}/properties/${encodeURIComponent(id)}:runReport`;

  const run = async (body: Record<string, unknown>) => {
    const res = await client.request<GA4Response>({ url, method: "POST", data: { dateRanges, ...body } });
    return res.data.rows ?? [];
  };

  try {
    const [totalsRows, seriesRows, channelRows, pageRows] = await Promise.all([
      run({ metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }, { name: "engagementRate" }] }),
      run({ dimensions: [{ name: "date" }], metrics: [{ name: "activeUsers" }, { name: "sessions" }], orderBys: [{ dimension: { dimensionName: "date" } }] }),
      run({ dimensions: [{ name: "sessionDefaultChannelGroup" }], metrics: [{ name: "sessions" }], orderBys: [{ metric: { metricName: "sessions" }, desc: true }], limit: 6 }),
      run({ dimensions: [{ name: "pagePath" }], metrics: [{ name: "screenPageViews" }], orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }], limit: 8 }),
    ]);

    const t = totalsRows[0]?.metricValues ?? [];
    const totals: GA4Totals = {
      activeUsers: num(t[0]?.value),
      sessions: num(t[1]?.value),
      pageViews: num(t[2]?.value),
      engagementRate: num(t[3]?.value),
    };

    const series: GA4SeriesPoint[] = seriesRows.map((r) => ({
      date: isoDate(r.dimensionValues?.[0]?.value ?? ""),
      activeUsers: num(r.metricValues?.[0]?.value),
      sessions: num(r.metricValues?.[1]?.value),
    }));

    const channels: GA4Channel[] = channelRows.map((r) => ({
      channel: r.dimensionValues?.[0]?.value || "Unknown",
      sessions: num(r.metricValues?.[0]?.value),
    }));

    const topPages: GA4Page[] = pageRows.map((r) => ({
      path: r.dimensionValues?.[0]?.value || "/",
      views: num(r.metricValues?.[0]?.value),
    }));

    const start = isoDate(series[0]?.date ?? "");
    const end = isoDate(series[series.length - 1]?.date ?? "");

    return { configured: true, propertyId: id, range: { start, end }, totals, series, channels, topPages };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[ga4] runReport failed:", message);
    if (/permission|403|forbidden/i.test(message)) return { configured: false, reason: "no_access" };
    if (/not found|404|invalid/i.test(message)) return { configured: false, reason: "bad_property" };
    return { configured: false, reason: "error" };
  }
}
