import { test, expect } from "./fixtures";

test.describe("Admin CRUD", () => {
  test("project lifecycle: create → read → update → delete", async ({ authed }) => {
    const create = await authed.post("/api/projects", {
      data: { title: "E2E Project", kind: "web", desc: "temp", status: "draft" },
    });
    expect(create.status()).toBe(201);
    const id = (await create.json()).data.id;
    expect(id).toBeTruthy();

    const get = await authed.get(`/api/projects/${id}`);
    expect(get.ok()).toBeTruthy();
    expect((await get.json()).data.title).toBe("E2E Project");

    const upd = await authed.put(`/api/projects/${id}`, {
      data: { title: "E2E Project (edited)", status: "published" },
    });
    expect(upd.ok()).toBeTruthy();
    const updated = (await upd.json()).data;
    expect(updated.title).toBe("E2E Project (edited)");
    expect(updated.status).toBe("published");

    expect((await authed.delete(`/api/projects/${id}`)).ok()).toBeTruthy();
    expect((await authed.get(`/api/projects/${id}`)).status()).toBe(404);
  });

  test("skill create + delete", async ({ authed }) => {
    const c = await authed.post("/api/skills", {
      data: { title: "E2E Skill", items: ["Alpha", "Beta"] },
    });
    expect(c.status()).toBe(201);
    const id = (await c.json()).data.id;
    expect((await authed.delete(`/api/skills/${id}`)).ok()).toBeTruthy();
  });

  test("experience create + delete", async ({ authed }) => {
    const c = await authed.post("/api/experience", {
      data: { role: "E2E Role", company: "TestCo", period: "2025" },
    });
    expect(c.status()).toBe(201);
    const id = (await c.json()).data.id;
    expect((await authed.delete(`/api/experience/${id}`)).ok()).toBeTruthy();
  });

  test("settings tagline round-trip (restored afterwards)", async ({ authed }) => {
    const before = (await (await authed.get("/api/settings")).json()).data;
    const original = before.tagline;
    try {
      const put = await authed.put("/api/settings", { data: { tagline: "E2E temporary tagline" } });
      expect(put.ok()).toBeTruthy();
      expect((await put.json()).data.tagline).toBe("E2E temporary tagline");

      const verify = (await (await authed.get("/api/settings")).json()).data;
      expect(verify.tagline).toBe("E2E temporary tagline");
      // GA4 config must be untouched by a partial update.
      expect(verify.ga4MeasurementId).toBe(before.ga4MeasurementId);
    } finally {
      await authed.put("/api/settings", { data: { tagline: original } });
    }
  });
});
