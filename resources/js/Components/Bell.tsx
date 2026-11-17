import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

interface Item { id: string; message: string; read: boolean; time: string }
interface Shared { notifications: { unread: number; items: Item[] }; [key: string]: unknown }

export default function Bell() {
  const { notifications } = usePage<Shared>().props;
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, []);

  return (
    <div ref={box} className="relative">
      <button onClick={() => setOpen(!open)} aria-haspopup="menu" aria-expanded={open}
        aria-label={`Notifications${notifications.unread ? `, ${notifications.unread} unread` : ''}`}
        className="relative grid h-9 w-9 place-items-center rounded-full bg-white text-base">
        🔔
        {notifications.unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ember px-1 text-[10px] font-bold text-white">
            {notifications.unread > 9 ? '9+' : notifications.unread}
          </span>
        )}
      </button>

      {open && (
        <div role="menu" className="absolute right-0 z-20 mt-2 w-80 max-w-[85vw] rounded-2xl bg-white p-2 shadow-lg ring-1 ring-black/5">
          <div className="flex items-center justify-between px-3 pb-2 pt-1">
            <p className="text-sm font-semibold">Notifications</p>
            {notifications.unread > 0 && (
              <button onClick={() => router.post('/notifications/read-all', {}, { preserveScroll: true })} className="text-xs underline">Mark all read</button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.items.map((n) => (
              <Link key={n.id} href={`/notifications/${n.id}`} onClick={() => setOpen(false)} className="flex gap-2 rounded-xl px-3 py-2.5 hover:bg-paper">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-transparent' : 'bg-ember'}`} />
                <span className="text-sm">{n.message}<span className="block text-[11px] text-black/50">{n.time}</span></span>
              </Link>
            ))}
            {!notifications.items.length && <p className="px-3 py-6 text-center text-sm text-black/60">Nothing yet. Offers, orders and reviews show up here.</p>}
          </div>
        </div>
      )}
    </div>
  );
}