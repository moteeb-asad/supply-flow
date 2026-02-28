import Header from "@/src/components/layout/header/Header";
import ProgressBarClient from "@/src/components/ui/ProgressBarClient";

export default function WithHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="relative flex-1 flex flex-col">
        <ProgressBarClient />
        <Header />
        <main className="flex-1 bg-gray-50">{children}</main>
      </div>
    </>
  );
}
