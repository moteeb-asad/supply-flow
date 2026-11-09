import type { ReactNode } from "react";
import LoginBranding from "@/src/features/auth/components/LoginBranding";

type AuthLayoutProps = {
  children: ReactNode;
};

// Grey frame with the form sheet on the left and the about panel on the right
// (the panel is hidden below lg).
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen bg-frame p-2 text-ink lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-2">
      {children}
      <LoginBranding />
    </div>
  );
}
