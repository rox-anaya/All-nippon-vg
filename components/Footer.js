// Global footer. Community links come from the admin settings.
// Empty links are hidden, so nothing is ever invented.
export default function Footer({ site }) {
  const links = [
    { label: 'Waypoints Portal', url: site.waypoints_portal },
    { label: 'Instagram', url: site.instagram },
    { label: 'YouTube', url: site.youtube },
    { label: 'VK', url: site.vk },
  ].filter((l) => l.url);

  return (
    <footer className="site-footer glass">
      {links.length > 0 && (
        <div className="footer-links">
          {links.map((l) => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          ))}
        </div>
      )}
      <p>© 2026 All Nippon Virtual Group — Official Community Airline on Waypoints</p>
      <p className="small">
        All Nippon Virtual Group is not affiliated with the real-world All Nippon Airways or ANA Holdings.
        All trademarks and logos remain the property of their respective owners.
      </p>
      <div className="divider" />
      <p className="faint">Proudly Indian & Kannadiga</p>
    </footer>
  );
}
