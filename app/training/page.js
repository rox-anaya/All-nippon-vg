// Pilot Training & Evaluation: stages, recruitment timeline, and a call to action.
import Link from 'next/link';
import { getSettings, getItems } from '../../lib/data';

export const dynamic = 'force-dynamic';

export default async function TrainingPage() {
  const [t, stages, steps] = await Promise.all([
    getSettings('training'),
    getItems('training_stages'),
    getItems('training_steps'),
  ]);

  return (
    <>
      <header>
        <div className="eyebrow">Training</div>
        <h1>{t.title || 'Pilot Training & Evaluation'}</h1>
        <p className="muted">{t.description}</p>
      </header>

      <section>
        <h2>{t.stages_heading || 'Evaluation Stages'}</h2>
        {stages === null ? (
          <p className="error">Could not load the evaluation stages. Please refresh the page.</p>
        ) : stages.length === 0 ? (
          <p className="muted">No evaluation stages published yet.</p>
        ) : (
          <div className="cards">
            {stages.map(({ id, data: s }) => (
              <article className="glass stage-card" key={id}>
                <div className="stage-top">
                  <span className="num-box">{s.number}</span>
                  <h3>{s.title}</h3>
                </div>
                <p>{s.description}</p>
                {s.assessment && <p className="small">{s.assessment}</p>}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="glass">
        <h2>{t.recruitment_heading || 'Recruitment Flow'}</h2>
        {steps === null ? (
          <p className="error">Could not load the recruitment steps. Please refresh the page.</p>
        ) : steps.length === 0 ? (
          <p className="muted">No recruitment steps published yet.</p>
        ) : (
          <ol className="timeline">
            {steps.map(({ id, data: s }) => (
              <li key={id}>
                <span className="num-box">{s.number}</span>
                <div className="step-body">
                  <strong>{s.title}</strong>
                  <p>{s.description}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="glass cta">
        <h2>{t.cta_heading}</h2>
        <p>{t.cta_text}</p>
        <Link className="btn btn-primary" href="/apply">{t.cta_button_label || 'Go to Application'}</Link>
      </section>
    </>
  );
}
