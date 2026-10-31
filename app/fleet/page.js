// The Wings of ANVG: aircraft by airline, with filter tabs.
import { getItems } from '../../lib/data';
import FleetGrid from '../../components/FleetGrid';

export const dynamic = 'force-dynamic';

export default async function FleetPage() {
  const [fleet, divisions] = await Promise.all([getItems('fleet'), getItems('divisions')]);

  // Map of airline name to its colour, set in the admin on the Airline divisions page.
  const accents = Object.fromEntries(
    (divisions ?? []).filter((d) => d.data.accent).map((d) => [d.data.name, d.data.accent])
  );

  return (
    <>
      <header>
        <div className="eyebrow">Operations</div>
        <h1>The Wings of ANVG</h1>
        <p className="muted">
          Spanning full-service passenger travel, dedicated transpacific freight, and regional low-cost routes. Discover the aircraft you will command as an ANVG pilot.
        </p>
      </header>

      {fleet === null ? (
        <p className="error">Could not load the fleet. Please refresh the page.</p>
      ) : (
        <FleetGrid items={fleet} accents={accents} />
      )}
    </>
  );
      }
  
