export default function WithoutHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-w-0 flex-1 rounded-sheet border border-line bg-surface">
      {children}
    </main>
  );
}
