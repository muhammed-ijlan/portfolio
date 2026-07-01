import { test, expect } from "@playwright/test";

const EMAIL = process.env.ADMIN_EMAIL || "";
const PASSWORD = process.env.ADMIN_PASSWORD || "";

test.describe("Admin login (UI)", () => {
  test.beforeAll(() => {
    if (!EMAIL || !PASSWORD) {
      throw new Error("ADMIN_EMAIL / ADMIN_PASSWORD must be set (loaded from .env).");
    }
  });

  test("rejects an incorrect password", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill("#email", EMAIL);
    await page.fill("#password", "wrong-password-123");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page.locator(".login-error")).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("signs in with valid credentials and reaches the panel", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill("#email", EMAIL);
    await page.fill("#password", PASSWORD);
    await page.getByRole("button", { name: /sign in/i }).click();

    // Login form unmounts once redirected into the panel.
    await expect(page.locator("#password")).toHaveCount(0);
    await expect(page).toHaveURL(/\/admin(?!\/login)/);

    // The browser now holds a valid session cookie.
    const me = await page.request.get("/api/auth/me");
    expect(me.ok()).toBeTruthy();
  });
});
