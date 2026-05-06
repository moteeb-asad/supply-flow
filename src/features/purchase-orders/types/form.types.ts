import type {
  PaymentMethod,
  PurchaseOrderLineItemFormValue,
} from "./domain.types";
import type { CreatePurchaseOrderFormInput } from "../validators/purchase-order.schema";
import {
  FieldErrors,
  UseFormClearErrors,
  UseFormSetValue,
  UseFormRegister,
  UseFieldArrayUpdate,
  UseFieldArrayRemove,
  UseFieldArrayAppend,
  FieldArrayWithId,
} from "react-hook-form";

export type PurchaseOrderFormValues = CreatePurchaseOrderFormInput;

export type PurchaseOrderFormProps = {
  mode: PurchaseOrderDrawerMode;
  formId?: string;
  initialValues?: Partial<PurchaseOrderFormValues>;
  onSubmit?: (values: PurchaseOrderFormValues) => void;
  onCancel?: () => void;
  onAddItemClick?: () => void;
  onLineItemsChange?: () => void;
  onFieldArrayReady?: (methods: {
    append: UseFieldArrayAppend<PurchaseOrderFormValues, "lineItems">;
  }) => void;
  isSubmitting?: boolean;
  serverError?: string;
};
export type SupplierAssignmentSectionProps = {
  errors: FieldErrors<PurchaseOrderFormValues>;
  register: UseFormRegister<PurchaseOrderFormValues>;
  setValue: UseFormSetValue<PurchaseOrderFormValues>;
  clearErrors: UseFormClearErrors<PurchaseOrderFormValues>;
};
export type LineItemsSectionProps = {
  onAddItemClick?: () => void;
  fields: FieldArrayWithId<PurchaseOrderFormValues, "lineItems", "id">[];
  append: UseFieldArrayAppend<PurchaseOrderFormValues, "lineItems">;
  update: UseFieldArrayUpdate<PurchaseOrderFormValues, "lineItems">;
  remove: UseFieldArrayRemove;
  onLineItemsChange?: () => void;
  register: UseFormRegister<PurchaseOrderFormValues>;
  errors: FieldErrors<PurchaseOrderFormValues>;
};
export type AdditionalNotesSectionProps = {
  register: UseFormRegister<PurchaseOrderFormValues>;
  errors: FieldErrors<PurchaseOrderFormValues>;
};
export type OrderDetailsSectionProps = {
  register: UseFormRegister<PurchaseOrderFormValues>;
  errors: FieldErrors<PurchaseOrderFormValues>;
  onPaymentMethodChange?: (value: PaymentMethod) => void;
};

export type UpdatePurchaseOrderActionResult = {
  success: boolean;
  error?: string;
};

export type PurchaseOrderDrawerMode = "create" | "edit";
export type AddItemFormValues = PurchaseOrderLineItemFormValue;
