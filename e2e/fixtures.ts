import {
  test as base,
  expect,
  request as playwrightRequest,
  type APIRequestContext,
} from "@playwright/test";

type AuthFixtures = {
  /** An APIRequestContext already logged in as the admin (session cookie set). */
  authed: APIRequestContext;
};

export const test = base.extend<AuthFixtures>({
  authed: async ({ baseURL }, use) => {
    const ctx = await playwrightRequest.newContext({ baseURL });
    const res = await ctx.post("/api/auth/login", {
      data: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD },
    });
    if (!res.ok()) {
      throw new Error(
        `auth fixture: login failed (${res.status()}). Check ADMIN_EMAIL / ADMIN_PASSWORD in .env match the DB.`
      );
    }
    await use(ctx);
    await ctx.dispose();
  },
});

export { expect };
