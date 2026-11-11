import type { Page } from "@playwright/test";

// Opens the table's Filters panel. Opening it loads the category list (a
// server action); applying while that is still loading drops the filter (see
// inventory-network.spec.ts), so wait for it. A cached list sends no request,
// hence the short timeout.
export async function openFilters(page: Page) {
  const categories = page
    .waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        (response.request().postData() ?? "").includes('"limit"'),
      { timeout: 3_000 },
    )
    .catch(() => undefined);
  await page.getByRole("button", { name: "Filters" }).click();
  await categories;
}

export const stockStatusSelect = (page: Page) =>
  page.locator("select").filter({ hasText: "All Stock Statuses" });

export async function applyFilters(page: Page) {
  await page.getByRole("button", { name: "Apply filters" }).click();
}
