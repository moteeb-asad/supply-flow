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
      {/* Grey frame: the sidebar sits on it, each page is a white sheet. */}
      <div className="flex min-h-screen gap-2 bg-frame p-2">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </UserProvider>
  );
}
