import { Link, router, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import AppLayout from '@/Layouts/AppLayout';

interface Shared { auth?: { user: { name: string; email: string; avatar?: string | null } | null }; saved?: string[]; [key: string]: unknown }

const links = [
  ['messages', '/messages', 'Messages'],
  ['saved', '/saved', 'Saved pairs'],
  ['orders', '/orders', 'My orders'],
  ['offers', '/offers', 'My offers'],
  ['settings', '/settings', 'Account settings'],
] as const;

export default function AccountLayout({ active, children }: PropsWithChildren<{ active: string }>) {
  const { auth, saved = [] } = usePage<Shared>().props;
  const user = auth?.user;
  const initials = (user?.name ?? '').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <AppLayout>
      <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
        <aside className="no-print h-fit rounded-2xl bg-white p-3">
          <div className="hidden items-center gap-3 px-2 pb-3 md:flex">
            <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-ink text-xs font-semibold text-white">
              {user?.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : initials}
            </span>
            <div className="min-w-0"><p className="truncate text-sm font-bold">{user?.name}</p><p className="truncate text-[11px] text-black/50">{user?.email}</p></div>
          </div>
          <nav className="flex gap-1 overflow-x-auto md:flex-col">
            {links.map(([key, href, label]) => (
              <Link key={key} href={href} className={`flex items-center justify-between whitespace-nowrap rounded-xl px-3 py-2.5 text-sm ${active === key ? 'bg-ink font-semibold text-white' : 'hover:bg-paper'}`}>
                {label}{key === 'saved' && <span className="ml-3 text-xs opacity-70">{saved.length}</span>}
              </Link>
            ))}
            <button onClick={() => router.post('/sign-out')} className="whitespace-nowrap rounded-xl px-3 py-2.5 text-left text-sm text-black/60 hover:bg-paper md:mt-1 md:border-t md:border-stone">Sign out</button>
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </AppLayout>
  );
}