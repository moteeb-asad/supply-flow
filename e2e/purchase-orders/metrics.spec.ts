import { test, expect, type Page, type Route } from "@playwright/test";

// The metric cards load through a Next.js server action: the browser sends a
// POST to the page URL with a Next-Action header, and the Next.js server
// queries Supabase. No /rest/v1/ request ever leaves the browser, so that is
// the request to intercept. The page itself (GET) is left alone.
const isServerAction = (route: Route) => {
  const request = route.request();
  return request.method() === "POST" && !!request.headers()["next-action"];
};

async function onServerActions(
  page: Page,
  handle: (route: Route) => Promise<void>,
) {
  await page.route(
    (url) => url.pathname === "/purchase-orders",
    (route) => (isServerAction(route) ? handle(route) : route.continue()),
  );
}

const metricCards = (page: Page) => {
  const cards = page.getByTestId("stat-card");
  return {
    cards,
    openCommitment: cards.filter({ hasText: "Open commitment" }),
    overdue: cards.filter({ hasText: "Overdue orders" }),
    completed: cards.filter({ hasText: "Completed this month" }),
  };
};

test("metric cards show no figure when the data fails to load", async ({
  page,
}) => {
  await onServerActions(page, (route) => route.abort("failed"));

  await page.goto("/purchase-orders");

  const { cards, openCommitment, overdue, completed } = metricCards(page);
  await expect(cards).toHaveCount(3);

  // React Query retries a failed query 3 times (about 7 s) before it reports
  // an error, so allow longer than the default 5 s.
  const afterRetries = { timeout: 15_000 };
  await expect(openCommitment).toContainText("—", afterRetries);
  await expect(overdue).toContainText("—", afterRetries);
  await expect(completed).toContainText("—", afterRetries);

  // A failed load must never look like real zeros.
  await expect(openCommitment).not.toContainText("$0.00");
});

test("metric cards show a loading state while the data is slow", async ({
  page,
}) => {
  await onServerActions(page, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3_000));
    await route.continue();
  });

  await page.goto("/purchase-orders");

  const { openCommitment, overdue, completed } = metricCards(page);

  // While the response is delayed, every card shows the loading marker.
  await expect(openCommitment).toContainText("…");
  await expect(overdue).toContainText("…");
  await expect(completed).toContainText("…");

  // Once it arrives, real figures replace it.
  await expect(openCommitment).toContainText("$", { timeout: 15_000 });
  await expect(overdue).toHaveText(/\d/, { timeout: 15_000 });
  await expect(openCommitment).not.toContainText("…");
});
