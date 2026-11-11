import { test, expect, type Page, type Route } from "@playwright/test";

// Supplier metric cards (get_supplier_overview_metrics). They load through a
// server action posted to /suppliers, the same way the supplier list does.

const metricCard = (page: Page, label: string) =>
  page.getByTestId("stat-card").filter({ hasText: label });

const LABELS = [
  "Active suppliers",
  "Average performance score",
  "Total spend this year",
];

async function onSupplierActions(
  page: Page,
  handle: (route: Route) => Promise<void>,
) {
  await page.route(
    (url) => url.pathname === "/suppliers",
    (route) => {
      const request = route.request();
      const isAction =
        request.method() === "POST" && !!request.headers()["next-action"];
      return isAction ? handle(route) : route.continue();
    },
  );
}

test("shows real figures in all three cards", async ({ page }) => {
  await page.goto("/suppliers");

  await expect(metricCard(page, "Active suppliers")).toContainText(/\d/);
  await expect(metricCard(page, "Average performance score")).toContainText(
    /\d+(\.\d)?%/,
  );
  await expect(metricCard(page, "Total spend this year")).toContainText(
    /\$[\d,]+\.\d{2}/,
  );
  await expect(metricCard(page, "Average performance score")).toContainText(
    /[\d,]+ of [\d,]+ deliveries on time this year/,
  );
});

test("metrics do not change with search or the category filter", async ({
  page,
}) => {
  await page.goto("/suppliers");
  await expect(metricCard(page, "Active suppliers")).toContainText(/\d/);

  const before = await Promise.all(
    LABELS.map((label) => metricCard(page, label).innerText()),
  );

  await page.getByLabel("Search suppliers").fill("PrimeGrain");
  await page
    .getByRole("group", { name: "Category" })
    .getByRole("button", { name: "Liquid" })
    .click();
  await expect(page.getByRole("list").getByRole("link").first()).toBeVisible();

  const after = await Promise.all(
    LABELS.map((label) => metricCard(page, label).innerText()),
  );
  expect(after).toEqual(before);
});

test("shows a loading marker while the figures are slow", async ({ page }) => {
  await onSupplierActions(page, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3_000));
    await route.continue();
  });

  await page.goto("/suppliers");

  for (const label of LABELS) {
    await expect(metricCard(page, label)).toContainText("…");
  }
  await expect(metricCard(page, "Active suppliers")).toContainText(/\d/, {
    timeout: 15_000,
  });
});

test("shows a dash, not a fake zero, when the figures fail to load", async ({
  page,
}) => {
  await onSupplierActions(page, (route) => route.abort("failed"));

  await page.goto("/suppliers");

  // React Query retries 3 times (about 7 s) before reporting the error.
  for (const label of LABELS) {
    await expect(metricCard(page, label)).toContainText("—", {
      timeout: 15_000,
    });
  }
  await expect(metricCard(page, "Total spend this year")).not.toContainText(
    "$0.00",
  );
});

test("Total spend shows a short bold figure and the full amount on hover", async ({
  page,
}) => {
  await page.goto("/suppliers");
  const card = metricCard(page, "Total spend this year");
  // The card is label, value, caption; the value is the second paragraph.
  const value = card.locator("p").nth(1);
  await expect(value).toContainText(/\$/);

  // Short form, e.g. "$475.9M" instead of "$475,929,120.20".
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
