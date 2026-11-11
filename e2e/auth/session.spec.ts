import { test, expect } from "@playwright/test";

// Uses the saved super admin session from auth.setup.ts.

test("stays signed in after a page refresh", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: /Welcome back/ }),
  ).toBeVisible();

  await page.reload();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("heading", { name: /Welcome back/ }),
  ).toBeVisible();
});

test("an invalid or expired session sends the user to the login page", async ({
  page,
  context,
}) => {
  // Replace the Supabase session cookies with values that cannot be
  // verified, as happens when a session expires or is revoked.
  const cookies = await context.cookies();
  const authCookies = cookies.filter((c) => /^sb-.*-auth-token/.test(c.name));
  expect(authCookies.length).toBeGreaterThan(0);

  await context.clearCookies();
  await context.addCookies(
    authCookies.map((c) => ({ ...c, value: "invalid-session" })),
  );

  await page.goto("/dashboard");

  await page.waitForURL("**/login");
});

test("signing in as another user in a second tab replaces the first user's session", async ({
  browser,
}) => {
  const keeperEmail = process.env.E2E_KEEPER_EMAIL ?? "";
  const keeperPassword = process.env.E2E_KEEPER_PASSWORD ?? "";
  const adminEmail = process.env.E2E_EMAIL ?? "";
  const adminPassword = process.env.E2E_PASSWORD ?? "";
  test.skip(
    !keeperEmail || !keeperPassword || !adminEmail || !adminPassword,
    "E2E_KEEPER_* and E2E_EMAIL / E2E_PASSWORD must be set",
  );

  // Two tabs in the same browser share cookies, so they share one session.
  const context = await browser.newContext({
    storageState: { cookies: [], origins: [] },
  });
  const firstTab = await context.newPage();
  const secondTab = await context.newPage();

  const signIn = async (page: typeof firstTab, email: string, pw: string) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(pw);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/dashboard");
  };

  // Tab 1: the store keeper signs in and walks away without logging out.
  await signIn(firstTab, keeperEmail, keeperPassword);
  await expect(firstTab.getByText("Store Keeper")).toBeVisible();

  // Tab 2: someone else signs in as the super admin in the same browser.
  await signIn(secondTab, adminEmail, adminPassword);
  await expect(secondTab.getByText("Super Admin")).toBeVisible();

  // Tab 1 now belongs to the super admin: the store keeper is no longer
  // signed in in this browser.
  await firstTab.reload();
  await expect(firstTab.getByText("Super Admin")).toBeVisible();
  await expect(firstTab.getByText("Store Keeper")).toHaveCount(0);

  await context.close();
});

// middleware.ts has this redirect, but its matcher skips /login, so the
// check never runs. Decide whether signed-in users should be sent on.
test.fixme("opening the login page while signed in goes to the dashboard", async ({
  page,
}) => {
  await page.goto("/login");
  await page.waitForURL("**/dashboard");
});
