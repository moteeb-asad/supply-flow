import { test, expect, type Page } from "@playwright/test";

// These tests sign in themselves, so start without the saved session.
test.use({ storageState: { cookies: [], origins: [] } });

const email = process.env.E2E_EMAIL ?? "";
const password = process.env.E2E_PASSWORD ?? "";

const loginForm = (page: Page) => ({
  email: page.getByLabel("Email"),
  password: page.getByLabel("Password", { exact: true }),
  submit: page.getByRole("button", { name: "Sign in" }),
});

test.beforeEach(async ({ page }) => {
  await page.goto("/login");
});

test("signs in with valid credentials and lands on the dashboard", async ({
  page,
}) => {
  test.skip(!email || !password, "E2E_EMAIL and E2E_PASSWORD must be set");
  const form = loginForm(page);

  await form.email.fill(email);
  await form.password.fill(password);
  await form.submit.click();

  await page.waitForURL("**/dashboard");
  await expect(
    page.getByRole("heading", { name: /Welcome back/ }),
  ).toBeVisible();
});

test("shows an error and stays on the login page for a wrong password", async ({
  page,
}) => {
  test.skip(!email, "E2E_EMAIL must be set");
  const form = loginForm(page);

  await form.email.fill(email);
  await form.password.fill("not-the-right-password");
  await form.submit.click();

  await expect(page.getByText("Invalid login credentials")).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});

test("rejects an unknown email with the same message as a wrong password", async ({
  page,
}) => {
  const form = loginForm(page);

  await form.email.fill(`nobody-${Date.now()}@example.com`);
  await form.password.fill("whatever-password");
  await form.submit.click();

  // Same wording as a wrong password, so the page does not reveal which
  // emails have an account.
  await expect(page.getByText("Invalid login credentials")).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});

test("asks for an email when the form is submitted empty", async ({ page }) => {
  await loginForm(page).submit.click();

  await expect(page.getByText("Email is required")).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});

test("rejects an email address that is not valid", async ({ page }) => {
  const form = loginForm(page);

  await form.email.fill("abc123");
  await form.password.fill("anything");
  await form.submit.click();

  await expect(page.getByText("Invalid email address")).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});

test("handles repeated wrong passwords without breaking the form", async ({
  page,
}) => {
  test.skip(!email, "E2E_EMAIL must be set");
  const form = loginForm(page);
  await form.email.fill(email);

  for (let attempt = 1; attempt <= 5; attempt++) {
    await form.password.fill(`wrong-password-${attempt}`);
    await form.submit.click();

    await expect(page.getByText("Invalid login credentials")).toBeVisible();
    await expect(form.submit).toBeEnabled();
  }
  await expect(page).toHaveURL(/\/login/);
});

// The login form has no show/hide password toggle yet (card "Login UX").
test.fixme("toggles password visibility", async ({ page }) => {
  const form = loginForm(page);
  await form.password.fill("secret");
  await page.getByRole("button", { name: /show password/i }).click();
  await expect(form.password).toHaveAttribute("type", "text");
});
