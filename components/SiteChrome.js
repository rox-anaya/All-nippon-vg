'use client';
// Shows the public menu, footer, voice assistant, and offline support on every public page.
// The private admin area is left out, so it has no public menu or footer.
import { usePathname } from 'next/navigation';
import Nav from './Nav';
import Footer from './Footer';
import VoiceAssistant from './VoiceAssistant';
import ServiceWorkerRegister from './ServiceWorkerRegister';

export default function SiteChrome({ site, voice, children }) {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return <div className="admin-root">{children}</div>;
  }

  return (
    <>
      <Nav site={site} />
      <main className="page">{children}</main>
      <Footer site={site} />
      <VoiceAssistant texts={voice} />
      <ServiceWorkerRegister />
    </>
  );
}
