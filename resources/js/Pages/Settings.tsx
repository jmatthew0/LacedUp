import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';

interface Props {
  user: { name: string; email: string };
  seller: { handle: string; bio: string; avatar: string | null } | null;
}

const input = 'w-full rounded-full bg-paper px-4 py-2.5 text-sm';
const save = 'rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-40';

function Err({ m }: { m?: string }) {
  return m ? <p className="mt-1 px-2 text-xs text-ember">{m}</p> : null;
}

function Card({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-6">
      <h2 className="display text-lg">{title}</h2>
      {note && <p className="mt-1 text-xs text-black/60">{note}</p>}
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

function AccountForm({ user }: { user: Props['user'] }) {
  const form = useForm({ name: user.name, email: user.email });
  const submit = (e: FormEvent) => { e.preventDefault(); form.patch('/settings/account', { preserveScroll: true }); };
  return (
    <form onSubmit={submit}>
      <Card title="Account">
        <div><input className={input} aria-label="Full name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} /><Err m={form.errors.name} /></div>
        <div><input className={input} type="email" aria-label="Email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} /><Err m={form.errors.email} /></div>
        <div className="flex items-center gap-3"><button disabled={form.processing} className={save}>Save changes</button>{form.recentlySuccessful && <span className="text-xs text-black/60">Saved</span>}</div>
      </Card>
    </form>
  );
}

function PasswordForm() {
  const form = useForm({ current_password: '', password: '', password_confirmation: '' });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    form.put('/settings/password', { preserveScroll: true, onSuccess: () => form.reset() });
  };
  return (
    <form onSubmit={submit}>
      <Card title="Password">
        <div><input className={input} type="password" placeholder="Current password" aria-label="Current password" value={form.data.current_password} onChange={(e) => form.setData('current_password', e.target.value)} /><Err m={form.errors.current_password} /></div>
        <div><input className={input} type="password" placeholder="New password (8+ characters)" aria-label="New password" value={form.data.password} onChange={(e) => form.setData('password', e.target.value)} /><Err m={form.errors.password} /></div>
        <div><input className={input} type="password" placeholder="Confirm new password" aria-label="Confirm new password" value={form.data.password_confirmation} onChange={(e) => form.setData('password_confirmation', e.target.value)} /></div>
        <div className="flex items-center gap-3"><button disabled={form.processing || !form.data.password} className={save}>Update password</button>{form.recentlySuccessful && <span className="text-xs text-black/60">Password updated</span>}</div>
      </Card>
    </form>
  );
}

function SellerForm({ seller }: { seller: NonNullable<Props['seller']> }) {
  const form = useForm({ bio: seller.bio, avatar: null as File | null });
  const preview = useMemo(() => (form.data.avatar ? URL.createObjectURL(form.data.avatar) : seller.avatar), [form.data.avatar, seller.avatar]);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    form.post('/settings/seller', { forceFormData: true, preserveScroll: true, onSuccess: () => form.setData('avatar', null) });
  };
  return (
    <form onSubmit={submit}>
      <Card title="Seller profile" note={`Shown at /sellers/${seller.handle}`}>
        <div className="flex items-center gap-4">
          {preview ? <img src={preview} alt="" className="h-16 w-16 rounded-full object-cover" /> : <span className="grid h-16 w-16 place-items-center rounded-full bg-stone text-xs text-black/50">No photo</span>}
          <label className="cursor-pointer rounded-full border border-ink/40 px-4 py-2 text-xs">
            Choose photo
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => form.setData('avatar', e.target.files?.[0] ?? null)} />
          </label>
        </div>
        <Err m={form.errors.avatar} />
        <div>
          <textarea rows={3} maxLength={300} aria-label="Bio" value={form.data.bio} onChange={(e) => form.setData('bio', e.target.value)} className="w-full rounded-2xl bg-paper px-4 py-3 text-sm" />
          <p className="px-2 text-right text-[10px] text-black/50">{form.data.bio.length}/300</p>
          <Err m={form.errors.bio} />
        </div>
        <div className="flex items-center gap-3"><button disabled={form.processing} className={save}>Save profile</button>{form.recentlySuccessful && <span className="text-xs text-black/60">Saved</span>}</div>
      </Card>
    </form>
  );
}

export default function Settings({ user, seller }: Props) {
  return (
    <AppLayout>
      <Head title="Settings" />
      <h1 className="display mt-6 text-4xl">Settings</h1>
      <div className="mt-6 grid max-w-2xl gap-6">
        <AccountForm user={user} />
        {seller ? <SellerForm seller={seller} /> : (
          <Card title="Seller profile" note="You become a seller when you list your first pair.">
            <Link href="/sell" className="inline-block rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-white">List a pair</Link>
          </Card>
        )}
        <PasswordForm />
      </div>
    </AppLayout>
  );
}