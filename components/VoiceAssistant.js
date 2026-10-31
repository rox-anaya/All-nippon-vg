'use client';
// Voice assistant. OFF unless the visitor turns it on in Settings.
// It speaks the admin-written announcement once each time the visitor opens a page.
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Connects each web address to its announcement in the admin Voice settings.
const PAGE_KEYS = {
  '/': 'home',
  '/about': 'about',
  '/staff': 'staff',
  '/events': 'events',
  '/fleet': 'fleet',
  '/routes': 'routes',
  '/ranks': 'ranks',
  '/training': 'training',
  '/apply': 'apply',
  '/codeshare': 'codeshare',
  '/changelog': 'changelog',
  '/settings': 'settings',
};

// The Settings page fires this event when the visitor changes the voice setting.
export const VOICE_EVENT = 'anvg-voice-change';

export default function VoiceAssistant({ texts }) {
  const pathname = usePathname();
  const lastSpoken = useRef(null);

  useEffect(() => {
    function speak() {
      if (!('speechSynthesis' in window)) return;

      let enabled = false;
      try {
        enabled = localStorage.getItem('anvg-voice') === 'on';
      } catch (e) {
        enabled = false;
      }

      // If voice is off, stop anything that is still speaking.
      if (!enabled) {
        window.speechSynthesis.cancel();
        return;
      }

      const text = texts?.[PAGE_KEYS[pathname]];
      // Speak once per page visit, so re-renders do not repeat the announcement.
      if (!text || lastSpoken.current === pathname) return;
      lastSpoken.current = pathname;

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }

    speak();
    window.addEventListener(VOICE_EVENT, speak);
    return () => window.removeEventListener(VOICE_EVENT, speak);
  }, [pathname, texts]);

  return null;
}
