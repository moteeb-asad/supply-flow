import { createAdminClient } from "@/src/db/supabaseAdmin";

export async function getRoleIdMap(): Promise<Record<string, string>> {
  const adminClient = createAdminClient();
  const { data: roles } = await adminClient.from("roles").select("id, name");
  const map: Record<string, string> = {};
  roles?.forEach((role: { id: string; name: string }) => {
    map[role.name] = role.id;
  });
  return map;
}
