"use client";

import Link from "next/link";
import { resetPasswordAction } from "@/src/features/auth/actions/auth.actions";
import { Input } from "@/src/components/ui/Input";
import FormErrorBanner from "@/src/components/ui/FormErrorBanner";
import AppIcon from "@/src/components/ui/AppIcon";
import { useActionState, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/src/features/auth/validators/auth.schema";
import AuthShell from "@/src/features/auth/components/AuthShell";
import AuthHeader from "@/src/features/auth/components/AuthHeader";
import SubmitButton from "@/src/features/auth/components/SubmitButton";
import { useRecoverySession } from "@/src/features/auth/hooks/useRecoverySession";

const labelClassName = "text-[13px] font-medium";

export default function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    undefined,
  );
  const { sessionReady, isInvite, tokenError } = useRecoverySession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const errorMessage =
    state?.error ||
    tokenError ||
    errors.password?.message ||
    errors.confirmPassword?.message;

  return (
    <AuthShell>
      <AuthHeader
        title={isInvite ? "Welcome to SupplyFlow" : "Create a new password"}
        subtitle={
          isInvite
            ? "Set up your account password to get started."
            : "Set a new password to regain access to your account."
        }
      />

      {!sessionReady && (
        <div
          role="status"
          className="mb-5 flex items-center gap-2.5 rounded-card bg-background-light px-4 py-3 text-[13px] text-muted"
        >
          <span className="size-4 shrink-0 animate-spin rounded-full border-2 border-line border-t-ink" />
          Verifying your link...
        </div>
      )}

      <FormErrorBanner message={errorMessage} className="mb-5" />

      {state?.success && (
        <div
          role="status"
          className="mb-5 flex items-start gap-2.5 rounded-card bg-success-soft px-4 py-3 text-[13px] font-medium text-success"
        >
          <AppIcon name="check" className="mt-0.5 size-4 shrink-0" />
          {isInvite
            ? "Password created successfully. You can sign in now."
            : state.success}
        </div>
      )}

      <form
        className="space-y-5"
        noValidate
        onSubmit={handleSubmit((data) => {
          const formData = new FormData();
          formData.append("password", data.password);
          formData.append("confirmPassword", data.confirmPassword);
          formData.append("flowType", isInvite ? "invite" : "recovery");

          startTransition(() => {
            formAction(formData);
          });
        })}
      >
        <div>
          <label className={labelClassName} htmlFor="password">
            New password
          </label>
          <Input
            autoComplete="new-password"
            className="mt-1.5"
            id="password"
            aria-invalid={errors.password ? true : undefined}
            placeholder="••••••••"
            type="password"
            {...register("password")}
          />
        </div>

        <div>
          <label className={labelClassName} htmlFor="confirmPassword">
            Confirm password
          </label>
          <Input
            autoComplete="new-password"
            className="mt-1.5"
            id="confirmPassword"
            aria-invalid={errors.confirmPassword ? true : undefined}
            placeholder="••••••••"
            type="password"
            {...register("confirmPassword")}
          />
        </div>

        <SubmitButton
          text={isInvite ? "Create password" : "Update password"}
          loadingText={isInvite ? "Creating..." : "Updating..."}
          loading={isPending}
        />

        <p className="text-center">
          <Link
            className="text-[13px] font-medium text-primary hover:underline"
            href="/login"
          >
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
