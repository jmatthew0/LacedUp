import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { peso } from '@/lib/format';

interface Thread { id: number; name: string; last: string; time: string; unread: boolean; role: 'buying' | 'selling' }
interface Msg { id: number; mine: boolean; body: string; kind: string; time: string; day: string }
interface Active {
  id: number; name: string; handle: string | null; role: 'buying' | 'selling';
  sneaker: { slug: string; name: string; image: string; price: number; condition: string; size: number | null } | null;
  messages: Msg[];
}

const tabs = ['All', 'Buying', 'Selling', 'Unread'];
const quick = ['Is it authentic?', 'Can you ship today?', 'Send more photos'];

function Avatar({ name, className = 'h-10 w-10' }: { name: string; className?: string }) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return <span className={`grid shrink-0 place-items-center rounded-full bg-ink text-xs font-semibold text-white ${className}`}>{initials}</span>;
}

export default function Messages({ threads, active }: { threads: Thread[]; active: Active | null }) {
  const [tab, setTab] = useState('All');
  const [q, setQ] = useState('');
  const box = useRef<HTMLDivElement>(null);
  const form = useForm({ body: '' });

  useEffect(() => {
    const t = setInterval(() => { if (!document.hidden) router.reload({ only: ['threads', 'active'] }); }, 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight; }, [active?.id, active?.messages.length]);

  const shown = useMemo(() => threads.filter((t) =>
    (tab === 'All' || (tab === 'Unread' ? t.unread : t.role === tab.toLowerCase())) && t.name.toLowerCase().includes(q.toLowerCase())), [threads, tab, q]);

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!active || !form.data.body.trim()) return;
    form.post(`/messages/${active.id}`, { preserveScroll: true, onSuccess: () => form.reset() });
  };
  const sendQuick = (body: string) => active && router.post(`/messages/${active.id}`, { body }, { preserveScroll: true });

  return (
    <AppLayout>
      <Head title="Messages" />
      <p className="mt-6 text-[10px] font-semibold uppercase tracking-wider text-ember">Inbox</p>
      <h1 className="display text-4xl sm:text-5xl">Messages</h1>

      <div className="mt-6 grid overflow-hidden rounded-3xl bg-white md:h-[640px] md:grid-cols-[320px_1fr]">
        <aside className="flex max-h-72 flex-col border-b border-stone md:max-h-none md:border-b-0 md:border-r">
          <div className="space-y-3 p-4">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search conversations" aria-label="Search conversations" className="w-full rounded-full border border-stone px-4 py-2 text-xs" />
            <div className="flex flex-wrap gap-2">
              {tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={`rounded-full px-3 py-1 text-xs font-semibold ${tab === t ? 'bg-ink text-white' : ''}`}>{t}</button>)}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            {shown.map((t) => (
              <Link key={t.id} href={`/messages/${t.id}`} preserveScroll className={`flex items-center gap-3 rounded-2xl px-3 py-3 ${active?.id === t.id ? 'bg-paper' : 'hover:bg-paper/60'}`}>
                <Avatar name={t.name} className="h-11 w-11" />
                <span className="min-w-0 flex-1">
                  <span className="flex justify-between gap-2"><b className="truncate text-sm">{t.name}</b><span className="shrink-0 text-[11px] text-black/50">{t.time}</span></span>
                  <span className="flex items-center justify-between gap-2"><span className="truncate text-xs text-black/60">{t.last || 'No messages yet'}</span>{t.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-ember" aria-label="Unread" />}</span>
                </span>
              </Link>
            ))}
            {!shown.length && <p className="px-3 py-8 text-center text-xs text-black/60">{threads.length ? 'No conversations match.' : 'No conversations yet. Open a pair and tap “Message seller”.'}</p>}
          </div>
        </aside>

        {active ? (
          <section className="flex min-h-[420px] flex-col">
            <header className="flex items-center gap-3 border-b border-stone px-5 py-3">
              <Avatar name={active.name} className="h-11 w-11" />
              <div className="flex-1">
                <p className="text-sm font-bold">{active.name}</p>
                <p className="text-[11px] text-black/60">{active.role === 'buying' ? 'Seller' : 'Buyer'}{active.handle ? ` · ${active.handle}` : ''}</p>
              </div>
              {active.handle && active.role === 'buying' && <Link href={`/sellers/${active.handle}`} className="text-xs underline">View profile</Link>}
            </header>

            <div ref={box} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {active.sneaker && (
                <div className="flex items-center gap-4 rounded-2xl bg-paper p-3">
                  <img src={active.sneaker.image} alt="" className="h-14 w-14 rounded-xl bg-stone object-contain" />
                  <div className="flex-1 text-sm"><b>{active.sneaker.name}</b><p className="text-xs text-black/60">{active.sneaker.size ? `US ${active.sneaker.size} · ` : ''}{active.sneaker.condition} · {peso(active.sneaker.price)}</p></div>
                  <Link href={`/sneakers/${active.sneaker.slug}`} className="rounded-full border border-ink/40 px-4 py-1.5 text-xs font-semibold">View listing</Link>
                </div>
              )}
              {active.messages.map((m, i) => (
                <div key={m.id}>
                  {(i === 0 || active.messages[i - 1].day !== m.day) && <p className="my-3 text-center text-[10px] font-semibold uppercase tracking-wider text-black/50">{m.day}</p>}
                  {m.kind === 'system'
                    ? <p className="text-center"><span className="rounded-full bg-stone px-3 py-1 text-[11px] font-semibold">{m.body}</span></p>
                    : (
                      <div className={`flex flex-col ${m.mine ? 'items-end' : 'items-start'}`}>
                        <p className={`max-w-[80%] whitespace-pre-wrap break-words rounded-2xl border px-4 py-2.5 text-sm ${m.mine ? 'border-ink bg-ink text-white' : 'border-stone bg-white'}`}>{m.body}</p>
                        <span className="mt-1 text-[10px] text-black/50">{m.time}</span>
                      </div>
                    )}
                </div>
              ))}
              {!active.messages.length && <p className="py-10 text-center text-sm text-black/60">Say hi to {active.name.split(' ')[0]}.</p>}
            </div>

            <footer className="border-t border-stone p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {quick.map((c) => <button key={c} onClick={() => sendQuick(c)} className="rounded-full border border-stone px-3 py-1.5 text-xs font-semibold hover:bg-paper">{c}</button>)}
              </div>
              <form onSubmit={send} className="flex items-center gap-3">
                <input value={form.data.body} onChange={(e) => form.setData('body', e.target.value)} maxLength={1000} placeholder="Write a message" aria-label="Write a message" className="flex-1 rounded-full border border-stone px-4 py-3 text-sm" />
                <button disabled={form.processing || !form.data.body.trim()} className="rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white disabled:opacity-40">Send</button>
              </form>
            </footer>
          </section>
        ) : (
          <section className="grid place-items-center p-10 text-center text-sm text-black/60">Select a conversation, or open a pair and tap “Message seller”.</section>
        )}
      </div>
    </AppLayout>
  );
}