import { cn } from "@/src/lib/utils";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  text?: string;
  icon?: React.ReactNode;
};

export function Button({
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
      className={cn(
        "w-full inline-flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
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
