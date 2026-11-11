import { test, expect, type Page } from "@playwright/test";
import { applyFilters, openFilters, stockStatusSelect } from "./filters";

// Inventory table (super admin, saved session). Uses the seeded local data:
// 3,000 SKUs in 17 categories, 6 rows per page, newest first. Items added by
// the add item tests running at the same time can appear on the first page.
// Stock status: critical <= 20 units, low <= 50, good above.

const PAGE_SIZE = 6;

// Applying filters calls router.replace; the URL changes only after the
// server round trip, which is slow on the dev server under parallel load.
const URL_UPDATE = { timeout: 15_000 };

// Data rows only: the empty state is a single cell spanning every column.
const rows = (page: Page) =>
  page.locator("tbody tr").filter({ has: page.locator("td:nth-child(2)") });
const search = (page: Page) => page.getByLabel("Search by SKU or item name");
const rangeText = (page: Page) => page.getByText(/\d+–\d+ of \d+ items/);
const noResults = (page: Page) => page.getByText("No results found");

async function pickCategory(page: Page, name: string) {
  await page.getByPlaceholder("Search and select category...").fill(name);
  await page.getByRole("button", { name, exact: true }).click();
}

// Applies the Critical stock filter and returns its total. Totals are read,
// not hard-coded: parallel tests add items while the suite runs.
async function filterCritical(page: Page) {
  const before = await rangeText(page).innerText();
  await openFilters(page);
  await stockStatusSelect(page).selectOption("critical");
  await applyFilters(page);
  await expect(rangeText(page)).not.toHaveText(before);
  return (await rangeText(page).innerText()).match(/of (\d+) items/)![1];
}

// Column order: Item, Category, Supplier, Stock level, Unit price, Total value.
const cell = (page: Page, row: number, column: number) =>
  rows(page).nth(row).locator(`td:nth-child(${column})`);

test.beforeEach(async ({ page }) => {
  await page.goto("/inventory");
  await expect(page.getByRole("heading", { name: "Inventory" })).toBeVisible();
  // Rows come from the client query, so the page is hydrated after this.
  await expect(rows(page)).toHaveCount(PAGE_SIZE);
});

// --- Table and pagination --------------------------------------------------

test("shows the first page of items", async ({ page }) => {
  await expect(rows(page)).toHaveCount(PAGE_SIZE);
  await expect(rangeText(page)).toContainText(`1–${PAGE_SIZE} of`);
  await expect(
    page.getByRole("button", { name: "Previous page" }),
  ).toBeDisabled();
});

test("each row shows the item, its stock and its value", async ({ page }) => {
  await expect(rows(page)).toHaveCount(PAGE_SIZE);

  for (let i = 0; i < PAGE_SIZE; i++) {
    await expect(cell(page, i, 1).locator("p")).toHaveCount(2); // name, SKU
    await expect(cell(page, i, 1).locator("p").nth(1)).not.toBeEmpty();
    await expect(cell(page, i, 2)).not.toBeEmpty();
    await expect(cell(page, i, 3)).not.toBeEmpty();

    // Stock label matches the quantity.
    const stock = await cell(page, i, 4).innerText();
    const qty = Number(stock.match(/\d+(\.\d+)?/)?.[0]);
    const label = qty <= 20 ? "Critical" : qty <= 50 ? "Low" : "Good";
    await expect(cell(page, i, 4)).toContainText(label);

    // Total value is unit price times quantity.
    const price = Number(
      (await cell(page, i, 5).innerText()).replace(/[$,]/g, ""),
    );
    const total = Number(
      (await cell(page, i, 6).innerText()).replace(/[$,]/g, ""),
    );
    expect(total).toBeCloseTo(price * qty, 2);
  }
});

test("Next and Previous page move through the items", async ({ page }) => {
  await expect(rows(page)).toHaveCount(PAGE_SIZE);
  const firstItem = await cell(page, 0, 1).locator("p").first().innerText();

  await page.getByRole("button", { name: "Next page" }).click();
  await expect(rangeText(page)).toContainText(`7–12 of`);
  await expect(cell(page, 0, 1).locator("p").first()).not.toHaveText(firstItem);

  await page.getByRole("button", { name: "Previous page" }).click();
  await expect(rangeText(page)).toContainText(`1–${PAGE_SIZE} of`);
  await expect(cell(page, 0, 1).locator("p").first()).toHaveText(firstItem);
});

