import { test, expect } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

const email = process.env.E2E_EMAIL ?? "";

test("the login page links to the forgot password page", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("link", { name: "Forgot password?" }).click();

  await page.waitForURL("**/forgot-password");
  await expect(
    page.getByRole("heading", { name: "Forgot your password?" }),
  ).toBeVisible();
});

test("sends a reset link to a registered email", async ({ page }) => {
  test.skip(!email, "E2E_EMAIL must be set");
  await page.goto("/forgot-password");

  await page.getByLabel("Email address").fill(email);
  await page.getByRole("button", { name: "Send reset link" }).click();

  // Local Supabase delivers the email to Mailpit (http://127.0.0.1:54324).
  await expect(
    page.getByText("Reset link sent. Check your email."),
  ).toBeVisible();
});

test("asks for an email when the form is submitted empty", async ({ page }) => {
  await page.goto("/forgot-password");
  await page.getByRole("button", { name: "Send reset link" }).click();

  await expect(page.getByText("Email is required")).toBeVisible();
});

test("links back to the login page", async ({ page }) => {
  await page.goto("/forgot-password");
  await page.getByRole("link", { name: "Back to sign in" }).click();

  await page.waitForURL("**/login");
});
