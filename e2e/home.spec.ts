import { test, expect } from "@playwright/test";

const SECTIONS = ["home", "about", "experience", "skills", "projects", "contact"];

test.describe("Public site", () => {
  test("home renders every section, correct title, and no page errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));

    await page.goto("/");
    await expect(page).toHaveTitle(/Ijlan/i);

    for (const id of SECTIONS) {
      const el = page.locator(`#${id}`);
      await el.scrollIntoViewIfNeeded();
      await expect(el, `section #${id} should render`).toBeVisible();
    }

    await expect(page.getByRole("heading", { name: /build something/i })).toBeVisible();
    expect(errors, `console/page errors:\n${errors.join("\n")}`).toEqual([]);
  });

  test("in-page navigation jumps to a section", async ({ page }) => {
    await page.goto("/");
    const link = page.locator('a[href="#contact"]').first();
    await expect(link).toHaveCount(1);
    await link.click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator("#contact")).toBeInViewport();
  });
});
