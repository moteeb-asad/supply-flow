import type { AdditionalNotesSectionProps } from "@/src/features/purchase-orders/types/form.types";

export default function AdditionalNotesSection({
  register,
  errors,
}: AdditionalNotesSectionProps) {
  return (
    <section className="space-y-5">
      <div className="mb-1 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-lg">
          sticky_note_2
        </span>
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#4e6797]">
          Additional Notes
        </h3>
      </div>
      <textarea
        className="min-h-[96px] w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
        // defaultValue={notes ?? ""}
        {...register("notes")}
        name="notes"
        placeholder="Add supplier notes or internal context"
      />
      {errors.notes ? (
        <p className="text-xs text-red-600">{errors.notes.message}</p>
      ) : null}
    </section>
  );
}
