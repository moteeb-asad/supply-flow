import { StatCard, StatStrip } from "@/src/components/ui/StatCard";

// Placeholder numbers until they come from the database (see the card
// "Supplier metrics and supplier detail page from real data").
export default function SupplierMetrics() {
  return (
    <StatStrip aria-label="Supplier totals">
      <StatCard label="Active suppliers" value="42" />
      <StatCard
        label="Average performance score"
        value="88%"
        hint={<span className="text-[13px] text-success">+2.4%</span>}
      />
      <StatCard label="Total spend this year" value="$1.24M" />
    </StatStrip>
  );
}
