import Header from "@/src/components/layout/header/Header";

export default function WithHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-1 flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  );
}
