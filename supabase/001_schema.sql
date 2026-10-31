-- =====================================================================
-- ANVG Stage 1 database setup.
-- HOW TO RUN: Supabase dashboard > SQL Editor > New query > paste all > Run.
-- Run this file ONCE. Running it again shows "already exists" errors.
-- =====================================================================

-- 1) Admin list. Only user IDs in this table can change website content.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admin_users enable row level security;

-- Helper used by every admin rule. Returns true only for listed admins.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- A signed-in user may read only their own admin row (the admin page uses this to check access).
create policy "users read own admin row" on public.admin_users
  for select to authenticated using (user_id = auth.uid());

-- 2) Page text and settings. One row per group: 'site', 'home', 'about'.
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;

create policy "anyone reads settings" on public.site_settings
  for select to anon, authenticated using (true);
create policy "admins manage settings" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 3) Lists: showcase images, airline divisions, staff. Later: events, fleet, ranks, and so on.
create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  collection text not null,
  data jsonb not null default '{}'::jsonb,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists content_items_collection_idx on public.content_items (collection, sort_order);
alter table public.content_items enable row level security;

create policy "anyone reads published items" on public.content_items
  for select to anon, authenticated using (is_published = true);
create policy "admins read all items" on public.content_items
  for select to authenticated using (public.is_admin());
create policy "admins add items" on public.content_items
  for insert to authenticated with check (public.is_admin());
create policy "admins edit items" on public.content_items
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete items" on public.content_items
  for delete to authenticated using (public.is_admin());

-- 4) Image bucket: anyone can view, only admins can upload, change, or delete.
insert into storage.buckets (id, name, public)
values ('anvg-media', 'anvg-media', true)
on conflict (id) do nothing;

create policy "anyone views media" on storage.objects
  for select to anon, authenticated using (bucket_id = 'anvg-media');
create policy "admins upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'anvg-media' and public.is_admin());
create policy "admins change media" on storage.objects
  for update to authenticated
  using (bucket_id = 'anvg-media' and public.is_admin())
  with check (bucket_id = 'anvg-media' and public.is_admin());
create policy "admins delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'anvg-media' and public.is_admin());

-- 5) Starting content, taken from your spec. Change anything later in the admin page.
insert into public.site_settings (key, value) values
('site', $j${
  "developer_name": "Anaya",
  "developer_button_label": "Waypoints VA",
  "developer_button_url": "https://community.infiniteflight.com/u/ravikumar",
  "waypoints_portal": "",
  "instagram": "",
  "youtube": "",
  "vk": ""
}$j$::jsonb),
('home', $j${
  "hero_image_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1779014897/Screenshot_20260509_221234_com.fds.infiniteflight_ewqhzv.jpg",
  "label": "ANVG • Waypoints Community Airline",
  "title": "All Nippon Virtual Group",
  "tagline": "Fly Beyond Borders",
  "stat_flight_hours": "—",
  "stat_pireps": "—",
  "stat_hubs": "4",
  "stat_aircraft_family": "—",
  "stat_destinations": "—",
  "ops_note": "Operations and flight logging powered by Waypoints | Last updated: Oct 2026",
  "mission": "To turn every flight into a journey worth remembering. ANVG brings together aviators to explore, connect, and experience virtual flight operations through the spirit of Japan. We fly with purpose, grow as a community, and leave a mark on every route we take.",
  "ceo_message": "Welcome to ANVG. We’re here to make every flight meaningful, every destination memorable, and every pilot part of something greater. Let’s fly together and build something we can be proud of.",
  "ceo_name": "Luciano",
  "ceo_role": "CEO - All Nippon Virtual Group",
  "cta_heading": "Ready to join?",
  "cta_text": "Experience virtual flight operations with our community. Become part of our growing virtual family today."
}$j$::jsonb),
('about', $j${
  "title": "Discover ANVG",
  "subtitle": "The Spirit of Japanese Aviation • Official Community Airline on Waypoints",
  "group_name": "All Nippon Virtual Group (ANVG)",
  "description": "All Nippon Virtual Group is an independent, community-driven virtual aviation organization operating on the Waypoints platform. Inspired by the rich legacy of Japanese aviation, ANVG unites multiple distinctive airline operations into a single cohesive group structure.\n\nWhether piloting domestic island feeders, crossing oceans in wide-body flagships, flying high-density low-cost leisure corridors, or commanding transpacific cargo freighters, ANVG offers a versatile and welcoming environment where pilots of all experience levels can thrive.",
  "tagline": "Fly Beyond Borders",
  "pillars_heading": "Our Group Pillars",
  "pillars_intro": "Four distinctive operating divisions under All Nippon Virtual Group."
}$j$::jsonb)
on conflict (key) do nothing;

