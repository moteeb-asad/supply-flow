// Drawer

import type { SupplierFormInput } from "@/src/features/suppliers/validators/suppliers.schema";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export type SuppliersScreenProps = Record<string, never>;

export type CategoryFilterValue = "all" | "dry" | "liquid" | "fresh" | "mixed";

export type CategoryFilterProps = {
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
};

export type SupplierSearchProps = {
  defaultValue?: string;
  debounceMs?: number;
  onSearchChange: (value: string) => void;
};

export type UseSuppliersParams = {
  category: CategoryFilterValue;
  search: string;
};

// Data

export type SupplierGridProps = {
  suppliers: Supplier[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
};

export type SupplierCursor = {
  createdAt: string;
  id: string;
};

export type SuppliersPage = {
  suppliers: Supplier[];
  nextCursor: SupplierCursor | null;
  hasMore: boolean;
};

export type SupplierCardProps = {
  supplier: Supplier;
};

export type SupplierDetailScreenProps = {
  supplier: Supplier;
};

export type SupplierHeaderProps = {
  supplier: Supplier;
  onEditClick?: () => void;
};

export type Supplier = {
  id: string;
  name: string;
  category: string | null;
  status: "active" | "inactive" | string | null;
  primary_contact_name: string | null;
  primary_contact_email: string | null;
  primary_contact_phone: string | null;
  payment_terms: string | null;
  min_order_qty: number | null;
  lead_time_days: number | null;
  notes: string | null;
  created_at: string | null;
};

export type SupplierFormValues = SupplierFormInput;

export type SupplierFormProps = {
  formId?: string;
  initialValues?: Partial<SupplierFormValues>;
  onSubmit?: (values: SupplierFormValues) => void;
  serverError?: string;
};

export type EditSupplierDrawerProps = {
  onClose?: () => void;
  supplier: Supplier;
};

export type CreateSupplierDrawerProps = {
  onClose?: () => void;
  onSuccess?: () => void;
};

export type GetSuppliersInput = {
  limit?: number;
  cursor?: SupplierCursor | null;
  category?: CategoryFilterValue;
  search?: string;
};

// Form

export type SupplierTermsSectionProps = {
  register: UseFormRegister<SupplierFormValues>;
  errors: FieldErrors<SupplierFormValues>;
};
export type SupplierIdentitySectionProps = {
  register: UseFormRegister<SupplierFormValues>;
  errors: FieldErrors<SupplierFormValues>;
};
export type SupplierContactSectionProps = {
  register: UseFormRegister<SupplierFormValues>;
  errors: FieldErrors<SupplierFormValues>;
};

// Row returned by get_supplier_overview_metrics (migration 050). numeric comes
// back from PostgREST as a string or number, so callers wrap it in Number().
export type SupplierOverviewMetrics = {
  active_supplier_count: number;
  deliveries_this_year: number;
  on_time_deliveries_this_year: number;
  // Null when nothing was delivered this year.
  on_time_rate: number | string | null;
  spend_this_year: number | string;
};
