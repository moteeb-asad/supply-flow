import { test, expect, type Page } from "@playwright/test";

// Logout calls supabase.auth.signOut(), which ends every session of that
// user. Use the store keeper account so the saved super admin session that
// other tests rely on stays valid.
test.use({ storageState: { cookies: [], origins: [] } });

const email = process.env.E2E_KEEPER_EMAIL ?? "";
const password = process.env.E2E_KEEPER_PASSWORD ?? "";

test.beforeEach(() => {
  test.skip(
    !email || !password,
    "E2E_KEEPER_EMAIL and E2E_KEEPER_PASSWORD must be set",
  );
});

async function signIn(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/dashboard");
}

async function logOut(page: Page) {
  await page.getByRole("button", { name: "Log out" }).click();
  await page.waitForURL("**/login");
}

test("logging out ends the session and returns to the login page", async ({
  page,
  context,
}) => {
  await signIn(page);
  await logOut(page);

  const authCookies = (await context.cookies()).filter((c) =>
    /^sb-.*-auth-token/.test(c.name),
  );
  expect(authCookies).toHaveLength(0);

  await page.goto("/dashboard");
  await page.waitForURL("**/login");
});

test("the browser back button after logout does not show the protected page", async ({
  page,
}) => {
  await signIn(page);
  await page.goto("/sku-receiving");
  await logOut(page);

  await page.goBack();

  // Back must not bring the signed-in page back.
  await page.waitForURL("**/login");
  await expect(
    page.getByRole("heading", { name: "Sign in to SupplyFlow" }),
  ).toBeVisible();
});
