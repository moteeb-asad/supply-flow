// e2e/purchase-orders-metrics.spec.ts
import { test, expect } from "@playwright/test";

test("metric cards show no figure when the data fails to load", async ({
  page,
}) => {
  // kill only the data calls, leave auth alone so the session survives
  await page.route("**/rest/v1/**", (route) => route.abort("failed"));

  await page.goto("/purchase-orders");

  const cards = page.getByTestId("stat-card");
  await expect(cards).toHaveCount(3);

  await expect(cards.filter({ hasText: "Open Commitment" })).toContainText("—");
  await expect(cards.filter({ hasText: "Overdue Orders" })).toContainText("—");
  await expect(cards.filter({ hasText: "Completed" })).toContainText("—");
});
