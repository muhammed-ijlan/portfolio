import { test, expect } from "./fixtures";

test.describe("Auth & session", () => {
  test("me returns 401 without a session", async ({ request }) => {
    expect((await request.get("/api/auth/me")).status()).toBe(401);
  });

  test("me returns the user when authenticated", async ({ authed }) => {
    const res = await authed.get("/api/auth/me");
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json.data.user.email).toBe((process.env.ADMIN_EMAIL || "").toLowerCase());
  });

  test("logout clears the session", async ({ authed }) => {
    expect((await authed.get("/api/auth/me")).status()).toBe(200);
    expect((await authed.post("/api/auth/logout")).ok()).toBeTruthy();
    expect((await authed.get("/api/auth/me")).status()).toBe(401);
  });

  for (const path of [
    "/api/projects",
    "/api/skills",
    "/api/experience",
    "/api/messages",
    "/api/settings",
    "/api/media",
    "/api/analytics/ga4",
    "/api/analytics/search-console",
  ]) {
    test(`protected: GET ${path} rejects anonymous access`, async ({ request }) => {
      expect((await request.get(path)).status()).toBe(401);
    });
  }

  test("change-password rejects a wrong current password (no change made)", async ({ authed }) => {
    const res = await authed.post("/api/auth/change-password", {
      data: { currentPassword: "totally-wrong", newPassword: "a-strong-new-pass-123" },
    });
    expect(res.status()).toBe(403);
  });

  test("change-password rejects a too-short new password (no change made)", async ({ authed }) => {
    const res = await authed.post("/api/auth/change-password", {
      data: { currentPassword: process.env.ADMIN_PASSWORD, newPassword: "short" },
    });
    expect(res.status()).toBe(422);
  });
});
