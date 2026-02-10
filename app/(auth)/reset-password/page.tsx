import { Suspense } from "react";
import ResetPasswordForm from "@/src/features/auth/forms/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
