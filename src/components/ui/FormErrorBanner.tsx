type FormErrorBannerProps = {
  message?: string | null;
  align?: "start" | "center";
  className?: string;
};

export function getValidationSummaryMessage(fieldErrorCount: number): string {
  if (fieldErrorCount <= 0) return "";

  const noun = fieldErrorCount === 1 ? "field" : "fields";
  const verb = fieldErrorCount === 1 ? "is" : "are";

  return `${fieldErrorCount} ${noun} ${verb} invalid. Please review the highlighted fields.`;
}

export default function FormErrorBanner({
  message,
  align = "start",
  className = "",
}: FormErrorBannerProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`flex gap-2.5 rounded-card bg-danger-soft px-4 py-3 ${align === "center" ? "items-center" : "items-start"} ${className}`.trim()}
    >
      <span
        aria-hidden="true"
        className="material-symbols-outlined shrink-0 !text-[18px] text-danger"
      >
        error
      </span>
      <div className="text-[13px] font-medium text-danger">{message}</div>
    </div>
  );
}
