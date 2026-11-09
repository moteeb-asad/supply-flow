// e2e/shot.spec.ts
import { test } from "@playwright/test";

test("capture metrics row", async ({ page }) => {
  await page.route(
    (url) => url.pathname === "/purchase-orders",
    (route) => {
      const r = route.request();
      return r.method() === "POST" && r.headers()["next-action"]
        ? route.abort("failed")
        : route.continue();
    },
  );

  await page.goto("/purchase-orders");
  const cards = page.getByTestId("stat-card");
  await cards.first().waitFor();
  await page.waitForTimeout(9000); // let the 3 retries finish

  await cards
    .first()
    .locator("..")
    .screenshot({ path: "e2e/screenshots/metrics.png" });
});
