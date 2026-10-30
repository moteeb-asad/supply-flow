const FEATURES = [
  {
    term: "Purchase orders",
    description: "Draft, send and track every order to delivery.",
  },
  {
    term: "SKU receiving",
    description: "Check each delivery line by line and record shortfalls.",
  },
  {
    term: "Suppliers",
    description: "See who delivers on time and who keeps you waiting.",
  },
];

// Plain about panel on the right of the auth pages (lg and up).
export default function LoginBranding() {
  return (
    <aside
      aria-label="About SupplyFlow"
      className="hidden flex-col justify-between rounded-sheet p-12 lg:flex"
    >
      <div />
      <div className="max-w-md">
        <p className="text-[28px] font-medium leading-9 tracking-[-0.01em]">
          Purchasing, receiving and stock, in one place for the whole warehouse
          team.
        </p>
        <dl className="mt-10 space-y-5">
          {FEATURES.map(({ term, description }) => (
            <div key={term} className="flex gap-4">
              <dt className="w-32 shrink-0 text-[13px] text-subtle">{term}</dt>
              <dd className="text-[13px] text-muted">{description}</dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="flex items-center gap-2 text-xs text-subtle">
        <span
          aria-hidden="true"
          className="material-symbols-outlined !text-[16px]"
        >
          verified_user
        </span>
        Internal system for authorised staff only.
      </p>
    </aside>
  );
}
