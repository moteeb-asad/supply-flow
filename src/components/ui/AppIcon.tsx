import DashboardIcon from "@/src/assets/icons/dashboard.svg";
import PurchaseOrdersIcon from "@/src/assets/icons/purchase-orders.svg";
import ReceivingIcon from "@/src/assets/icons/receiving.svg";
import InventoryIcon from "@/src/assets/icons/inventory.svg";
import SuppliersIcon from "@/src/assets/icons/suppliers.svg";
import ReportsIcon from "@/src/assets/icons/reports.svg";
import SettingsIcon from "@/src/assets/icons/settings.svg";
import UploadIcon from "@/src/assets/icons/upload.svg";
import ScanIcon from "@/src/assets/icons/scan.svg";
import SearchIcon from "@/src/assets/icons/search.svg";
import FilterIcon from "@/src/assets/icons/filter.svg";
import ChevronLeftIcon from "@/src/assets/icons/chevron-left.svg";
import ChevronRightIcon from "@/src/assets/icons/chevron-right.svg";
import DownloadIcon from "@/src/assets/icons/download.svg";
import EditIcon from "@/src/assets/icons/edit.svg";
import PersonIcon from "@/src/assets/icons/person.svg";
import MailIcon from "@/src/assets/icons/mail.svg";
import PhoneIcon from "@/src/assets/icons/phone.svg";

const iconMap = {
  dashboard: DashboardIcon,
  purchaseOrders: PurchaseOrdersIcon,
  receiving: ReceivingIcon,
  inventory: InventoryIcon,
  suppliers: SuppliersIcon,
  reports: ReportsIcon,
  settings: SettingsIcon,
  upload: UploadIcon,
  scan: ScanIcon,
  search: SearchIcon,
  filter: FilterIcon,
  chevronLeft: ChevronLeftIcon,
  chevronRight: ChevronRightIcon,
  download: DownloadIcon,
  edit: EditIcon,
  person: PersonIcon,
  mail: MailIcon,
  phone: PhoneIcon,
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
