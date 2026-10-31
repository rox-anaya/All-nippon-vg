// Placeholder for pages built in later stages (Events, Fleet, Routes, and so on).
import Link from 'next/link';

export default function ComingSoonPage() {
  return (
    <section className="glass">
      <h1>Coming soon</h1>
      <p className="muted">This page is part of the next build stage.</p>
      <Link className="btn" href="/">Back to Home</Link>
    </section>
  );
}
