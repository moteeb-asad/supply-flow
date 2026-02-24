"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { MultiSelect } from "@/src/components/ui/MultiSelect";
import {
  inviteUserSchema,
  type InviteUserInput,
} from "../../users/validators/invite-user.schema";
import { ROLE_OPTIONS } from "../../users/constants/roles";
import { inviteUserAction } from "../actions/invite-user.actions";
import { InviteUserModalProps } from "../types";

export default function InviteUserModal({
  isOpen,
  onClose,
}: InviteUserModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<InviteUserInput>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      primaryRole: "",
      roles: [],
    },
  });

  const selectedRoles = watch("roles");
  const primaryRole = watch("primaryRole");

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setSuccess(false);
      reset();
    }
  }, [isOpen, reset]);

  const handleRolesChange = (newRoles: string[]) => {
    setValue("roles", newRoles);

    // If no roles selected, clear primary
    if (newRoles.length === 0) {
      setValue("primaryRole", "");
      return;
    }

    // If current primary is not in new roles, set first role as primary
    if (!newRoles.includes(primaryRole)) {
      setValue("primaryRole", newRoles[0]);
    }
  };

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
        data.roles,
        data.primaryRole,
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
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
        <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-[#e7ebf3] overflow-hidden relative z-10">
          <div className="px-6 py-4 border-b border-[#e7ebf3] flex justify-between items-center">
            <h3 className="text-lg font-bold">Invite New User</h3>
            <button
              type="button"
              className="text-[#4e6797] hover:text-[#0e121b] transition-colors cursor-pointer"
              onClick={closeModal}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-6 space-y-5">
              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                  <span className="material-symbols-outlined text-red-600 text-xl">
                    error
                  </span>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <span className="material-symbols-outlined text-green-600 text-xl">
                    check_circle
                  </span>
                  <p className="text-sm text-green-700">
                    Invitation sent successfully!
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <label
                  className="text-sm font-semibold text-[#4e6797]"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="e.g. Jason Smith"
                  className="text-sm py-2 rounded-lg mt-[6px] text-[#0e121b]"
                  {...register("fullName")}
                  disabled={isSubmitting}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  className="text-sm font-semibold text-[#4e6797]"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. jason@warehouse.com"
                  className="text-sm py-2 rounded-lg mt-[6px] text-[#0e121b]"
                  {...register("email")}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <MultiSelect
                  id="roles"
                  label="Select Role(s)"
                  options={ROLE_OPTIONS}
                  value={selectedRoles}
                  onChange={handleRolesChange}
                  placeholder="Add roles..."
                  primaryValue={primaryRole}
                  onPrimaryChange={(value) => setValue("primaryRole", value)}
                  primaryLabel="Primary"
                />
                {errors.roles && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.roles.message}
                  </p>
                )}
                {errors.primaryRole && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.primaryRole.message}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <span className="material-symbols-outlined text-primary text-xl">
                  info
                </span>
                <p className="text-xs text-[#4e6797] leading-relaxed">
                  The user will receive a one-time invitation link via email,
                  valid for{" "}
                  <span className="font-bold text-primary">24 hours.</span>
                </p>
              </div>

              {/* Rate Limit Warning - Only show when rate limit error occurs */}
              {error && error.toLowerCase().includes("rate limit") && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <span className="material-symbols-outlined text-amber-600 text-xl">
                    schedule
                  </span>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    <span className="font-semibold">Rate Limit:</span> You can
                    only send 2 invitations per hour on the free tier. Please
                    try again later or upgrade your plan.
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-[#e7ebf3] flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                shadow="none"
                onClick={closeModal}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                shadow="sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <span className="material-symbols-outlined !text-lg">
                      send
                    </span>
                    Send Invite
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
