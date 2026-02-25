"use server";

import { createClient } from "@/src/db/supabaseClient";
import { createAdminClient } from "@/src/db/supabaseAdmin";
import type { UserRole } from "@/src/features/auth/types";

/**
 * Server Action: Get users with server-side pagination
 *
 * SECURITY:
 * - Only super_admin users can access this
 * - Permission check happens via JWT metadata (no database query)
 * - adminClient is only used AFTER authorization is verified
 * - This is an admin-only feature, not for regular users
 */
export async function getUsersAction({
  page = 1,
  itemsPerPage = 10,
  roles,
  lastLoginRange,
}: {
  page?: number;
  itemsPerPage?: number;
  roles?: string[];
  lastLoginRange?: string;
} = {}) {
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
        total: 0,
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
        total: 0,
      };
    }

    // Step 3: User is authorized - now safe to use adminClient
    // adminClient is used here because:
    // - This is an admin-only feature (user management)
    // - We've already verified the user is super_admin
    // - Using RLS would create infinite recursion
    const adminClient = createAdminClient();

    // Calculate pagination range
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    let query = adminClient
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
        { count: "exact" },
      )
      .order("created_at", { ascending: false });

    // Filter by roles (primary_role)
    if (roles && roles.length > 0) {
      // Map role names to IDs using admin client
      const { data: allRoles, error: rolesError } = await adminClient
        .from("roles")
        .select("id, name");
      if (rolesError) {
        console.error("Role fetch error:", rolesError);
        return {
          success: false,
          error: rolesError.message,
          users: [],
          total: 0,
        };
      }
      const roleIdMap: Record<string, string> = {};
      allRoles?.forEach((role: { id: string; name: string }) => {
        roleIdMap[role.name] = role.id;
      });
      const roleIds = roles.map((name) => roleIdMap[name]).filter(Boolean);
      if (roleIds.length > 0) {
        query = query.in("primary_role_id", roleIds);
      }
    }

    // Filter by lastLoginRange
    if (lastLoginRange && lastLoginRange !== "Last 7 days") {
      // Example: implement logic for lastLoginRange
      // You may want to parse and calculate the date range here
      // For now, just as a placeholder:
      // if (lastLoginRange === "Last 30 days") ...
    }

    const {
      data: profiles,
      error: profilesError,
      count,
    } = await query.range(from, to);

    if (profilesError) {
      console.error("Profile fetch error:", profilesError);
      return {
        success: false,
        error: profilesError.message,
        users: [],
        total: 0,
      };
    }

    if (!profiles || profiles.length === 0) {
      return { success: true, users: [], total: count || 0 };
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
    userRoles?.forEach((ur) => {
      if (!userRolesMap.has(ur.user_id)) {
        userRolesMap.set(ur.user_id, []);
      }
      // Type assertion: role is the joined roles table record
      const role = ur.role as unknown as { id: string; name: string } | null;
      if (role?.name) {
        userRolesMap.get(ur.user_id)?.push(role.name);
      }
    });

    // Map profiles to user objects
    const users = profiles.map((profile) => {
      const roles = userRolesMap.get(profile.id) || [];
      const primaryRole = profile.primary_role as unknown as {
        id: string;
        name: string;
      } | null;

      return {
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        avatar_url: profile.avatar_url,
        last_sign_in_at: profile.last_login_at,
        created_at: profile.created_at,
        primary_role_id: profile.primary_role_id,
        primary_role_label: (primaryRole?.name as UserRole) || null,
        roles: roles,
      };
    });

    return { success: true, users, total: count || 0 };
  } catch (err) {
    console.error("getUsersAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to fetch users",
      users: [],
      total: 0,
    };
  }
}
