"use server";

import { createAdminSupabaseClient } from "@/src/db/supabaseAdmin";
import { inviteUserSchema } from "../../users/validators/invite-user.schema";
import { createServerSupabaseClient } from "@/src/db/supabaseServer";
import { requireSuperAdmin } from "@/src/features/auth/server/require-super-admin";

type InviteUserResult =
  { success: true; message: string } | { success: false; error: string };

// Accept currentUser as argument for audit fields
export async function inviteUserAction(
  fullName: string,
  email: string,
  roleName: string,
): Promise<InviteUserResult> {
  await requireSuperAdmin();
  try {
    // Validate input
    const validation = inviteUserSchema.safeParse({
      fullName,
      email,
      role: roleName,
    });
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Invalid input",
      };
    }

    const adminClient = createAdminSupabaseClient();

    // Use absolute URL with protocol and host
    const redirectUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // 1. Invite user via Supabase Auth.
    // user_metadata holds display data only: users can edit it themselves.
    // The role reaches app_metadata through the profiles trigger (migration 037).

    const { data: authData, error: inviteError } =
      await adminClient.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${redirectUrl}/reset-password`,
        data: {
          full_name: fullName,
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
      },
    });

    // 2. Get the role id
    const { data: roleRow, error: roleError } = await adminClient
      .from("roles")
      .select("id")
      .eq("name", roleName)
      .maybeSingle<{ id: number }>();

    if (roleError || !roleRow) {
      console.error("Role fetch error:", roleError);
      return {
        success: false,
        error: "Failed to fetch role from database",
      };
    }

    const roleId = roleRow.id;

    // 3. Create or update profile entry
    // Note: auth.users triggers may already create a profile row, so use upsert.
    const { error: profileError } = await adminClient.from("profiles").upsert(
      {
        id: userId,
        email: email,
        full_name: fullName,
        primary_role_id: roleId,
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

    // 4. Exactly one user_roles row (used by RLS): drop any other role first,
    // e.g. when an existing user is re-invited with a different role.
    const { error: staleRolesError } = await adminClient
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .neq("role_id", roleId);

    if (staleRolesError) {
      console.error("Stale user roles cleanup error:", staleRolesError);
      return {
        success: false,
        error: `Failed to assign role: ${staleRolesError.message}`,
      };
    }

    const { error: userRolesError } = await adminClient
      .from("user_roles")
      .upsert(
        {
          user_id: userId,
          role_id: roleId,
          assigned_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,role_id",
          ignoreDuplicates: true,
        },
      );

    if (userRolesError) {
      console.error("User roles assignment error:", userRolesError);
      return {
        success: false,
        error: `Failed to assign role: ${userRolesError.message}`,
      };
    }

    // 5. Insert invitation record
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const sentAt = new Date();
    const expiresAt = new Date(sentAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours later
    const { error: invitationError } = await adminClient
      .from("invitations")
      .insert({
        email,
        role_id: roleId,
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
