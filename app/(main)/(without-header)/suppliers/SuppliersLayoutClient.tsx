import { ReactNode } from "react";

interface SuppliersLayoutClientProps {
  children: ReactNode;
}

export default function SuppliersLayoutClient({
  children,
}: SuppliersLayoutClientProps) {
  return (
    <>
      {children}

      {/* <SupplierOnboardingDrawer open={open} onOpenChange={setOpen} /> */}
    </>
  );
}
