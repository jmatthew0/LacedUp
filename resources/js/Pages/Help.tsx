import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import SupportModal from '@/Components/SupportModal';
import { faqs } from '@/data/faqs';
import AppLayout from '@/Layouts/AppLayout';

const topics = ['All topics', 'Orders', 'Selling', 'Payments', 'Shipping', 'Returns'];
const popular = ['Refund', 'Shipping', 'Authentication', 'Payout fee'];

export default function Help() {
  const [q, setQ] = useState('');
  const [topic, setTopic] = useState('All topics');
  const [open, setOpen] = useState<number | null>(null);
  const [modal, setModal] = useState<'message' | 'issue' | null>(null);

  const list = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return faqs.filter((f) => (topic === 'All topics' || f.topic === topic) && words.every((w) => `${f.q} ${f.a}`.toLowerCase().includes(w)));
  }, [q, topic]);

  return (
    <AppLayout>
      <Head title="Help center" />
      <section className="mt-4 rounded-3xl bg-ink p-6 text-white sm:p-10">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-ember">Help center</p>
        <h1 className="display mt-3 text-4xl sm:text-6xl">How can we help?</h1>
        <input value={q} onChange={(e) => { setQ(e.target.value); setOpen(null); }} placeholder="Search questions, for example refund or payout" aria-label="Search help"
          className="mt-6 w-full max-w-xl rounded-full bg-white px-5 py-3 text-sm text-ink" />
        <p className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/70">Popular:
          {popular.map((p) => <button key={p} onClick={() => { setQ(p); setTopic('All topics'); setOpen(null); }} className="rounded-full bg-white/10 px-3 py-1 text-white">{p}</button>)}
        </p>
      </section>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {topics.map((t) => (
          <button key={t} onClick={() => { setTopic(t); setOpen(null); }} aria-pressed={topic === t}
            className={`rounded-2xl p-4 text-left text-sm font-semibold ${topic === t ? 'bg-ink text-white' : 'bg-white hover:bg-stone'}`}>
            {t}<span className="mt-6 block text-[10px] font-normal opacity-60">{t === 'All topics' ? faqs.length : faqs.filter((f) => f.topic === t).length} answers</span>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section>
          <div className="mb-3 flex items-end justify-between"><h2 className="display text-2xl">Frequently asked</h2><span className="text-xs text-black/60">{list.length} answers</span></div>
          <div className="space-y-2">
            {list.map((f, i) => (
              <div key={f.q} className="rounded-2xl bg-white">
                <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold">
                  {f.q}<span aria-hidden="true">{open === i ? '−' : '+'}</span>
                </button>
                {open === i && <p className="px-5 pb-5 text-sm leading-relaxed text-black/70">{f.a}</p>}
              </div>
            ))}
            {!list.length && <p className="rounded-2xl bg-white p-8 text-center text-sm">No answers found. Try another word, or message support.</p>}
          </div>
        </section>

        <aside className="h-fit rounded-3xl bg-white p-6">
          <h2 className="display text-xl">Still need help?</h2>
          <p className="mt-2 text-xs text-black/60">Our support team usually replies within a few hours.</p>
          <button onClick={() => setModal('message')} className="mt-5 w-full rounded-full bg-ember py-3 text-sm font-semibold text-white">Message support</button>
          <a href="mailto:support@lacedup.ph" className="mt-3 block rounded-full border border-ink/40 py-3 text-center text-sm font-semibold">Email support</a>
          <div className="mt-5 space-y-2 border-t border-stone pt-4 text-xs text-black/70">
            <p>Mon to Sat, 9 AM to 8 PM</p>
            <button onClick={() => setModal('issue')} className="underline">Report an issue</button>
          </div>
        </aside>
      </div>

      <SupportModal type={modal} onClose={() => setModal(null)} />
    </AppLayout>
  );
}