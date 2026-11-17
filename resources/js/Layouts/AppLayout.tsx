import { Link, router } from '@inertiajs/react';
import { FormEvent, PropsWithChildren, useState } from 'react';

const nav = ['New In', 'Men', 'Women', 'Kids', 'Retro', 'Sellers'];

export default function AppLayout({ children }: PropsWithChildren) {
  const [q, setQ] = useState('');
  const submit = (e: FormEvent) => { e.preventDefault(); router.get('/search', { q }); };
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-4">
        <Link href="/" className="display text-lg">Laced<span className="text-ember">Up</span></Link>
        <nav className="hidden gap-5 text-xs md:flex">
          {nav.map((n) => <Link key={n} href={`/search?q=${n === 'Retro' ? 'retro' : ''}`} className="hover:text-ember">{n}</Link>)}
        </nav>
        <form onSubmit={submit} className="ml-auto hidden sm:block">
          <input aria-label="Search models" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search models, brands" className="w-52 rounded-full bg-white px-4 py-2 text-xs" />
        </form>
        <Link href="/bag" className="text-xs hover:text-ember">Bag</Link>
        <Link href="/orders" className="text-xs hover:text-ember">Orders</Link>
        <Link href="/sign-in" className="text-xs hover:text-ember">Sign in</Link>
        <Link href="/sell" className="rounded-full bg-ember px-4 py-2 text-xs font-semibold text-white">Sell a pair</Link>
      </header>
      <main className="mx-auto max-w-6xl px-5 pb-16">{children}</main>
      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 border-t border-stone px-5 py-6 text-xs text-black/60">
        <span className="display text-sm text-ink">LacedUp</span>
        <span>Discover, buy, and sell sneakers.</span>
        <span>© 2026 Laced Up. All rights reserved.</span>
      </footer>
    </div>
  );
}