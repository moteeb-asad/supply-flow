import type { ReactNode } from "react";

export type SubmitButtonProps = {
  text: string;
  loadingText?: string;
  icon?: ReactNode;
  className?: string;
  loading?: boolean;
};
