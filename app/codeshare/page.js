// Codeshare Alliances: partner airlines, expandable one at a time.
import { getSettings, getItems } from '../../lib/data';
import PartnerList from '../../components/PartnerList';

export const dynamic = 'force-dynamic';

export default async function CodesharePage() {
  const [c, partners] = await Promise.all([getSettings('codeshare'), getItems('partners')]);

  return (
    <>
      <header>
        <div className="eyebrow">Community</div>
        <h1>{c.title || 'Codeshare Alliances'}</h1>
        <p className="muted">{c.description}</p>
      </header>

      <section>
        <h2>Partner Airlines</h2>
        {partners === null ? (
          <p className="error">Could not load partner airlines. Please refresh the page.</p>
        ) : partners.length === 0 ? (
          <p className="muted">No partner airlines published yet.</p>
        ) : (
          <PartnerList items={partners} />
        )}
      </section>
    </>
  );
}
