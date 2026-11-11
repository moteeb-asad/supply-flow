import { test, expect, type Page } from "@playwright/test";

// "Edit supplier" drawer, opened from the supplier detail page header (the
// header and details list use real data; the KPIs on that page do not yet).
// Each test creates its own supplier so seeded data is never changed.

async function createSupplier(page: Page) {
  const name = `E2E Edit ${Date.now()}`;
  await page.goto("/suppliers");
  await page.getByRole("button", { name: "Add supplier" }).click();
  const form = page.getByRole("dialog", { name: "Add supplier" });
  await form.getByLabel("Supplier name").fill(name);
  await form.getByLabel("Contact person").fill("Bilal Ahmed");
  await form.getByLabel("Lead time").fill("6");
  await form.getByRole("button", { name: "Add supplier" }).click();
  await expect(form).toHaveCount(0, { timeout: 10_000 });
  return name;
}

async function openEditDrawer(page: Page, name: string) {
  await page.getByLabel("Search suppliers").fill(name);
  // A new supplier is already first in the unfiltered grid; wait for the
  // (debounced) search to settle on just this card, or the click races the
  // grid re-render and is lost.
  const results = page.getByRole("list").getByRole("link");
  await expect(results).toHaveCount(1);
  await results.click();
  await expect(page.getByRole("heading", { name })).toBeVisible();
  await page.getByRole("button", { name: "Edit supplier" }).click();
  const drawer = page.getByRole("dialog", { name: "Edit supplier" });
  await expect(drawer).toBeVisible();
  return drawer;
}

test("opens with the supplier's current details filled in", async ({
  page,
}) => {
  const name = await createSupplier(page);
  const form = await openEditDrawer(page, name);

  await expect(form.getByLabel("Supplier name")).toHaveValue(name);
  await expect(form.getByLabel("Contact person")).toHaveValue("Bilal Ahmed");
  await expect(form.getByLabel("Lead time")).toHaveValue("6");
});

test("saving changes updates the supplier page", async ({ page }) => {
  const name = await createSupplier(page);
  const form = await openEditDrawer(page, name);
  const newName = `${name} (renamed)`;

  await form.getByLabel("Supplier name").fill(newName);
  await form.getByText("Mixed", { exact: true }).click();
  await form.getByLabel("Lead time").fill("12");
  await form.getByRole("button", { name: "Save changes" }).click();

  await expect(form).toHaveCount(0, { timeout: 10_000 });
  await expect(page.getByRole("heading", { name: newName })).toBeVisible();
  await expect(page.getByText("12 days").first()).toBeVisible();
  await expect(page.getByText("Mixed").first()).toBeVisible();
});

test("shows validation errors and keeps the drawer open", async ({ page }) => {
  const name = await createSupplier(page);
  const form = await openEditDrawer(page, name);

  await form.getByLabel("Supplier name").fill("");
  await form.getByRole("button", { name: "Save changes" }).click();

  await expect(form.getByText("Supplier name is required")).toBeVisible();
  await expect(form).toBeVisible();
});

test("Cancel closes the drawer without saving", async ({ page }) => {
  const name = await createSupplier(page);
  const form = await openEditDrawer(page, name);

  await form.getByLabel("Supplier name").fill(`${name} (not saved)`);
  await form.getByRole("button", { name: "Cancel" }).click();

  await expect(form).toHaveCount(0);
  await expect(page.getByRole("heading", { name })).toBeVisible();
});

test("saving without any change is blocked and sends no request", async ({
  page,
}) => {
  const name = await createSupplier(page);
  const form = await openEditDrawer(page, name);

  let updates = 0;
  page.on("request", (request) => {
    if (
      request.method() === "POST" &&
      !!request.headers()["next-action"] &&
      /\/suppliers\/[0-9a-f-]+$/.test(new URL(request.url()).pathname) &&
      (request.postData() ?? "").includes(name)
    ) {
      updates++;
    }
  });

  const save = form.getByRole("button", { name: "Save changes" });
  // Nothing changed yet: Save is disabled.
  await expect(save).toBeDisabled();

  // Typing the same value again is still "no change".
  await form.getByLabel("Supplier name").fill(name);
  await expect(save).toBeDisabled();

  await save.click({ force: true });
  await page.waitForTimeout(1_500);
  expect(updates).toBe(0);
  await expect(form).toBeVisible();
});
