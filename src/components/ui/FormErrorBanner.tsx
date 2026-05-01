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
      className={`p-4 bg-danger/10 border border-danger/20 rounded-xl flex gap-3 ${align === "center" ? "items-center" : "items-start"} ${className}`.trim()}
    >
      <span className="material-symbols-outlined text-danger text-xl">
        error
      </span>
      <div className="text-sm text-danger font-medium">{message}</div>
    </div>
  );
}
