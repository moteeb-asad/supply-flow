"use client";

import { Button } from "@/src/components/ui/Button";
import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

type SubmitButtonProps = {
  text: string;
  loadingText?: string;
  icon?: ReactNode;
  className?: string;
};

export default function SubmitButton({
  text,
  loadingText = "Please wait...",
  icon,
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      loading={pending}
      type="submit"
      text={pending ? loadingText : text}
      icon={icon}
      className={className}
    />
  );
}
