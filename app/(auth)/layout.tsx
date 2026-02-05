import type { ReactNode } from "react";
import LoginBranding from "@/src/components/auth/LoginBranding";

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
