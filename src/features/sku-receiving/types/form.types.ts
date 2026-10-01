import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type {
  StartReceivingFormOutput,
  StartReceivingFormValues,
  StartReceivingLineItemValue,
} from "../validators/sku-receiving.schema";

export type {
  StartReceivingFormOutput,
  StartReceivingFormValues,
  StartReceivingLineItemValue,
};

export type StartReceivingFormProps = {
  formId?: string;
  onSubmit?: (values: StartReceivingFormOutput) => void;
  isSubmitting?: boolean;
  serverError?: string;
};

export type StartReceivingLoadedPoPayload = {
  purchase_order_id: string;
  po_number: string;
  supplier_name: string | null;
  expected_delivery_date: string | null;
  status: string;
  line_items: StartReceivingLineItemValue[];
};

export type ReceiptHeaderSectionProps = {
  register: UseFormRegister<StartReceivingFormValues>;
  errors: FieldErrors<StartReceivingFormValues>;
  control: Control<StartReceivingFormValues>;
};

export type LineItemsReceivingSectionProps = {
  register: UseFormRegister<StartReceivingFormValues>;
  errors: FieldErrors<StartReceivingFormValues>;
  control: Control<StartReceivingFormValues>;
};

export type SummaryFinalNotesProps = {
  register: UseFormRegister<StartReceivingFormValues>;
  control: Control<StartReceivingFormValues>;
};
