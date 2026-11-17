import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function SignIn() {
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const input = 'w-full rounded-full bg-white px-4 py-2.5 text-sm';
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <Head title="Sign in" />
      <div className="flex flex-col justify-between bg-ink p-10 text-white">
        <Link href="/" className="display text-lg">Laced<span className="text-ember">Up</span></Link>
        <div><h1 className="display text-6xl">Discover. Buy. Sell.</h1><p className="mt-4 max-w-sm text-sm text-white/70">Every pair is authenticated and every payment is held in escrow until you confirm delivery.</p></div>
        <dl className="flex gap-8"><div><dd className="display text-2xl">48K</dd><dt className="text-[10px]">Sales</dt></div><div><dd className="display text-2xl">4.9</dd><dt className="text-[10px]">Avg rating</dt></div><div><dd className="display text-2xl">48h</dd><dt className="text-[10px]">Shipping</dt></div></dl>
      </div>
      <div className="grid place-items-center p-8"><form onSubmit={(e) => e.preventDefault()} className="w-full max-w-sm space-y-3">
        <div className="mb-6 flex rounded-full bg-white p-1 text-xs">{(['in', 'up'] as const).map((m) => <button type="button" key={m} onClick={() => setMode(m)} className={`flex-1 rounded-full py-2 ${mode === m ? 'bg-ink text-white' : ''}`}>{m === 'in' ? 'Sign in' : 'Create account'}</button>)}</div>
        <h2 className="display text-3xl">{mode === 'in' ? 'Welcome back' : 'Join Laced Up'}</h2>
        {mode === 'up' && <input className={input} placeholder="Full name" />}
        <input className={input} type="email" placeholder="you@example.com" aria-label="Email" /><input className={input} type="password" placeholder="At least 8 characters" aria-label="Password" />
        <button className="w-full rounded-full bg-ink py-3 text-sm font-semibold text-white">{mode === 'in' ? 'Sign in' : 'Create account'}</button>
        <div className="flex gap-3">{['Google', 'Facebook'].map((n) => <button type="button" key={n} className="flex-1 rounded-full bg-white py-2.5 text-xs font-semibold">{n}</button>)}</div>
      </form></div>
    </div>
  );
}