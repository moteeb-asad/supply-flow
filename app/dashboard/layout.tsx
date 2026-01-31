import Sidebar from "@/src/components/layout/sidebar/Sidebar";
import Header from "@/src/components/layout/header/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Get user role from auth session
  const userRole = "ops_manager" as const;
  const userName = "Admin User";

  return (
    <div className="flex min-h-screen">
      <Sidebar userRole={userRole} />
      <div className="flex-1 flex flex-col">
        <Header userName={userName} userRole={userRole} />
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800">
          {children}
        </main>
      </div>
    </div>
  );
}
