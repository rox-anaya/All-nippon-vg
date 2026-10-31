// Pilot Progression: standard ranks and Elite Command.
import { getItems } from '../../lib/data';

export const dynamic = 'force-dynamic';

// Shows the hour range. If no hours are set, it says so instead of inventing a number.
function hoursText(d) {
  if (d.min_hours && d.max_hours) return `${d.min_hours}–${d.max_hours} Hrs`;
  if (d.min_hours) return `${d.min_hours}+ Hrs`;
  return 'To be configured by the administrator';
}

function RankCard({ data: d, elite }) {
  return (
    <details className={`glass rank ${elite ? 'elite' : ''}`}>
      <summary>
        <span className="rank-no">{d.code || '--'}</span>
        {d.insignia_url && <img className="rank-insignia" src={d.insignia_url} alt="" />}
        <span className="rank-text">
          <strong>{d.name}</strong>
          <span className="rank-hours">{hoursText(d)}</span>
        </span>
      </summary>
      <p>{d.description || 'No description yet.'}</p>
    </details>
  );
}

export default async function RanksPage() {
  const ranks = await getItems('ranks');

  return (
    <>
      <header>
        <div className="eyebrow">Operations</div>
        <h1>Pilot Progression</h1>
        <p className="muted">
          Your career at All Nippon Virtual Group starts here. Earn your wings, log flight hours via Waypoints, and rise through the ranks to command our largest aircraft.
        </p>
      </header>

      {ranks === null ? (
        <p className="error">Could not load ranks. Please refresh the page.</p>
      ) : (
        <>
          <section>
            <h2>Standard Pilot Progression</h2>
            <div className="stack">
              {ranks.filter((r) => r.data.category !== 'Elite Command').map(({ id, data }) => (
                <RankCard key={id} data={data} />
              ))}
            </div>
          </section>

          {ranks.some((r) => r.data.category === 'Elite Command') && (
            <section>
              <h2>Elite Command</h2>
              <p className="muted">
                Reserved for legends of the sky. These distinguished ranks recognise exceptional dedication, experience, and commitment to ANVG.
              </p>
              <div className="stack">
                {ranks.filter((r) => r.data.category === 'Elite Command').map(({ id, data }) => (
                  <RankCard key={id} data={data} elite />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
