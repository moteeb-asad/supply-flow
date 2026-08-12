"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  StartReceivingLoadedPoPayload,
  StartReceivingFormProps,
  StartReceivingFormValues,
} from "../../types/form.types";
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
  serverError,
  isSubmitting,
}: StartReceivingFormProps) {
  const { user } = useUser();

  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm<StartReceivingFormValues>({
    defaultValues: {
      purchase_order_id: "",
      receipt_datetime: getCurrentDateTimeLocalValue(),
      delivery_note_number: "",
      received_by_name: "",
      received_by_role: "",
      receiving_location: "dock_door_04",
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

  const fieldErrorCount = Object.values(errors).reduce(
    (count, error) => count + (error?.message ? 1 : 0),
    0,
  );
  const bannerMessage =
    serverError || getValidationSummaryMessage(fieldErrorCount);

  const handlePoLoaded = (payload: StartReceivingLoadedPoPayload) => {
    setValue("purchase_order_id", payload.purchase_order_id);
    setValue("line_items", payload.line_items, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <form
      className="flex-1 overflow-y-auto p-6 space-y-8"
      id={formId}
      noValidate
    >
      <input type="hidden" {...register("purchase_order_id")} />
      <div
        className={`flex-1 min-h-0 space-y-8 transition-opacity ${
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
        <LineItemsReceivingSection control={control} register={register} />
        <SummaryFinalNotes control={control} register={register} />
      </div>
    </form>
  );
}
