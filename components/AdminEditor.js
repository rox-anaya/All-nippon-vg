'use client';
// Editor used by every admin page.
// Settings pages edit one block of text. List pages add, edit, reorder, hide, and delete items.
import { useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabaseClient';
import { SECTIONS } from '../lib/collections';

const BUCKET = 'anvg-media';

// Shows a success or error message. Renders nothing when there is no message.
export function Msg({ msg }) {
  return msg.text ? <p className={msg.type}>{msg.text}</p> : null;
}

// --- UTC time helpers. The admin types 2026-11-07 12:00, and it is saved as UTC. ---
function isoToUtcText(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d) ? '' : d.toISOString().slice(0, 16).replace('T', ' ');
}

function utcTextToIso(text) {
  const m = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/.exec(text);
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]));
  // Rejects impossible dates such as 2026-02-31.
  if (isNaN(d) || d.toISOString().slice(0, 16).replace('T', ' ') !== text) return null;
  return d.toISOString();
}

// Turns stored values into text the form can show.
function toForm(obj, fields) {
  const out = {};
  for (const f of fields) {
    const v = obj?.[f.name];
    if (f.type === 'utc') out[f.name] = isoToUtcText(v);
    else out[f.name] = Array.isArray(v) ? v.join(', ') : v ?? '';
  }
  return out;
}

// Turns form text back into the values we save.
function fromForm(form, fields) {
  const out = {};
  for (const f of fields) {
    const v = (form[f.name] ?? '').toString().trim();
    if (f.type === 'list') out[f.name] = v.split(',').map((s) => s.trim()).filter(Boolean);
    else if (f.type === 'utc') out[f.name] = utcTextToIso(v) ?? '';
    else if (f.type === 'icao') out[f.name] = v.toUpperCase();
    else out[f.name] = v;
  }
  return out;
}

// Checks the form before saving. Blocks unsafe links and badly formatted codes or times.
function validate(fields, form) {
  for (const f of fields) {
    const v = (form[f.name] ?? '').toString().trim();
    if (!v) continue;
    if ((f.type === 'url' || f.type === 'image') && !/^https:\/\//i.test(v)) {
      return `${f.label} must start with https://`;
    }
    if (f.type === 'icao' && !/^[A-Za-z]{4}$/.test(v)) {
      return `${f.label} must be exactly 4 letters, for example RJTT`;
    }
    if (f.type === 'utc' && !utcTextToIso(v)) {
      return `${f.label} must look like 2026-11-07 12:00 (UTC)`;
    }
    if (f.type === 'color' && !/^#[0-9a-fA-F]{6}$/.test(v)) {
      return `${f.label} must look like #2b7de0`;
    }
  }
  return null;
}

// Shrinks a large phone photo in the browser before upload, keeping its proportions.
async function shrinkImage(file, maxSide = 2000) {
  const url = URL.createObjectURL(file);
  const img = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = url;
  });
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);
  const keepPng = file.type === 'image/png';
  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, keepPng ? 'image/png' : 'image/jpeg', 0.92)
  );
  return { blob, ext: keepPng ? 'png' : 'jpg' };
}

