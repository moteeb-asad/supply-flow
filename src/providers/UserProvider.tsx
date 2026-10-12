"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createBrowserSupabaseClient } from "@/src/db/supabaseBrowserClient";
import type { UserRole } from "@/src/types/layout";
import type {
  ProfileRoleRow,
  RoleNameRow,
  UserContextValue,
  UserProfile,
} from "@/src/types/user";

const UserContext = createContext<UserContextValue>({
  user: null,
  loading: true,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    let active = true;

    async function fetchUser() {
      if (!active) return;
      setLoading(true);

      try {
        // Display-only context: verify the session JWT locally (cached JWKS)
        // instead of a Supabase Auth round trip. Security checks live in the
        // middleware and database RLS.
        const { data } = await supabase.auth.getClaims();
        const claims = data?.claims;

        if (!active) return;

        if (!claims) {
          setUser(null);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, primary_role_id")
          .eq("id", claims.sub)
          .maybeSingle<ProfileRoleRow>();

        let primaryRole: UserRole | undefined =
          claims.user_metadata?.primary_role ?? undefined;

        if (profile?.primary_role_id) {
          const { data: role } = await supabase
            .from("roles")
            .select("name")
            .eq("id", profile.primary_role_id)
            .maybeSingle<RoleNameRow>();

          if (role?.name) {
            primaryRole = role.name as UserRole;
          }
        }

        if (!active) return;

        setUser({
          id: claims.sub,
          email: claims.email ?? "",
          fullName:
            profile?.full_name ?? claims.user_metadata?.name ?? undefined,
          primaryRole,
        });
      } catch (error) {
        // Aborted or failed request (navigation, network drop): keep the last
        // known user instead of throwing or clearing it.
        console.error("Failed to load current user:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    void fetchUser();

    // Refetch only when the signed-in user actually changes, not on
    // INITIAL_SESSION (already fetched above) or hourly TOKEN_REFRESHED.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "USER_UPDATED"
      ) {
        void fetchUser();
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
