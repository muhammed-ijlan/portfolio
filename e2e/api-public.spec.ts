import { test, expect } from "@playwright/test";

test.describe("Public endpoints", () => {
  test("GET /api/health reports the DB is connected", async ({ request }) => {
    const r = await request.get("/api/health");
    expect(r.ok()).toBeTruthy();
    const json = await r.json();
    expect(json.ok).toBe(true);
    expect(json.data.db).toBe("connected");
  });

  test("GET /api/portfolio returns public content", async ({ request }) => {
    const r = await request.get("/api/portfolio");
    expect(r.ok()).toBeTruthy();
    const json = await r.json();
    expect(json.ok).toBe(true);
    expect(json.data.about).toBeTruthy();
    expect(Array.isArray(json.data.projects)).toBeTruthy();
    expect(Array.isArray(json.data.skills)).toBeTruthy();
  });

  test("GET /sitemap.xml", async ({ request }) => {
    const r = await request.get("/sitemap.xml");
    expect(r.ok()).toBeTruthy();
    expect(r.headers()["content-type"]).toContain("xml");
  });

  test("GET /robots.txt", async ({ request }) => {
    const r = await request.get("/robots.txt");
    expect(r.ok()).toBeTruthy();
    expect(await r.text()).toMatch(/user-agent/i);
  });

  test("GET /manifest.webmanifest", async ({ request }) => {
    const r = await request.get("/manifest.webmanifest");
    expect(r.ok()).toBeTruthy();
    const json = await r.json();
    expect(json.name || json.short_name).toBeTruthy();
  });

  test("GET /opengraph-image renders an image", async ({ request }) => {
    const r = await request.get("/opengraph-image");
    expect(r.ok()).toBeTruthy();
    expect(r.headers()["content-type"]).toContain("image");
  });
});
