"use client";

import { Button } from "@/src/components/ui/Button";
import { cn } from "@/src/lib/utils";
import { useFormStatus } from "react-dom";
import { SubmitButtonProps } from "../types";

export default function SubmitButton({
  text,
  loadingText = "Please wait...",
  icon,
  className,
  loading,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isLoading = loading ?? pending;

  return (
    <Button
      loading={isLoading}
      type="submit"
      text={isLoading ? loadingText : text}
      icon={icon}
      className={cn("py-2.5 text-sm", className)}
    />
  );
}
