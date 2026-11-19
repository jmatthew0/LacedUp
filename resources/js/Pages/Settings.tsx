import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useMemo } from 'react';
import SettingsHeader from '@/Components/SettingsHeader';
import AccountLayout from '@/Layouts/AccountLayout';

interface Props { user: { name: string; username: string | null; email: string; phone: string | null; bio: string | null; avatar: string | null } }

const input = 'w-full rounded-full border border-stone bg-white px-4 py-2.5 text-sm';

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold">{label}
      <div className="mt-1 font-normal">{children}</div>
      {error && <p className="mt-1 px-2 text-xs font-normal text-ember">{error}</p>}
    </label>
  );
}

export default function Settings({ user }: Props) {
  const form = useForm({ name: user.name, username: user.username ?? '', email: user.email, phone: user.phone ?? '', bio: user.bio ?? '', avatar: null as File | null });
  const preview = useMemo(() => (form.data.avatar ? URL.createObjectURL(form.data.avatar) : user.avatar), [form.data.avatar, user.avatar]);
  const e = form.errors;

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    form.post('/settings/profile', { forceFormData: true, preserveScroll: true, onSuccess: () => form.setData('avatar', null) });
  };

  return (
    <AccountLayout active="settings">
      <Head title="Account settings" />
      <SettingsHeader tab="profile" />
      <form onSubmit={submit} className="rounded-3xl bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone pb-5">
          <div className="flex items-center gap-4">
            {preview ? <img src={preview} alt="" className="h-16 w-16 rounded-full object-cover" />
              : <span className="grid h-16 w-16 place-items-center rounded-full bg-ink text-lg font-semibold text-white">{user.name[0]}</span>}
            <div><p className="text-sm font-bold">{form.data.name || user.name}</p><p className="text-xs text-black/60">JPG or PNG, up to 2 MB</p></div>
          </div>
          <label className="cursor-pointer rounded-full border border-ink/40 px-5 py-2 text-xs font-semibold">
            Change photo
            <input type="file" accept="image/*" className="sr-only" onChange={(ev) => form.setData('avatar', ev.target.files?.[0] ?? null)} />
          </label>
        </div>
        {e.avatar && <p className="mt-2 text-xs text-ember">{e.avatar}</p>}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Full name" error={e.name}><input className={input} value={form.data.name} onChange={(ev) => form.setData('name', ev.target.value)} /></Field>
          <Field label="Username" error={e.username}><input className={input} value={form.data.username} onChange={(ev) => form.setData('username', ev.target.value)} /></Field>
          <Field label="Email" error={e.email}><input className={input} type="email" value={form.data.email} onChange={(ev) => form.setData('email', ev.target.value)} /></Field>
          <Field label="Mobile number" error={e.phone}><input className={input} value={form.data.phone} onChange={(ev) => form.setData('phone', ev.target.value)} /></Field>
        </div>
        <div className="mt-4">
          <Field label="Bio" error={e.bio}>
            <textarea rows={3} maxLength={300} className="w-full rounded-2xl border border-stone px-4 py-3 text-sm" value={form.data.bio} onChange={(ev) => form.setData('bio', ev.target.value)} />
          </Field>
          <p className="px-2 text-right text-[10px] text-black/50">{form.data.bio.length}/300</p>
        </div>
        <div className="mt-4 flex items-center justify-end gap-3">
          {form.recentlySuccessful && <span className="text-xs text-black/60">Saved</span>}
          <button disabled={form.processing} className="rounded-full bg-ember px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Save changes</button>
        </div>
      </form>
    </AccountLayout>
  );
}