import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import AuthShell from '@/Components/AuthShell';

export default function ForgotPassword() {
  const form = useForm({ email: '' });
  const [sent, setSent] = useState(false);
  const send = (e?: FormEvent) => { e?.preventDefault(); form.post('/forgot-password', { preserveScroll: true, onSuccess: () => setSent(true) }); };

  return (
    <AuthShell step={sent ? 1 : 0}>
      <Head title="Forgot password" />
      {sent ? (
        <>
          <h1 className="display text-3xl">Check your email</h1>
          <p className="mt-3 text-sm text-black/70">If an account exists for <b>{form.data.email}</b>, a reset link is on its way. The link works for 60 minutes.</p>
          <button onClick={() => send()} disabled={form.processing} className="mt-6 w-full rounded-full border border-ink/40 py-3 text-sm font-semibold disabled:opacity-50">{form.processing ? 'Sending' : 'Resend link'}</button>
          <button onClick={() => setSent(false)} className="mt-3 w-full text-xs underline">Use a different email</button>
          {form.errors.email && <p className="mt-3 text-center text-xs text-ember">{form.errors.email}</p>}
        </>
      ) : (
        <form onSubmit={send}>
          <h1 className="display text-3xl">Forgot password?</h1>
          <p className="mt-3 text-sm text-black/70">Enter the email linked to your account and we will send you a reset link.</p>
          <label className="mt-6 block text-xs font-semibold">Email
            <input type="email" autoFocus value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} placeholder="you@example.com" className="mt-1 w-full rounded-full border border-stone px-4 py-3 text-sm font-normal" />
          </label>
          {form.errors.email && <p className="mt-2 px-2 text-xs text-ember">{form.errors.email}</p>}
          <button disabled={form.processing || !form.data.email} className="mt-4 w-full rounded-full bg-ink py-3 text-sm font-semibold text-white disabled:opacity-40">{form.processing ? 'Sending' : 'Send reset link'}</button>
        </form>
      )}
    </AuthShell>
  );
}