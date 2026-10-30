export default function WithoutHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-w-0 grow-[999] basis-[560px] rounded-sheet border border-line bg-surface">
      {children}
    </main>
  );
}
