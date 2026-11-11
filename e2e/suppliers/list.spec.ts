import { test, expect, type Page } from "@playwright/test";

// Suppliers main screen (super admin, saved session). Uses the seeded local
// data: 300 suppliers, 8 per page, names like "PrimeGrain Traders".

const PAGE_SIZE = 8;

const cards = (page: Page) => page.getByRole("list").getByRole("link");
const search = (page: Page) => page.getByLabel("Search suppliers");
const categoryButton = (page: Page, name: string) =>
  page.getByRole("group", { name: "Category" }).getByRole("button", { name });

test.beforeEach(async ({ page }) => {
  await page.goto("/suppliers");
  await expect(page.getByRole("heading", { name: "Suppliers" })).toBeVisible();
});

test("shows the first page of supplier cards", async ({ page }) => {
  await expect(cards(page)).toHaveCount(PAGE_SIZE);
  await expect(
    page.getByRole("button", { name: "Load more suppliers" }),
  ).toBeVisible();
});

test("Load more adds the next page of suppliers", async ({ page }) => {
  await expect(cards(page)).toHaveCount(PAGE_SIZE);

  await page.getByRole("button", { name: "Load more suppliers" }).click();

  await expect(cards(page)).toHaveCount(PAGE_SIZE * 2);
});

test("search shows only suppliers whose name matches", async ({ page }) => {
  await search(page).fill("PrimeGrain");

  await expect(cards(page).first()).toContainText("PrimeGrain");
  for (const card of await cards(page).all()) {
    await expect(card).toContainText("PrimeGrain");
  }
});

test("a search with no match shows an empty state", async ({ page }) => {
  await search(page).fill(`no-such-supplier-${Date.now()}`);

  await expect(page.getByText("No suppliers found.")).toBeVisible();
  await expect(cards(page)).toHaveCount(0);
});

