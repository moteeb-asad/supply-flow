import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

export type StartReceivingFormProps = {
  formId?: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
  serverError?: string;
};

export type StartReceivingLineItemValue = {
  purchase_order_item_id: string;
  sku_id: string;
  sku_code: string;
  item_name: string;
  ordered_qty: number;
  received_qty_so_far: number;
  remaining_qty: number;
  qty_received: number;
  qty_rejected: number;
  variance_reason: string;
};

export type StartReceivingLoadedPoPayload = {
  purchase_order_id: string;
  po_number: string;
  supplier_name: string | null;
  expected_delivery_date: string | null;
  status: string;
  line_items: StartReceivingLineItemValue[];
};

export type StartReceivingFormValues = {
  purchase_order_id: string;
  receipt_datetime: string;
  delivery_note_number: string;
  received_by_name: string;
  received_by_role: string;
  receiving_location: string;
  vehicle_ref: string;
  notes: string;
  line_items: StartReceivingLineItemValue[];
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
