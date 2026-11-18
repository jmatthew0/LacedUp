import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AccountLayout from '@/Layouts/AccountLayout';
import { peso } from '@/lib/format';

interface Offer {
  id: number; status: string; size: string | null; amount: number; counter: number | null; final: number | null; sold: boolean;
  sneaker: { slug: string; name: string; image: string; price: number; seller: string; condition: string };
}

const tabs = ['All', 'Active', 'Countered', 'Accepted', 'Declined'];
const key: Record<string, string> = { Active: 'pending', Countered: 'countered', Accepted: 'accepted', Declined: 'declined' };
const badge: Record<string, string> = { pending: 'bg-ink text-white', countered: 'bg-ember text-white', accepted: 'bg-green-600 text-white', declined: 'border border-ink' };
const badgeText: Record<string, string> = { pending: 'Active', countered: 'Countered', accepted: 'Accepted', declined: 'Declined' };

function Card({ o }: { o: Offer }) {
  const [raising, setRaising] = useState(false);
  const [value, setValue] = useState(0);
  const [error, setError] = useState('');
  const post = (url: string, data: Record<string, string | number> = {}) => router.post(url, data, { preserveScroll: true });
  const btn = 'rounded-full px-4 py-2 text-xs font-semibold';
  const dark = `${btn} bg-ink text-white`;
  const line = `${btn} border border-ink/40`;
  const ghost = 'px-3 py-2 text-xs text-black/60 hover:text-ink';

  return (
    <article className="rounded-2xl bg-white p-5">
      <div className="flex gap-4">
        <img src={o.sneaker.image} alt="" className="h-20 w-20 shrink-0 rounded-xl bg-stone object-contain" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link href={`/sneakers/${o.sneaker.slug}`} className="text-sm font-bold hover:text-ember">{o.sneaker.name}{o.size ? ` · US ${o.size}` : ''}</Link>
              <p className="text-xs text-black/60">{o.sneaker.condition} · from {o.sneaker.seller}</p>
            </div>
            <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${o.sold && o.status !== 'accepted' ? 'border border-ink' : badge[o.status]}`}>{o.sold && o.status !== 'accepted' ? 'Pair sold' : badgeText[o.status]}</span>
          </div>
          <p className="mt-2 flex items-baseline gap-3 text-xs text-black/60">
            <s>{peso(o.sneaker.price)}</s>Your offer <b className="display text-xl text-ink">{peso(o.amount)}</b>
          </p>
          {o.status === 'countered' && o.counter && (
            <p className="mt-2 inline-block rounded-xl border border-ember bg-ember/5 px-4 py-2 text-xs text-black/60">Seller counter<br /><b className="display text-xl text-ink">{peso(o.counter)}</b></p>
          )}
          {o.status === 'accepted' && <p className="mt-2 text-xs font-semibold text-green-700">Offer accepted at {peso(o.final ?? o.amount)}. Buy it before someone else does.</p>}
          {o.status === 'declined' && <p className="mt-2 text-xs text-black/60">Seller declined. Try a higher offer.</p>}
        </div>
      </div>

      {raising && (
        <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
          <input type="number" placeholder={`Above ${o.amount}`} value={value || ''} onChange={(e) => setValue(+e.target.value)} className="w-36 rounded-full bg-paper px-4 py-2 text-xs" />
          <button disabled={!value} onClick={() => router.patch(`/offers/${o.id}/raise`, { amount: value }, { preserveScroll: true, onError: (e) => setError(e.amount ?? ''), onSuccess: () => setRaising(false) })} className={`${dark} disabled:opacity-40`}>Send raise</button>
        </div>
      )}
      {error && <p className="mt-1 text-right text-xs text-ember">{error}</p>}

      {!(o.sold && o.status !== 'accepted') && (
        <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-stone pt-4">
          {o.status === 'pending' && (<>
            <button onClick={() => setRaising(!raising)} className={line}>Raise offer</button>
            <button onClick={() => confirm('Cancel this offer?') && router.delete(`/offers/${o.id}`, { preserveScroll: true })} className={ghost}>Cancel offer</button>
          </>)}
          {o.status === 'countered' && (<>
            <button onClick={() => post(`/offers/${o.id}/reply`, { action: 'decline' })} className={ghost}>Decline counter</button>
            <button onClick={() => post(`/offers/${o.id}/reply`, { action: 'accept' })} className={dark}>Accept counter</button>
          </>)}
          {o.status === 'accepted' && (<>
            <Link href={`/sneakers/${o.sneaker.slug}`} className={line}>View listing</Link>
            <button onClick={() => post(`/offers/${o.id}/checkout`)} className={`${btn} bg-ember text-white`}>Pay now</button>
          </>)}
          {o.status === 'declined' && (<>
            <button onClick={() => router.delete(`/offers/${o.id}`, { preserveScroll: true })} className={ghost}>Dismiss</button>
            <Link href={`/sneakers/${o.sneaker.slug}`} className={dark}>Make new offer</Link>
          </>)}
        </div>
      )}
    </article>
  );
}

export default function Offers({ offers }: { offers: Offer[] }) {
  const [tab, setTab] = useState('All');
  const count = (t: string) => offers.filter((o) => o.status === key[t]).length;
  const shown = offers.filter((o) => tab === 'All' || o.status === key[tab]);

  return (
    <AccountLayout active="offers">
      <Head title="My offers" />
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ember">Buying</p>
      <h1 className="display text-4xl">My offers</h1>
      <p className="mt-1 text-xs text-black/60">Track every offer you have sent and respond to counters.</p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tabs.slice(1).map((t) => <div key={t} className="rounded-2xl bg-white p-4"><p className="text-[10px] uppercase text-black/50">{t}</p><p className="display text-2xl">{count(t)}</p></div>)}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_240px]">
        <div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${tab === t ? 'bg-ink text-white' : 'bg-white'}`}>{t}</button>)}
          </div>
          <div className="mt-4 space-y-4">
            {shown.map((o) => <Card key={o.id} o={o} />)}
            {!shown.length && <p className="rounded-2xl bg-white p-8 text-center text-sm">{offers.length ? `No ${tab.toLowerCase()} offers.` : 'No offers yet. Open any pair and tap “Make an offer”.'} <Link href="/" className="text-ember underline">Browse pairs</Link></p>}
          </div>
        </div>

        <aside className="h-fit rounded-2xl bg-ink p-5 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ember">How offers work</p>
          <ol className="mt-4 space-y-4 text-xs">
            {[['Make an offer', 'Pick a price under the asking price.'], ['Seller responds', 'They can accept, counter, or decline.'], ['Buy at the agreed price', 'Accepted offers go straight to checkout.']].map(([t, d], i) => (
              <li key={t} className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-[11px] font-bold text-ink">{i + 1}</span><span><b className="text-sm">{t}</b><br /><span className="text-white/70">{d}</span></span></li>
            ))}
          </ol>
        </aside>
      </div>
    </AccountLayout>
  );
}