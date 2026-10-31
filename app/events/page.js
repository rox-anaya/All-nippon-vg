// Network Activity: VA events and the latest news.
import { getItems } from '../../lib/data';
import Banner from '../../components/Banner';

export const dynamic = 'force-dynamic';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pad = (n) => String(n).padStart(2, '0');

// Formats a stored UTC time as, for example, "07 Nov 2026 · 12:00 Z".
function formatZulu(iso) {
  const d = new Date(iso);
  if (!iso || isNaN(d)) return 'Not set';
  return `${pad(d.getUTCDate())} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()} · ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} Z`;
}

function EventCard({ data: d, upcoming }) {
  return (
    <article className="glass event-card">
      <Banner src={d.banner_url} alt={d.name} empty="No banner yet" />
      <div className="event-body">
        <span className={`pill ${upcoming ? 'upcoming' : 'past'}`}>{upcoming ? 'Upcoming' : 'Past'}</span>
        <h3>{d.name}</h3>
        <div className="route-line">
          <span className="icao">{d.departure_icao || '----'}</span>
          <span aria-hidden="true">→</span>
          <span className="icao">{d.arrival_icao || '----'}</span>
        </div>
        <p className="zulu">Departure: {formatZulu(d.departure_zulu)}</p>
        <p className="desc">{d.description}</p>
      </div>
    </article>
  );
}

export default async function EventsPage() {
  const [events, news] = await Promise.all([getItems('events'), getItems('news')]);

  // Split events by departure time: upcoming (soonest first), then past (most recent first).
  const now = Date.now();
  const timed = (events ?? []).map(({ id, data }) => {
    const t = new Date(data.departure_zulu).getTime();
    return { id, data, t: isNaN(t) ? 0 : t };
  });
  const isUpcoming = (e) => e.t > 0 && e.t >= now;
  const upcoming = timed.filter(isUpcoming).sort((a, b) => a.t - b.t);
  const past = timed.filter((e) => !isUpcoming(e)).sort((a, b) => b.t - a.t);

  return (
    <>
      <header>
        <div className="eyebrow">Events & news</div>
        <h1>Network Activity</h1>
        <p className="muted">
          Join our pilots in skies around the world. Discover upcoming group flights, fly-ins, and the latest announcements from All Nippon Virtual Group.
        </p>
      </header>

      <section>
        <h2>VA Events</h2>
        {events === null ? (
          <p className="error">Could not load events. Please refresh the page.</p>
        ) : timed.length === 0 ? (
          <p className="muted">No events published yet.</p>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div className="cards">
                {upcoming.map((e) => <EventCard key={e.id} data={e.data} upcoming />)}
              </div>
            )}
            {past.length > 0 && (
              <>
                <p className="sub-head">Past events</p>
                <div className="cards">
                  {past.map((e) => <EventCard key={e.id} data={e.data} upcoming={false} />)}
                </div>
              </>
            )}
          </>
        )}
      </section>

      <section>
        <h2>Latest News</h2>
        {news === null ? (
          <p className="error">Could not load news. Please refresh the page.</p>
        ) : news.length === 0 ? (
          <p className="muted">No news published yet.</p>
        ) : (
          <div className="cards">
            {news.map(({ id, data: n }) => (
              <article className="glass event-card" key={id}>
                <Banner src={n.banner_url} alt={n.title} empty="No banner yet" />
                <div className="event-body">
                  <h3>{n.title}</h3>
                  <p className="desc">{n.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
          }
