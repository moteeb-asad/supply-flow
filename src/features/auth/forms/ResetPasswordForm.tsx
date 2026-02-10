"use client";

import { useSearchParams } from "next/navigation";
import { resetPasswordAction } from "../actions/auth.actions";
import { Input } from "@/src/components/ui/Input";
import { useActionState } from "react";
import AuthShell from "../components/AuthShell";
import AuthHeader from "../components/AuthHeader";
import SubmitButton from "../components/SubmitButton";

export default function ResetPasswordForm() {
  const [state, formAction] = useActionState(resetPasswordAction, undefined);
  const searchParams = useSearchParams();
  const mode = searchParams.get("type"); // "invite" | "recovery" | null

  const isInvite = mode === "invite";

  return (
    <AuthShell>
      <div className="max-w-md w-full mx-auto my-auto">
        <AuthHeader
          title={isInvite ? "Set Your Password" : "Create New Password"}
          subtitle={
            isInvite
              ? "Finish setting up your account by creating a password."
              : "Set a new password to regain access to your account."
          }
        />

        {state?.error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl flex gap-3 items-start">
            <span className="material-symbols-outlined text-danger text-xl">
              error
            </span>
            <p className="text-sm text-danger font-medium">{state.error}</p>
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

        <form className="space-y-6" action={formAction}>
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
                name="password"
                placeholder="••••••••"
                required
                type="password"
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
                name="confirmPassword"
                placeholder="••••••••"
                required
                type="password"
              />
            </div>
          </div>

          <SubmitButton
            text={isInvite ? "Set Password" : "Update Password"}
            loadingText="Updating..."
            icon={
              <span className="material-symbols-outlined text-xl">
                lock_reset
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
