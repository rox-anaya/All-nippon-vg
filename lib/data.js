// Server-side reads for the public website. Only published content is returned,
// because the database rules hide unpublished rows from the public key.
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  { auth: { persistSession: false } }
);

// Returns one settings group as an object, for example getSettings('home').
// Returns {} when the row is missing or the database cannot be reached.
export async function getSettings(key) {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();
  if (error) {
    console.error('Settings read failed:', error.message);
    return {};
  }
  return data?.value ?? {};
}

// Returns the published items in a list, in the order the admin chose.
// Returns null when the database cannot be reached, so pages can show an error message.
export async function getItems(collection) {
  const { data, error } = await supabase
    .from('content_items')
    .select('id, data, sort_order')
    .eq('collection', collection)
    .eq('is_published', true)
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('List read failed:', error.message);
    return null;
  }
  return data ?? [];
}
