import type { InventoryItemFormValues } from "../components/shared/InventoryItemForm";

export type SupplierAssignmentSectionProps = {
  values: InventoryItemFormValues;
  onChange: <K extends keyof InventoryItemFormValues>(
    key: K,
    value: InventoryItemFormValues[K],
  ) => void;
};
