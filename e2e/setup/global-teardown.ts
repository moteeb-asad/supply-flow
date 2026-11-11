import fs from "node:fs";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Runs once after the whole e2e run. Deletes the rows the tests created, so
// the local grid and metrics stay clean between runs.
//
// Test data is recognised by its name prefix: every test that creates a
// record names it "E2E ..." (e.g. "E2E Supplier 1794392798782").
//
// Safety: uses only the LOCAL Supabase settings from .env.development.local
// and refuses to run against anything but 127.0.0.1 / localhost, because
// .env holds the production URL and service-role key.

const TEST_PREFIX = "E2E ";
const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost"]);

export default async function globalTeardown() {
  const envFile = ".env.development.local";
  if (!fs.existsSync(envFile)) {
    console.warn(`[e2e cleanup] skipped: ${envFile} not found`);
    return;
  }

  const env = dotenv.parse(fs.readFileSync(envFile));
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.warn("[e2e cleanup] skipped: local Supabase URL or key missing");
    return;
  }
  if (!LOCAL_HOSTS.has(new URL(url).hostname)) {
    console.warn(`[e2e cleanup] skipped: ${url} is not a local database`);
    return;
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  const { count, error } = await supabase
    .from("suppliers")
    .delete({ count: "exact" })
    .like("name", `${TEST_PREFIX}%`);

  if (error) {
    console.warn(`[e2e cleanup] suppliers: ${error.message}`);
    return;
  }
  console.warn(`[e2e cleanup] deleted ${count ?? 0} test suppliers`);
}