// --- Search ----------------------------------------------------------------

test("search by item name shows only matching items", async ({ page }) => {
  await search(page).fill("Basmati");

  await expect(cell(page, 0, 1)).toContainText("Basmati");
  for (const row of await rows(page).all()) {
    await expect(row.locator("td").first()).toContainText("Basmati");
  }
});

test("search by SKU code finds that item", async ({ page }) => {
  await search(page).fill("SKU-DRY-1130");

  await expect(rows(page)).toHaveCount(1);
  await expect(cell(page, 0, 1)).toContainText("Royal Basmati Rice 10 kg");
});

test("search ignores letter case", async ({ page }) => {
  await search(page).fill("royal basmati");

  await expect(cell(page, 0, 1)).toContainText("Royal Basmati");
});

test("search matches part of a name", async ({ page }) => {
  await search(page).fill("asmat");

  await expect(cell(page, 0, 1)).toContainText(/basmati/i);
});

test("a search with no match shows an empty state", async ({ page }) => {
  await search(page).fill(`no-such-item-${Date.now()}`);

  await expect(noResults(page)).toBeVisible();
  await expect(rows(page)).toHaveCount(0);
  await expect(rangeText(page)).toContainText("0–0 of 0 items");
});

test("clearing the search brings back the full list", async ({ page }) => {
  await search(page).fill("SKU-DRY-1130");
  await expect(rows(page)).toHaveCount(1);

  await search(page).fill("");

  await expect(rows(page)).toHaveCount(PAGE_SIZE);
});

test("searching from a later page starts again at page 1", async ({ page }) => {
  await page.getByRole("button", { name: "Next page" }).click();
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(rangeText(page)).toContainText("13–18 of");

  await search(page).fill("Basmati");

  await expect(rangeText(page)).toContainText(/^1–\d+ of/);
  await expect(cell(page, 0, 1)).toContainText("Basmati");
});

// Item names never contain these, so each search should find nothing,
// without a failed request behind the empty state.
for (const term of ["%", "_", "'", ","]) {
  test(`searching for "${term}" is treated as plain text`, async ({ page }) => {
    let crashed = false;
    let fetchFailed = false;
    page.on("pageerror", () => (crashed = true));
    page.on("console", (message) => {
      if (message.text().includes("DataTable fetch error")) fetchFailed = true;
    });

    await search(page).fill(term);

    await expect(noResults(page)).toBeVisible();
    await expect(rows(page)).toHaveCount(0);
    expect(crashed).toBe(false);
    expect(fetchFailed).toBe(false);
  });
}

// --- Search requests ---------------------------------------------------------

// Counts inventory table requests (their body carries "pageSize").
async function countTableRequests(page: Page) {
  const bodies: string[] = [];
  await page.route(
    (url) => url.pathname === "/inventory",
    (route) => {
      const request = route.request();
      const body = request.postData() ?? "";
      if (request.method() === "POST" && body.includes('"pageSize"')) {
        bodies.push(body);
      }
      return route.continue();
    },
  );
  return bodies;
}

test("typing quickly sends one search request, not one per letter", async ({
  page,
}) => {
  const requests = await countTableRequests(page);

  await search(page).pressSequentially("Basmati", { delay: 40 });
  await expect(cell(page, 0, 1)).toContainText("Basmati");

  // Only the finished word is searched (350 ms debounce).
  const searches = requests.filter((body) => !body.includes('"search":""'));
  expect(searches).toHaveLength(1);
  expect(searches[0]).toContain('"search":"Basmati"');
});

test("typing the same search again does not send a new request", async ({
  page,
}) => {
  const requests = await countTableRequests(page);
  await search(page).fill("Basmati");
  await expect(cell(page, 0, 1)).toContainText("Basmati");
  await page.waitForTimeout(600); // past the 350 ms debounce
  const afterFirstSearch = requests.length;

  // Same term typed again.
  await search(page).fill("");
  await page.waitForTimeout(600);
  await search(page).fill("Basmati");
  await page.waitForTimeout(1_000);

  // Clearing goes back to the cached full list, retyping to the cached search.
  expect(requests.length).toBe(afterFirstSearch);
  await expect(cell(page, 0, 1)).toContainText("Basmati");
});

// --- Filters ----------------------------------------------------------------

