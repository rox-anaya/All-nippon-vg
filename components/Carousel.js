'use client';
// Fleet showcase carousel. Shows one image at a time, moves on every 5 seconds, and loops.
// Images are shown inside a fixed 16:9 frame with "contain", so nothing is stretched or cropped.
import { useEffect, useRef, useState } from 'react';

function Chevron({ dir }) {
  const d = dir === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7';
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Carousel({ images }) {
  const [index, setIndex] = useState(0);
  const touchStart = useRef(null);
  const count = images.length;

  // Restart the 5-second timer every time the picture changes.
  useEffect(() => {
    if (count < 2) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearTimeout(timer);
  }, [index, count]);

  const go = (step) => setIndex((i) => (i + step + count) % count);

  return (
    <div
      className="carousel"
      onTouchStart={(e) => {
        touchStart.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStart.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchStart.current = null;
      }}
    >
      {images.map((img, i) => (
        <img
          key={i}
          src={img.image_url}
          alt={img.caption || `Fleet image ${i + 1}`}
          className={i === index ? 'active' : ''}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}
      <button className="carousel-btn prev" aria-label="Previous image" onClick={() => go(-1)}>
        <Chevron dir="prev" />
      </button>
      <button className="carousel-btn next" aria-label="Next image" onClick={() => go(1)}>
        <Chevron dir="next" />
      </button>
    </div>
  );
}
