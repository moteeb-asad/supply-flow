import Sidebar from "@/src/components/layout/sidebar/Sidebar";
import { ProgressProvider } from "@/src/providers/ProgressProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <ProgressProvider>
        <div className="flex-1 flex flex-col">{children}</div>
      </ProgressProvider>
    </div>
  );
}
