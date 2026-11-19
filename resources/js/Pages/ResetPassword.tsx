import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import AuthShell from '@/Components/AuthShell';

const input = 'w-full rounded-full border border-stone px-4 py-3 text-sm';

export default function ResetPassword({ token, email }: { token: string; email: string }) {
  const form = useForm({ token, email, password: '', password_confirmation: '' });
  const submit = (e: FormEvent) => { e.preventDefault(); form.post('/reset-password', { onFinish: () => form.reset('password', 'password_confirmation') }); };

  return (
    <AuthShell step={2}>
      <Head title="New password" />
      <form onSubmit={submit} className="space-y-3">
        <h1 className="display text-3xl">New password</h1>
        <p className="text-sm text-black/70">Choose a new password for <b>{form.data.email || 'your account'}</b>.</p>
        {!email && <input type="email" className={input} placeholder="Email" aria-label="Email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} />}
        <input type="password" autoFocus className={input} placeholder="New password (8+ characters)" aria-label="New password" value={form.data.password} onChange={(e) => form.setData('password', e.target.value)} />
        {form.errors.password && <p className="px-2 text-xs text-ember">{form.errors.password}</p>}
        <input type="password" className={input} placeholder="Confirm new password" aria-label="Confirm new password" value={form.data.password_confirmation} onChange={(e) => form.setData('password_confirmation', e.target.value)} />
        {form.errors.email && <p className="px-2 text-xs text-ember">{form.errors.email} <Link href="/forgot-password" className="underline">Request a new link</Link></p>}
        <button disabled={form.processing || !form.data.password} className="w-full rounded-full bg-ink py-3 text-sm font-semibold text-white disabled:opacity-40">{form.processing ? 'Saving' : 'Update password'}</button>
      </form>
    </AuthShell>
  );
}