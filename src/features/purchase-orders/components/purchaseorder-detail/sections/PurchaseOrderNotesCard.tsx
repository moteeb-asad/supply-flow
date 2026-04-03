type PurchaseOrderNotesCardProps = {
  notes?: string | null;
};

export default function PurchaseOrderNotesCard({
  notes,
}: PurchaseOrderNotesCardProps) {
  const hasNotes = Boolean(notes && notes.trim().length > 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-base font-bold">Internal Notes</h3>
      {hasNotes ? (
        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
          {notes}
        </p>
      ) : (
        <p className="text-sm text-slate-500">
          No internal notes were added for this purchase order.
        </p>
      )}
    </div>
  );
}
