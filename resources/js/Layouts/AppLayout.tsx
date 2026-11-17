import { Link, router, usePage } from '@inertiajs/react';
import { FormEvent, PropsWithChildren, useEffect, useRef, useState } from 'react';

const nav = ['New In', 'Men', 'Women', 'Kids', 'Retro', 'Sellers'];

interface User { id: number; name: string; email: string }
interface Shared { auth: { user: User | null }; [key: string]: unknown }

function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const initials = user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  useEffect(() => {
    const close = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, []);

  const item = 'block w-full whitespace-nowrap rounded-xl px-3 py-2 text-left text-sm hover:bg-paper';

  return (
    <div ref={box} className="relative">
      <button onClick={() => setOpen(!open)} aria-haspopup="menu" aria-expanded={open} aria-label="Account menu"
        className="grid h-9 w-9 place-items-center rounded-full bg-ink text-xs font-semibold text-white">{initials}</button>
      {open && (
        <div role="menu" className="absolute right-0 z-20 mt-2 w-56 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-black/5">
          <div className="border-b border-stone px-3 pb-2 pt-1">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-black/50">{user.email}</p>
          </div>
          <div className="pt-1">
            <Link href="/orders" className={item}>My orders</Link>
            <Link href="/saved" className={item}>Saved pairs</Link>
            <Link href="/offers" className={item}>My offers</Link>
            <Link href="/dashboard" className={item}>Seller dashboard</Link>
            <button onClick={() => router.post('/sign-out')} className={item}>Sign out</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AppLayout({ children }: PropsWithChildren) {
  const { auth } = usePage<Shared>().props;
  const [q, setQ] = useState('');
  const submit = (e: FormEvent) => { e.preventDefault(); router.get('/search', { q }); };

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center gap-5 px-5 py-4">
        <Link href="/" className="display shrink-0 whitespace-nowrap text-lg">Laced<span className="text-ember">Up</span></Link>

        <nav className="hidden gap-5 whitespace-nowrap text-xs lg:flex">
          {nav.map((n) => <Link key={n} href={`/search?q=${n === 'Retro' ? 'retro' : ''}`} className="hover:text-ember">{n}</Link>)}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <form onSubmit={submit} className="hidden md:block">
            <input aria-label="Search models" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search models, brands"
              className="w-48 rounded-full bg-white px-4 py-2 text-xs" />
          </form>
          <Link href="/bag" className="shrink-0 whitespace-nowrap text-xs hover:text-ember">Bag</Link>
          {auth.user ? <UserMenu user={auth.user} /> : <Link href="/sign-in" className="shrink-0 whitespace-nowrap text-xs hover:text-ember">Sign in</Link>}
          <Link href="/sell" className="shrink-0 whitespace-nowrap rounded-full bg-ember px-4 py-2 text-xs font-semibold text-white">Sell a pair</Link>
        </div>
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