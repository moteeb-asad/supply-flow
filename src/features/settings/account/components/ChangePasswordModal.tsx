"use client";

import { Modal } from "@/src/components/ui/Modal";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "../validators/password.schema";
import { changePassword } from "../actions/change-password";
import { useState } from "react";

export default function ChangePasswordModal({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    setIsSubmitting(true);
    setServerError(null);

    const formData = new FormData();
    formData.append("currentPassword", data.currentPassword);
    formData.append("newPassword", data.newPassword);
    formData.append("confirmPassword", data.confirmPassword);

    const result = await changePassword(formData);

    setIsSubmitting(false);

    if (result.success) {
      reset();
      setIsModalOpen(false);
      // Optional: Show success toast
    } else {
      setServerError(result.error || "Failed to update password");
    }
  };

  const handleClose = () => {
    reset();
    setServerError(null);
    setIsModalOpen(false);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleClose}
      title="Change Password"
      description="Enter your current password and a new secure password."
      footer={
        <>
          <Button
            type="submit"
            variant="primary"
            size="md"
            shadow="none"
            className="flex-1"
            form="change-password-form"
            loading={isSubmitting}
          >
            Update Password
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="md"
            shadow="none"
            onClick={handleClose}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </>
      }
    >
      <form id="change-password-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5">
          {serverError && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#4e6797]">
              Current Password
            </label>
            <Input
              {...register("currentPassword")}
              className="w-full rounded-lg border-none bg-background-light px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50"
              placeholder="••••••••"
              type="password"
            />
            {errors.currentPassword && (
              <p className="text-xs text-red-600">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#4e6797]">
              New Password
            </label>
            <Input
              {...register("newPassword")}
              className="w-full rounded-lg border-none bg-background-light px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50"
              placeholder="••••••••"
              type="password"
            />
            {errors.newPassword && (
              <p className="text-xs text-red-600">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#4e6797]">
              Confirm New Password
            </label>
            <Input
              {...register("confirmPassword")}
              className="w-full rounded-lg border-none bg-background-light px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50"
              placeholder="••••••••"
              type="password"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
