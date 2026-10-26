import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/src/db/supabaseBrowser";

const INVALID_LINK_ERROR =
  "Invalid or expired reset link. Please request a new one.";

// Reads the recovery or invite tokens from the email link, starts the session
// in the browser and reports whether the link is usable.
export function useRecoverySession() {
  const [sessionReady, setSessionReady] = useState(false);
  const [isInvite, setIsInvite] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1),
        );
        const searchParams = new URLSearchParams(window.location.search);
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const hashType = hashParams.get("type");
        const queryType = searchParams.get("type");
        const type = hashType || queryType;
        const code = searchParams.get("code");

        setIsInvite(type === "invite");

        const supabase = createBrowserSupabaseClient();

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error("Supabase setSession error:", error);
            setTokenError(INVALID_LINK_ERROR);
          }
        } else if (!code && (type === "recovery" || type === "invite")) {
          setTokenError(INVALID_LINK_ERROR);
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (
          !session &&
          (accessToken ||
            refreshToken ||
            code ||
            type === "recovery" ||
            type === "invite")
        ) {
          setTokenError(INVALID_LINK_ERROR);
        }
      } catch (error) {
        console.error("Reset password session check failed:", error);
        setTokenError(
          "Unable to reach the authentication server. Check your Supabase URL and key.",
        );
      } finally {
        setSessionReady(true);
      }
    };

    void checkSession();
  }, []);

  return { sessionReady, isInvite, tokenError };
}
