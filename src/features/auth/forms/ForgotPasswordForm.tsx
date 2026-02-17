"use client";

import { requestPasswordResetAction } from "@/src/features/auth/actions/auth.actions";
import { Input } from "@/src/components/ui/Input";
import { useActionState, useEffect, useState, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/src/features/auth/validators/auth.schema";
import AuthShell from "@/src/features/auth/components/AuthShell";
import AuthHeader from "@/src/features/auth/components/AuthHeader";
import SubmitButton from "@/src/features/auth/components/SubmitButton";

export default function ForgotPasswordForm() {
  const [state, formAction] = useActionState(
    requestPasswordResetAction,
    undefined,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  useEffect(() => {
    if (state?.error || state?.success) {
      setIsSubmitting(false);
    }
  }, [state]);

  return (
    <AuthShell>
      <div className="max-w-md w-full mx-auto my-auto">
        <AuthHeader
          title="Forgot Password?"
          subtitle="Enter your work email address and we’ll send you a reset link."
        />

        {(state?.error || errors.email) && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl flex gap-3 items-start">
            <span className="material-symbols-outlined text-danger text-xl">
              error
            </span>
            <p className="text-sm text-danger font-medium">
              {state?.error || errors.email?.message}
            </p>
          </div>
        )}

        {state?.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex gap-3 items-start">
            <span className="material-symbols-outlined text-green-600 text-xl">
              check_circle
            </span>
            <p className="text-sm text-green-700 font-medium">
              {state.success}
            </p>
          </div>
        )}

        <form
          className="space-y-6"
          noValidate
          onSubmit={handleSubmit((data) => {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append("email", data.email);

            startTransition(() => {
              formAction(formData);
            });
          })}
        >
          <div>
            <label
              className="block text-sm font-semibold text-gray-700 mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                mail
              </span>
              <Input
                autoComplete="email"
                className="pl-10 pr-4 text-sm"
                id="email"
                placeholder="name@company.com"
                type="email"
                {...register("email")}
              />
            </div>
          </div>

          <SubmitButton
            className="cursor-pointer"
            text="Send Reset Link"
            loadingText="Sending..."
            loading={isSubmitting}
            icon={
              <span className="material-symbols-outlined text-xl">send</span>
            }
          />

          <div className="text-center  mt-6">
            <a
              className="flex items-center justify-center text-xs font-bold text-primary"
              href="/login"
            >
              <span className="material-symbols-outlined !text-[16px] mr-1">
                arrow_back
              </span>
              <span className="hover:underline">Back to Sign In</span>
            </a>
          </div>
        </form>
      </div>
    </AuthShell>
  );
}
