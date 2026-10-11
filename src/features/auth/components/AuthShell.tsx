import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
};

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="flex w-full flex-col justify-between bg-white p-6 sm:p-8 lg:w-1/2 lg:p-12">
      {children}
    </div>
  );
}
