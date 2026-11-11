import { test, expect, type Page, type Route } from "@playwright/test";

// Supplier screen and drawers when the network is slow or fails. The list,
// the metrics and "Add supplier" are server actions posted to /suppliers;
// "Save changes" posts to /suppliers/<id>.

async function onActions(
  page: Page,
  path: RegExp,
  handle: (route: Route) => Promise<void>,
) {
  await page.route(
    (url) => path.test(url.pathname),
    (route) => {
      const request = route.request();
      const isAction =
        request.method() === "POST" && !!request.headers()["next-action"];
      return isAction ? handle(route) : route.continue();
    },
  );
}

const uniqueName = () => `E2E Net ${Date.now()}`;

async function openAddDrawer(page: Page) {
  await page.goto("/suppliers");
  await expect(page.getByRole("list").getByRole("link").first()).toBeVisible();
  await page.getByRole("button", { name: "Add supplier" }).click();
  return page.getByRole("dialog", { name: "Add supplier" });
}

test("list fails to load: says so instead of 'No suppliers found'", async ({
  page,
}) => {
  await onActions(page, /^\/suppliers$/, (route) => route.abort("failed"));

  await page.goto("/suppliers");

  // An empty result and a failed load must look different.
  await expect(
    page.getByText(/couldn.t load|try again|connection/i),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("No suppliers found.")).toHaveCount(0);
});

test("slow save: the button shows 'Adding...' and is disabled", async ({
  page,
}) => {
  const form = await openAddDrawer(page);
  await onActions(page, /^\/suppliers$/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3_000));
    await route.continue();
  });

  await form.getByLabel("Supplier name").fill(uniqueName());
  await form.getByRole("button", { name: "Add supplier" }).click();

  const busy = form.getByRole("button", { name: "Adding..." });
  await expect(busy).toBeVisible();
  await expect(busy).toBeDisabled();
  await expect(form).toHaveCount(0, { timeout: 15_000 });
});

test("double click on Add supplier creates only one supplier", async ({
  page,
}) => {
  const name = uniqueName();
  const form = await openAddDrawer(page);

  let creates = 0;
  await onActions(page, /^\/suppliers$/, async (route) => {
    if ((route.request().postData() ?? "").includes(name)) creates++;
    await route.continue();
  });

  await form.getByLabel("Supplier name").fill(name);
  await form
    .getByRole("button", { name: "Add supplier" })
    .click({ clickCount: 2 });
  await expect(form).toHaveCount(0, { timeout: 10_000 });

  expect(creates).toBe(1);
  await page.getByLabel("Search suppliers").fill(name);
  await expect(
    page.getByRole("list").getByRole("link", { name: new RegExp(name) }),
  ).toHaveCount(1);
});

test("save fails: shows an error, keeps the drawer and the typed values", async ({
  page,
}) => {
  const name = uniqueName();
  const form = await openAddDrawer(page);
  await onActions(page, /^\/suppliers$/, async (route) => {
    if ((route.request().postData() ?? "").includes(name)) {
      await route.abort("failed");
    } else {
      await route.continue();
    }
  });

  await form.getByLabel("Supplier name").fill(name);
  await form.getByRole("button", { name: "Add supplier" }).click();

  await expect(page.getByText(/application error/i)).toHaveCount(0);
  await expect(form.getByText(/couldn.t|connection|try again/i)).toBeVisible({
    timeout: 10_000,
  });
  await expect(form).toBeVisible();
  await expect(form.getByLabel("Supplier name")).toHaveValue(name);
  await expect(
    form.getByRole("button", { name: "Add supplier" }),
  ).toBeEnabled();
});

