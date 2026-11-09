"use client";

import Link from "next/link";
import { requestPasswordResetAction } from "@/src/features/auth/actions/auth.actions";
import { Input } from "@/src/components/ui/Input";
import FormErrorBanner from "@/src/components/ui/FormErrorBanner";
import AppIcon from "@/src/components/ui/AppIcon";
import { useActionState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/src/features/auth/validators/auth.schema";
import AuthShell from "@/src/features/auth/components/AuthShell";
import AuthHeader from "@/src/features/auth/components/AuthHeader";
import SubmitButton from "@/src/features/auth/components/SubmitButton";

const labelClassName = "text-[13px] font-medium";

export default function ForgotPasswordForm() {
  const [state, formAction] = useActionState(
    requestPasswordResetAction,
    undefined,
  );
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  return (
    <AuthShell>
      <AuthHeader
        title="Forgot your password?"
        subtitle="Enter your work email address and we’ll send you a reset link."
      />

      <FormErrorBanner
        message={state?.error || errors.email?.message}
        className="mb-5"
      />

      {state?.success && (
        <div
          role="status"
          className="mb-5 flex items-start gap-2.5 rounded-card bg-success-soft px-4 py-3 text-[13px] font-medium text-success"
        >
          <AppIcon name="check" className="mt-0.5 size-4 shrink-0" />
          {state.success}
        </div>
      )}

      <form
        className="space-y-5"
        noValidate
        onSubmit={handleSubmit((data) => {
          const formData = new FormData();
          formData.append("email", data.email);

          startTransition(() => {
            formAction(formData);
          });
        })}
      >
        <div>
          <label className={labelClassName} htmlFor="email">
            Email address
          </label>
          <Input
            autoComplete="email"
            className="mt-1.5"
            id="email"
            aria-invalid={errors.email ? true : undefined}
            placeholder="name@company.com"
            type="email"
            {...register("email")}
          />
        </div>

        <SubmitButton
          text="Send reset link"
          loadingText="Sending..."
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
