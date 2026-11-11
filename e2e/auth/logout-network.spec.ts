import { test, expect, type Page, type Route } from "@playwright/test";

// How logout behaves when the network is slow or fails. Logout is a Next.js
// server action posted from the sidebar form, to whatever page the user is
// on (POST + Next-Action header).
//
// Uses the store keeper: signOut() ends every session of the user, and the
// saved super admin session must stay valid for other tests.
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

// Intercept only the logout server action (posted to the current page).
async function onLogoutAction(
  page: Page,
  handle: (route: Route) => Promise<void>,
) {
  await page.route("**/*", (route) => {
    const request = route.request();
    const isAction =
      request.method() === "POST" && !!request.headers()["next-action"];
    return isAction && !request.url().includes("/login")
      ? handle(route)
      : route.continue();
  });
}

const logoutButton = (page: Page) =>
  page.getByRole("button", { name: "Log out" });

async function slowLogout(page: Page) {
  let requests = 0;
  await onLogoutAction(page, async (route) => {
    requests++;
    await new Promise((resolve) => setTimeout(resolve, 3_000));
    await route.continue();
  });
  return () => requests;
}

test("slow logout: extra clicks send only one logout request", async ({
  page,
}) => {
  await signIn(page);
  const logoutRequests = await slowLogout(page);

  await logoutButton(page).click();
  await logoutButton(page).click({ force: true, clickCount: 2 });

  await page.waitForURL("**/login", { timeout: 15_000 });
  expect(logoutRequests()).toBe(1);
});

test("slow logout: the button shows that logout is in progress", async ({
  page,
}) => {
  await signIn(page);
  await slowLogout(page);

  await logoutButton(page).click();

  // Expected: while waiting the button is disabled (and looks busy), so the
  // user knows the click worked.
  await expect(logoutButton(page)).toBeDisabled({ timeout: 1_000 });

  await page.waitForURL("**/login", { timeout: 15_000 });
});

test("logout request fails: the user stays signed in, sees why, and can retry", async ({
  page,
}) => {
  await signIn(page);

  let attempts = 0;
  await onLogoutAction(page, async (route) => {
    attempts++;
    if (attempts === 1) await route.abort("failed");
    else await route.continue();
  });

  await logoutButton(page).click();

  // Expected: no crash. The session was not ended on the server, so the user
  // is still signed in, is told logout did not happen, and can try again.
  await expect(page.getByText(/application error/i)).toHaveCount(0);
  await expect(page.getByText(/couldn.t|network|connection/i)).toBeVisible({
    timeout: 10_000,
  });
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(logoutButton(page)).toBeEnabled();

  await logoutButton(page).click();
  await page.waitForURL("**/login", { timeout: 15_000 });
});
