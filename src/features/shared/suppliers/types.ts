export type SharedSupplierOption = {
  id: string;
  name: string;
  category: string | null;
  status: "active" | "inactive" | string | null;
};

export type GetActiveSuppliersInput = {
  search?: string;
  limit?: number;
  offset?: number;
};

export type GetActiveSuppliersResult = {
  items: SharedSupplierOption[];
  nextOffset: number | null;
};

export type SupplierPickerProps = {
  initialSupplierId?: string;
  initialSupplierName?: string;
  error?: string;
  label?: string;
  placeholder?: string;
  supplierIdFieldName?: string;
  supplierNameFieldName?: string;
  onSupplierChange?: (supplier: SharedSupplierOption | null) => void;
};
