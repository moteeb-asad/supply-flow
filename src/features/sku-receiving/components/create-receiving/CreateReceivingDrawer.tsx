"use client";

import { FormDrawer } from "@/src/components/ui/FormDrawer";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import { confirmSkuReceivingAction } from "../../actions/confirmSkuReceivingAction";
import { CreateReceivingDrawerProps } from "../../types/component-props.types";
import type { StartReceivingFormOutput } from "../../types/form.types";
import StartReceivingForm from "../shared/StartReceivingForm";

const CREATE_RECEIVING_FORM_ID = "create-receiving-form";

// Everything a confirmed receipt changes: receipts, PO lookup/status, stock.
const AFFECTED_QUERY_KEYS = [
  ["sku-receiving-table"],
  ["po-lookup-suggestions"],
  ["purchase-orders-table"],
  ["purchase-orders-metrics"],
  ["inventory-table"],
];

export default function CreateReceivingDrawer({
  onClose,
  onSuccess,
}: CreateReceivingDrawerProps) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string>();

  // Only called with schema-validated values (see StartReceivingForm).
  const handleSubmit = (values: StartReceivingFormOutput) => {
    setServerError(undefined);
    startTransition(async () => {
      const result = await confirmSkuReceivingAction({
        ...values,
        // datetime-local has no zone; the browser knows the user's offset.
        receipt_datetime: new Date(values.receipt_datetime).toISOString(),
      });

      if (!result.success) {
        setServerError(result.error);
        return;
      }

      AFFECTED_QUERY_KEYS.forEach((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      );
      onSuccess?.();
    });
  };

  return (
    <FormDrawer
      title="Create Receiving"
      description="Inbound Goods Processing"
      onClose={onClose}
      submitLabel="Create Receiving"
      submittingLabel="Creating..."
      isSubmitting={isPending}
      formId={CREATE_RECEIVING_FORM_ID}
      widthClassName="max-w-[680px]"
    >
      <StartReceivingForm
        formId={CREATE_RECEIVING_FORM_ID}
        isSubmitting={isPending}
        serverError={serverError}
        onSubmit={handleSubmit}
      />
    </FormDrawer>
  );
}
