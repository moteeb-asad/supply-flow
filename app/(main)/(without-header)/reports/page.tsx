export default function ReportsPage() {
  return (
    <div className="h-full min-w-0 grow-[999] basis-[560px] rounded-sheet border border-line bg-surface">
      <header className="px-8 pb-6 pt-8">
        <h1 className="text-2xl font-semibold tracking-[-0.01em]">Reports</h1>
        <p className="mt-1 text-sm text-muted">
          Spend, supplier and stock reports you can export.
        </p>
      </header>

      <main className="px-8 pb-8">
        <section
          aria-labelledby="soon-title"
          className="rounded-card border border-dashed border-line px-8 py-14"
        >
          <div className="mx-auto max-w-xl">
            <span className="inline-flex h-[22px] items-center gap-1.5 rounded-full bg-neutral-soft px-2 text-xs font-medium text-neutral">
              <span
                className="size-1.5 rounded-full bg-neutral"
                aria-hidden="true"
              ></span>
              In progress
            </span>
            <h2
              id="soon-title"
              className="mt-4 text-xl font-semibold tracking-[-0.01em]"
            >
              Reports are being built
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              These three reports come first. Each one will open with the last
              30 days and export to CSV.
            </p>
            <ul className="mt-6 divide-y divide-line-soft border-y border-line-soft">
              <li className="flex gap-4 py-4">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 size-[18px] shrink-0 text-subtle"
                  aria-hidden="true"
                >
                  <path d="M3.5 6.5h10v9h-10zM13.5 9.5h4l3 3v3h-7"></path>
                  <circle cx="7.5" cy="17.5" r="1.75"></circle>
                  <circle cx="17" cy="17.5" r="1.75"></circle>
                </svg>
                <div>
                  <p className="text-sm font-medium">Supplier performance</p>
                  <p className="mt-0.5 text-[13px] text-muted">
                    On-time rate, fill rate and late deliveries for each
                    supplier.
                  </p>
                </div>
              </li>
              <li className="flex gap-4 py-4">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 size-[18px] shrink-0 text-subtle"
                  aria-hidden="true"
                >
                  <path d="M4 20h16M7 16v-4M11.5 16V8M16 16v-6"></path>
                </svg>
                <div>
                  <p className="text-sm font-medium">Spend by supplier</p>
                  <p className="mt-0.5 text-[13px] text-muted">
                    Purchase order totals by supplier and month, with GST shown
                    apart.
                  </p>
                </div>
              </li>
              <li className="flex gap-4 py-4">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 size-[18px] shrink-0 text-subtle"
                  aria-hidden="true"
                >
                  <path d="M12 3.5 20 8v8l-8 4.5L4 16V8z"></path>
                  <path d="M4 8l8 4.5L20 8M12 12.5v8"></path>
                </svg>
                <div>
                  <p className="text-sm font-medium">Stock movement</p>
                  <p className="mt-0.5 text-[13px] text-muted">
                    What came in, what went out and what was rejected, per SKU.
                  </p>
                </div>
              </li>
            </ul>
            <p className="mt-6 text-[13px] text-muted">
              Until then, supplier on-time rates are on the{" "}
              <a
                href="01-dashboard.html"
                className="font-medium text-primary hover:underline"
              >
                dashboard
              </a>
              .
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
