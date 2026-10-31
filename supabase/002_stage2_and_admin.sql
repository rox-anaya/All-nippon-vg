-- =====================================================================
-- ANVG: admin account and Stage 2 starting content.
-- HOW TO RUN: Supabase > SQL Editor > New query > paste all > Run.
-- Run ONCE, after 001_schema.sql. If the first line fails, the user does
-- not exist yet: create it in Authentication > Users first.
-- =====================================================================

-- Make the owner account an admin.
insert into public.admin_users (user_id)
values ('7bfb29e1-988a-4764-8ceb-80ddcb289d8a')
on conflict do nothing;

-- Routes & hubs: the four primary hubs (from the spec).
insert into public.content_items (collection, data, sort_order, is_published) values
('hubs', $j${"name": "Tokyo International Airport (Haneda)", "icao": "RJTT", "image_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790509650/Haneda-Airport-Tokyo-review_le5uqm.webp", "description": "The premier domestic and international gateway for ANVG. Situated in the heart of Tokyo, Haneda offers highly scenic approaches over Tokyo Bay and serves as our most heavily trafficked operational base."}$j$::jsonb, 1, true),
('hubs', $j${"name": "Narita International Airport", "icao": "RJAA", "image_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790509659/The_night_view_of_Tokyo_Narita_Airport_Terminal_1_h4lz1d.jpg", "description": "Our primary heavy international hub. Narita connects Japan to the virtual world, handling the vast majority of our long-haul wide-body passenger flights and global B777F cargo logistics."}$j$::jsonb, 2, true),
('hubs', $j${"name": "Osaka International Airport (Itami)", "icao": "RJOO", "image_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790509651/page-business-airportsitm-overview_istg2r.webp", "description": "Serving the Kansai region, Itami is a vital domestic hub dedicated to high-frequency regional operations. It is the perfect base for our narrow-body and turboprop pilots looking for quick, immersive short-hauls."}$j$::jsonb, 3, true),
('hubs', $j${"name": "Kansai International Airport", "icao": "RJBB", "image_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790509659/av_imagen_tbwalv.webp", "description": "The 24-hour offshore gateway to Western Japan. Kansai supports a healthy, robust mix of domestic connections, international passenger routes, and critical global cargo operations."}$j$::jsonb, 4, true);

-- Ranks: the standard and elite ranks (from the spec). Sora no Takumi has no hours set, on purpose.
insert into public.content_items (collection, data, sort_order, is_published) values
('ranks', $j${"code": "01", "name": "Trainee", "category": "Standard", "insignia_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790511238/IMG_20260927_173850_nrqova.jpg", "min_hours": "0", "max_hours": "25", "description": "Given upon joining."}$j$::jsonb, 1, true),
('ranks', $j${"code": "02", "name": "Cadet Pilot", "category": "Standard", "insignia_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790511456/IMG_20260927_174554_vfamdj.jpg", "min_hours": "25", "max_hours": "50", "description": ""}$j$::jsonb, 2, true),
('ranks', $j${"code": "03", "name": "Second Officer", "category": "Standard", "insignia_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790511456/IMG_20260927_174616_k2us8z.jpg", "min_hours": "50", "max_hours": "100", "description": ""}$j$::jsonb, 3, true),
('ranks', $j${"code": "04", "name": "First Officer", "category": "Standard", "insignia_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790511455/IMG_20260927_174714_yizbai.jpg", "min_hours": "100", "max_hours": "150", "description": ""}$j$::jsonb, 4, true),
('ranks', $j${"code": "05", "name": "Hikōshi", "category": "Standard", "insignia_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790511777/IMG_20260927_175008_pgtjvc.jpg", "min_hours": "150", "max_hours": "200", "description": ""}$j$::jsonb, 5, true),
('ranks', $j${"code": "06", "name": "Kōkūshi", "category": "Standard", "insignia_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790511776/IMG_20260927_175133_bat1tj.jpg", "min_hours": "200", "max_hours": "250", "description": ""}$j$::jsonb, 6, true),
('ranks', $j${"code": "07", "name": "Kantoku", "category": "Standard", "insignia_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790511776/IMG_20260927_175202_oo4dym.jpg", "min_hours": "250", "max_hours": "350", "description": ""}$j$::jsonb, 7, true),
('ranks', $j${"code": "08", "name": "Shireikan", "category": "Standard", "insignia_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790511775/IMG_20260927_175231_v2psex.jpg", "min_hours": "350", "max_hours": "1,000", "description": ""}$j$::jsonb, 8, true),
('ranks', $j${"code": "01", "name": "Seiei Kicho", "category": "Elite Command", "insignia_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790512095/IMG_20260927_175531_ieguy6.jpg", "min_hours": "1,000", "max_hours": "1,500", "description": ""}$j$::jsonb, 9, true),
('ranks', $j${"code": "02", "name": "Meiyo Kicho", "category": "Elite Command", "insignia_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790512095/IMG_20260927_175609_wywlei.jpg", "min_hours": "1,500", "max_hours": "2,000", "description": ""}$j$::jsonb, 10, true),
('ranks', $j${"code": "03", "name": "Sora no Takumi", "category": "Elite Command", "insignia_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790512096/IMG_20260927_175752_ykwm80.jpg", "min_hours": "", "max_hours": "", "description": ""}$j$::jsonb, 11, true);

