'use client';
// Registers the offline service worker and shows a banner when a new version is ready.
import { useEffect, useState } from 'react';

export default function ServiceWorkerRegister() {
  const [waiting, setWaiting] = useState(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // Only reload when an update replaces an existing version, not on the very first install.
    const hadController = !!navigator.serviceWorker.controller;
    let reloaded = false;
    const onControllerChange = () => {
      if (hadController && !reloaded) {
        reloaded = true;
        window.location.reload();
      }
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        if (registration.waiting && hadController) setWaiting(registration.waiting);
        registration.addEventListener('updatefound', () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
              setWaiting(worker);
            }
          });
        });
      })
      .catch(() => {
        // The site still works without offline support.
      });

    return () => navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
  }, []);

  if (!waiting) return null;

  return (
    <div className="update-banner" role="status">
      <span>A new version of ANVG is ready.</span>
      <button className="btn btn-compact btn-primary" onClick={() => waiting.postMessage('SKIP_WAITING')}>
        Refresh
      </button>
    </div>
  );
}
