import { test, expect, type Page, type Route } from "@playwright/test";
import { applyFilters, openFilters, stockStatusSelect } from "./filters";

// Inventory metric cards (get_inventory_metrics). They load through a server
// action posted to /inventory, the same way the inventory table does.

const metricCard = (page: Page, label: string) =>
  page.getByTestId("stat-card").filter({ hasText: label });

const LABELS = ["Total stock value", "Low stock", "Out of stock"];

async function onInventoryActions(
  page: Page,
  handle: (route: Route) => Promise<void>,
) {
  await page.route(
    (url) => url.pathname === "/inventory",
    (route) => {
      const request = route.request();
      const isAction =
        request.method() === "POST" && !!request.headers()["next-action"];
      return isAction ? handle(route) : route.continue();
    },
  );
}

test("shows real figures in all three cards", async ({ page }) => {
  await page.goto("/inventory");

  await expect(metricCard(page, "Total stock value")).toContainText(
    /\$[\d,]+\.\d{2}/,
  );
  await expect(metricCard(page, "Low stock")).toContainText(/[\d,]+ items?/);
  await expect(metricCard(page, "Out of stock")).toContainText(/[\d,]+ SKUs?/);
});

test("Low stock shows 'Action required' when items are low", async ({
  page,
}) => {
  // The seeded data has low stock items.
  await page.goto("/inventory");

  await expect(metricCard(page, "Low stock")).toContainText("Action required");
});

test("metrics do not change with search or filters", async ({ page }) => {
  await page.goto("/inventory");
  await expect(metricCard(page, "Total stock value")).toContainText(/\d/);

  const before = await Promise.all(
    LABELS.map((label) => metricCard(page, label).innerText()),
  );

  await page.getByLabel("Search by SKU or item name").fill("Basmati");
  await openFilters(page);
  await stockStatusSelect(page).selectOption("critical");
  await applyFilters(page);
  await expect(page.locator("tbody tr").first()).toContainText("Critical");

  const after = await Promise.all(
    LABELS.map((label) => metricCard(page, label).innerText()),
  );
  expect(after).toEqual(before);
});

test("shows a loading marker while the figures are slow", async ({ page }) => {
  await onInventoryActions(page, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3_000));
    await route.continue();
  });

  await page.goto("/inventory");

  for (const label of LABELS) {
    await expect(metricCard(page, label)).toContainText("…");
  }
  await expect(metricCard(page, "Total stock value")).toContainText(/\d/, {
    timeout: 15_000,
  });
});

test("shows a dash, not a fake zero, when the figures fail to load", async ({
  page,
}) => {
  await onInventoryActions(page, (route) => route.abort("failed"));

  await page.goto("/inventory");

  // React Query retries 3 times (about 7 s) before reporting the error.
  for (const label of LABELS) {
    await expect(metricCard(page, label)).toContainText("—", {
      timeout: 15_000,
    });
  }
  await expect(metricCard(page, "Total stock value")).not.toContainText(
    "$0.00",
  );
});

test("Total stock value shows a short bold figure and the full amount on hover", async ({
  page,
}) => {
  await page.goto("/inventory");
  const card = metricCard(page, "Total stock value");
  // The card is label, value, caption; the value is the second paragraph.
  const value = card.locator("p").nth(1);
  await expect(value).toContainText(/\$/);

  // Short form, e.g. "$21.8M" instead of "$21,781,071.81".
  await expect(value).toHaveText(/^\$\d+(\.\d+)?[KMB]$/);

  // Bold.
  const weight = await value.evaluate((el) =>
    Number(getComputedStyle(el).fontWeight),
  );
  expect(weight).toBeGreaterThanOrEqual(600);

  // Hovering shows the exact amount in a small tooltip.
  await value.hover();
  await expect(page.getByRole("tooltip")).toHaveText(/^\$[\d,]+\.\d{2}$/);
});
