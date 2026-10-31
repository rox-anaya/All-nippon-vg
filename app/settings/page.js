'use client';
// Flight Deck Settings. Choices are saved on this device only, using localStorage.
// Nothing here changes what other visitors see.
import { useEffect, useState } from 'react';
import { VOICE_EVENT } from '../../components/VoiceAssistant';

const THEMES = [
  { key: 'midnight', label: 'Midnight Aviation', from: '#0b1a33', to: '#2b7de0' },
  { key: 'ana', label: 'ANA-inspired Blue', from: '#0a2a5e', to: '#9fd0ff' },
  { key: 'sakura', label: 'Sakura Night', from: '#2a0f2e', to: '#f2a7c3' },
  { key: 'imperial', label: 'Imperial Red', from: '#0b1a33', to: '#c8102e' },
  { key: 'arctic', label: 'Arctic Silver', from: '#1c2632', to: '#c9d3e0' },
  { key: 'emerald', label: 'Emerald Flight Deck', from: '#062a22', to: '#d8b45e' },
  { key: 'oceanic', label: 'Oceanic Blue', from: '#04254a', to: '#35d0ff' },
  { key: 'champagne', label: 'Champagne Gold', from: '#1f1f22', to: '#d6b25e' },
];

const FONTS = [
  { key: 'system', label: 'System default', family: 'system-ui, sans-serif' },
  { key: 'inter', label: 'Inter', family: 'var(--font-inter), sans-serif' },
  { key: 'manrope', label: 'Manrope', family: 'var(--font-manrope), sans-serif' },
  { key: 'poppins', label: 'Poppins', family: 'var(--font-poppins), sans-serif' },
  { key: 'montserrat', label: 'Montserrat', family: 'var(--font-montserrat), sans-serif' },
  { key: 'roboto', label: 'Roboto', family: 'var(--font-roboto), sans-serif' },
  { key: 'nunito', label: 'Nunito Sans', family: 'var(--font-nunito), sans-serif' },
];

// Reads and writes this device's settings. If storage is blocked, the defaults are used.
function readStore(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch (e) {
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch (e) {
    // Storage unavailable: the change still applies for this visit.
  }
}

export default function SettingsPage() {
  const [theme, setTheme] = useState('midnight');
  const [font, setFont] = useState('system');
  const [voice, setVoice] = useState(false);
  const [note, setNote] = useState('');

  // Load the saved choices after the page appears, so the server and browser match.
  useEffect(() => {
    setTheme(readStore('anvg-theme', 'midnight'));
    setFont(readStore('anvg-font', 'system'));
    setVoice(readStore('anvg-voice', 'off') === 'on');
  }, []);

  function chooseTheme(key) {
    setTheme(key);
    writeStore('anvg-theme', key);
    document.documentElement.dataset.theme = key;
    setNote('Theme saved on this device.');
  }

  function chooseFont(key) {
    setFont(key);
    writeStore('anvg-font', key);
    document.documentElement.dataset.font = key;
    setNote('Font saved on this device.');
  }

  function setVoiceOn(on) {
    setVoice(on);
    writeStore('anvg-voice', on ? 'on' : 'off');
    window.dispatchEvent(new Event(VOICE_EVENT));
    setNote(on ? 'Voice assistance is on.' : 'Voice assistance is off.');
  }

  function resetVoice() {
    if (!window.confirm('Turn voice assistance off? Your theme and font stay the same.')) return;
    setVoiceOn(false);
  }

  function resetAll() {
    if (!window.confirm('Reset your theme, font, and voice settings to the defaults?')) return;
    writeStore('anvg-theme', null);
    writeStore('anvg-font', null);
    writeStore('anvg-voice', null);
    document.documentElement.dataset.theme = 'midnight';
    document.documentElement.dataset.font = 'system';
    setTheme('midnight');
    setFont('system');
    setVoiceOn(false);
    setNote('All preferences reset to the defaults.');
  }

  return (
    <>
      <header>
        <div className="eyebrow">Settings</div>
        <h1>Flight Deck Settings</h1>
        <p className="muted">Customize your virtual flight operations portal. Manage your personal appearance and audio preferences.</p>
      </header>

      <p className="success" aria-live="polite">{note}</p>

      <section className="glass">
        <h2>Appearance &amp; Theme</h2>
        <div className="settings-grid">
          {THEMES.map((t) => {
            const selected = theme === t.key;
            return (
              <button
                key={t.key}
                className="choice"
                aria-pressed={selected}
                onClick={() => chooseTheme(t.key)}
              >
                <span className="swatch" style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }} />
                <strong>{t.label}</strong>
                <span className="choice-state">{selected ? 'Selected' : 'Tap to use'}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="glass">
        <h2>Typography</h2>
        <div className="settings-grid">
          {FONTS.map((f) => {
            const selected = font === f.key;
            return (
              <button
                key={f.key}
                className="choice"
                aria-pressed={selected}
                onClick={() => chooseFont(f.key)}
              >
                <span className="font-sample" style={{ fontFamily: f.family }}>Aa Flight Deck</span>
                <strong>{f.label}</strong>
                <span className="choice-state">{selected ? 'Selected' : 'Tap to use'}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="glass">
        <h2>Voice Assistance</h2>
        <p>Enable spoken announcements to receive helpful page information while exploring the ANVG portal. It is off by default.</p>
        <div className="btn-row">
          <button
            className="switch"
            role="switch"
            aria-checked={voice}
            onClick={() => setVoiceOn(!voice)}
          >
            {voice ? 'On' : 'Off'}
          </button>
          <button className="btn" onClick={resetVoice}>Reset Voice Settings</button>
        </div>
      </section>

      <section className="glass">
        <h2>Restore Defaults</h2>
        <p>Resets this device&apos;s theme, font, and voice settings. Website content is not changed.</p>
        <div className="btn-row">
          <button className="btn btn-red" onClick={resetAll}>Reset All Preferences</button>
        </div>
      </section>
    </>
  );
  }
