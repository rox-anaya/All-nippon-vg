import Link from 'next/link';
import { getSettings, getItems } from '../../lib/data';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const [a, divisions] = await Promise.all([getSettings('about'), getItems('divisions')]);
  const paragraphs = (a.description || '').split('\n').filter((p) => p.trim());

  return (
    <>
      <header>
        <div className="eyebrow">{a.subtitle}</div>
        <h1>{a.title}</h1>
      </header>

      <section className="glass">
        <h2>About Our Group</h2>
        <h3>{a.group_name}</h3>
        {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        <p className="tagline">{a.tagline}</p>
      </section>

      <section>
        <h2>{a.pillars_heading}</h2>
        <p className="muted">{a.pillars_intro}</p>
        {divisions === null ? (
          <p className="error">Could not load divisions. Please refresh the page.</p>
        ) : divisions.length === 0 ? (
          <p className="muted">No divisions published yet.</p>
        ) : (
          <div className="cards">
            {divisions.map(({ id, data: d }) => (
              <article className="glass" key={id}>
                <div className="division-head">
                  {d.logo_url && <img className="logo-sm" src={d.logo_url} alt="" />}
                  <div>
                    <div className="eyebrow">{d.category}</div>
                    <h3>{d.name}</h3>
                  </div>
                </div>
                <p>{d.description}</p>
                <div className="meta">
                  <span className="faint">Hubs</span>
                  <div className="chips">{(d.hubs || []).map((x) => <span className="chip" key={x}>{x}</span>)}</div>
                </div>
                <div className="meta">
                  <span className="faint">Fleet</span>
                  <div className="chips">{(d.fleet || []).map((x) => <span className="chip" key={x}>{x}</span>)}</div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="glass cta">
        <h2>The Team Behind the Flight Deck</h2>
        <p>Meet the flight operations coordinators, flight standards trainers, and leadership staff working to deliver a smooth virtual airline experience.</p>
        <Link className="btn btn-primary" href="/staff">Meet the Staff →</Link>
      </section>
    </>
  );
}
