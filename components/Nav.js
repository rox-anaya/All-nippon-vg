'use client';
// Slide-out menu with an animated hamburger button.
// Background scrolling is locked while the menu is open, and the old scroll position is restored.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const LOGO_URL =
  'https://res.cloudinary.com/dsfwafyc2/image/upload/v1792817398/file_0000000014488211bfa6f947add0e395_npjxai.png';

// Menu structure from the spec. Nested items appear under their parent.
const MENU = [
  { label: 'Home', href: '/' },
  { label: 'About Us', children: [
      { label: 'About Us', href: '/about' },
      { label: 'Staff', href: '/staff' },
  ] },
  { label: 'Operations', children: [
      { label: 'Events', href: '/events' },
      { label: 'Fleet', href: '/fleet' },
      { label: 'Route', href: '/routes' },
      { label: 'Ranks', href: '/ranks' },
  ] },
  { label: 'Training', href: '/training' },
  { label: 'Change Log', children: [
      { label: 'Change Log', href: '/changelog' },
      { label: 'Settings', href: '/settings' },
  ] },
  { label: 'Apply', href: '/apply' },
];

export default function Nav({ site }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the menu whenever the visitor moves to another page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While the menu is open, freeze the page behind it.
  useEffect(() => {
    if (!open) return;
    const y = window.scrollY;
    const body = document.body;
    body.style.position = 'fixed';
    body.style.top = `-${y}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.overflow = 'hidden';

    // Escape closes the menu on desktop keyboards.
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.overflow = '';
      window.scrollTo(0, y);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isActive = (href) => pathname === href;

  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="ANVG home">
          <img src={LOGO_URL} alt="All Nippon Virtual Group logo" className="brand-logo" />
        </Link>
        <button
          className={`burger ${open ? 'is-open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <div className={`nav-overlay ${open ? 'show' : ''}`} onClick={() => setOpen(false)} />

      <nav className={`nav-panel ${open ? 'open' : ''}`} aria-label="Main menu">
        <ul>
          {MENU.map((item) =>
            item.href ? (
              <li key={item.label}>
                <Link href={item.href} className={isActive(item.href) ? 'active' : ''}>
                  {item.label}
                </Link>
              </li>
            ) : (
              <li key={item.label} className="nav-group">
                <span className="nav-group-label">{item.label}</span>
                <ul>
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link href={child.href} className={isActive(child.href) ? 'active' : ''}>
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            )
          )}
        </ul>

        <div className="credit-card glass">
          <div className="credit-top">POWERED BY METUPOLO™</div>
          <div className="credit-dev">
            Developed By <span className="script">{site.developer_name || 'Anaya'}</span>
          </div>
          {site.developer_button_url && (
            <a
              className="btn btn-primary btn-compact"
              href={site.developer_button_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {site.developer_button_label || 'Waypoints VA'}
            </a>
          )}
        </div>
      </nav>
    </>
  );
}
