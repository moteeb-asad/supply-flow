"use client";

import { resetPasswordAction } from "@/src/features/auth/actions/auth.actions";
import { Input } from "@/src/components/ui/Input";
import { useActionState, startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/src/features/auth/validators/auth.schema";
import AuthShell from "@/src/features/auth/components/AuthShell";
import AuthHeader from "@/src/features/auth/components/AuthHeader";
import SubmitButton from "@/src/features/auth/components/SubmitButton";
import { createBrowserSupabaseClient } from "@/src/db/supabaseBrowserClient";

export default function ResetPasswordForm() {
  const [state, formAction] = useActionState(resetPasswordAction, undefined);
  const [sessionReady, setSessionReady] = useState(false);
  const [isInvite, setIsInvite] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    const type = hashParams.get("type");

    setIsInvite(type === "invite");
    setTokenError(
      type === "recovery" && !accessToken
        ? "Invalid or expired reset link. Please request a new one."
        : null,
    );

    const checkSession = async () => {
      const supabase = createBrowserSupabaseClient();
      await supabase.auth.getSession();
      setSessionReady(true);
    };

    checkSession();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  return (
    <AuthShell>
      <div className="max-w-md w-full mx-auto my-auto">
        <AuthHeader
          title={isInvite ? "Welcome to SupplyFlow" : "Create New Password"}
          subtitle={
            isInvite
              ? "Set up your account password to get started."
              : "Set a new password to regain access to your account."
          }
        />

        {!sessionReady && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <p className="text-sm text-blue-700">Verifying your link...</p>
          </div>
        )}

        {(state?.error ||
          tokenError ||
          errors.password ||
          errors.confirmPassword) && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl flex gap-3 items-start">
            <span className="material-symbols-outlined text-danger text-xl">
              error
            </span>
            <p className="text-sm text-danger font-medium">
              {state?.error ||
                tokenError ||
                errors.password?.message ||
                errors.confirmPassword?.message}
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
            startTransition(() => {
              const formData = new FormData();
              formData.append("password", data.password);
              formData.append("confirmPassword", data.confirmPassword);
              formAction(formData);
            });
          })}
        >
          <div>
            <label
              className="block text-sm font-semibold text-gray-700 mb-2"
              htmlFor="password"
            >
              New Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                lock
              </span>
              <Input
                autoComplete="new-password"
                className="pl-10 pr-4 text-sm"
                id="password"
                placeholder="••••••••"
                type="password"
                {...register("password")}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-semibold text-gray-700 mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                lock
              </span>
              <Input
                autoComplete="new-password"
                className="pl-10 pr-4 text-sm"
                id="confirmPassword"
                placeholder="••••••••"
                type="password"
                {...register("confirmPassword")}
              />
            </div>
          </div>

          <SubmitButton
            className="cursor-pointer"
            text={isInvite ? "Create Password" : "Update Password"}
            loadingText={isInvite ? "Creating..." : "Updating..."}
            icon={
              <span className="material-symbols-outlined text-xl">
                {isInvite ? "check_circle" : "lock_reset"}
              </span>
            }
          />

          {!isInvite && (
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
          )}
        </form>
      </div>
    </AuthShell>
  );
}
