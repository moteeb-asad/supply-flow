import { Button } from "@/src/components/ui/Button";

// Popover under the Filters button. The filter fields inside come from each
// screen's config.filters component.
export default function DataTableFiltersPanel({
  children,
  onApply,
  onClear,
}: {
  children: React.ReactNode;
  onApply?: () => void;
  onClear?: () => void;
}) {
  return (
    <div className="absolute right-0 top-full z-50 mt-2 flex max-h-[min(70vh,36rem)] w-[min(20rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-card border border-line bg-surface shadow-overlay sm:w-80">
      <div className="flex-1 space-y-6 overflow-y-auto p-5">{children}</div>

      <div className="flex shrink-0 items-center justify-between gap-2 border-t border-line px-5 py-3">
        <Button variant="ghost" size="sm" onClick={onClear} type="button">
          Clear all
        </Button>
        <Button size="sm" onClick={onApply} type="button">
          Apply filters
        </Button>
      </div>
    </div>
  );
}
