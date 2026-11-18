import { Link, router, usePage } from '@inertiajs/react';
import { FormEvent, PropsWithChildren, useEffect, useRef, useState } from 'react';
import Bell from '@/Components/Bell';

const nav = ['New In', 'Men', 'Women', 'Kids', 'Retro', 'Sellers'];
const navHref = (n: string) => (n === 'Sellers' ? '/sellers' : `/search?q=${n === 'Retro' ? 'retro' : ''}`);

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

  const item = 'block w-full whitespace-nowrap rounded-xl px-3 py-2.5 text-left text-sm hover:bg-paper';

  return (
    <div ref={box} className="relative">
      <button onClick={() => setOpen(!open)} aria-haspopup="menu" aria-expanded={open} aria-label="Account menu"
        className="grid h-9 w-9 place-items-center rounded-full bg-ink text-xs font-semibold text-white">{initials}</button>
      {open && (
        <div role="menu" onClick={() => setOpen(false)} className="absolute right-0 z-20 mt-2 w-56 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-black/5">
          <div className="border-b border-stone px-3 pb-2 pt-1">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-black/50">{user.email}</p>
          </div>
          <div className="pt-1">
          <Link href="/messages" className={item}>Messages</Link>
            <Link href="/orders" className={item}>My orders</Link>
            <Link href="/saved" className={item}>Saved pairs</Link>
            <Link href="/offers" className={item}>My offers</Link>
            <Link href="/dashboard" className={item}>Seller dashboard</Link>
            <Link href="/settings" className={item}>Settings</Link>
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
  const [menu, setMenu] = useState(false);
  const submit = (e: FormEvent) => { e.preventDefault(); setMenu(false); router.get('/search', { q }); };

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false); };
    document.addEventListener('keydown', esc);
    const off = router.on('navigate', () => setMenu(false));
    return () => { document.removeEventListener('keydown', esc); off(); };
  }, []);

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-5 sm:px-5 sm:py-4">
        <button onClick={() => setMenu(true)} aria-label="Open menu" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-lg lg:hidden">☰</button>
        <Link href="/" className="display shrink-0 whitespace-nowrap text-lg">Laced<span className="text-ember">Up</span></Link>

        <nav className="hidden gap-5 whitespace-nowrap text-xs lg:flex">
          {nav.map((n) => <Link key={n} href={navHref(n)} className="hover:text-ember">{n}</Link>)}
        </nav>

        <div className="ml-auto flex items-center gap-3 sm:gap-4">
          <form onSubmit={submit} className="hidden md:block">
            <input aria-label="Search models" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search models, brands" className="w-48 rounded-full bg-white px-4 py-2 text-xs" />
          </form>
          {auth.user && <Bell />}
          <Link href="/bag" className="shrink-0 whitespace-nowrap text-xs hover:text-ember">Bag</Link>
          {auth.user ? <UserMenu user={auth.user} /> : <Link href="/sign-in" className="shrink-0 whitespace-nowrap text-xs hover:text-ember">Sign in</Link>}
          <Link href="/sell" className="hidden shrink-0 whitespace-nowrap rounded-full bg-ember px-4 py-2 text-xs font-semibold text-white sm:block">Sell a pair</Link>
        </div>
      </header>

      {menu && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <button aria-label="Close menu" onClick={() => setMenu(false)} className="absolute inset-0 bg-black/40" />
          <aside role="dialog" aria-label="Menu" className="absolute left-0 top-0 h-full w-72 max-w-[85%] space-y-6 overflow-y-auto bg-paper p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="display text-lg">Laced<span className="text-ember">Up</span></span>
              <button onClick={() => setMenu(false)} aria-label="Close menu" className="grid h-10 w-10 place-items-center rounded-full bg-white">✕</button>
            </div>
            <form onSubmit={submit}>
              <input aria-label="Search models" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search models, brands" className="w-full rounded-full bg-white px-4 py-3 text-sm" />
            </form>
            <nav className="flex flex-col">
              {nav.map((n) => <Link key={n} href={navHref(n)} className="border-b border-stone py-3 text-base font-semibold">{n}</Link>)}
            </nav>
            <div className="flex flex-col gap-3">
              <Link href="/sell" className="rounded-full bg-ember py-3 text-center text-sm font-semibold text-white">Sell a pair</Link>
              {!auth.user && <Link href="/sign-in" className="rounded-full border border-ink/40 py-3 text-center text-sm">Sign in</Link>}
            </div>
          </aside>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-5">{children}</main>

      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 border-t border-stone px-4 py-6 text-xs text-black/60 sm:px-5">
        <span className="display text-sm text-ink">LacedUp</span>
        <span>Discover, buy, and sell sneakers.</span>
        <span>© 2026 Laced Up. All rights reserved.</span>
      </footer>
    </div>
  );
}