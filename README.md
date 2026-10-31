# All Nippon Virtual Group (ANVG) website

This is the complete website: the public pages, the private admin dashboard, and the app (PWA) setup.
You don't need to write any code. Everything you change is done in the admin dashboard.

## What is in this folder

- `app/` : every page (Home, About Us, Staff, Events, Fleet, Ranks, Routes, Training, Apply, Codeshare, Change Log, Settings, and the admin area)
- `components/` : menu, footer, carousel, admin editor, and other shared parts
- `lib/` : `collections.js` decides which fields the admin dashboard shows. `data.js` reads the database.
- `public/` : app manifest, offline page, and service worker (`sw.js`)
- `supabase/` : database set-up files. Run them in order: 001, then 002, then 003.

## Step 1: Supabase (database), once

1. Open Supabase, choose your project, then open **SQL Editor > New query**.
2. Paste the whole of `supabase/001_schema.sql` and tap **Run**.
3. Create a new query, paste `supabase/002_stage2_and_admin.sql`, and tap **Run**.
4. Create a new query, paste `supabase/003_stage3_stage4.sql`, and tap **Run**.
5. Go to **Authentication > Providers > Email** and turn OFF "Allow new users to sign up".
6. Go to **Authentication > URL Configuration**. Set **Site URL** to your Vercel address, for example `https://your-site.vercel.app`. Add `https://your-site.vercel.app/admin` to **Redirect URLs**. This is needed for password reset.

Never paste the secret or service_role key anywhere. The website only needs the publishable key.

## Step 2: GitHub (source code)

1. Open the repository **All-nippon-vg**.
2. Tap **Add file > Upload files**, then choose the files and folders from this project.
3. Tap **Commit changes**.

Tip: if the browser will not upload folders, send the ZIP file's contents in batches. Keep the folder names exactly as they are (`app`, `components`, `lib`, `public`, `supabase`).

## Step 3: Vercel (hosting), once

1. Open Vercel, choose **Add New > Project**, then pick the All-nippon-vg repository.
2. Before deploying, open **Environment Variables** and add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = your publishable key
3. Tap **Deploy**. Later changes on GitHub redeploy automatically.

## Step 4: Your admin login

1. In Supabase, go to **Authentication > Users > Add user**. Tick **Auto Confirm User**.
   The account set up in step 002 is the admin. If you use a different account, run the insert line from the 002 file with its user ID.
2. Open `https://your-site.vercel.app/admin` and sign in.
3. The left sidebar lists every page. Pick a page to edit it.

## Everyday editing (no code)

- **Settings pages** (Home, About Us, Training, Apply, Codeshare, Change Log, Voice): change the text, then tap **Save**.
- **Lists** (Events, News, Fleet, Ranks, Routes & hubs, Staff, Partners, Change Log entries, and others): tap **Add new**, fill in the fields, then **Save**.
- **Show, Hide, Up, Down, Delete** work on each item. Hidden items never appear on the public site.
- **Times** are typed in UTC as `2026-11-07 12:00`.
- **Links** must start with `https://`.
- Pictures can be uploaded from your phone. They are shrunk automatically before upload.

## Testing checklist (about 5 minutes)

1. Open the public site. The menu opens and closes, and the page doesn't scroll behind it.
2. Open each menu item. Every page loads.
3. Sign in at /admin. Edit one staff member, then check the public Staff page.
4. Hide an item, then check it disappears from the public page.
5. Settings page: change the theme and font, refresh, and confirm they stay.
6. Turn voice on in Settings, then open another page. It should speak once.
7. Install the app: in Chrome, open the menu and tap **Install app** or **Add to Home screen**.

## Known gaps (planned for later)

- The Pilots page needs its own ANVG spec. It currently shows "Coming soon."
- The 3D globe on the Routes page is not built yet. The hubs are shown as cards.
- Drag-and-drop ordering: Up and Down buttons are used instead.
- Event and news pictures are not checked for broken links. A broken picture shows as blank.
- Free Supabase projects pause after about a week with no visits. Open the Supabase dashboard to wake a paused project.
- The app icon uses the logo link you supplied. Chrome may need proper PNG icons (192 and 512 pixels) before it offers installation. If the install option doesn't appear, send me the icon file.
