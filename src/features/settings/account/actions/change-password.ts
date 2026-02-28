"use server";

import { createClient } from "@/src/db/supabaseClient";
import { changePasswordSchema } from "../validators/password.schema";

export async function changePassword(formData: FormData) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      error: "You must be logged in to change your password",
    };
  }

  // Parse and validate form data
  const rawData = {
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validation = changePasswordSchema.safeParse(rawData);

  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return {
      success: false,
      error: firstError.message,
      field: firstError.path[0] as string,
    };
  }

  const { currentPassword, newPassword } = validation.data;

  // Verify current password by attempting to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  });

  if (signInError) {
    return {
      success: false,
      error: "Current password is incorrect",
      field: "currentPassword",
    };
  }

  // Update to new password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return {
      success: false,
      error: updateError.message || "Failed to update password",
    };
  }

  return {
    success: true,
    message: "Password updated successfully",
  };
}
