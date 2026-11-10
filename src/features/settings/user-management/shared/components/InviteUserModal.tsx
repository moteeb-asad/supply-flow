"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import AppIcon from "@/src/components/ui/AppIcon";
import FormErrorBanner from "@/src/components/ui/FormErrorBanner";
import { useUser } from "@/src/providers/UserProvider";
import {
  DEMO_ACCOUNT_DISABLED_MESSAGE,
  isDemoAccount,
} from "@/src/features/auth/utils/demo-account";
import { cn } from "@/src/lib/utils";
import {
  inviteUserSchema,
  type InviteUserInput,
} from "../../users/validators/invite-user.schema";
import { ROLE_OPTIONS } from "../../users/constants/roles";
import { inviteUserAction } from "../actions/invite-user.actions";
import { InviteUserModalProps } from "../types";

const labelClassName = "text-[13px] font-medium text-muted";
const errorClassName = "mt-1.5 text-xs text-danger";

export default function InviteUserModal({
  isOpen,
  onClose,
}: InviteUserModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user } = useUser();
  const isDemo = isDemoAccount(user?.email);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<InviteUserInput>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      role: "",
    },
  });
  const selectedRole = useWatch({ control, name: "role" });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setSuccess(false);
      reset();
    }
  }, [isOpen, reset]);

  const closeModal = () => {
    onClose();
  };

  const onSubmit = async (data: InviteUserInput) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await inviteUserAction(
        data.fullName,
        data.email,
        data.role,
      );

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess(true);

      // Close modal after 2 seconds
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send invitation",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 px-4 py-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-title"
        aria-describedby="invite-description"
        className="w-full max-w-[480px] overflow-hidden rounded-sheet bg-surface shadow-overlay"
      >
        <header className="flex items-start justify-between gap-4 px-6 pb-2 pt-5">
          <div>
            <h2
              id="invite-title"
              className="text-lg font-semibold tracking-[-0.01em]"
            >
              Invite a teammate
            </h2>
            <p
              id="invite-description"
              className="mt-0.5 text-[13px] text-muted"
            >
              They get a one-time sign-up link by email.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-control text-subtle hover:bg-background-light hover:text-ink"
            onClick={closeModal}
          >
            <AppIcon name="close" />
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-5 px-6 pb-6 pt-4">
            {/* Also reachable through ?modal=invite-user, so guard here too. */}
            <FormErrorBanner
              message={isDemo ? DEMO_ACCOUNT_DISABLED_MESSAGE : error}
            />

            {success && (
              <div
                role="status"
                className="flex items-center gap-2.5 rounded-card bg-success-soft px-4 py-3 text-[13px] font-medium text-success"
              >
                <AppIcon name="check" className="size-4 shrink-0" />
                Invitation sent successfully!
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClassName} htmlFor="fullName">
                  Full name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="e.g. Jason Smith"
                  className="mt-1.5 h-9"
                  aria-invalid={errors.fullName ? true : undefined}
                  {...register("fullName")}
                  disabled={isSubmitting}
                />
                {errors.fullName && (
                  <p className={errorClassName}>{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className={labelClassName} htmlFor="email">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. jason@warehouse.com"
                  className="mt-1.5 h-9"
                  aria-invalid={errors.email ? true : undefined}
                  {...register("email")}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className={errorClassName}>{errors.email.message}</p>
                )}
              </div>
            </div>

            <fieldset disabled={isSubmitting}>
              <legend className={labelClassName}>Role</legend>
              <div
                className={cn(
                  "mt-1.5 divide-y divide-line-soft overflow-hidden rounded-card border",
                  errors.role ? "border-danger" : "border-line",
                )}
              >
                {ROLE_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-background-light/60",
                      selectedRole === option.value && "bg-background-light/60",
                    )}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      className="mt-0.5 size-4 shrink-0 cursor-pointer accent-ink"
                      {...register("role")}
                    />
                    <span>
                      <span className="block text-[13px] font-medium">
                        {option.label}
                      </span>
                      <span className="block text-xs text-muted">
                        {option.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              {errors.role && (
                <p className={errorClassName}>{errors.role.message}</p>
              )}
            </fieldset>

            <p className="flex items-center gap-2 text-xs text-muted">
              <AppIcon name="clock" className="size-4 shrink-0 text-subtle" />
              The link works for 24 hours. You can resend it from Invitations.
            </p>

            {/* Rate Limit Warning - Only show when rate limit error occurs */}
            {error && error.toLowerCase().includes("rate limit") && (
              <div className="rounded-card bg-warning-soft px-4 py-3 text-xs leading-relaxed text-warning">
                <span className="font-semibold">Rate limit:</span> You can only
                send 2 invitations per hour on the free tier. Please try again
                later or upgrade your plan.
              </div>
            )}
          </div>

          <footer className="flex justify-end gap-2 border-t border-line bg-background-light px-6 py-4">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={closeModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="md"
              className="px-4"
              disabled={isSubmitting || isDemo}
            >
              {isSubmitting ? "Sending..." : "Send invite"}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
}
