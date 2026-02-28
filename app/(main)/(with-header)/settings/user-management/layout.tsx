import { Suspense } from "react";
import UsersLayoutClient from "./UsersLayoutClient";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <UsersLayoutClient>{children}</UsersLayoutClient>
    </Suspense>
  );
}
