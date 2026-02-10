import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
};

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 lg:p-16 bg-white">
      {children}
    </div>
  );
}
