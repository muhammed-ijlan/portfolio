import { test, expect } from "./fixtures";

test.describe("Analytics dashboard APIs", () => {
  test("GA4 endpoint returns configured data", async ({ authed }) => {
    const r = await authed.get("/api/analytics/ga4");
    expect(r.ok()).toBeTruthy();
    const json = await r.json();
    expect(json.ok).toBe(true);
    expect(json.data.configured, `GA4 not configured: ${JSON.stringify(json.data)}`).toBe(true);
  });

  test("Search Console endpoint returns configured data", async ({ authed }) => {
    const r = await authed.get("/api/analytics/search-console");
    expect(r.ok()).toBeTruthy();
    const json = await r.json();
    expect(json.ok).toBe(true);
    expect(json.data.configured, `SC not configured: ${JSON.stringify(json.data)}`).toBe(true);
  });
});
