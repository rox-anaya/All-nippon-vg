// Browser-side Supabase client, used only by the admin pages.
// It uses the PUBLISHABLE key, which is safe in browser code.
// The database rules decide what it is allowed to change.
// The service_role key must never be added to this project.
import { createClient } from '@supabase/supabase-js';

let client = null;

// Creates the client once and reuses it on every call.
export function getSupabase() {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    );
  }
  return client;
}
