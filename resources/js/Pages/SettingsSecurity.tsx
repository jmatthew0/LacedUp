import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import SettingsHeader from '@/Components/SettingsHeader';
import AccountLayout from '@/Layouts/AccountLayout';

const input = 'w-full rounded-full border border-stone bg-white px-4 py-2.5 text-sm';

export default function SettingsSecurity() {
  const form = useForm({ current_password: '', password: '', password_confirmation: '' });
  const submit = (e: FormEvent) => { e.preventDefault(); form.put('/settings/password', { preserveScroll: true, onSuccess: () => form.reset() }); };
  const err = (m?: string) => (m ? <p className="mt-1 px-2 text-xs text-ember">{m}</p> : null);

  return (
    <AccountLayout active="settings">
      <Head title="Security" />
      <SettingsHeader tab="security" />
      <form onSubmit={submit} className="space-y-3 rounded-3xl bg-white p-6">
        <h2 className="display text-lg">Change password</h2>
        <div><input className={input} type="password" placeholder="Current password" aria-label="Current password" value={form.data.current_password} onChange={(e) => form.setData('current_password', e.target.value)} />{err(form.errors.current_password)}</div>
        <div><input className={input} type="password" placeholder="New password (8+ characters)" aria-label="New password" value={form.data.password} onChange={(e) => form.setData('password', e.target.value)} />{err(form.errors.password)}</div>
        <div><input className={input} type="password" placeholder="Confirm new password" aria-label="Confirm new password" value={form.data.password_confirmation} onChange={(e) => form.setData('password_confirmation', e.target.value)} /></div>
        <div className="flex items-center justify-end gap-3">
          {form.recentlySuccessful && <span className="text-xs text-black/60">Password updated</span>}
          <button disabled={form.processing || !form.data.password} className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-40">Update password</button>
        </div>
      </form>
    </AccountLayout>
  );
}