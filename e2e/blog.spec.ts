import { test, expect } from "./fixtures";

test.describe("Blog — public", () => {
  test("index renders featured post, tag filters and cards", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { name: /Notes from the/i })).toBeVisible();
    await expect(page.locator(".blog-featured")).toBeVisible();
    await expect(page.locator(".blog-card").first()).toBeVisible();

    const web3 = page.getByRole("tab", { name: "Web3" });
    await web3.click();
    await expect(page.locator(".blog-card").first()).toBeVisible();
  });

  test("opens an article with reading progress, body and author card", async ({ page }) => {
    await page.goto("/blog");
    await page.locator(".blog-featured").click();
    await expect(page).toHaveURL(/\/blog\/[a-z0-9-]+$/);
    await expect(page.locator("h1.article-title")).toBeVisible();
    await expect(page.locator(".reading-progress")).toBeAttached();
    await expect(page.locator(".article-body pre").first()).toBeVisible();
    await expect(page.locator(".author-card")).toBeVisible();
  });

  test("the Writing nav link reaches the blog", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Writing" }).click();
    await expect(page).toHaveURL(/\/blog$/);
    await expect(page.getByRole("heading", { name: /Notes from the/i })).toBeVisible();
  });

  test("unknown slug shows the not-found page", async ({ page }) => {
    await page.goto("/blog/this-post-does-not-exist");
    await expect(page.locator("body")).toContainText(/not found|404/i);
  });
});

test.describe("Blog — API", () => {
  test("GET /api/blog requires auth", async ({ request }) => {
    expect((await request.get("/api/blog")).status()).toBe(401);
  });

  test("published posts are readable and listed", async ({ authed }) => {
    const res = await authed.get("/api/blog");
    expect(res.ok()).toBeTruthy();
    const { data } = await res.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThanOrEqual(6);
  });

  test("post lifecycle: create → read → update → delete", async ({ authed }) => {
    const slug = `e2e-post-${Date.now()}`;
    const create = await authed.post("/api/blog", {
      data: { title: "E2E Post", slug, excerpt: "temp", content: "## Heading\n\nBody paragraph.", tags: ["Test"], status: "draft" },
    });
    expect(create.status()).toBe(201);
    const id = (await create.json()).data.id;

    const get = await authed.get(`/api/blog/${id}`);
    expect((await get.json()).data.title).toBe("E2E Post");

    const upd = await authed.put(`/api/blog/${id}`, { data: { status: "published", title: "E2E Post (edited)" } });
    const updated = (await upd.json()).data;
    expect(updated.status).toBe("published");
    expect(updated.title).toBe("E2E Post (edited)");

    expect((await authed.delete(`/api/blog/${id}`)).ok()).toBeTruthy();
    expect((await authed.get(`/api/blog/${id}`)).status()).toBe(404);
  });
});
