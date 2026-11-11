import { test, expect, type Page } from "@playwright/test";

// "Add inventory item" drawer on the inventory screen (super admin).

const drawer = (page: Page) =>
  page.getByRole("dialog", { name: "Add inventory item" });

async function openDrawer(page: Page) {
  await page.goto("/inventory");
  await page.getByRole("button", { name: "Add item" }).click();
  await expect(drawer(page)).toBeVisible();
  return drawer(page);
}

// Test data starts with "E2E" so the global teardown can delete it.
const uniqueId = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

type Form = ReturnType<typeof drawer>;

async function fillItem(
  form: Form,
  item: { name: string; sku: string; quantity?: string; price?: string },
) {
  await form.getByLabel("Item name").fill(item.name);
  await form.getByLabel("SKU").fill(item.sku);
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
  await form.getByLabel("Quantity on hand").fill(item.quantity ?? "12");
  await form.getByLabel("Unit price").fill(item.price ?? "2.50");
}

const submit = (form: Form) =>
  form.getByRole("button", { name: "Add item" }).click();

test("opens with empty fields", async ({ page }) => {
  const form = await openDrawer(page);

  await expect(form.getByLabel("Item name")).toHaveValue("");
  await expect(form.getByLabel("SKU")).toHaveValue("");
  await expect(form.getByLabel("Unit", { exact: true })).toHaveValue("");
  await expect(
    form.getByPlaceholder("Search and select category..."),
  ).toHaveValue("");
  await expect(
    form.getByPlaceholder("Search and select supplier..."),
  ).toHaveValue("");
  await expect(form.getByLabel("Quantity on hand")).toHaveValue("0");
  await expect(form.getByText("$0.00")).toBeVisible();
});

test("requires every field", async ({ page }) => {
  const form = await openDrawer(page);

  await submit(form);

  await expect(form.getByText("Item name is required")).toBeVisible();
  await expect(form.getByText("SKU code is required")).toBeVisible();
  await expect(form.getByText("Unit is required")).toBeVisible();
  await expect(form.getByText("Category is required")).toBeVisible();
  await expect(form.getByText("Supplier name is required")).toBeVisible();
  await expect(form.getByRole("alert")).toContainText("5 fields are invalid");
  await expect(drawer(page)).toBeVisible();
});

test("rejects a negative quantity", async ({ page }) => {
  const form = await openDrawer(page);

  await fillItem(form, {
    name: `E2E Item ${uniqueId()}`,
    sku: `E2E-${uniqueId()}`,
    quantity: "-5",
  });
  await submit(form);

  await expect(
    form.getByText("Initial stock must be at least 0"),
  ).toBeVisible();
});

test("shows the stock value as quantity times unit price", async ({ page }) => {
  const form = await openDrawer(page);

  await form.getByLabel("Quantity on hand").fill("12");
  await form.getByLabel("Unit price").fill("2.50");

  await expect(form.getByText("$30.00")).toBeVisible();
});

test("Cancel closes the drawer without saving", async ({ page }) => {
  const name = `E2E Item ${uniqueId()}`;
  const form = await openDrawer(page);

  await form.getByLabel("Item name").fill(name);
  await form.getByRole("button", { name: "Cancel" }).click();

  await expect(drawer(page)).toHaveCount(0);
  await page.getByLabel("Search by SKU or item name").fill(name);
  await expect(page.getByText("No results found")).toBeVisible();
});

test("adds an item that then appears in the table", async ({ page }) => {
  const id = uniqueId();
  const name = `E2E Item ${id}`;
  const sku = `E2E-${id}`;
  const form = await openDrawer(page);

  await fillItem(form, { name, sku, quantity: "12", price: "2.50" });
  await submit(form);

  await expect(drawer(page)).toHaveCount(0, { timeout: 10_000 });

  await page.getByLabel("Search by SKU or item name").fill(name);
  const row = page.locator("tbody tr").filter({ hasText: name });
  await expect(row).toBeVisible();
  await expect(row).toContainText(sku);
  await expect(row).toContainText("Dairy");
  await expect(row).toContainText("PrimeGrain");
  await expect(row).toContainText("12");
  await expect(row).toContainText("Critical"); // 20 units or fewer
  await expect(row).toContainText("$2.50");
  await expect(row).toContainText("$30.00");
});

test("a SKU code typed in lowercase is saved in uppercase", async ({
  page,
}) => {
  // The SKU field shows what is typed in capitals.
  const id = uniqueId();
  const name = `E2E Item ${id}`;
  const form = await openDrawer(page);

  await fillItem(form, { name, sku: `e2e-${id}` });
  await submit(form);
  await expect(drawer(page)).toHaveCount(0, { timeout: 10_000 });

  await page.getByLabel("Search by SKU or item name").fill(name);
  const row = page.locator("tbody tr").filter({ hasText: name });
  await expect(row).toContainText(`E2E-${id}`);
});

test("adding an item with a SKU code that already exists is blocked", async ({
  page,
}) => {
  const id = uniqueId();
  const sku = `E2E-${id}`;
  let form = await openDrawer(page);
  await fillItem(form, { name: `E2E Item ${id}`, sku });
  await submit(form);
  await expect(drawer(page)).toHaveCount(0, { timeout: 10_000 });

  // Same SKU code again, different name.
  form = await openDrawer(page);
  await fillItem(form, { name: `E2E Item ${id} copy`, sku });
  await submit(form);

  await expect(form.getByText(/already exists/i)).toBeVisible();
  await expect(drawer(page)).toBeVisible();

  await form.getByRole("button", { name: "Cancel" }).click();
  await page.getByLabel("Search by SKU or item name").fill(sku);
  await expect(page.locator("tbody tr").filter({ hasText: sku })).toHaveCount(
    1,
  );
});
