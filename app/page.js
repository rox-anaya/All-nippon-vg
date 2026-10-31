import Link from 'next/link';
import { getSettings, getItems } from '../lib/data';
import Carousel from '../components/Carousel';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [h, showcase] = await Promise.all([getSettings('home'), getItems('showcase')]);

  const stats = [
    ['Flight Hours Flown', h.stat_flight_hours],
    ['Total PIREPs', h.stat_pireps],
    ['Hubs', h.stat_hubs],
    ['Aircraft Family', h.stat_aircraft_family],
    ['Destinations', h.stat_destinations],
  ];
  const slides = (showcase ?? []).map((item) => item.data).filter((d) => d?.image_url);

  return (
    <>
      <section className="glass hero">
        {h.hero_image_url && <img src={h.hero_image_url} alt="ANVG hero image" />}
        <div className="hero-body">
          <div className="eyebrow">{h.label}</div>
          <h1>{h.title}</h1>
          <p className="tagline">{h.tagline}</p>
          <div className="btn-row">
            <Link className="btn btn-primary" href="/events">Events</Link>
            <Link className="btn" href="/about">Learn More</Link>
            <Link className="btn btn-red" href="/fleet">Join Fleet</Link>
          </div>
        </div>
      </section>

      <section className="glass">
        <div className="stats">
          {stats.map(([label, value]) => (
            <div className="stat" key={label}>
              <div className="stat-value">{value || '—'}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="glass">
        <h2>Operations Center</h2>
        <div className="btn-row">
          <Link className="btn btn-primary" href="/pilots">Pilots</Link>
          <Link className="btn" href="/routes">Routes</Link>
          <Link className="btn" href="/codeshare">Codeshare</Link>
        </div>
        <p className="small" style={{ marginTop: 14 }}>{h.ops_note}</p>
      </section>

      <section className="glass">
        <div className="map-head">
          <h2 style={{ margin: 0 }}>Live Map</h2>
          <span className="status"><span className="live-dot" aria-hidden="true" /> Online</span>
        </div>
        <iframe
          className="map-frame"
          src="https://waypoint-live.app/embed/va/all-nippon-virtual-airways"
          title="Live flights"
          loading="lazy"
        />
        <p className="small" style={{ marginTop: 10 }}>
          Map not loading?{' '}
          <a href="https://waypoint-live.app/embed/va/all-nippon-virtual-airways" target="_blank" rel="noopener noreferrer">
            Open the live map in a new tab
          </a>.
        </p>
      </section>

      <section className="glass">
        <h2>Our Mission</h2>
        <p>{h.mission}</p>
      </section>

      <section className="glass">
        <h2>Fleet Showcase</h2>
        {slides.length > 0 ? <Carousel images={slides} /> : <p className="muted">No showcase images yet.</p>}
      </section>

      <section className="glass">
        <p className="ceo-quote">“{h.ceo_message}”</p>
        <p className="ceo-name">— {h.ceo_name}</p>
        <p className="small">{h.ceo_role}</p>
      </section>

      <section className="glass cta">
        <h2>{h.cta_heading}</h2>
        <p>{h.cta_text}</p>
        <Link className="btn btn-red" href="/apply">Submit Application</Link>
      </section>
    </>
  );
}
