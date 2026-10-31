// Admin registry: every editable page and list is defined here.
// The dashboard sidebar, the forms, and the input checks are all built from this file.
//
// Field types:
//   text (default), textarea, url (https:// only), image (upload or https:// link),
//   list (comma-separated), color (hex code like #2b7de0), select (fixed choices),
//   icao (exactly 4 letters, saved in capitals), utc (date and time in UTC, e.g. 2026-11-07 12:00)
//
// Extra options per section:
//   titleField: which field names the item in the admin list
//   newFirst: new items go to the top of the list (used for news and change log)
//
// To add a page or list later, add one entry here. No other code changes are needed.

export const GROUP_ORDER = ['Home', 'About Us', 'Operations', 'Training & Apply', 'Community'];

export const FLEET_AIRLINES = [
  'All Nippon Airways',
  'Nippon Cargo Airlines (NCA)',
  'Peach Aviation',
  'AirJapan',
];

export const SECTIONS = {
  // ---------- Home ----------
  site: {
    kind: 'settings', group: 'Home', label: 'Site & footer',
    hint: 'Footer community links and the developer credit shown in the menu.',
    fields: [
      { name: 'developer_name', label: 'Developer credit name' },
      { name: 'developer_button_label', label: 'Credit button label' },
      { name: 'developer_button_url', label: 'Credit button link (IFC profile)', type: 'url' },
      { name: 'waypoints_portal', label: 'Waypoints Portal link', type: 'url' },
      { name: 'instagram', label: 'Instagram link', type: 'url' },
      { name: 'youtube', label: 'YouTube link', type: 'url' },
      { name: 'vk', label: 'VK link (add later)', type: 'url' },
    ],
  },
  home: {
    kind: 'settings', group: 'Home', label: 'Home page',
    hint: 'Hero text, statistics, operations footnote, mission, CEO message, and the join card.',
    fields: [
      { name: 'hero_image_url', label: 'Hero image', type: 'image' },
      { name: 'label', label: 'Small label' },
      { name: 'title', label: 'Main title' },
      { name: 'tagline', label: 'Tagline' },
      { name: 'stat_flight_hours', label: 'Stat: Flight Hours Flown' },
      { name: 'stat_pireps', label: 'Stat: Total PIREPs' },
      { name: 'stat_hubs', label: 'Stat: Hubs' },
      { name: 'stat_aircraft_family', label: 'Stat: Aircraft Family' },
      { name: 'stat_destinations', label: 'Stat: Destinations' },
      { name: 'ops_note', label: 'Operations footnote' },
      { name: 'mission', label: 'Our Mission text', type: 'textarea' },
      { name: 'ceo_message', label: 'CEO message', type: 'textarea' },
      { name: 'ceo_name', label: 'CEO name' },
      { name: 'ceo_role', label: 'CEO role' },
      { name: 'cta_heading', label: 'Join heading' },
      { name: 'cta_text', label: 'Join text', type: 'textarea' },
    ],
  },
  showcase: {
    kind: 'list', group: 'Home', label: 'Fleet showcase',
    hint: 'Pictures in the Home carousel. The order here is the order they appear.',
    titleField: 'caption',
    fields: [
      { name: 'image_url', label: 'Image', type: 'image' },
      { name: 'caption', label: 'Caption (optional)' },
    ],
  },
  voice: {
    kind: 'settings', group: 'Home', label: 'Voice announcements',
    hint: 'What the voice assistant says on each page, when a visitor turns it on. Keep each one short.',
    fields: [
      { name: 'home', label: 'Home page', type: 'textarea' },
      { name: 'about', label: 'About Us page', type: 'textarea' },
      { name: 'staff', label: 'Staff page', type: 'textarea' },
      { name: 'events', label: 'Events page', type: 'textarea' },
      { name: 'fleet', label: 'Fleet page', type: 'textarea' },
      { name: 'routes', label: 'Routes page', type: 'textarea' },
      { name: 'ranks', label: 'Ranks page', type: 'textarea' },
      { name: 'training', label: 'Training page', type: 'textarea' },
      { name: 'apply', label: 'Apply page', type: 'textarea' },
      { name: 'codeshare', label: 'Codeshare page', type: 'textarea' },
      { name: 'changelog', label: 'Change Log page', type: 'textarea' },
      { name: 'settings', label: 'Settings page', type: 'textarea' },
    ],
  },

  // ---------- About Us ----------
  about: {
    kind: 'settings', group: 'About Us', label: 'About Us page',
    hint: 'Page title, group description, tagline, and the airline pillars heading.',
    fields: [
      { name: 'title', label: 'Page title' },
      { name: 'subtitle', label: 'Subtitle' },
      { name: 'group_name', label: 'Group name' },
      { name: 'description', label: 'Group description (blank line = new paragraph)', type: 'textarea' },
      { name: 'tagline', label: 'Tagline' },
      { name: 'pillars_heading', label: 'Pillars heading' },
      { name: 'pillars_intro', label: 'Pillars introduction', type: 'textarea' },
    ],
  },
  divisions: {
    kind: 'list', group: 'About Us', label: 'Airline divisions',
    hint: 'Cards on the About Us page. The colour here also colours that airline on the Fleet page.',
    titleField: 'name',
    fields: [
      { name: 'category', label: 'Division category' },
      { name: 'name', label: 'Airline name' },
      { name: 'logo_url', label: 'Logo (optional)', type: 'image' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'hubs', label: 'Hub airports', type: 'list' },
      { name: 'fleet', label: 'Aircraft fleet', type: 'list' },
      { name: 'accent', label: 'Airline colour (optional, e.g. #2b7de0)', type: 'color' },
    ],
  },
  staff: {
    kind: 'list', group: 'About Us', label: 'Staff',
    hint: 'Profiles on the Staff page. The order here is the order they appear.',
    titleField: 'name',
    fields: [
      { name: 'name', label: 'Name' },
      { name: 'role', label: 'Role' },
      { name: 'image_url', label: 'Profile picture', type: 'image' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'accent', label: 'Card accent colour (optional, e.g. #c8a24a)', type: 'color' },
      { name: 'button_label', label: 'Button label (optional)' },
      { name: 'button_url', label: 'Button link (optional)', type: 'url' },
    ],
  },

  // ---------- Operations ----------
  events: {
    kind: 'list', group: 'Operations', label: 'Events',
    hint: 'Virtual airline events. Times are UTC (Zulu). Upcoming events show first, then past ones.',
    titleField: 'name',
    fields: [
      { name: 'name', label: 'Event name' },
      { name: 'banner_url', label: 'Banner (16:9 works best)', type: 'image' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'departure_icao', label: 'Departure ICAO (4 letters)', type: 'icao' },
      { name: 'arrival_icao', label: 'Arrival ICAO (4 letters)', type: 'icao' },
      { name: 'departure_zulu', label: 'Departure time (UTC)', type: 'utc' },
    ],
  },
  news: {
    kind: 'list', group: 'Operations', label: 'Latest news',
    hint: 'Announcements. New items go to the top. Use Up and Down to change the order.',
    titleField: 'title',
    newFirst: true,
    fields: [
      { name: 'title', label: 'Headline' },
      { name: 'banner_url', label: 'Banner (16:9 works best)', type: 'image' },
      { name: 'description', label: 'Announcement text', type: 'textarea' },
    ],
  },
  fleet: {
    kind: 'list', group: 'Operations', label: 'Fleet',
    hint: 'Aircraft cards on the Fleet page. Pick the airline and whether it is passenger or cargo.',
    titleField: 'name',
    fields: [
      { name: 'name', label: 'Aircraft name or model' },
      { name: 'airline', label: 'Airline', type: 'select', options: FLEET_AIRLINES },
      { name: 'category', label: 'Category', type: 'select', options: ['Passenger', 'Cargo'] },
      { name: 'image_url', label: 'Aircraft photo', type: 'image' },
      { name: 'description', label: 'Description (shown when expanded)', type: 'textarea' },
    ],
  },
  ranks: {
    kind: 'list', group: 'Operations', label: 'Ranks',
    hint: 'Standard and Elite ranks. The code is the number shown in the small box.',
    titleField: 'name',
    fields: [
      { name: 'code', label: 'Number code (for example 01)' },
      { name: 'name', label: 'Rank name' },
      { name: 'category', label: 'Section', type: 'select', options: ['Standard', 'Elite Command'] },
      { name: 'insignia_url', label: 'Insignia image', type: 'image' },
      { name: 'min_hours', label: 'Minimum flight hours (leave blank if not set)' },
      { name: 'max_hours', label: 'Maximum flight hours (optional)' },
      { name: 'description', label: 'Description (optional)', type: 'textarea' },
    ],
  },
  hubs: {
    kind: 'list', group: 'Operations', label: 'Routes & hubs',
    hint: 'The primary hubs shown on the Routes page.',
    titleField: 'name',
    fields: [
      { name: 'name', label: 'Airport name' },
      { name: 'icao', label: 'ICAO code (4 letters)', type: 'icao' },
      { name: 'image_url', label: 'Airport photo', type: 'image' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },

  // ---------- Training & Apply ----------
  training: {
    kind: 'settings', group: 'Training & Apply', label: 'Training page',
    hint: 'Page title, section headings, and the call to action at the bottom.',
    fields: [
      { name: 'title', label: 'Page title' },
      { name: 'description', label: 'Introduction', type: 'textarea' },
      { name: 'stages_heading', label: 'Evaluation stages heading' },
      { name: 'recruitment_heading', label: 'Recruitment flow heading' },
      { name: 'cta_heading', label: 'Call to action heading' },
      { name: 'cta_text', label: 'Call to action text', type: 'textarea' },
      { name: 'cta_button_label', label: 'Button label' },
    ],
  },
  training_stages: {
    kind: 'list', group: 'Training & Apply', label: 'Evaluation stages',
    hint: 'Cards in the Evaluation Stages section. Add as many as you need.',
    titleField: 'title',
    fields: [
      { name: 'number', label: 'Stage number (for example 01)' },
      { name: 'title', label: 'Stage title' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'assessment', label: 'Assessment information' },
    ],
  },
  training_steps: {
    kind: 'list', group: 'Training & Apply', label: 'Recruitment steps',
    hint: 'Steps in the Recruitment Flow timeline, shown in this order.',
    titleField: 'title',
    fields: [
      { name: 'number', label: 'Step number' },
      { name: 'title', label: 'Step title' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  apply: {
    kind: 'settings', group: 'Training & Apply', label: 'Apply page',
    hint: 'Page text and the Crew Center test button. Paste the official test link in the button link field.',
    fields: [
      { name: 'title', label: 'Page title' },
      { name: 'description', label: 'Introduction', type: 'textarea' },
      { name: 'prereq_heading', label: 'Prerequisites heading' },
      { name: 'steps_heading', label: 'Onboarding heading' },
      { name: 'integration_heading', label: 'Waypoints card heading' },
      { name: 'integration_text', label: 'Waypoints card text', type: 'textarea' },
      { name: 'intake_small', label: 'Intake card small heading' },
      { name: 'intake_heading', label: 'Intake card main heading' },
      { name: 'intake_text', label: 'Intake card description', type: 'textarea' },
      { name: 'intake_divider_text', label: 'Small text under the divider' },
      { name: 'button_label', label: 'Test button label' },
      { name: 'button_url', label: 'Test button link (Waypoints Crew Center test page)', type: 'url' },
    ],
  },
  apply_prereqs: {
    kind: 'list', group: 'Training & Apply', label: 'Pilot prerequisites',
    hint: 'Numbered requirements on the Apply page.',
    titleField: 'title',
    fields: [
      { name: 'number', label: 'Number (for example 01)' },
      { name: 'title', label: 'Heading' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  apply_steps: {
    kind: 'list', group: 'Training & Apply', label: 'Onboarding steps',
    hint: 'Numbered steps in the Recruitment and Onboarding timeline on the Apply page.',
    titleField: 'description',
    fields: [
      { name: 'number', label: 'Number (for example 01)' },
      { name: 'description', label: 'Step text', type: 'textarea' },
    ],
  },

  // ---------- Community ----------
  codeshare: {
    kind: 'settings', group: 'Community', label: 'Codeshare page',
    hint: 'Page title and introduction.',
    fields: [
      { name: 'title', label: 'Page title' },
      { name: 'description', label: 'Introduction', type: 'textarea' },
    ],
  },
  partners: {
    kind: 'list', group: 'Community', label: 'Partner airlines',
    hint: 'Codeshare partners. Tap a card on the public page to see its details.',
    titleField: 'name',
    fields: [
      { name: 'name', label: 'Airline name' },
      { name: 'logo_url', label: 'Logo', type: 'image' },
      { name: 'description', label: 'Partnership description', type: 'textarea' },
      { name: 'aircraft', label: 'Codeshare aircraft and variants', type: 'list' },
    ],
  },
  changelog: {
    kind: 'settings', group: 'Community', label: 'Change Log page',
    hint: 'Page title. Entries are managed in the next menu item.',
    fields: [
      { name: 'title', label: 'Page title' },
    ],
  },
  changelog_entries: {
    kind: 'list', group: 'Community', label: 'Change Log entries',
    hint: 'Updates shown on the Change Log page. Newest first.',
    titleField: 'heading',
    newFirst: true,
    fields: [
      { name: 'heading', label: 'Heading' },
      { name: 'description', label: 'Details', type: 'textarea' },
    ],
  },
};
