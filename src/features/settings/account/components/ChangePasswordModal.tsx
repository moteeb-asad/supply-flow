"use client";

import { Modal } from "@/src/components/ui/Modal";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import FormErrorBanner from "@/src/components/ui/FormErrorBanner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "../validators/password.schema";
import { changePassword } from "../actions/change-password";
import { useState } from "react";

const labelClassName = "text-[13px] font-medium text-muted";
const errorClassName = "mt-1.5 text-xs text-danger";

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
      title="Change password"
      description="Enter your current password and a new secure password."
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            size="md"
            className="hover:bg-surface"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="md"
            className="px-4"
            form="change-password-form"
            loading={isSubmitting}
          >
            Update password
          </Button>
        </>
      }
    >
      <form id="change-password-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormErrorBanner message={serverError} />

          <div>
            <label htmlFor="current-password" className={labelClassName}>
              Current password
            </label>
            <Input
              id="current-password"
              {...register("currentPassword")}
              aria-invalid={errors.currentPassword ? true : undefined}
              className="mt-1.5 h-9"
              placeholder="••••••••"
              type="password"
            />
            {errors.currentPassword && (
              <p className={errorClassName}>{errors.currentPassword.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="new-password" className={labelClassName}>
              New password
            </label>
            <Input
              id="new-password"
              {...register("newPassword")}
              aria-invalid={errors.newPassword ? true : undefined}
              className="mt-1.5 h-9"
              placeholder="••••••••"
              type="password"
            />
            {errors.newPassword && (
              <p className={errorClassName}>{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirm-password" className={labelClassName}>
              Confirm new password
            </label>
            <Input
              id="confirm-password"
              {...register("confirmPassword")}
              aria-invalid={errors.confirmPassword ? true : undefined}
              className="mt-1.5 h-9"
              placeholder="••••••••"
              type="password"
            />
            {errors.confirmPassword && (
              <p className={errorClassName}>{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
