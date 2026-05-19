import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InventoryItemFormValues } from "@/src/features/inventory/types/form.types";
import { StartReceivingFormProps } from "../../types/form.types";
import PoLookupSection from "./PoLookupSection";
import ReceiptHeaderSection from "./ReceiptHeaderSection";
import { Line } from "react-chartjs-2";
import LineItemsReceivingSection from "./LineItemsReceivingSection";
import SummaryFinalNotes from "./SummaryFinalNotes";
// import {
//   FormErrorBanner,
//   getValidationSummaryMessage,
// } from "@/src/components/ui/FormErrorBanner";

export default function StartReceivingForm({
  formId,
  serverError,
  isSubmitting,
}: StartReceivingFormProps) {
  //   const {
  //     register,
  //     handleSubmit,
  //     clearErrors,
  //     setValue,
  //     control,
  //     formState: { errors },
  //   } = useForm<InventoryItemFormValues>({
  //     resolver: zodResolver(StartReceivingSchema),
  //     defaultValues: getInventoryItemDefaultValues(initialValues),
  //   });
  //   const fieldErrorCount = Object.values(errors).reduce(
  //     (count, error) => count + (error?.message ? 1 : 0),
  //     0,
  //   );
  //   const bannerMessage =
  //     serverError || getValidationSummaryMessage(fieldErrorCount);

  return (
    <form
      className="flex-1 overflow-y-auto p-6 space-y-8"
      id={formId}
      noValidate
    >
      <div
        className={`flex-1 min-h-0 space-y-8 transition-opacity ${
          isSubmitting ? "opacity-60" : "opacity-100"
        }`}
      >
        {/* <FormErrorBanner align="center" message={bannerMessage} /> */}

        <PoLookupSection />
        <ReceiptHeaderSection />
        <LineItemsReceivingSection />
        <SummaryFinalNotes />
      </div>
    </form>
  );
}
