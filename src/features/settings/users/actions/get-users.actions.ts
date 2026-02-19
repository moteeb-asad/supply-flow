"use server";

import { createClient } from "@/src/db/supabaseClient";
import { createAdminClient } from "@/src/db/supabaseAdmin";

/**
 * Server Action: Get all users for user management
 *
 * SECURITY:
 * - Only super_admin users can access this
 * - Permission check happens via JWT metadata (no database query)
 * - adminClient is only used AFTER authorization is verified
 * - This is an admin-only feature, not for regular users
 */
export async function getUsersAction() {
  try {
    const supabase = await createClient();

    // Step 1: Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Unauthorized. Please log in.",
        users: [],
      };
    }

    // Step 2: Check permission from JWT metadata (non-recursive)
    // The user's role is stored in user_metadata.primary_role during signup/creation
    const userRole = user.user_metadata?.primary_role;

    if (userRole !== "super_admin") {
      console.warn(
        `Unauthorized access attempt to getUsersAction by user ${user.id}`,
      );
      return {
        success: false,
        error: "Access denied. Super admin role required.",
        users: [],
      };
    }

    // Step 3: User is authorized - now safe to use adminClient
    // adminClient is used here because:
    // - This is an admin-only feature (user management)
    // - We've already verified the user is super_admin
    // - Using RLS would create infinite recursion
    const adminClient = createAdminClient();

    const { data: profiles, error: profilesError } = await adminClient
      .from("profiles")
      .select(
        `
        id,
        full_name,
        email,
        avatar_url,
        last_login_at,
        created_at,
        primary_role_id,
        primary_role:roles!profiles_primary_role_id_fkey(id, name)
      `,
      )
      .order("created_at", { ascending: false });

    if (profilesError) {
      console.error("Profile fetch error:", profilesError);
      return { success: false, error: profilesError.message, users: [] };
    }

    if (!profiles || profiles.length === 0) {
      return { success: true, users: [] };
    }

    // Fetch user_roles for all users (additional roles beyond primary_role)
    const { data: userRoles } = await adminClient
      .from("user_roles")
      .select(
        `
        user_id,
        role:roles(id, name)
      `,
      )
      .in(
        "user_id",
        profiles.map((p) => p.id),
      );

    // Create a map of user roles by user_id
    const userRolesMap = new Map<string, string[]>();
    userRoles?.forEach((ur: any) => {
      if (!userRolesMap.has(ur.user_id)) {
        userRolesMap.set(ur.user_id, []);
      }
      if (ur.role?.name) {
        userRolesMap.get(ur.user_id)?.push(ur.role.name);
      }
    });

    // Map profiles to user objects
    const users = profiles.map((profile: any) => {
      const roles = userRolesMap.get(profile.id) || [];

      return {
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        avatar_url: profile.avatar_url,
        last_sign_in_at: profile.last_login_at,
        created_at: profile.created_at,
        primary_role_id: profile.primary_role_id,
        primary_role_label: profile.primary_role?.name || "",
        roles: roles,
      };
    });

    return { success: true, users };
  } catch (err) {
    console.error("getUsersAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to fetch users",
      users: [],
    };
  }
}
