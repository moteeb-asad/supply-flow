import type { StartReceivingLoadedPoPayload } from "./form.types";
import type { SkuReceivingFiltersValue } from "./query.types";

export type CreateReceivingDrawerProps = {
  onClose?: () => void;
  onSuccess?: () => void;
};

export type SkuReceivingTableProps = {
  filters: SkuReceivingFiltersValue;
  onFiltersChange: (filters: SkuReceivingFiltersValue) => void;
};

export type SkuReceivingFiltersProps = {
  onChange: (filters: SkuReceivingFiltersValue) => void;
  values?: SkuReceivingFiltersValue;
};

export type PoLookupSectionProps = {
  onPoLoaded: (payload: StartReceivingLoadedPoPayload) => void;
};