test("edit save fails: shows an error and keeps the drawer open", async ({
  page,
}) => {
  // Create a supplier to edit (normal network).
  const name = uniqueName();
  let form = await openAddDrawer(page);
  await form.getByLabel("Supplier name").fill(name);
  await form.getByRole("button", { name: "Add supplier" }).click();
  await expect(form).toHaveCount(0, { timeout: 10_000 });

  await page.getByLabel("Search suppliers").fill(name);
  const results = page.getByRole("list").getByRole("link");
  await expect(results).toHaveCount(1); // wait for the debounced search
  await results.click();
  await page.getByRole("button", { name: "Edit supplier" }).click();
  form = page.getByRole("dialog", { name: "Edit supplier" });

  await onActions(page, /^\/suppliers\/[0-9a-f-]+$/, async (route) => {
    if ((route.request().postData() ?? "").includes("renamed")) {
      await route.abort("failed");
    } else {
      await route.continue();
    }
  });

  await form.getByLabel("Supplier name").fill(`${name} renamed`);
  await form.getByRole("button", { name: "Save changes" }).click();

  await expect(page.getByText(/application error/i)).toHaveCount(0);
  await expect(form.getByText(/couldn.t|connection|try again/i)).toBeVisible({
    timeout: 10_000,
  });
  await expect(
    form.getByRole("button", { name: "Save changes" }),
  ).toBeEnabled();
});

// --- Search, filter and Load more when the list request fails -------------
// Only the supplier list request is affected (its body carries "search");
// the metrics and the page itself load normally.

const listCards = (page: Page) => page.getByRole("list").getByRole("link");

async function loadSuppliersThenControlList(page: Page) {
  const network = { fail: false, delayMs: 0 };
  await page.route(
    (url) => url.pathname === "/suppliers",
    async (route) => {
      const request = route.request();
      const isList =
        request.method() === "POST" &&
        !!request.headers()["next-action"] &&
        (request.postData() ?? "").includes('"search"');
      if (!isList) return route.continue();
      if (network.delayMs) {
        await new Promise((resolve) => setTimeout(resolve, network.delayMs));
      }
      return network.fail ? route.abort("failed") : route.continue();
    },
  );
  await page.goto("/suppliers");
  await expect(listCards(page)).toHaveCount(8);
  return network;
}

// Retries take about 7 s before React Query reports the error.
const AFTER_RETRIES = { timeout: 15_000 };
const loadError = (page: Page) =>
  page.getByText(/couldn.t load|try again|connection/i);

test("search fails: says the search could not run, not 'No suppliers found'", async ({
  page,
}) => {
  const network = await loadSuppliersThenControlList(page);
  network.fail = true;

  await page.getByLabel("Search suppliers").fill("PrimeGrain");

  await expect(loadError(page)).toBeVisible(AFTER_RETRIES);
  await expect(page.getByText("No suppliers found.")).toHaveCount(0);
});

test("filter fails: says the list could not load, not 'No suppliers found'", async ({
  page,
}) => {
  const network = await loadSuppliersThenControlList(page);
  network.fail = true;

  await page
    .getByRole("group", { name: "Category" })
    .getByRole("button", { name: "Liquid" })
    .click();

  await expect(loadError(page)).toBeVisible(AFTER_RETRIES);
  await expect(page.getByText("No suppliers found.")).toHaveCount(0);
});

test("slow Load more: the button shows it is loading and is disabled", async ({
  page,
}) => {
  const network = await loadSuppliersThenControlList(page);
  network.delayMs = 3_000;

  await page.getByRole("button", { name: "Load more suppliers" }).click();

  const busy = page.getByRole("button", { name: "Loading..." });
  await expect(busy).toBeVisible({ timeout: 1_000 });
  await expect(busy).toBeDisabled();
  await expect(listCards(page)).toHaveCount(16, AFTER_RETRIES);
});

test("Load more fails: keeps the loaded cards, says why, and retry works", async ({
  page,
}) => {
  const network = await loadSuppliersThenControlList(page);
  network.fail = true;

  await page.getByRole("button", { name: "Load more suppliers" }).click();

  await expect(loadError(page)).toBeVisible(AFTER_RETRIES);
  await expect(listCards(page)).toHaveCount(8);

  network.fail = false;
  await page.getByRole("button", { name: /Load more|Try again/ }).click();
  await expect(listCards(page)).toHaveCount(16);
});
