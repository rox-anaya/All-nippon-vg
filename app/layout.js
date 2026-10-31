import {
  Dancing_Script,
  Inter,
  Manrope,
  Montserrat,
  Nunito_Sans,
  Poppins,
  Roboto,
} from 'next/font/google';
import './globals.css';
import SiteChrome from '../components/SiteChrome';
import { getSettings } from '../lib/data';

// Fonts the visitor can choose in Settings. Each one is available as a CSS variable.
const fontWeights = ['400', '500', '600', '700'];
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', weight: fontWeights });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap', weight: fontWeights });
const poppins = Poppins({ subsets: ['latin'], variable: '--font-poppins', display: 'swap', weight: fontWeights });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap', weight: fontWeights });
const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto', display: 'swap', weight: fontWeights });
const nunito = Nunito_Sans({ subsets: ['latin'], variable: '--font-nunito', display: 'swap', weight: fontWeights });

// Cursive font for the "Rox" credit in the menu.
const script = Dancing_Script({ subsets: ['latin'], variable: '--font-script', display: 'swap', weight: ['700'] });

const FONT_VARIABLES = [inter, manrope, poppins, montserrat, roboto, nunito, script]
  .map((f) => f.variable)
  .join(' ');

// Runs before the page is drawn, so the saved theme and font appear straight away (no flash).
const EARLY_SCRIPT = `try{var d=document.documentElement;var t=localStorage.getItem('anvg-theme');if(t)d.dataset.theme=t;var f=localStorage.getItem('anvg-font');if(f)d.dataset.font=f;}catch(e){}`;

// App icon, used when the site is installed to a phone home screen.
const APP_ICON = 'https://res.cloudinary.com/dsfwafyc2/image/upload/v1792817398/file_0000000014488211bfa6f947add0e395_npjxai.png';

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
    <html lang="en" className={FONT_VARIABLES} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: EARLY_SCRIPT }} />
      </head>
      <body>
        <SiteChrome site={site} voice={voice}>{children}</SiteChrome>
      </body>
    </html>
  );
}
