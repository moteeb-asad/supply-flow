import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

export type StartReceivingFormProps = {
  formId?: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
  serverError?: string;
};

export type StartReceivingFormValues = {
  receipt_datetime: string;
  delivery_note_number: string;
  received_by_name: string;
  received_by_role: string;
  receiving_location: string;
  vehicle_ref: string;
  notes: string;
  line_items: Array<{
    sku_code: string;
    item_name: string;
    ordered_qty: number;
    remaining_qty: number;
    qty_received: number;
    qty_rejected: number;
    variance_reason: string;
  }>;
};

export type ReceiptHeaderSectionProps = {
  register: UseFormRegister<StartReceivingFormValues>;
  errors: FieldErrors<StartReceivingFormValues>;
  control: Control<StartReceivingFormValues>;
};

export type LineItemsReceivingSectionProps = {
  register: UseFormRegister<StartReceivingFormValues>;
  control: Control<StartReceivingFormValues>;
};

export type SummaryFinalNotesProps = {
  register: UseFormRegister<StartReceivingFormValues>;
  control: Control<StartReceivingFormValues>;
};
