import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import SettingsHeader from '@/Components/SettingsHeader';
import AccountLayout from '@/Layouts/AccountLayout';

export default function SettingsPayments({ methods, current }: { methods: string[]; current: string }) {
  const [method, setMethod] = useState(current);
  const [saved, setSaved] = useState(false);
  const save = () => router.post('/settings/payments', { method }, { preserveScroll: true, onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 2000); } });

  return (
    <AccountLayout active="settings">
      <Head title="Payment methods" />
      <SettingsHeader tab="payments" />
      <section className="rounded-3xl bg-white p-6">
        <h2 className="display text-lg">Preferred payment method</h2>
        <p className="mt-1 text-xs text-black/60">This is selected for you at checkout. You can still change it for any order.</p>
        <div className="mt-4 space-y-2">
          {methods.map((m) => (
            <label key={m} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm ${method === m ? 'border-ink' : 'border-stone'}`}>
              <input type="radio" name="method" checked={method === m} onChange={() => setMethod(m)} className="accent-ember" />{m}
            </label>
          ))}
        </div>
        <p className="mt-4 rounded-xl bg-paper p-3 text-xs text-black/60">Card and wallet details are not stored yet. You enter payment details with the provider when you pay.</p>
        <div className="mt-4 flex items-center justify-end gap-3">
          {saved && <span className="text-xs text-black/60">Saved</span>}
          <button onClick={save} className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white">Save preference</button>
        </div>
      </section>
    </AccountLayout>
  );
}