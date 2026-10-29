import Header from "@/src/components/layout/header/Header";

export default function WithHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col rounded-sheet border border-line bg-surface">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
