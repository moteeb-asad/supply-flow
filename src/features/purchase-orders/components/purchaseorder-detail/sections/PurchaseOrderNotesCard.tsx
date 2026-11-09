type PurchaseOrderNotesCardProps = {
  notes?: string | null;
};

export default function PurchaseOrderNotesCard({
  notes,
}: PurchaseOrderNotesCardProps) {
  const hasNotes = Boolean(notes && notes.trim().length > 0);

  return (
    <section
      aria-labelledby="po-notes-title"
      className="rounded-card border border-line p-5"
    >
      <h2 id="po-notes-title" className="text-[15px] font-semibold">
        Internal notes
      </h2>
      {hasNotes ? (
        <p className="mt-2 whitespace-pre-wrap text-[13px] leading-5 text-muted">
          {notes}
        </p>
      ) : (
        <p className="mt-2 text-[13px] text-subtle">
          No internal notes were added for this purchase order.
        </p>
      )}
    </section>
  );
}
