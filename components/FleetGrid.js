'use client';
// Fleet filter tabs and aircraft cards. Each card takes its airline's colour.
import { useState } from 'react';
import Banner from './Banner';

const TABS = [
  { label: 'All Fleet', airline: null },
  { label: 'ANA Mainline', airline: 'All Nippon Airways' },
  { label: 'NCA Cargo', airline: 'Nippon Cargo Airlines (NCA)' },
  { label: 'Peach Aviation', airline: 'Peach Aviation' },
  { label: 'AirJapan', airline: 'AirJapan' },
];

export default function FleetGrid({ items, accents }) {
  const [tab, setTab] = useState(0);
  const active = TABS[tab];

  // Keeps airline groups together, in the same order as the tabs.
  const airlineOrder = (name) => TABS.findIndex((t) => t.airline === name);
  const shown = items
    .filter((i) => !active.airline || i.data.airline === active.airline)
    .sort((x, y) => airlineOrder(x.data.airline) - airlineOrder(y.data.airline));

  return (
    <>
      <div className="tabs" role="tablist" aria-label="Filter by airline">
        {TABS.map((t, i) => (
          <button
            key={t.label}
            role="tab"
            aria-selected={i === tab}
            className={`tab ${i === tab ? 'active' : ''}`}
            onClick={() => setTab(i)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="muted">No aircraft in this fleet yet.</p>
      ) : (
        <div className="cards">
          {shown.map(({ id, data: a }) => (
            <article className="glass fleet-card" key={id} style={{ '--accent': accents[a.airline] || '#6fb3ff' }}>
              <div className="fleet-top">
                <span className="pill">{a.category || 'Passenger'}</span>
                <span className="faint">{a.airline}</span>
              </div>
              <h3>{a.name}</h3>
              <Banner src={a.image_url} alt={a.name} empty="No photo yet" />
              {a.description && (
                <details>
                  <summary>Details</summary>
                  <p>{a.description}</p>
                </details>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