test("the category filter shows only suppliers in that category", async ({
  page,
}) => {
  await categoryButton(page, "Liquid").click();

  await expect(categoryButton(page, "Liquid")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(cards(page).first()).toContainText("Liquid");
  for (const card of await cards(page).all()) {
    await expect(card).toContainText("Liquid");
    await expect(card).not.toContainText("Dry goods");
  }
});

test("search and category filter work together", async ({ page }) => {
  // Every seeded PrimeGrain supplier is in the Liquid category.
  await categoryButton(page, "Liquid").click();
  await search(page).fill("PrimeGrain");

  await expect(cards(page).first()).toContainText("PrimeGrain");
  for (const card of await cards(page).all()) {
    await expect(card).toContainText("PrimeGrain");
    await expect(card).toContainText("Liquid");
  }
});

// "Fresh" is not a stored category (suppliers.schema.ts allows dry, liquid,
// mixed), so this filter can never match. See card "UI redesign review bugs".
test.fixme("the Fresh filter shows fresh suppliers", async ({ page }) => {
  await categoryButton(page, "Fresh").click();
  await expect(cards(page).first()).toBeVisible();
});

test("clearing the search brings back the full list", async ({ page }) => {
  await search(page).fill("PrimeGrain");
  await expect(cards(page).first()).toContainText("PrimeGrain");

  await search(page).fill("");

  await expect(cards(page)).toHaveCount(PAGE_SIZE);
  await expect(
    cards(page).filter({ hasNotText: "PrimeGrain" }),
  ).not.toHaveCount(0);
});

test("switching back to All shows every category again", async ({ page }) => {
  await categoryButton(page, "Liquid").click();
  await expect(cards(page).first()).toContainText("Liquid");

  await categoryButton(page, "All").click();

  await expect(categoryButton(page, "All")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(cards(page)).toHaveCount(PAGE_SIZE);
  await expect(cards(page).filter({ hasNotText: "Liquid" })).not.toHaveCount(0);
});

for (const [filter, label] of [
  ["Dry", "Dry goods"],
  ["Mixed", "Mixed"],
] as const) {
  test(`the ${filter} filter shows only ${label} suppliers`, async ({
    page,
  }) => {
    await categoryButton(page, filter).click();

    await expect(cards(page).first()).toContainText(label);
    for (const card of await cards(page).all()) {
      await expect(card).toContainText(label);
    }
  });
}

test("search ignores letter case", async ({ page }) => {
  await search(page).fill("primegrain");

  await expect(cards(page).first()).toContainText("PrimeGrain");
  for (const card of await cards(page).all()) {
    await expect(card).toContainText("PrimeGrain");
  }
});

test("search matches part of a name", async ({ page }) => {
  await search(page).fill("Grain");

  await expect(cards(page).first()).toContainText(/grain/i);
  for (const card of await cards(page).all()) {
    await expect(card).toContainText(/grain/i);
  }
});

test("typing quickly sends one search request, not one per letter", async ({
  page,
}) => {
  const searches: string[] = [];
  await page.route(
    (url) => url.pathname === "/suppliers",
    (route) => {
      const request = route.request();
      const body = request.postData() ?? "";
      if (request.method() === "POST" && body.includes('"search":"')) {
        searches.push(body);
      }
      return route.continue();
    },
  );

  await search(page).pressSequentially("PrimeGrain", { delay: 40 });
  await expect(cards(page).first()).toContainText("PrimeGrain");

  // Only the finished word is searched (350 ms debounce).
  const partial = searches.filter(
    (body) => body.includes('"search":"P') && !body.includes("PrimeGrain"),
  );
  expect(partial).toHaveLength(0);
  expect(searches.filter((body) => body.includes("PrimeGrain"))).toHaveLength(
    1,
  );
});

test("Load more keeps the category filter", async ({ page }) => {
  await categoryButton(page, "Liquid").click();
  await expect(cards(page).first()).toContainText("Liquid");

  await page.getByRole("button", { name: "Load more suppliers" }).click();

  await expect(cards(page)).toHaveCount(PAGE_SIZE * 2);
  for (const card of await cards(page).all()) {
    await expect(card).toContainText("Liquid");
  }
});

// Supplier names never contain these, so each search should find nothing.
for (const term of ["%", "_", "'"]) {
  test(`searching for "${term}" is treated as plain text`, async ({ page }) => {
    let crashed = false;
    page.on("pageerror", () => (crashed = true));

    await search(page).fill(term);

    await expect(page.getByText("No suppliers found.")).toBeVisible();
    await expect(cards(page)).toHaveCount(0);
    expect(crashed).toBe(false);
  });
}

// Search and filter live in React state only, so a reload or a shared link
// loses them. Decide whether they should live in the URL (as the data tables
// do, see card "Data table: URL as source of truth").
test.fixme("search and filter survive a page reload", async ({ page }) => {
  await categoryButton(page, "Liquid").click();
  await search(page).fill("PrimeGrain");
  await expect(cards(page).first()).toContainText("PrimeGrain");

  await page.reload();

  await expect(search(page)).toHaveValue("PrimeGrain");
  await expect(categoryButton(page, "Liquid")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("clicking a supplier card opens that supplier's page", async ({
  page,
}) => {
  const first = cards(page).first();
  const name = (await first.locator("p").first().innerText()).trim();

  await first.click();

  await page.waitForURL(/\/suppliers\/[0-9a-f-]{36}$/);
  await expect(page.getByRole("heading", { name })).toBeVisible();
});

// --- No repeat requests for the same search or filter ---------------------

// Counts supplier list requests (their body carries "search").
async function countListRequests(page: Page) {
  const bodies: string[] = [];
  await page.route(
    (url) => url.pathname === "/suppliers",
    (route) => {
      const request = route.request();
      const body = request.postData() ?? "";
      if (request.method() === "POST" && body.includes('"search"')) {
        bodies.push(body);
      }
      return route.continue();
    },
  );
  return bodies;
}

test("typing the same search again does not send a new request", async ({
  page,
}) => {
  const requests = await countListRequests(page);
  await search(page).fill("PrimeGrain");
  await expect(cards(page).first()).toContainText("PrimeGrain");
  await page.waitForTimeout(600); // past the 350 ms debounce
  const afterFirstSearch = requests.length;

  // Same term typed again, and a space added then removed.
  await search(page).fill("");
  await search(page).fill("PrimeGrain");
  await search(page).press("End");
  await search(page).press("Space");
  await search(page).press("Backspace");
  await page.waitForTimeout(1_000);

  expect(requests.length).toBe(afterFirstSearch);
  await expect(cards(page).first()).toContainText("PrimeGrain");
});

test("clicking the category that is already selected does not refetch", async ({
  page,
}) => {
  const requests = await countListRequests(page);
  await categoryButton(page, "Liquid").click();
  await expect(cards(page).first()).toContainText("Liquid");
  await page.waitForTimeout(600);
  const afterFirstClick = requests.length;

  await categoryButton(page, "Liquid").click();
  await categoryButton(page, "Liquid").click();
  await page.waitForTimeout(1_000);

  expect(requests.length).toBe(afterFirstClick);
});
