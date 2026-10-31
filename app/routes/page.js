// Global Network: the four primary hubs. The interactive globe is a later stage.
import { getItems } from '../../lib/data';
import Banner from '../../components/Banner';

export const dynamic = 'force-dynamic';

export default async function RoutesPage() {
  const hubs = await getItems('hubs');

  return (
    <>
      <header>
        <div className="eyebrow">Operations</div>
        <h1>Global Network</h1>
        <p className="muted">
          Explore ANVG’s virtual route database. From our four primary hubs in Japan, our fleet connects the Infinite Flight world across continents and oceans.
        </p>
      </header>

      <section>
        <h2>Operational Hubs</h2>
        {hubs === null ? (
          <p className="error">Could not load hubs. Please refresh the page.</p>
        ) : hubs.length === 0 ? (
          <p className="muted">No hubs published yet.</p>
        ) : (
          <div className="cards">
            {hubs.map(({ id, data: h }) => (
              <article className="glass hub" key={id}>
                <Banner src={h.image_url} alt={h.name} empty="No photo yet" />
                <div className="hub-top">
                  <h3>{h.name}</h3>
                  {h.icao && <span className="chip icao">{h.icao}</span>}
                </div>
                <p>{h.description}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
