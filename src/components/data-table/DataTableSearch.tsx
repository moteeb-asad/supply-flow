type DataTableSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function DataTableSearch({
  value,
  onChange,
  placeholder,
}: DataTableSearchProps) {
  return (
    <div className="relative w-80">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4e6797] text-xl">
        search
      </span>
      <input
        className="w-full pl-10 pr-4 py-2 bg-background-light border-none rounded-lg focus:ring-2 focus:ring-primary text-sm"
        placeholder={placeholder || "Search..."}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
