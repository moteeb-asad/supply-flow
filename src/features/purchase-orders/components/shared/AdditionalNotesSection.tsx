import type { AdditionalNotesSectionProps } from "@/src/features/purchase-orders/types/form.types";
import { cn } from "@/src/lib/utils";
import { inputClassName } from "@/src/components/ui/Input";
import { errorClassName, sectionHeadingClassName } from "./fields";

export default function AdditionalNotesSection({
  register,
  errors,
}: AdditionalNotesSectionProps) {
  return (
    <section className="space-y-3 border-t border-line-soft pt-6">
      <label
        htmlFor="po-notes"
        className={cn("block", sectionHeadingClassName)}
      >
        Notes <span className="font-normal text-subtle">optional</span>
      </label>
      <textarea
        id="po-notes"
        rows={3}
        className={cn(inputClassName, "h-auto resize-none py-2")}
        aria-invalid={errors.notes ? true : undefined}
        // defaultValue={notes ?? ""}
        {...register("notes")}
        name="notes"
        placeholder="Add supplier notes or internal context"
      />
      {errors.notes ? (
        <p className={errorClassName}>{errors.notes.message}</p>
      ) : null}
    </section>
  );
}
