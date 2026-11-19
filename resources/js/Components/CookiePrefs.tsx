import { useEffect, useState } from 'react';
import Switch from '@/Components/Switch';

const KEY = 'lacedup-cookies';

export default function CookiePrefs() {
  const [prefs, setPrefs] = useState({ preferences: true, analytics: false });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setPrefs(JSON.parse(raw)); } catch { /* storage unavailable */ }
  }, []);

  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch { /* storage unavailable */ }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const rows: [string, string, 'preferences' | 'analytics' | null][] = [
    ['Essential', 'Needed for sign-in and checkout. Always on.', null],
    ['Preferences', 'Remembers size, sort, and view settings.', 'preferences'],
    ['Analytics', 'Helps us improve pages and search.', 'analytics'],
  ];

  return (
    <div className="no-print mt-5">
      <div className="divide-y divide-stone rounded-2xl bg-white">
        {rows.map(([name, note, key]) => (
          <div key={name} className="flex items-center justify-between gap-4 p-4">
            <div><p className="text-sm font-semibold">{name}</p><p className="text-xs text-black/60">{note}</p></div>
            {key ? <Switch on={prefs[key]} onChange={(v) => setPrefs({ ...prefs, [key]: v })} label={name} />
              : <span className="rounded-full bg-paper px-3 py-1 text-[11px] font-semibold">Required</span>}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-end gap-3">
        {saved && <span className="text-xs text-black/60">Saved</span>}
        <button onClick={save} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">Save preferences</button>
      </div>
    </div>
  );
}