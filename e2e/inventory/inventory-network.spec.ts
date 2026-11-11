import { test, expect, type Page, type Route } from "@playwright/test";
import { applyFilters, openFilters, stockStatusSelect } from "./filters";

// Inventory screen and the add item drawer when the network is slow or fails.
// The table, the metrics, the pickers and "Add item" are all server actions
// posted to /inventory.

async function onActions(page: Page, handle: (route: Route) => Promise<void>) {
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

const rows = (page: Page) =>
  page.locator("tbody tr").filter({ has: page.locator("td:nth-child(2)") });
const rangeText = (page: Page) => page.getByText(/\d+–\d+ of \d+ items/);
const uniqueId = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

// Retries take about 7 s before React Query reports the error.
const AFTER_RETRIES = { timeout: 15_000 };
const loadError = (page: Page) =>
  page.getByText(/couldn.t load|try again|connection/i);

// --- Table requests -----------------------------------------------------------
// Only the table request is affected (its body carries "pageSize"); the
// metrics and the page itself load normally.

async function loadInventoryThenControlTable(page: Page) {
  const network = { fail: false, delayMs: 0 };
  await page.route(
    (url) => url.pathname === "/inventory",
    async (route) => {
      const request = route.request();
      const isTable =
        request.method() === "POST" &&
        !!request.headers()["next-action"] &&
        (request.postData() ?? "").includes('"pageSize"');
      if (!isTable) return route.continue();
      if (network.delayMs) {
        await new Promise((resolve) => setTimeout(resolve, network.delayMs));
      }
      return network.fail ? route.abort("failed") : route.continue();
    },
  );
  await page.goto("/inventory");
  await expect(rows(page)).toHaveCount(6);
  return network;
}

test("table fails to load: says so instead of 'No results found'", async ({
  page,
}) => {
  await onActions(page, async (route) => {
    if ((route.request().postData() ?? "").includes('"pageSize"')) {
      await route.abort("failed");
    } else {
      await route.continue();
    }
  });

  await page.goto("/inventory");

  // An empty result and a failed load must look different.
  await expect(loadError(page)).toBeVisible(AFTER_RETRIES);
  await expect(page.getByText("No results found")).toHaveCount(0);
});

test("search fails: says the search could not run, not 'No results found'", async ({
  page,
}) => {
  const network = await loadInventoryThenControlTable(page);
  network.fail = true;

  await page.getByLabel("Search by SKU or item name").fill("Basmati");

  await expect(loadError(page)).toBeVisible(AFTER_RETRIES);
  await expect(page.getByText("No results found")).toHaveCount(0);
});

test("filter fails: says the table could not load, not old or empty rows", async ({
  page,
}) => {
  const network = await loadInventoryThenControlTable(page);
  network.fail = true;

  await openFilters(page);
  await stockStatusSelect(page).selectOption("critical");
  await applyFilters(page);

  await expect(loadError(page)).toBeVisible(AFTER_RETRIES);
  await expect(page.getByText("No results found")).toHaveCount(0);
});

test("slow category list: applying a stock filter still filters", async ({
  page,
}) => {
  // Opening Filters loads the category list. While it is loading, applying
  // another filter must still work.
  await page.route(
    (url) => url.pathname === "/inventory",
    async (route) => {
      const body = route.request().postData() ?? "";
      if (route.request().method() === "POST" && body.includes('"limit"')) {
        await new Promise((resolve) => setTimeout(resolve, 1_000));
      }
      await route.continue();
    },
  );
  await page.goto("/inventory");
  await expect(rows(page)).toHaveCount(6);
  const before = await rangeText(page).innerText();

  await page.getByRole("button", { name: "Filters" }).click();
  await stockStatusSelect(page).selectOption("critical");
  await applyFilters(page);

  await expect(rangeText(page)).not.toHaveText(before);
  await expect(page).toHaveURL(/stockStatus=critical/, { timeout: 15_000 });
  for (let i = 0; i < 6; i++) {
    await expect(rows(page).nth(i)).toContainText("Critical");
  }
});

test("slow next page: the table shows it is loading", async ({ page }) => {
  const network = await loadInventoryThenControlTable(page);
  network.delayMs = 3_000;

  await page.getByRole("button", { name: "Next page" }).click();

  await expect(page.getByText("Loading...")).toBeVisible({ timeout: 1_000 });
  await expect(rangeText(page)).toContainText("7–12 of", AFTER_RETRIES);
});

test("next page fails: keeps the current page, says why, and retry works", async ({
  page,
}) => {
  const network = await loadInventoryThenControlTable(page);
  network.fail = true;

  await page.getByRole("button", { name: "Next page" }).click();

  await expect(loadError(page)).toBeVisible(AFTER_RETRIES);
  await expect(rows(page)).toHaveCount(6);

  network.fail = false;
  await page
    .getByRole("button", { name: /Next page|Try again/ })
    .first()
    .click();
  await expect(rangeText(page)).toContainText("7–12 of");
});

// --- Add item drawer ------------------------------------------------------

async function openAndFillDrawer(page: Page, name: string, sku: string) {
  await page.goto("/inventory");
  await expect(rows(page)).toHaveCount(6);
  await page.getByRole("button", { name: "Add item" }).click();
  const form = page.getByRole("dialog", { name: "Add inventory item" });

  await form.getByLabel("Item name").fill(name);
  await form.getByLabel("SKU").fill(sku);
  await form.getByLabel("Unit", { exact: true }).selectOption("kg");
  await form.getByPlaceholder("Search and select category...").fill("Dairy");
  await form.getByRole("button", { name: "Dairy", exact: true }).click();
  await form
    .getByPlaceholder("Search and select supplier...")
    .fill("PrimeGrain");
  await form
    .getByRole("button", { name: /PrimeGrain/ })
    .first()
    .click();
  await form.getByLabel("Quantity on hand").fill("40");
  await form.getByLabel("Unit price").fill("3");
  return form;
}

test("slow save: the button shows 'Adding...' and is disabled", async ({
  page,
}) => {
  const id = uniqueId();
  const form = await openAndFillDrawer(page, `E2E Net ${id}`, `E2E-${id}`);
  await onActions(page, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3_000));
    await route.continue();
  });

  await form.getByRole("button", { name: "Add item" }).click();

  const busy = form.getByRole("button", { name: "Adding..." });
  await expect(busy).toBeVisible();
  await expect(busy).toBeDisabled();
  await expect(form).toHaveCount(0, { timeout: 15_000 });
});