// Uploads an image to Supabase Storage and returns its public address.
async function uploadImage(file) {
  const supabase = getSupabase();
  const { blob, ext } = await shrinkImage(file);
  const path = `uploads/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: blob.type, cacheControl: '31536000' });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

// One form field. The field type decides which input appears.
function FieldInput({ field, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const type = field.type || 'text';

  if (type === 'textarea') {
    return (
      <label>
        {field.label}
        <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      </label>
    );
  }

  if (type === 'select') {
    return (
      <label>
        {field.label}
        <select value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          <option value="">Choose…</option>
          {field.options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </label>
    );
  }

  if (type === 'image') {
    async function handleFile(e) {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      setError('');
      try {
        onChange(await uploadImage(file));
      } catch (err) {
        setError(`Upload failed: ${err.message}`);
      } finally {
        setUploading(false);
      }
    }
    return (
      <div className="field">
        <span>{field.label}</span>
        {value && <img className="admin-preview" src={value} alt="Current image preview" />}
        <input type="file" accept="image/*" onChange={handleFile} />
        <input
          placeholder="or paste an https:// image link"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
        {uploading && <p className="muted">Uploading…</p>}
        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <label>
        {field.label} <span className="faint">(separate items with commas)</span>
        <input value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      </label>
    );
  }

  const placeholder =
    type === 'url' ? 'https://...'
    : type === 'utc' ? 'YYYY-MM-DD HH:MM (UTC)'
    : type === 'icao' ? 'for example RJTT'
    : type === 'color' ? '#RRGGBB'
    : '';

  return (
    <label>
      {field.label}
      <input
        type={type === 'url' ? 'url' : 'text'}
        placeholder={placeholder}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

// Editor for one block of page text (for example, Home page).
function SettingsEditor({ sectionKey }) {
  const def = SECTIONS[sectionKey];
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    getSupabase()
      .from('site_settings')
      .select('value')
      .eq('key', sectionKey)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) setMsg({ type: 'error', text: error.message });
        setForm(toForm(data?.value, def.fields));
      });
    return () => {
      alive = false;
    };
  }, [sectionKey]);

  async function save() {
    const err = validate(def.fields, form);
    if (err) return setMsg({ type: 'error', text: err });
    setBusy(true);
    const { error } = await getSupabase()
      .from('site_settings')
      .upsert({ key: sectionKey, value: fromForm(form, def.fields), updated_at: new Date().toISOString() });
    setBusy(false);
    setMsg(
      error
        ? { type: 'error', text: error.message }
        : { type: 'success', text: 'Saved. Refresh the public page to see the change.' }
    );
  }

  if (!form) return <p className="muted">Loading…</p>;

  return (
    <div className="glass admin-form">
      {def.fields.map((f) => (
        <FieldInput
          key={f.name}
          field={f}
          value={form[f.name]}
          onChange={(v) => setForm((p) => ({ ...p, [f.name]: v }))}
        />
      ))}
      <Msg msg={msg} />
      <div className="btn-row">
        <button className="btn btn-primary" disabled={busy} onClick={save}>
          {busy ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}

// Editor for a list (for example, Events). Items can be added, edited, reordered, hidden, and deleted.
function ListEditor({ sectionKey }) {
  const def = SECTIONS[sectionKey];
  const supabase = getSupabase();
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null); // null, 'new', or an item id
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('collection', sectionKey)
      .order('sort_order', { ascending: true });
    if (error) setMsg({ type: 'error', text: error.message });
    else setRows(data);
    setLoading(false);
  }

  useEffect(() => {
    setEditing(null);
    setLoading(true);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionKey]);

  function startNew() {
    setForm(toForm({}, def.fields));
    setEditing('new');
    setMsg({ type: '', text: '' });
  }

  function startEdit(row) {
    setForm(toForm(row.data, def.fields));
    setEditing(row.id);
    setMsg({ type: '', text: '' });
  }

  // New items go to the bottom, or to the top for lists marked newFirst.
  function nextSortOrder() {
    if (rows.length === 0) return 1;
    return def.newFirst
      ? Math.min(...rows.map((r) => r.sort_order)) - 1
      : Math.max(...rows.map((r) => r.sort_order)) + 1;
  }

  async function saveItem() {
    const err = validate(def.fields, form);
    if (err) return setMsg({ type: 'error', text: err });
    setBusy(true);
    const data = fromForm(form, def.fields);
    const res =
      editing === 'new'
        ? await supabase.from('content_items').insert({
            collection: sectionKey,
            data,
            is_published: true,
            sort_order: nextSortOrder(),
          })
        : await supabase.from('content_items').update({ data }).eq('id', editing);
    setBusy(false);
    if (res.error) return setMsg({ type: 'error', text: res.error.message });
    setEditing(null);
    setMsg({ type: 'success', text: 'Saved.' });
    load();
  }

  // Runs one database change, shows the result, and reloads the list.
  async function run(request, okText) {
    const { error } = await request;
    setMsg(error ? { type: 'error', text: error.message } : { type: 'success', text: okText });
    load();
  }

  function togglePublish(row) {
    return run(
      supabase.from('content_items').update({ is_published: !row.is_published }).eq('id', row.id),
      row.is_published ? 'Hidden from the public page.' : 'Published on the public page.'
    );
  }

  function removeItem(row) {
    if (!window.confirm('Delete this item permanently? This cannot be undone.')) return;
    return run(supabase.from('content_items').delete().eq('id', row.id), 'Deleted.');
  }

  // Swaps the order of two neighbouring items.
  async function move(index, dir) {
    const j = index + dir;
    if (j < 0 || j >= rows.length) return;
    const a = rows[index];
    const b = rows[j];
    const [r1, r2] = await Promise.all([
      supabase.from('content_items').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('content_items').update({ sort_order: a.sort_order }).eq('id', b.id),
    ]);
    if (r1.error || r2.error) setMsg({ type: 'error', text: 'Could not change the order.' });
    load();
  }

  const thumbField = def.fields.find((f) => f.type === 'image');
  const titleOf = (d) => (def.titleField && d[def.titleField]) || '(untitled)';
  const publishedCount = rows.filter((r) => r.is_published).length;

  return (
    <div className="glass admin-form">
      <div className="admin-toolbar">
        <span className="faint">
          {rows.length} item{rows.length === 1 ? '' : 's'} · {publishedCount} published
        </span>
        <button className="btn btn-primary" onClick={startNew}>Add new</button>
      </div>

      <Msg msg={msg} />
      {loading && <p className="muted">Loading…</p>}
      {!loading && rows.length === 0 && <p className="muted">Nothing here yet. Tap Add new.</p>}

      {rows.map((row, i) => (
        <div className="admin-item" key={row.id}>
          {thumbField && row.data[thumbField.name] && (
            <img className="admin-thumb" src={row.data[thumbField.name]} alt="" />
          )}
          <div className="admin-item-body">
            <strong>{titleOf(row.data)}</strong>
            <span className="faint">
              {row.is_published ? 'Published' : 'Hidden'} · position {i + 1}
            </span>
          </div>
          <div className="admin-actions">
            <button className="btn btn-compact" onClick={() => startEdit(row)}>Edit</button>
            <button className="btn btn-compact" onClick={() => move(i, -1)} disabled={i === 0}>Up</button>
            <button className="btn btn-compact" onClick={() => move(i, 1)} disabled={i === rows.length - 1}>Down</button>
            <button className="btn btn-compact" onClick={() => togglePublish(row)}>
              {row.is_published ? 'Hide' : 'Publish'}
            </button>
            <button className="btn btn-compact btn-red" onClick={() => removeItem(row)}>Delete</button>
          </div>
        </div>
      ))}

      {editing && (
        <div className="glass admin-form">
          <h3>{editing === 'new' ? 'New item' : 'Edit item'}</h3>
          {def.fields.map((f) => (
            <FieldInput
              key={f.name}
              field={f}
              value={form[f.name]}
              onChange={(v) => setForm((p) => ({ ...p, [f.name]: v }))}
            />
          ))}
          <div className="btn-row">
            <button className="btn btn-primary" disabled={busy} onClick={saveItem}>
              {busy ? 'Saving…' : 'Save'}
            </button>
            <button className="btn" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Picks the right editor for the selected page.
export default function AdminEditor({ sectionKey }) {
  return SECTIONS[sectionKey].kind === 'settings'
    ? <SettingsEditor sectionKey={sectionKey} />
    : <ListEditor sectionKey={sectionKey} />;
}
