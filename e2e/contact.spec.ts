import { test, expect } from "@playwright/test";

test.describe("Contact form", () => {
  test("shows validation errors on an empty submit", async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: /send message/i }).click();

    await expect(page.getByText("Please enter your name")).toBeVisible();
    await expect(page.getByText("Please enter your email")).toBeVisible();
  });

  test("submits a message, verifies persistence, then cleans up", async ({ page, request }) => {
    const subject = `E2E test ${Date.now()}`;

    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.fill("#name", "E2E Bot");
    await page.fill("#contact #email", "e2e-bot@example.com");
    await page.fill("#subject", subject);
    await page.fill("#message", "Automated end-to-end test — safe to ignore.");
    await page.getByRole("button", { name: /send message/i }).click();

    await expect(page.getByRole("heading", { name: "Message sent" })).toBeVisible();

    // Verify it was stored and remove it via the authenticated API (keeps inbox clean).
    const login = await request.post("/api/auth/login", {
      data: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD },
    });
    expect(login.ok()).toBeTruthy();

    const list = await request.get("/api/messages");
    const { data } = await list.json();
    const msg = data.find((m: { subject: string; id: string }) => m.subject === subject);
    expect(msg, "submitted message should be persisted").toBeTruthy();

    const del = await request.delete(`/api/messages/${msg.id}`);
    expect(del.ok()).toBeTruthy();
  });
});
