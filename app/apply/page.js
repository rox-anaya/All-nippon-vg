// Join Our Flight Deck: prerequisites, onboarding steps, Waypoints card, and the test button.
import { getSettings, getItems } from '../../lib/data';

export const dynamic = 'force-dynamic';

export default async function ApplyPage() {
  const [a, prereqs, steps] = await Promise.all([
    getSettings('apply'),
    getItems('apply_prereqs'),
    getItems('apply_steps'),
  ]);

  // The test button only works once the owner has added the official link.
  const hasTestLink = /^https:\/\//i.test(a.button_url || '');

  return (
    <>
      <header>
        <div className="eyebrow">Apply</div>
        <h1>{a.title || 'Join Our Flight Deck'}</h1>
        <p className="muted">{a.description}</p>
      </header>

      <section className="glass">
        <h2>{a.prereq_heading || 'Pilot Prerequisites'}</h2>
        {prereqs === null ? (
          <p className="error">Could not load the prerequisites. Please refresh the page.</p>
        ) : prereqs.length === 0 ? (
          <p className="muted">No prerequisites published yet.</p>
        ) : (
          <ol className="timeline">
            {prereqs.map(({ id, data: p }) => (
              <li key={id}>
                <span className="num-box">{p.number}</span>
                <div className="step-body">
                  <strong>{p.title}</strong>
                  <p>{p.description}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="glass">
        <h2>{a.steps_heading || 'Recruitment & Onboarding Flow'}</h2>
        {steps === null ? (
          <p className="error">Could not load the onboarding steps. Please refresh the page.</p>
        ) : steps.length === 0 ? (
          <p className="muted">No onboarding steps published yet.</p>
        ) : (
          <ol className="timeline">
            {steps.map(({ id, data: s }) => (
              <li key={id}>
                <span className="num-box">{s.number}</span>
                <div className="step-body">
                  <p>{s.description}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="glass">
        <h2>{a.integration_heading || 'Waypoints Integration'}</h2>
        <p>{a.integration_text}</p>
      </section>

      <section className="glass intake">
        <div className="eyebrow">{a.intake_small}</div>
        <h2>{a.intake_heading}</h2>
        <p>{a.intake_text}</p>
        <div className="divider" />
        <p className="small">{a.intake_divider_text}</p>
        {hasTestLink ? (
          <a className="btn btn-red" href={a.button_url} target="_blank" rel="noopener noreferrer">
            {a.button_label || 'Start Pilot Test'}
          </a>
        ) : (
          <p className="muted">The test link has not been set yet. The owner can add it in the admin dashboard.</p>
        )}
      </section>
    </>
  );
              }
