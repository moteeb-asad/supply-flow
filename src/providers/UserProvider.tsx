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

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!active) return;

      if (authUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, primary_role_id")
          .eq("id", authUser.id)
          .maybeSingle<ProfileRoleRow>();

        let primaryRole: UserRole | undefined =
          authUser.user_metadata?.primary_role ?? undefined;

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
          id: authUser.id,
          email: authUser.email ?? "",
          fullName:
            profile?.full_name ?? authUser.user_metadata?.name ?? undefined,
          primaryRole,
        });
      } else {
        setUser(null);
      }

      if (!active) return;
      setLoading(false);
    }

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void fetchUser();
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
