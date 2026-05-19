import { FormDrawer } from "@/src/components/ui/FormDrawer";
import { useActionState, useTransition } from "react";
import { CreateReceivingDrawerProps } from "../../types/component-props.types";
import StartReceivingForm from "../shared/StartReceivingForm";

const CREATE_RECEIVING_FORM_ID = "Create-receiving-form";
export default function CreateReceivingDrawer({
  onClose,
}: CreateReceivingDrawerProps) {
  //   const [state, formAction] = useActionState(saveSkuReceivingAction, undefined);
  const [isPending, startTransition] = useTransition();

  return (
    <>
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
        />
      </FormDrawer>
    </>
  );
}
