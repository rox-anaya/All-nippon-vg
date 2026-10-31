-- =====================================================================
-- ANVG: Stage 3 and Stage 4 content, plus your footer and credit links.
-- HOW TO RUN: Supabase > SQL Editor > New query > paste all > Run.
-- Run ONCE, after 001 and 002.
-- =====================================================================

-- Footer links and developer credit (values from the owner).
update public.site_settings
set value = value || $j${
  "developer_name": "Rox",
  "waypoints_portal": "https://waypoint-live.app/join/3UYSYVMNDZ",
  "instagram": "https://www.instagram.com/if.atlas_virtual?dlrf=NDQyNnQ5dmxjanBs",
  "youtube": "https://youtube.com/@anavirtualgroup?si=WKal4QTNj96RdI80"
}$j$::jsonb
where key = 'site';

-- Page text for the new pages.
insert into public.site_settings (key, value) values
('training', $j${
  "title": "Pilot Training & Evaluation",
  "description": "Excellence in aviation starts with preparation. Our structured training pipeline ensures every ANVG pilot commands their aircraft with realism, safety, and community spirit.",
  "stages_heading": "Evaluation Stages",
  "recruitment_heading": "Recruitment Flow",
  "cta_heading": "Ready to take off?",
  "cta_text": "Join a welcoming community of passionate virtual aviators. Review prerequisites and take the test today to earn your ANVG wings.",
  "cta_button_label": "Go to Application"
}$j$::jsonb),
('apply', $j${
  "title": "Join Our Flight Deck",
  "description": "Ready to fly across Japan and beyond? Review our community prerequisites below and take the direct pilot intake test right inside the Waypoints Crew Center.",
  "prereq_heading": "Pilot Prerequisites",
  "steps_heading": "Recruitment & Onboarding Flow",
  "integration_heading": "Waypoints Integration",
  "integration_text": "Testing and callsign assignment are managed directly through the Waypoints Crew Center system. Make sure you are logged into your Waypoints account before starting the application!",
  "intake_small": "Crew Center Direct Intake",
  "intake_heading": "Start Your Pilot Test",
  "intake_text": "Click below to launch the pilot knowledge assessment directly inside our Waypoints portal. Upon passing, your pilot record will be queued for instant activation.",
  "intake_divider_text": "Take Pilot Test on Waypoints",
  "button_label": "Start Pilot Test",
  "button_url": ""
}$j$::jsonb),
('codeshare', $j${
  "title": "Codeshare Alliances",
  "description": "Expanding our wings through global simulation partnerships. Connect to worldwide destinations through our official codeshare airline network on Waypoints."
}$j$::jsonb),
('changelog', $j${
  "title": "Change Log"
}$j$::jsonb),
('voice', $j${
  "home": "Welcome to All Nippon Virtual Group. Explore our fleet, routes, and upcoming operations.",
  "about": "About All Nippon Virtual Group, and the airline divisions that make up our group.",
  "staff": "Meet the leadership team behind All Nippon Virtual Group.",
  "events": "Network activity. Upcoming virtual events and the latest announcements.",
  "fleet": "The wings of ANVG. Browse aircraft by airline.",
  "routes": "Global network. Explore our four primary hubs in Japan.",
  "ranks": "Pilot progression. Explore the standard and elite ranks.",
  "training": "Pilot training and evaluation. See how to earn your wings.",
  "apply": "Join our flight deck. Review the prerequisites and start your pilot test.",
  "codeshare": "Codeshare alliances. Our partner airlines on Waypoints.",
  "changelog": "Change log. Recent updates to the ANVG website.",
  "settings": "Flight deck settings. Change your theme, font, and voice assistance."
}$j$::jsonb)
on conflict (key) do nothing;

-- Training: evaluation stages.
insert into public.content_items (collection, data, sort_order, is_published) values
('training_stages', $j${"number": "01", "title": "Crew Center Theory Exam", "description": "Completed directly inside the Waypoints Crew Center intake portal. Covers fundamental aviation knowledge, Infinite Flight pattern procedures, radio phraseology, and ANVG standard operating guidelines before flight hours are logged.", "assessment": "Automated assessment via Waypoints."}$j$::jsonb, 1, true),
('training_stages', $j${"number": "02", "title": "Checkride Evaluation", "description": "A live flight check conducted with an ANVG flight training mentor. Primarily reserved for advanced wide-body type ratings or pilots seeking personalized coaching on ILS approaches, crosswind landings, and pattern operations.", "assessment": "Scheduled upon request or mentor review."}$j$::jsonb, 2, true);

-- Training: recruitment flow steps.
insert into public.content_items (collection, data, sort_order, is_published) values
('training_steps', $j${"number": "01", "title": "Waypoints Intake", "description": "Launch the pilot test inside Waypoints Crew Center."}$j$::jsonb, 1, true),
('training_steps', $j${"number": "02", "title": "Knowledge Exam", "description": "Complete the online questionnaire covering flight basics."}$j$::jsonb, 2, true),
('training_steps', $j${"number": "03", "title": "Staff Approval", "description": "Our leadership validates your score and assigns your callsign."}$j$::jsonb, 3, true),
('training_steps', $j${"number": "04", "title": "Discord Access", "description": "Join our pilot briefing channels and flight schedules."}$j$::jsonb, 4, true),
('training_steps', $j${"number": "05", "title": "Wheels Up", "description": "Fly group routes and log PIREPs into the system!"}$j$::jsonb, 5, true);

-- Apply: pilot prerequisites.
insert into public.content_items (collection, data, sort_order, is_published) values
('apply_prereqs', $j${"number": "01", "title": "Minimum Age", "description": "Must be 13 years old or older, in compliance with standard online community guidelines."}$j$::jsonb, 1, true),
('apply_prereqs', $j${"number": "02", "title": "Flight Simulator", "description": "Must own an active Infinite Flight Pro subscription to fly our multiplayer routes."}$j$::jsonb, 2, true),
('apply_prereqs', $j${"number": "03", "title": "Waypoints Profile", "description": "Must have an active account on the Waypoints Crew Center for PIREP logging and rank tracking."}$j$::jsonb, 3, true),
('apply_prereqs', $j${"number": "04", "title": "Discord Membership", "description": "Must have a Discord account to join our pilot briefing room and event channels."}$j$::jsonb, 4, true),
('apply_prereqs', $j${"number": "05", "title": "Activity Standard", "description": "Log at least 1 flight per month through Waypoints to remain in good standing."}$j$::jsonb, 5, true),
('apply_prereqs', $j${"number": "06", "title": "Aviation Passion", "description": "Respect fellow pilots, follow basic flight etiquette, and enjoy flying together!"}$j$::jsonb, 6, true);

-- Apply: onboarding steps.
insert into public.content_items (collection, data, sort_order, is_published) values
('apply_steps', $j${"number": "01", "description": "Open our official Waypoints Crew Center portal using the link below."}$j$::jsonb, 1, true),
('apply_steps', $j${"number": "02", "description": "Complete the online pilot intake questionnaire and knowledge test directly inside Waypoints."}$j$::jsonb, 2, true),
('apply_steps', $j${"number": "03", "description": "Our staff team approves your application and assigns your official ANVG callsign."}$j$::jsonb, 3, true),
('apply_steps', $j${"number": "04", "description": "Join our Discord server, download flight routes, and start logging flight hours!"}$j$::jsonb, 4, true);
