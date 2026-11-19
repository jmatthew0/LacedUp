import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import SettingsHeader from '@/Components/SettingsHeader';
import Switch from '@/Components/Switch';
import AccountLayout from '@/Layouts/AccountLayout';

type Prefs = { offers: boolean; orders: boolean; reviews: boolean };
const rows: [keyof Prefs, string, string][] = [
  ['offers', 'Offers', 'New offers, counters, and replies on your offers.'],
  ['orders', 'Orders', 'New orders, shipping updates, disputes, and returns.'],
  ['reviews', 'Reviews', 'When a buyer reviews you as a seller.'],
];

export default function SettingsNotifications({ prefs }: { prefs: Prefs }) {
  const [state, setState] = useState(prefs);
  const [saved, setSaved] = useState(false);
  const save = () => router.post('/settings/notifications', state, { preserveScroll: true, onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 2000); } });

  return (
    <AccountLayout active="settings">
      <Head title="Notifications" />
      <SettingsHeader tab="notifications" />
      <section className="rounded-3xl bg-white p-6">
        <h2 className="display text-lg">In-app notifications</h2>
        <p className="mt-1 text-xs text-black/60">Choose what shows up in the bell. Turned-off types are not saved.</p>
        <div className="mt-4 divide-y divide-stone">
          {rows.map(([key, name, note]) => (
            <div key={key} className="flex items-center justify-between gap-4 py-4">
              <div><p className="text-sm font-semibold">{name}</p><p className="text-xs text-black/60">{note}</p></div>
              <Switch on={state[key]} onChange={(v) => setState({ ...state, [key]: v })} label={name} />
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-end gap-3">
          {saved && <span className="text-xs text-black/60">Saved</span>}
          <button onClick={save} className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white">Save preferences</button>
        </div>
      </section>
    </AccountLayout>
  );
}