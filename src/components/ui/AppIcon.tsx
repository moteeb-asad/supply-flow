import DashboardIcon from "@/src/assets/icons/dashboard.svg";
import PurchaseOrdersIcon from "@/src/assets/icons/purchase-orders.svg";
import ReceivingIcon from "@/src/assets/icons/receiving.svg";
import InventoryIcon from "@/src/assets/icons/inventory.svg";
import SuppliersIcon from "@/src/assets/icons/suppliers.svg";
import ReportsIcon from "@/src/assets/icons/reports.svg";
import SettingsIcon from "@/src/assets/icons/settings.svg";

const iconMap = {
  dashboard: DashboardIcon,
  purchaseOrders: PurchaseOrdersIcon,
  receiving: ReceivingIcon,
  inventory: InventoryIcon,
  suppliers: SuppliersIcon,
  reports: ReportsIcon,
  settings: SettingsIcon,
};

export type AppIconName = keyof typeof iconMap;

interface AppIconProps {
  name: AppIconName;
  className?: string;
}

export default function AppIcon({
  name,
  className = "size-[18px]",
}: AppIconProps) {
  const Icon = iconMap[name];

  return <Icon className={className} aria-hidden="true" />;
}
