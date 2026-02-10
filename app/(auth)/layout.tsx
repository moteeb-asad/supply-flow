import type { ReactNode } from "react";
import LoginBranding from "@/src/features/auth/components/LoginBranding";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <main className="flex min-h-screen">
        {children}
        <LoginBranding />
      </main>
    </>
  );
}
