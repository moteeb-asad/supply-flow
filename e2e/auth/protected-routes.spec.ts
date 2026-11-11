import { test, expect } from "@playwright/test";

// Every app page needs a session (middleware.ts). Detail pages fall under
// their section, e.g. /purchase-orders/<id>.
const PROTECTED_ROUTES = [
  "/dashboard",
  "/purchase-orders",
  "/purchase-orders/00000000-0000-0000-0000-000000000000",
  "/sku-receiving",
  "/inventory",
  "/suppliers",
  "/reports",
  "/settings",
  "/settings/account",
  "/settings/user-management",
  "/settings/user-management/invitations",
];

test.describe("signed out", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  for (const route of PROTECTED_ROUTES) {
    test(`${route} redirects to the login page`, async ({ page }) => {
      await page.goto(route);

      await page.waitForURL("**/login");
      await expect(
        page.getByRole("heading", { name: "Sign in to SupplyFlow" }),
      ).toBeVisible();
    });
  }

  test("the login and forgot password pages open without a session", async ({
    page,
  }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/\/login$/);

    await page.goto("/forgot-password");
    await expect(page).toHaveURL(/\/forgot-password$/);
  });
});

test.describe("signed in (saved session from auth.setup.ts)", () => {
  test("opens a protected page without being sent to login", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(
      page.getByRole("heading", { name: /Welcome back/ }),
    ).toBeVisible();
  });
});