-- Fleet: the aircraft types named in the spec. Photos are placeholders taken from the Home page.
-- Published, so you can see the page working. Replace photos in the admin, or hide any item.
insert into public.content_items (collection, data, sort_order, is_published) values
('fleet', $j${"name": "B77W", "airline": "All Nippon Airways", "category": "Passenger", "image_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790574373/InfiniteFlight_2026-09-27-13-11-43_c2obn9.webp", "description": ""}$j$::jsonb, 1, true),
('fleet', $j${"name": "B787", "airline": "All Nippon Airways", "category": "Passenger", "image_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790574372/InfiniteFlight_2026-09-27-13-11-46_tbcdxz.webp", "description": ""}$j$::jsonb, 2, true),
('fleet', $j${"name": "A320", "airline": "All Nippon Airways", "category": "Passenger", "image_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790574372/InfiniteFlight_2026-09-27-13-11-15_cmvok8.webp", "description": ""}$j$::jsonb, 3, true),
('fleet', $j${"name": "Q400", "airline": "All Nippon Airways", "category": "Passenger", "image_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790574372/InfiniteFlight_2026-09-27-13-11-38_fj7ej7.webp", "description": ""}$j$::jsonb, 4, true),
('fleet', $j${"name": "Boeing 747-8F", "airline": "Nippon Cargo Airlines (NCA)", "category": "Cargo", "image_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790574372/InfiniteFlight_2026-09-27-13-11-19_oor104.webp", "description": ""}$j$::jsonb, 5, true),
('fleet', $j${"name": "Airbus A320-200", "airline": "Peach Aviation", "category": "Passenger", "image_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790574373/InfiniteFlight_2026-09-27-13-11-43_c2obn9.webp", "description": ""}$j$::jsonb, 6, true),
('fleet', $j${"name": "Boeing 787-8", "airline": "AirJapan", "category": "Passenger", "image_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1790574372/InfiniteFlight_2026-09-27-13-11-46_tbcdxz.webp", "description": ""}$j$::jsonb, 7, true);

-- Events: one hidden sample so you can test the Publish button. Edit it or delete it.
insert into public.content_items (collection, data, sort_order, is_published) values
('events', $j${"name": "Sample event (replace me)", "banner_url": "https://res.cloudinary.com/dsfwafyc2/image/upload/v1779014897/Screenshot_20260509_221234_com.fds.infiniteflight_ewqhzv.jpg", "description": "Replace this text with your event details.", "departure_icao": "RJTT", "arrival_icao": "RJAA", "departure_zulu": "2026-11-07T12:00:00Z"}$j$::jsonb, 1, false);
