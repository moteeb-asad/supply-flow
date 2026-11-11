import { test, expect, type Page, type Route } from "@playwright/test";

// How the login form behaves when the network is slow, drops, or the user
// clicks more than once. Login is a Next.js server action: the browser sends
// a POST to /login with a Next-Action header, so that is the request to
// intercept.

test.use({ storageState: { cookies: [], origins: [] } });

const email = process.env.E2E_EMAIL ?? "";
const password = process.env.E2E_PASSWORD ?? "";

test.beforeEach(() => {
  test.skip(!email || !password, "E2E_EMAIL and E2E_PASSWORD must be set");
});

const isLoginAction = (route: Route) => {
  const request = route.request();
  return request.method() === "POST" && !!request.headers()["next-action"];
};

async function onLoginAction(
  page: Page,
  handle: (route: Route) => Promise<void>,
) {
  await page.route(
    (url) => url.pathname === "/login",
    (route) => (isLoginAction(route) ? handle(route) : route.continue()),
  );
}

async function fillAndSubmit(page: Page) {
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  const submit = page.getByRole("button", { name: /Sign in|Signing in/ });
  await submit.click();
  return submit;
}

test.beforeEach(async ({ page }) => {
  await page.goto("/login");
});

test("shows a disabled 'Signing in...' button while the request is slow", async ({
  page,
}) => {
  await onLoginAction(page, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3_000));
    await route.continue();
  });

  const submit = await fillAndSubmit(page);

  await expect(submit).toHaveText("Signing in...");
  await expect(submit).toBeDisabled();

  await page.waitForURL("**/dashboard", { timeout: 15_000 });
});

test("shows an error and lets the user retry when the network drops", async ({
  page,
}) => {
  await onLoginAction(page, (route) => route.abort("failed"));

  const submit = await fillAndSubmit(page);

  // Expected: a clear message, not a crash or a stuck button.
  await expect(
    page.getByText(/couldn.t reach|network|connection/i),
  ).toBeVisible({
    timeout: 10_000,
  });
  await expect(submit).toHaveText("Sign in");
  await expect(submit).toBeEnabled();
  await expect(page).toHaveURL(/\/login/);
});

test("sends only one login request when Sign in is clicked several times", async ({
  page,
}) => {
  let loginRequests = 0;
  await onLoginAction(page, async (route) => {
    loginRequests++;
    await route.continue();
  });

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click({ clickCount: 3 });

  await page.waitForURL("**/dashboard", { timeout: 15_000 });
  expect(loginRequests).toBe(1);
});

test("recovers when the server signed in but the response was lost", async ({
  page,
}) => {
  // Let the request reach the server (Supabase accepts the login), then drop
  // the response, so the session cookie never reaches the browser.
  await onLoginAction(page, async (route) => {
    await route.fetch();
    await route.abort("failed");
  });

  const submit = await fillAndSubmit(page);

  // Expected: the form does not stay stuck on "Signing in...".
  await expect(submit).toHaveText("Sign in", { timeout: 10_000 });

  // Back online: no session arrived, so the user is still signed out and can
  // simply sign in again.
  await page.unroute("**/*");
  await page.reload();
  await expect(page).toHaveURL(/\/login/);

  await fillAndSubmit(page);
  await page.waitForURL("**/dashboard", { timeout: 15_000 });
});
