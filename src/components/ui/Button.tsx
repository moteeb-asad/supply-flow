import { cn } from "@/src/lib/utils";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "icon";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  text?: string;
  icon?: React.ReactNode;
  // Kept so existing call sites compile. Buttons are flat now; only "sm"
  // adds the raised shadow, the rest render without one.
  shadow?: "none" | "sm" | "md" | "lg";
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/25 disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  // One primary action per view, in ink. Blue is for links and focus.
  primary: "bg-ink text-white border border-transparent hover:bg-ink/90",
  secondary: "bg-surface text-ink border border-line hover:bg-background-light",
  ghost:
    "bg-transparent text-muted border border-transparent hover:bg-background-light hover:text-ink",
  danger: "bg-surface text-danger border border-danger/30 hover:bg-danger-soft",
  icon: "bg-transparent text-subtle hover:text-ink border-none p-0 font-normal",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-9 px-3.5 text-[13px]",
  lg: "h-10 w-full px-4 text-sm",
};

const shadows = {
  none: "",
  sm: "shadow-raised",
  md: "",
  lg: "",
};

export function Button({
  variant = "primary",
  size = "lg",
  children,
  loading,
  disabled,
  className,
  text,
  icon,
  shadow = "none",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        base,
        variants[variant],
        variant === "icon" ? "" : sizes[size],
        shadows[shadow],
        className,
      )}
    >
      {loading ? (
        (text ?? "Please wait...")
      ) : (
        <>
          {text ?? children}
          {icon}
        </>
      )}
    </button>
  );
}
