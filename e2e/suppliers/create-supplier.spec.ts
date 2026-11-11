import { test, expect, type Page } from "@playwright/test";

// "Add supplier" drawer on the suppliers screen (super admin).

const drawer = (page: Page) =>
  page.getByRole("dialog", { name: "Add supplier" });

async function openDrawer(page: Page) {
  await page.goto("/suppliers");
  await page.getByRole("button", { name: "Add supplier" }).click();
  await expect(drawer(page)).toBeVisible();
  return drawer(page);
}

const uniqueName = () => `E2E Supplier ${Date.now()}`;

test("opens with sensible defaults", async ({ page }) => {
  const form = await openDrawer(page);

  await expect(form.getByLabel("Supplier name")).toHaveValue("");
  await expect(form.getByRole("radio", { name: "Dry" })).toBeChecked();
  await expect(form.getByLabel("Status")).toHaveValue("active");
  await expect(form.getByLabel("Payment terms")).toHaveValue("Net 30");
  await expect(form.getByLabel("Lead time")).toHaveValue("7");
  await expect(form.getByLabel("Minimum order")).toHaveValue("100");
});

test("requires a supplier name", async ({ page }) => {
  const form = await openDrawer(page);

  await form.getByRole("button", { name: "Add supplier" }).click();

  await expect(form.getByText("Supplier name is required")).toBeVisible();
  await expect(drawer(page)).toBeVisible();
});

test("rejects an email address that is not valid", async ({ page }) => {
  const form = await openDrawer(page);

  await form.getByLabel("Supplier name").fill(uniqueName());
  await form.getByLabel("Email").fill("not-an-email");
  await form.getByRole("button", { name: "Add supplier" }).click();

  await expect(
    form.getByText("Enter a full email, like name@company.com"),
  ).toBeVisible();
});

test("rejects a lead time over 30 days", async ({ page }) => {
  const form = await openDrawer(page);

  await form.getByLabel("Supplier name").fill(uniqueName());
  await form.getByLabel("Lead time").fill("45");
  await form.getByRole("button", { name: "Add supplier" }).click();

  await expect(
    form.getByText("Lead time must be 30 days or less"),
  ).toBeVisible();
});

test("Cancel closes the drawer without saving", async ({ page }) => {
  const name = uniqueName();
  const form = await openDrawer(page);

  await form.getByLabel("Supplier name").fill(name);
  await form.getByRole("button", { name: "Cancel" }).click();

  await expect(drawer(page)).toHaveCount(0);
  await page.getByLabel("Search suppliers").fill(name);
  await expect(page.getByText("No suppliers found.")).toBeVisible();
});

test("adds a supplier that then appears in the grid", async ({ page }) => {
  const name = uniqueName();
  const form = await openDrawer(page);

  await form.getByLabel("Supplier name").fill(name);
  // The radio input is visually hidden behind its label; click the label.
  await form.getByText("Liquid", { exact: true }).click();
  await form.getByLabel("Contact person").fill("Ayesha Khan");
  await form.getByLabel("Email").fill("ayesha.khan@example.com");
  await form.getByLabel("Phone").fill("+92 300 1234567");
  await form.getByLabel("Lead time").fill("5");
  await form.getByLabel("Minimum order").fill("250");
  await form.getByRole("button", { name: "Add supplier" }).click();

  await expect(drawer(page)).toHaveCount(0, { timeout: 10_000 });

  await page.getByLabel("Search suppliers").fill(name);
  const card = page
    .getByRole("list")
    .getByRole("link", { name: new RegExp(name) });
  await expect(card).toBeVisible();
  await expect(card).toContainText("Liquid");
  await expect(card).toContainText("5 days");
  await expect(card).toContainText("250 units");
  await expect(card).toContainText("Ayesha Khan");
});

test("adding a supplier with a name that already exists is blocked", async ({
  page,
}) => {
  const name = uniqueName();
  let form = await openDrawer(page);
  await form.getByLabel("Supplier name").fill(name);
  await form.getByRole("button", { name: "Add supplier" }).click();
  await expect(drawer(page)).toHaveCount(0);

  // Same name again.
  form = await openDrawer(page);
  await form.getByLabel("Supplier name").fill(name);
  await form.getByRole("button", { name: "Add supplier" }).click();

  await expect(form.getByText(/already exists/i)).toBeVisible();
  await expect(drawer(page)).toBeVisible();

  await form.getByRole("button", { name: "Cancel" }).click();
  await page.getByLabel("Search suppliers").fill(name);
  await expect(page.getByRole("list").getByRole("link")).toHaveCount(1);
});
