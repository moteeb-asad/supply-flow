import type { AdditionalNotesSectionProps } from "../../types";

export default function AdditionalNotesSection({
  notes,
  error,
}: AdditionalNotesSectionProps) {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 text-primary">
        <span className="material-symbols-outlined text-[20px]">
          sticky_note_2
        </span>
        <h3 className="font-semibold text-sm uppercase tracking-wider">
          Additional Notes
        </h3>
      </div>
      <textarea
        className="w-full min-h-[96px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
        defaultValue={notes ?? ""}
        name="notes"
        placeholder="Add supplier notes or internal context"
      />
      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      ) : null}
    </section>
  );
}
