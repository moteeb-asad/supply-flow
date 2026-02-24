"use server";

import { createClient } from "@/src/db/supabaseClient";
import { redirect } from "next/navigation";
import {
  loginSchema,
  resetPasswordSchema,
} from "@/src/features/auth/validators/auth.schema";

export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string } | undefined> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validate input
  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    console.log("Validation errors:", validation.error.format());
    return {
      error: "Invalid email or password format",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requestPasswordResetAction(
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string; success?: string } | undefined> {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required." };
  }

  const supabase = await createClient();

  // Use absolute URL with protocol and host
  const redirectUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000");

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${redirectUrl}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Reset link sent. Check your email." };
}

export async function resetPasswordAction(
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData,
) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Use Zod schema for server-side validation too
  const validation = resetPasswordSchema.safeParse({
    password,
    confirmPassword,
  });

  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return { error: firstError.message };
  }

  const supabase = await createClient();

  // Check if user is authenticated (has valid session from recovery token)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Session error:", userError);
    return {
      error:
        "Invalid or expired reset link. Please request a new password reset.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("Password update error:", error);
    return {
      error: error.message || "Unable to update password. Please try again.",
    };
  }

  return { success: "Password updated successfully. You can sign in now." };
}
