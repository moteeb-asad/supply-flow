import { cn } from "@/src/lib/utils";
import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "icon";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  text?: string;
  icon?: React.ReactNode;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white border border-transparent shadow-lg shadow-primary/20 hover:bg-primary/90",
  secondary: "bg-white text-[#4e6797] border border-[#e7ebf3] hover:bg-gray-50",
  ghost:
    "bg-transparent text-[#4e6797] border border-transparent hover:bg-gray-50",
  icon: "bg-transparent text-[#94a3b8] hover:text-[#4e6797] border-none p-0 font-normal shadow-none",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "w-full px-6 py-3.5 text-base",
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
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {loading ? (
        "Please wait..."
      ) : (
        <>
          {text ?? children}
          {icon}
        </>
      )}
    </button>
  );
}
