// Change Log: bulletin cards, newest first.
import { getSettings, getItems } from '../../lib/data';

export const dynamic = 'force-dynamic';

export default async function ChangelogPage() {
  const [c, entries] = await Promise.all([getSettings('changelog'), getItems('changelog_entries')]);

  return (
    <>
      <header>
        <h1>{c.title || 'Change Log'}</h1>
      </header>

      {entries === null ? (
        <p className="error">Could not load the change log. Please refresh the page.</p>
      ) : entries.length === 0 ? (
        <p className="muted">No updates published yet.</p>
      ) : (
        <div className="cards">
          {entries.map(({ id, data: e }) => (
            <article className="glass" key={id}>
              <h3>{e.heading}</h3>
              <p className="pre">{e.description}</p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
