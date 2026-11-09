import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
};

// The white sheet shared by login, forgot password and reset password: logo at
// the top, the form centred, copyright at the bottom.
export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="flex flex-col rounded-sheet border border-line bg-surface">
      <div className="flex items-center gap-2.5 px-8 pt-8">
        <span
          aria-hidden="true"
          className="inline-flex size-8 items-center justify-center rounded-control bg-ink text-white"
        >
          <span className="material-symbols-outlined !text-[18px]">
            deployed_code
          </span>
        </span>
        <span className="text-sm font-semibold">SupplyFlow</span>
      </div>

      <main className="flex flex-1 items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </main>

      <p className="px-8 pb-6 text-xs text-subtle">
        © {new Date().getFullYear()} SupplyFlow
      </p>
    </div>
  );
}
