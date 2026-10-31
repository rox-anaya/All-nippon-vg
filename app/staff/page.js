import { getItems } from '../../lib/data';

export const dynamic = 'force-dynamic';

export default async function StaffPage() {
  const staff = await getItems('staff');

  return (
    <>
      <header>
        <h1>Leadership Team</h1>
        <p className="muted">
          The dedicated team orchestrating operations, flight standards, and community life across All Nippon Virtual Group.
        </p>
      </header>

      {staff === null ? (
        <p className="error">Could not load staff profiles. Please refresh the page.</p>
      ) : staff.length === 0 ? (
        <p className="muted">No staff profiles published yet.</p>
      ) : (
        <div className="cards">
          {staff.map(({ id, data: s }) => (
            <article className="glass" key={id} style={s.accent ? { borderColor: s.accent } : undefined}>
              <div className="staff-top">
                {s.image_url ? (
                  <img src={s.image_url} alt={s.name} />
                ) : (
                  <div className="avatar" aria-hidden="true">
                    {(s.name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('')}
                  </div>
                )}
                <div>
                  <h2>{s.name}</h2>
                  <div className="role" style={s.accent ? { color: s.accent } : undefined}>{s.role}</div>
                </div>
              </div>
              <p>{s.description}</p>
              {s.button_url && (
                <a className="btn btn-compact" href={s.button_url} target="_blank" rel="noopener noreferrer">
                  {s.button_label || 'Profile'}
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
