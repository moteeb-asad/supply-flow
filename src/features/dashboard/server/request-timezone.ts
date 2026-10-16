import { headers } from "next/headers";

// Visitor's IANA timezone from Vercel's geo header; SQL functions fall back to
// UTC for missing or invalid values (e.g. in local development).
export async function getRequestTimezone(): Promise<string> {
  return (await headers()).get("x-vercel-ip-timezone") ?? "UTC";
}
