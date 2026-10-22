import Sidebar from "@/src/components/layout/sidebar/Sidebar";
import { UserProvider } from "@/src/providers/UserProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Mounted here (not in the root layout) so it loads the user after login:
    // login is a server action, so the browser client gets no SIGNED_IN event.
    <UserProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </UserProvider>
  );
}