test("double click on Add item creates only one item", async ({ page }) => {
  const id = uniqueId();
  const name = `E2E Net ${id}`;
  const form = await openAndFillDrawer(page, name, `E2E-${id}`);

  let creates = 0;
  await onActions(page, async (route) => {
    if ((route.request().postData() ?? "").includes(name)) creates++;
    await route.continue();
  });

  await form.getByRole("button", { name: "Add item" }).click({ clickCount: 2 });
  await expect(form).toHaveCount(0, { timeout: 10_000 });

  expect(creates).toBe(1);
  await page.getByLabel("Search by SKU or item name").fill(name);
  await expect(page.locator("tbody tr").filter({ hasText: name })).toHaveCount(
    1,
  );
});

test("save fails: shows an error, keeps the drawer and the typed values", async ({
  page,
}) => {
  const id = uniqueId();
  const name = `E2E Net ${id}`;
  const form = await openAndFillDrawer(page, name, `E2E-${id}`);
  await onActions(page, async (route) => {
    if ((route.request().postData() ?? "").includes(name)) {
      await route.abort("failed");
    } else {
      await route.continue();
    }
  });

  await form.getByRole("button", { name: "Add item" }).click();

  await expect(page.getByText(/application error/i)).toHaveCount(0);
  await expect(form.getByText(/couldn.t|connection|try again/i)).toBeVisible({
    timeout: 10_000,
  });
  await expect(form).toBeVisible();
  await expect(form.getByLabel("Item name")).toHaveValue(name);
  await expect(form.getByRole("button", { name: "Add item" })).toBeEnabled();
});
