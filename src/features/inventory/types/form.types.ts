import {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { InventoryItemFormInput } from "../validators/inventory-item.schema";

export type InventoryItemFormValues = InventoryItemFormInput;

export type InventoryItemFormProps = {
  formId?: string;
  initialValues?: Partial<InventoryItemFormValues>;
  onSubmit?: (values: InventoryItemFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  serverError?: string;
};
export type SupplierAssignmentSectionProps = {
  errors: FieldErrors<InventoryItemFormValues>;
  register: UseFormRegister<InventoryItemFormValues>;
  setValue: UseFormSetValue<InventoryItemFormValues>;
  clearErrors: UseFormClearErrors<InventoryItemFormValues>;
};
export type GeneralInformationSectionProps = {
  register: UseFormRegister<InventoryItemFormValues>;
  errors: FieldErrors<InventoryItemFormValues>;
  setValue: UseFormSetValue<InventoryItemFormValues>;
  clearErrors: UseFormClearErrors<InventoryItemFormValues>;
};
export type StockDetailsSectionProps = {
  register: UseFormRegister<InventoryItemFormValues>;
  errors: FieldErrors<InventoryItemFormValues>;
  control: Control<InventoryItemFormValues>;
};
