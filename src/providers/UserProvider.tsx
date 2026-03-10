"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createBrowserSupabaseClient } from "@/src/db/supabaseBrowserClient";
import type { UserRole } from "@/src/features/auth/types";

export type UserProfile = {
  id: string;
  email: string;
  fullName?: string;
  primaryRole?: UserRole;
};

interface UserContextValue {
  user: UserProfile | null;
  loading: boolean;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  loading: true,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      const supabase = createBrowserSupabaseClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email ?? "",
          fullName: authUser.user_metadata?.name ?? undefined,
          primaryRole: authUser.user_metadata?.primary_role ?? undefined,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    }
    fetchUser();
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