insert into public.content_items (collection, data, sort_order) values
('showcase', $j${"image_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790574373/InfiniteFlight_2026-09-27-13-11-43_c2obn9.webp", "caption": ""}$j$::jsonb, 1),
('showcase', $j${"image_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790574372/InfiniteFlight_2026-09-27-13-11-46_tbcdxz.webp", "caption": ""}$j$::jsonb, 2),
('showcase', $j${"image_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790574372/InfiniteFlight_2026-09-27-13-11-15_cmvok8.webp", "caption": ""}$j$::jsonb, 3),
('showcase', $j${"image_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790574372/InfiniteFlight_2026-09-27-13-11-38_fj7ej7.webp", "caption": ""}$j$::jsonb, 4),
('showcase', $j${"image_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790574372/InfiniteFlight_2026-09-27-13-11-19_oor104.webp", "caption": ""}$j$::jsonb, 5),
('divisions', $j${"category": "Flagship Mainline", "name": "All Nippon Airways", "logo_url": "", "description": "The core foundation of ANVG. Providing full-service passenger operations with an expansive domestic trunk network and premium long-haul routes connecting Tokyo Haneda (RJTT) and Narita (RJAA) across Asia, North America, and Europe.", "hubs": ["RJTT", "RJAA"], "fleet": ["B77W", "B787", "A320", "Q400"]}$j$::jsonb, 1),
('divisions', $j${"category": "Heavy Freight Division", "name": "Nippon Cargo Airlines (NCA)", "logo_url": "", "description": "Dedicated heavy-lift freight logistics connecting Japan with global supply chains. Operating the Boeing 747-8F across high-payload transpacific corridors connecting Tokyo Narita with Anchorage (PANC) and Chicago O'Hare (KORD).", "hubs": ["RJAA", "PANC"], "fleet": ["Boeing 747-8F"]}$j$::jsonb, 2),
('divisions', $j${"category": "Low-Cost & Regional", "name": "Peach Aviation", "logo_url": "", "description": "ANVG's vibrant low-cost subsidiary providing affordable, high-frequency domestic flights and regional hops across East Asia. Headquartered out of Osaka Kansai (RJBB) and Naha (ROAH) with signature point-to-point agility.", "hubs": ["RJBB", "ROAH", "RJAA"], "fleet": ["Airbus A320-200"]}$j$::jsonb, 3),
('divisions', $j${"category": "Leisure Medium-Haul", "name": "AirJapan", "logo_url": "", "description": "The hybrid leisure airline of the group, bridging full-service comfort with budget accessibility. Operating medium-haul Boeing 787 flights linking Tokyo Narita to vacation hotspots throughout Southeast Asia and Oceania.", "hubs": ["RJAA (Narita)"], "fleet": ["Boeing 787-8"]}$j$::jsonb, 4);

-- ---------------------------------------------------------------------
-- AFTER RUNNING THIS FILE, create your admin login:
-- 1. Authentication > Users > Add user > Create new user.
--    Enter your email and a password, and tick "Auto Confirm User".
-- 2. Come back to SQL Editor and run this (use YOUR email):
--    insert into public.admin_users (user_id)
--    select id from auth.users where email = 'your-email@example.com';
-- 3. Authentication > Providers > Email: turn OFF "Allow new users to sign up"
--    so strangers cannot create accounts.
-- ---------------------------------------------------------------------
