import { Suspense } from "react";
import SuppliersLayoutClient from "./SuppliersLayoutClient";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <SuppliersLayoutClient>{children}</SuppliersLayoutClient>
    </Suspense>
  );
}
