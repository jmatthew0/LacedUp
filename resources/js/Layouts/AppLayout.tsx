import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

const nav = ['New In', 'Men', 'Women', 'Kids', 'Retro', 'Sellers'];

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-4">
        <Link href="/" className="display text-lg" style={{ fontStretch: '125%' }}>
          Laced<span className="text-ember">Up</span>
        </Link>
        <nav className="hidden gap-5 text-xs md:flex">
          {nav.map((n) => <a key={n} href="#" className="hover:text-ember">{n}</a>)}
        </nav>
        <input aria-label="Search models" placeholder="Search models, brands" className="ml-auto hidden w-52 rounded-full bg-white px-4 py-2 text-xs sm:block" />
        <button className="rounded-full bg-ember px-4 py-2 text-xs font-semibold text-white">Sell a pair</button>
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
