import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

const status = (usePage().props.flash as { status?: string } | undefined)?.status;

export default function SignIn() {
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const form = useForm({ name: '', email: '', password: '', remember: false });
  const input = 'w-full rounded-full bg-white px-4 py-2.5 text-sm';

  const submit = (e: FormEvent) => {
    e.preventDefault();
    form.post(mode === 'in' ? '/sign-in' : '/sign-up', { onFinish: () => form.reset('password') });
  };
  const switchMode = (m: 'in' | 'up') => { setMode(m); form.clearErrors(); };

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <Head title="Sign in" />
      <div className="relative isolate hidden flex-col justify-between overflow-hidden bg-ink p-10 text-white md:flex">
      <img src="/images/videoframe.png" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <video autoPlay muted loop playsInline preload="metadata" poster="/images/videoframe.png" aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-cover motion-reduce:hidden">
          <source src="/images/videoframe.mp4" type="video/mp4" />
        </video>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/35 to-black/55" />
        <Link href="/" className="display text-lg">Laced<span className="text-ember">Up</span></Link>
        <div>
          <h1 className="display text-6xl">Discover. Buy. Sell.</h1>
          <p className="mt-4 max-w-sm text-sm text-white/70">Every pair is authenticated and every payment is held in escrow until you confirm delivery.</p>
        </div>
      </div>

      <div className="grid place-items-center p-8">
      <form onSubmit={submit} className="w-full max-w-sm space-y-3">
      <Link href="/" className="display mb-8 block text-lg md:hidden">Laced<span className="text-ember">Up</span></Link>
          <div className="mb-6 flex rounded-full bg-white p-1 text-xs">
            {(['in', 'up'] as const).map((m) => (
              <button type="button" key={m} onClick={() => switchMode(m)} className={`flex-1 rounded-full py-2 ${mode === m ? 'bg-ink text-white' : ''}`}>
                {m === 'in' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>
          <h2 className="display text-3xl">{mode === 'in' ? 'Welcome back' : 'Join Laced Up'}</h2>

          {status && <p role="status" className="rounded-xl bg-green-50 px-4 py-2 text-xs text-green-800">{status}</p>}

          {mode === 'up' && (
            <div>
              <input className={input} placeholder="Full name" aria-label="Full name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
              {form.errors.name && <p className="mt-1 px-2 text-xs text-ember">{form.errors.name}</p>}
            </div>
          )}
          <div>
            <input className={input} type="email" placeholder="you@example.com" aria-label="Email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} />
            {form.errors.email && <p className="mt-1 px-2 text-xs text-ember">{form.errors.email}</p>}
          </div>
          <div>
            <input className={input} type="password" placeholder="At least 8 characters" aria-label="Password" value={form.data.password} onChange={(e) => form.setData('password', e.target.value)} />
            {form.errors.password && <p className="mt-1 px-2 text-xs text-ember">{form.errors.password}</p>}
          </div>
          {mode === 'in' && (
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" className="accent-ember" checked={form.data.remember} onChange={(e) => form.setData('remember', e.target.checked)} />
              Remember me on this device
            </label>
          )}

        {mode === 'in' && <Link href="/forgot-password" className="block text-right text-xs underline">Forgot password?</Link>}
          <button disabled={form.processing} className="w-full rounded-full bg-ink py-3 text-sm font-semibold text-white disabled:opacity-50">
            {form.processing ? 'Please wait' : mode === 'in' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}