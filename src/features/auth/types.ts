import type { ReactNode } from "react";
import type { PERMISSIONS, ROLES } from "./constants/rbac";

export type Role = (typeof ROLES)[number];
export type Permission = (typeof PERMISSIONS)[number];

export type SubmitButtonProps = {
  text: string;
  loadingText?: string;
  icon?: ReactNode;
  className?: string;
  loading?: boolean;
};
