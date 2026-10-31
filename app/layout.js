import { Inter, Manrope, Montserrat, Poppins, Roboto } from 'next/font/google';
import './globals.css';
import SiteChrome from '../components/SiteChrome';
import { getSettings } from '../lib/data';

// ---------------------------------------------------------------------------
// FONTS
//
// Inter, Manrope, Poppins, Montserrat, and Roboto are loaded with next/font/google.
// Each weight is written as a plain literal inside its own loader (Next.js requirement).
//
// Two fonts are loaded differently, using a CSS link to Google Fonts:
//   - Nunito Sans: next/font/google could not find its font data during the Vercel build
//     ("Failed to find font override values for font Nunito Sans"), so it is loaded by CSS instead.
//     It stays selectable in Settings.
//   - Dancing Script (the cursive "Rox" credit): loaded the same way, so no build-time font
//     check can fail on it.
// ---------------------------------------------------------------------------

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

// Roboto's static weights are 100, 300, 400, 500, 700, 900. There is no 600, so it is not requested.
const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
  weight: ['400', '500', '700'],
});

// CSS variables for the fonts loaded by link. These names must match the Settings page.
const CSS_FONT_VARIABLES = {
  '--font-nunito': "'Nunito Sans', system-ui, sans-serif",
  '--font-script': "'Dancing Script', cursive",
};

// Google Fonts stylesheet for the two link-loaded fonts.
const GOOGLE_FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Nunito+Sans:wght@400;500;600;700&display=swap';

const FONT_CLASSNAMES = [inter, manrope, poppins, montserrat, roboto]
  .map((f) => f.variable)
  .join(' ');

// Runs before the page is drawn, so the saved theme and font appear straight away (no flash).
const EARLY_SCRIPT = `try{var d=document.documentElement;var t=localStorage.getItem('anvg-theme');if(t)d.dataset.theme=t;var f=localStorage.getItem('anvg-font');if(f)d.dataset.font=f;}catch(e){}`;

// App icon, used when the site is installed to a phone home screen.
const APP_ICON =
  'https://res.cloudinary.com/dsfwafyc2/image/upload/v1792817398/file_0000000014488211bfa6f947add0e395_npjxai.png';

export const metadata = {
  title: 'All Nippon Virtual Group',
  description: 'All Nippon Virtual Group, Official Community Airline on Waypoints',
  manifest: '/manifest.webmanifest',
  icons: { icon: APP_ICON, apple: APP_ICON },
};

export const viewport = {
  themeColor: '#0b1a33',
  width: 'device-width',
  initialScale: 1,
};

// Always read fresh content, so admin edits appear without a redeploy.
export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }) {
  const [site, voice] = await Promise.all([getSettings('site'), getSettings('voice')]);
  return (
    <html
      lang="en"
      className={FONT_CLASSNAMES}
      style={CSS_FONT_VARIABLES}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={GOOGLE_FONTS_HREF} />
        <script dangerouslySetInnerHTML={{ __html: EARLY_SCRIPT }} />
      </head>
      <body>
        <SiteChrome site={site} voice={voice}>{children}</SiteChrome>
      </body>
    </html>
  );
}
