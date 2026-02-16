"use server";

import { createAdminClient } from "@/src/db/supabaseAdmin";
import { inviteUserSchema } from "../validators/invite-user.schema";

type InviteUserResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function inviteUserAction(
  fullName: string,
  email: string,
  roleNames: string[],
): Promise<InviteUserResult> {
  try {
    // Validate input
    const validation = inviteUserSchema.safeParse({
      fullName,
      email,
      roles: roleNames,
    });
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Invalid input",
      };
    }

    const adminClient = createAdminClient();

    // Use absolute URL with protocol and host
    const redirectUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000");

    // 1. Invite user via Supabase Auth
    const { data: authData, error: inviteError } =
      await adminClient.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${redirectUrl}/reset-password`,
      });

    if (inviteError || !authData.user) {
      // Check for rate limit error
      const errorMessage = inviteError?.message || "";
      if (
        errorMessage.includes("rate limit") ||
        errorMessage.includes("Email rate limit exceeded")
      ) {
        return {
          success: false,
          error:
            "Email rate limit exceeded (2/hour on free plan). Please wait and try again later, or upgrade your Supabase plan.",
        };
      }

      return {
        success: false,
        error: inviteError?.message || "Failed to send invitation",
      };
    }

    const userId = authData.user.id;

    // 2. Create profile entry first
    const { error: profileError } = await adminClient.from("profiles").insert({
      id: userId,
      email: email,
      full_name: fullName,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      return {
        success: false,
        error: `Failed to create user profile: ${profileError.message}`,
      };
    }

    // 3. Get role IDs from role names
    const { data: rolesData, error: rolesError } = await adminClient
      .from("roles")
      .select("id, name")
      .in("name", roleNames);

    if (rolesError || !rolesData || rolesData.length === 0) {
      console.error("Roles fetch error:", rolesError);
      return {
        success: false,
        error: "Failed to fetch roles from database",
      };
    }

    // 4. Create user_roles entries
    const userRoles = rolesData.map((role) => ({
      user_id: userId,
      role_id: role.id,
      assigned_at: new Date().toISOString(),
    }));

    const { error: userRolesError } = await adminClient
      .from("user_roles")
      .insert(userRoles);

    if (userRolesError) {
      console.error("User roles assignment error:", userRolesError);
      return {
        success: false,
        error: `Failed to assign roles: ${userRolesError.message}`,
      };
    }

    return {
      success: true,
      message: `Invitation sent to ${email}`,
    };
  } catch (error) {
    console.error("Invite user error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
