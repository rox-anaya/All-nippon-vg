'use client';
// Private admin dashboard with a sidebar. Access is enforced by the database (row-level security).
// This page only decides which screen to show.
import { useEffect, useRef, useState } from 'react';
import { getSupabase } from '../../lib/supabaseClient';
import { SECTIONS, GROUP_ORDER } from '../../lib/collections';
import AdminEditor, { Msg } from '../../components/AdminEditor';

// Sidebar groups, built from the registry so the menu always matches the editors.
const GROUPS = GROUP_ORDER.map((g) => ({
  label: g,
  keys: Object.keys(SECTIONS).filter((k) => SECTIONS[k].group === g),
}));

// Shared wrapper for the sign-in, reset, and denied screens.
function AuthCard({ children }) {
  return (
    <div className="admin-auth-wrap">
      <section className="glass auth">{children}</section>
    </div>
  );
}

export default function AdminPage() {
  const supabase = getSupabase();
  const [status, setStatus] = useState('loading'); // loading | signed-out | recovery | denied | ready
  const [user, setUser] = useState(null);
  const [current, setCurrent] = useState('home');
  const [navOpen, setNavOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);
  const recovering = useRef(false);

  // Checks the admin list for the signed-in user.
  async function checkAdmin(session) {
    if (recovering.current) return;
    setUser(session.user);
    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', session.user.id)
      .maybeSingle();
    setStatus(!error && data ? 'ready' : 'denied');
  }

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        recovering.current = true;
        setUser(session?.user ?? null);
        setStatus('recovery');
        return;
      }
      if (session) {
        checkAdmin(session);
      } else {
        setUser(null);
        setStatus(recovering.current ? 'recovery' : 'signed-out');
      }
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signIn(e) {
    e.preventDefault();
    setBusy(true);
    setMsg({ type: '', text: '' });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setMsg({ type: 'error', text: error.message });
  }

  async function sendReset() {
    if (!email) return setMsg({ type: 'error', text: 'Type your admin email first.' });
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin`,
    });
    setBusy(false);
    setMsg(
      error
        ? { type: 'error', text: error.message }
        : { type: 'success', text: 'Reset link sent. Check your email.' }
    );
  }

  async function saveNewPassword(e) {
    e.preventDefault();
    if (newPassword.length < 8) return setMsg({ type: 'error', text: 'Use at least 8 characters.' });
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setBusy(false);
    if (error) return setMsg({ type: 'error', text: error.message });
    recovering.current = false;
    setNewPassword('');
    const { data } = await supabase.auth.getSession();
    if (data.session) checkAdmin(data.session);
    else setStatus('signed-out');
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setPassword('');
    setStatus('signed-out');
  }

  function pick(key) {
    setCurrent(key);
    setNavOpen(false);
  }

  if (status === 'loading') {
    return <AuthCard><p className="muted">Checking access…</p></AuthCard>;
  }

  if (status === 'recovery') {
    return (
      <AuthCard>
        <form onSubmit={saveNewPassword}>
          <h1>Set a new password</h1>
          <label>
            New password (8+ characters)
            <input type="password" minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </label>
          <Msg msg={msg} />
          <button className="btn btn-primary" disabled={busy}>Save password</button>
        </form>
      </AuthCard>
    );
  }

  if (status === 'signed-out') {
    return (
      <AuthCard>
        <form onSubmit={signIn}>
          <h1>Admin sign in</h1>
          <label>
            Email
            <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <Msg msg={msg} />
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
          <button type="button" className="btn-link" onClick={sendReset} disabled={busy}>Forgot password?</button>
        </form>
      </AuthCard>
    );
  }

  if (status === 'denied') {
    return (
      <AuthCard>
        <h1>Access denied</h1>
        <p>This account is not an administrator. Ask the site owner to add you.</p>
        <button className="btn" onClick={signOut}>Sign out</button>
      </AuthCard>
    );
  }

  // Signed in and approved: the sidebar dashboard.
  const def = SECTIONS[current];

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${navOpen ? 'open' : ''}`} aria-label="Admin navigation">
        <div className="admin-brand">
          <div className="eyebrow">ANVG</div>
          <strong>Admin dashboard</strong>
        </div>

        {GROUPS.map((g) => (
          <div className="side-group" key={g.label}>
            <div className="side-label">{g.label}</div>
            {g.keys.map((k) => (
              <button
                key={k}
                className={`side-link ${k === current ? 'active' : ''}`}
                aria-current={k === current ? 'page' : undefined}
                onClick={() => pick(k)}
              >
                {SECTIONS[k].label}
              </button>
            ))}
          </div>
        ))}

        <div className="side-foot">
          <span className="faint">Signed in as</span>
          <span className="side-email">{user?.email}</span>
          <button className="btn btn-compact" onClick={signOut}>Sign out</button>
        </div>
      </aside>

      {navOpen && <div className="admin-scrim" onClick={() => setNavOpen(false)} />}

      <div className="admin-main">
        <div className="admin-topbar">
          <button className="btn btn-compact" onClick={() => setNavOpen(true)} aria-label="Open admin menu">
            Menu
          </button>
          <span className="faint">{def.label}</span>
        </div>

        <header className="admin-page-head">
          <div className="eyebrow">{def.group}</div>
          <h1>{def.label}</h1>
          <p className="muted">{def.hint}</p>
        </header>

        <AdminEditor key={current} sectionKey={current} />
      </div>
    </div>
  );
}
