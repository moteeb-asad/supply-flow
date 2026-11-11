import { test, expect, type Page, type Route } from "@playwright/test";

// How the forgot password form behaves when the network fails. The request
// is a Next.js server action: a POST to /forgot-password with a Next-Action
// header.

test.use({ storageState: { cookies: [], origins: [] } });

const email = process.env.E2E_EMAIL ?? "";

test.beforeEach(() => {
  test.skip(!email, "E2E_EMAIL must be set");
});

const isAction = (route: Route) =>
  route.request().method() === "POST" &&
  !!route.request().headers()["next-action"];

async function onResetAction(
  page: Page,
  handle: (route: Route) => Promise<void>,
) {
  await page.route(
    (url) => url.pathname === "/forgot-password",
    (route) => (isAction(route) ? handle(route) : route.continue()),
  );
}

test("network drops while sending: shows an error and lets the user send again", async ({
  page,
}) => {
  let attempts = 0;
  // First attempt fails at the network level; later attempts go through.
  await onResetAction(page, async (route) => {
    attempts++;
    if (attempts === 1) await route.abort("failed");
    else await route.continue();
  });

  await page.goto("/forgot-password");
  await page.getByLabel("Email address").fill(email);
  const submit = page.getByRole("button", { name: /Send reset link|Sending/ });
  await submit.click();

  // Expected: a clear message and a button that works again.
  await expect(
    page.getByText(/couldn.t reach|network|connection/i),
  ).toBeVisible({
    timeout: 10_000,
  });
  await expect(submit).toHaveText("Send reset link");
  await expect(submit).toBeEnabled();

  // The failed request is not retried on its own: nothing more was sent.
  await page.waitForTimeout(2_000);
  expect(attempts).toBe(1);

  // The user sends it again once the network is back.
  await submit.click();
  await expect(
    page.getByText("Reset link sent. Check your email."),
  ).toBeVisible();
  expect(attempts).toBe(2);
});
