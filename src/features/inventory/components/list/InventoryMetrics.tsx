import { StatCard, StatStrip } from "@/src/components/ui/StatCard";
import { StatusPill } from "@/src/components/ui/StatusPill";

// Placeholder numbers until they come from the database (see the card
// "Inventory metrics from real data").
export default function InventoryMetrics() {
  return (
    <StatStrip aria-label="Stock totals">
      <StatCard
        label="Total stock value"
        value="$1,248,500.00"
        caption={<span className="text-success">+2.4% vs last month</span>}
      />
      <StatCard
        label="Low stock"
        value="14 items"
        hint={<StatusPill tone="danger">Action required</StatusPill>}
        caption="Items below their reorder level"
      />
      <StatCard
        label="Out of stock"
        value={
          <>
            3 <span className="text-base font-normal text-subtle">SKUs</span>
          </>
        }
        caption="2 since yesterday"
      />
    </StatStrip>
  );
}
