'use client';
// Partner airline cards. Only one card is open at a time, to keep the page tidy.
import { useState } from 'react';

export default function PartnerList({ items }) {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="stack">
      {items.map(({ id, data: p }) => {
        const open = openId === id;
        return (
          <article className="glass partner" key={id}>
            <button
              className="partner-head"
              aria-expanded={open}
              aria-controls={`partner-${id}`}
              onClick={() => setOpenId(open ? null : id)}
            >
              <span className="partner-logo">
                {p.logo_url ? <img src={p.logo_url} alt="" /> : <span className="banner-empty">Logo</span>}
              </span>
              <span className="partner-name">{p.name}</span>
              <span className="chev" aria-hidden="true" />
            </button>

            {open && (
              <div className="partner-body" id={`partner-${id}`}>
                {p.description && <p>{p.description}</p>}
                {(p.aircraft || []).length > 0 && (
                  <div className="meta">
                    <span className="faint">Codeshare aircraft</span>
                    <div className="chips">
                      {p.aircraft.map((a) => <span className="chip" key={a}>{a}</span>)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
