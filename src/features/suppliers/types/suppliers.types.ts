// Drawer

import { ReactNode } from "react";
import type { SupplierFormInput } from "@/src/features/suppliers/validators/suppliers.schema";
import { FieldErrors, UseFormRegister } from "react-hook-form";

// Data

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

export type SupplierDrawerProps = {
  title: string;
  description: string;
  submitLabel: string;
  submittingLabel?: string;
  formId: string;
  isSubmitting?: boolean;
  onClose?: () => void;
  children: ReactNode;
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
  initialValues?: Partial<SupplierFormValues>;
};

export type CreateSupplierDrawerProps = {
  onClose?: () => void;
};

// Form

export type SupplierTermsSectionProps = {
  register: UseFormRegister<SupplierFormValues>;
  errors: FieldErrors<SupplierFormValues>;
  leadTimeDays: number;
};
export type SupplierIdentitySectionProps = {
  register: UseFormRegister<SupplierFormValues>;
  errors: FieldErrors<SupplierFormValues>;
};
export type SupplierContactSectionProps = {
  register: UseFormRegister<SupplierFormValues>;
  errors: FieldErrors<SupplierFormValues>;
};
