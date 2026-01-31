"use client";

interface HeaderProps {
  title?: string;
  searchPlaceholder?: string;
}

export default function Header({
  title = "Supplier Overview",
  searchPlaceholder = "Search suppliers...",
}: HeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-[#e7ebf3] dark:border-gray-800 bg-white dark:bg-[#1a1f2e] shrink-0">
      <div className="flex items-center gap-6">
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
        <div className="flex items-center gap-4">
          <div className="relative min-w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4e6797] text-xl">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-background-light dark:bg-background-dark border-none rounded-lg focus:ring-2 focus:ring-primary text-sm"
              placeholder={searchPlaceholder}
              type="text"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors">
          <span className="material-symbols-outlined text-lg">add</span>
          <span>Add Supplier</span>
        </button>
        <button className="p-2 text-[#4e6797] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-white dark:border-[#1a1f2e]" />
        </button>
        <button className="p-2 text-[#4e6797] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <span className="material-symbols-outlined">help</span>
        </button>
      </div>
    </header>
  );
}