for (const status of ["Good", "Low", "Critical"]) {
  test(`the ${status} stock filter shows only ${status} items`, async ({
    page,
  }) => {
    await openFilters(page);
    await stockStatusSelect(page).selectOption(status.toLowerCase());
    await applyFilters(page);

    await expect(rows(page)).toHaveCount(PAGE_SIZE);
    for (let i = 0; i < PAGE_SIZE; i++) {
      await expect(cell(page, i, 4)).toContainText(status);
    }
  });
}

test("the category filter shows only that category", async ({ page }) => {
  await openFilters(page);
  await pickCategory(page, "Dairy");
  await applyFilters(page);

  for (let i = 0; i < PAGE_SIZE; i++) {
    await expect(cell(page, i, 2)).toHaveText("Dairy");
  }
});

test("the unit price range shows only prices inside it", async ({ page }) => {
  const before = await rangeText(page).innerText();
  await openFilters(page);
  await page.getByPlaceholder("Min").fill("10");
  await page.getByPlaceholder("Max").fill("20");
  await applyFilters(page);

  // The old rows stay on screen until the filtered page arrives.
  await expect(rangeText(page)).not.toHaveText(before);
  await expect(rows(page)).toHaveCount(PAGE_SIZE);
  for (let i = 0; i < PAGE_SIZE; i++) {
    const price = Number(
      (await cell(page, i, 5).innerText()).replace(/[$,]/g, ""),
    );
    expect(price).toBeGreaterThanOrEqual(10);
    expect(price).toBeLessThanOrEqual(20);
  }
});

test("the Filters button counts the active filters", async ({ page }) => {
  await openFilters(page);
  await pickCategory(page, "Dairy");
  await stockStatusSelect(page).selectOption("low");
  await applyFilters(page);

  await expect(page.getByRole("button", { name: "Filters" })).toContainText(
    "2",
  );
});

test("search and filters work together", async ({ page }) => {
  await openFilters(page);
  await pickCategory(page, "Dry Goods");
  await applyFilters(page);
  await search(page).fill("Basmati");

  await expect(cell(page, 0, 1)).toContainText("Basmati");
  for (const row of await rows(page).all()) {
    await expect(row.locator("td").nth(0)).toContainText("Basmati");
    await expect(row.locator("td").nth(1)).toHaveText("Dry Goods");
  }
});

test("Clear all removes every filter", async ({ page }) => {
  const critical = await filterCritical(page);

  await openFilters(page);
  await page.getByRole("button", { name: "Clear all" }).click();

  await expect(rangeText(page)).not.toContainText(`of ${critical} items`);
  await expect(page).not.toHaveURL(/stockStatus/, URL_UPDATE);
  await expect(rows(page)).toHaveCount(PAGE_SIZE);
});

test("filters survive a page reload", async ({ page }) => {
  const critical = await filterCritical(page);
  await expect(page).toHaveURL(/stockStatus=critical/, URL_UPDATE);

  await page.reload();

  await expect(rangeText(page)).toContainText(`of ${critical} items`);
  await expect(page.getByRole("button", { name: "Filters" })).toContainText(
    "1",
  );
});

test("Next page keeps the filter", async ({ page }) => {
  const critical = await filterCritical(page);

  await page.getByRole("button", { name: "Next page" }).click();

  await expect(rangeText(page)).toContainText(`7–12 of ${critical} items`);
  for (let i = 0; i < PAGE_SIZE; i++) {
    await expect(cell(page, i, 4)).toContainText("Critical");
  }
});

test("applying a filter from a later page starts again at page 1", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Next page" }).click();
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(rangeText(page)).toContainText("13–18 of");

  await filterCritical(page);

  await expect(rangeText(page)).toContainText(/^1–6 of/);
});

test("applying the same filters again does not refetch", async ({ page }) => {
  await filterCritical(page);
  await page.waitForTimeout(600);

  const requests = await countTableRequests(page);
  await openFilters(page);
  await applyFilters(page);
  await page.waitForTimeout(1_000);

  expect(requests).toHaveLength(0);
});

// The search lives in React state only, while the filters live in the URL, so
// a reload keeps the filters but loses the search. Decide whether the search
// belongs in the URL too (card "Data table: URL as source of truth").
test.fixme("the search survives a page reload", async ({ page }) => {
  await search(page).fill("Basmati");
  await expect(cell(page, 0, 1)).toContainText("Basmati");

  await page.reload();

  await expect(search(page)).toHaveValue("Basmati");
  await expect(cell(page, 0, 1)).toContainText("Basmati");
});
