"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  StartReceivingLoadedPoPayload,
  StartReceivingFormOutput,
  StartReceivingFormProps,
  StartReceivingFormValues,
} from "../../types";
import { DEFAULT_RECEIVING_GATE } from "../../constants/form-options";
import { startReceivingSchema } from "../../validators/sku-receiving.schema";
import PoLookupSection from "./PoLookupSection";
import ReceiptHeaderSection from "./ReceiptHeaderSection";
import LineItemsReceivingSection from "./LineItemsReceivingSection";
import SummaryFinalNotes from "./SummaryFinalNotes";
import FormErrorBanner, {
  getValidationSummaryMessage,
} from "@/src/components/ui/FormErrorBanner";
import { useUser } from "@/src/providers/UserProvider";

const getCurrentDateTimeLocalValue = () => {
  const now = new Date();
  const tzOffsetMs = now.getTimezoneOffset() * 60_000;
  const local = new Date(now.getTime() - tzOffsetMs);
  return local.toISOString().slice(0, 16);
};

export default function StartReceivingForm({
  formId,
  onSubmit,
  serverError,
  isSubmitting,
}: StartReceivingFormProps) {
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    control,
    formState: { errors, isSubmitted },
  } = useForm<StartReceivingFormValues, unknown, StartReceivingFormOutput>({
    resolver: zodResolver(startReceivingSchema),
    defaultValues: {
      purchase_order_id: "",
      receipt_datetime: getCurrentDateTimeLocalValue(),
      delivery_note_number: "",
      received_by_name: "",
      received_by_role: "",
      receiving_location: DEFAULT_RECEIVING_GATE,
      vehicle_ref: "",
      notes: "",
      line_items: [],
    },
  });

  useEffect(() => {
    const role = user?.primaryRole
      ? user.primaryRole
          .split("_")
          .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
          .join(" ")
      : "";

    setValue("received_by_name", user?.fullName ?? user?.email ?? "");
    setValue("received_by_role", role);
  }, [setValue, user?.email, user?.fullName, user?.primaryRole]);

  // Count each top-level field once, including nested line_items errors.
  const fieldErrorCount = Object.keys(errors).length;
  const bannerMessage =
    serverError ||
    errors.purchase_order_id?.message ||
    getValidationSummaryMessage(fieldErrorCount);

  const handlePoLoaded = (payload: StartReceivingLoadedPoPayload) => {
    setValue("purchase_order_id", payload.purchase_order_id);
    setValue("line_items", payload.line_items, {
      shouldDirty: true,
      shouldTouch: true,
    });
    // One schema run after the first submit so stale errors clear on PO change.
    // (setValue's shouldValidate skips empty arrays and runs per nested field.)
    if (isSubmitted) void trigger(["purchase_order_id", "line_items"]);
  };

  return (
    <form
      className="flex-1 overflow-y-auto p-5 space-y-6"
      id={formId}
      noValidate
      onSubmit={handleSubmit((values) => onSubmit?.(values))}
    >
      <input type="hidden" {...register("purchase_order_id")} />
      <div
        className={`flex-1 min-h-0 space-y-6 transition-opacity ${
          isSubmitting ? "opacity-60" : "opacity-100"
        }`}
      >
        <FormErrorBanner align="center" message={bannerMessage} />

        <PoLookupSection onPoLoaded={handlePoLoaded} />
        <ReceiptHeaderSection
          control={control}
          errors={errors}
          register={register}
        />
        <LineItemsReceivingSection
          control={control}
          errors={errors}
          register={register}
        />
        <SummaryFinalNotes control={control} register={register} />
      </div>
    </form>
  );
}
