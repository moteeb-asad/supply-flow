"use server";

import { createAdminClient } from "@/src/db/supabaseAdmin";
import { inviteUserSchema } from "../../users/validators/invite-user.schema";
import { createClient } from "@/src/db/supabaseClient";

type InviteUserResult =
  | { success: true; message: string }
  | { success: false; error: string };

// Accept currentUser as argument for audit fields
export async function inviteUserAction(
  fullName: string,
  email: string,
  roleNames: string[],
  primaryRoleName: string,
): Promise<InviteUserResult> {
  try {
    // Validate input
    const validation = inviteUserSchema.safeParse({
      fullName,
      email,
      primaryRole: primaryRoleName,
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
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // 1. Invite user via Supabase Auth
    const primaryRole = primaryRoleName;
    const roles = roleNames;

    const { data: authData, error: inviteError } =
      await adminClient.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${redirectUrl}/reset-password`,
        data: {
          full_name: fullName,
          primary_role: primaryRole,
          roles,
        },
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

    // Ensure display name is set on auth user metadata
    await adminClient.auth.admin.updateUserById(userId, {
      user_metadata: {
        full_name: fullName,
        primary_role: primaryRole,
        roles,
      },
    });

    // 2. Get role IDs from role names
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

    const primaryRoleId = rolesData.find(
      (role) => role.name === primaryRole,
    )?.id;

    if (!primaryRoleId) {
      return {
        success: false,
        error: "Primary role is not in selected roles",
      };
    }

    // 3. Create or update profile entry
    // Note: auth.users triggers may already create a profile row, so use upsert.
    const { error: profileError } = await adminClient.from("profiles").upsert(
      {
        id: userId,
        email: email,
        full_name: fullName,
        primary_role_id: primaryRoleId,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "id",
      },
    );

    if (profileError) {
      console.error("Profile creation error:", profileError);
      return {
        success: false,
        error: `Failed to create user profile: ${profileError.message}`,
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
      .upsert(userRoles, {
        onConflict: "user_id,role_id",
        ignoreDuplicates: true,
      });

    if (userRolesError) {
      console.error("User roles assignment error:", userRolesError);
      return {
        success: false,
        error: `Failed to assign roles: ${userRolesError.message}`,
      };
    }

    // 5. Insert invitation record
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const sentAt = new Date();
    const expiresAt = new Date(sentAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours later
    const { error: invitationError } = await adminClient
      .from("invitations")
      .insert({
        email,
        role_id: primaryRoleId,
        invited_by: user.id,
        sent_at: sentAt.toISOString(),
        expires_at: expiresAt.toISOString(),
        status: "pending",
      });
    if (invitationError) {
      console.error("Invitation table insert error:", invitationError);
      return {
        success: false,
        error: `Failed to record invitation: ${invitationError.message}`,
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
