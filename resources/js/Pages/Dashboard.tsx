import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmModal from '@/Components/ConfirmModal';
import Modal from '@/Components/Modal';
import AppLayout from '@/Layouts/AppLayout';
import { peso } from '@/lib/format';

interface Row { slug: string; name: string; image: string; sizes: number[]; price: number; status: string }
interface Offer { id: number; name: string; size: string | null; asking: number; amount: number; buyer: string }
interface Props {
  seller: { handle: string; name: string } | null;
  stats: { earnings: number; active: number; sales: number; rating: number } | null;
  listings: Row[];
  toShip: { name: string; size: string | null; code: string }[];
  offers: Offer[];
}

function OfferRow({ o }: { o: Offer }) {
  const [counter, setCounter] = useState(false);
  const [value, setValue] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const send = (data: Record<string, string | number>, done?: () => void) => router.post(`/offers/${o.id}/respond`, data, {
    preserveScroll: true,
    onStart: () => { setBusy(true); setError(''); },
    onFinish: () => setBusy(false),
    onError: (e) => setError(e.counter_amount ?? 'Something went wrong.'),
    onSuccess: done,
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone py-3 text-sm">
      <span>{o.name}{o.size ? ` · US ${o.size}` : ''}<span className="ml-2 text-xs text-black/60">from {o.buyer} · asking {peso(o.asking)}</span></span>
      <span className="flex items-center gap-2">
        <b>{peso(o.amount)}</b>
        <button onClick={() => send({ action: 'accept' })} className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">Accept</button>
        <button onClick={() => setCounter(true)} className="rounded-full border border-ink/30 px-3 py-1 text-xs">Counter</button>
        <button onClick={() => send({ action: 'decline' })} className="rounded-full border border-ink/30 px-3 py-1 text-xs">Decline</button>
      </span>

      <Modal open={counter} onClose={() => { setCounter(false); setError(''); }} title="Counter offer">
        <p className="text-sm text-black/70">{o.buyer} offered <b>{peso(o.amount)}</b> on {o.name}. Asking price is {peso(o.asking)}.</p>
        <label className="mt-4 block text-xs font-semibold">Your counter (₱)
          <input type="number" autoFocus value={value || ''} onChange={(e) => setValue(+e.target.value)} className="mt-1 w-full rounded-full bg-paper px-4 py-3 text-sm font-normal" />
        </label>
        <p className="mt-1 px-2 text-[11px] text-black/50">Must be above {peso(o.amount)} and below {peso(o.asking)}</p>
        {error && <p className="mt-3 text-xs text-ember">{error}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={() => setCounter(false)} className="rounded-full border border-ink/40 px-5 py-2.5 text-sm">Cancel</button>
          <button disabled={!value || busy} onClick={() => send({ action: 'counter', counter_amount: value }, () => setCounter(false))} className="rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40">
            {busy ? 'Sending' : 'Send counter'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default function Dashboard({ seller, stats, listings, toShip, offers }: Props) {
  const [del, setDel] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);

  if (!seller || !stats) {
    return (
      <AppLayout>
        <Head title="Seller dashboard" />
        <div className="mt-10 rounded-3xl bg-white p-10 text-center">
          <h1 className="display text-3xl">Start selling</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm text-black/60">List your first pair and your seller profile is created automatically.</p>
          <Link href="/sell" className="mt-6 inline-block rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white">List a pair</Link>
        </div>
      </AppLayout>
    );
  }

  const cards = [['Earnings this month', peso(stats.earnings)], ['Active listings', String(stats.active)], ['Pending offers', String(offers.length)], ['Pairs sold', String(stats.sales)], ['Rating', `${stats.rating} ★`]];

  return (
    <AppLayout>
      <Head title="Seller dashboard" />
      <div className="mt-6 flex items-center justify-between">
        <h1 className="display text-4xl">Hello, {seller.name.split(' ')[0]}</h1>
        <div className="flex gap-2">
          <Link href={`/sellers/${seller.handle}`} className="rounded-full border border-ink/40 px-4 py-2 text-xs">View profile</Link>
          <Link href="/sell" className="rounded-full bg-ember px-4 py-2 text-xs font-semibold text-white">New listing</Link>
        </div>
      </div>

      <div className="my-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {cards.map(([l, v]) => <div key={l} className="rounded-2xl bg-white p-4"><p className="text-[10px] text-black/50">{l}</p><p className="display text-xl">{v}</p></div>)}
      </div>

      <section className="rounded-2xl bg-white p-5">
        <h2 className="display mb-3 text-base">Pending offers</h2>
        {offers.length ? offers.map((o) => <OfferRow key={o.id} o={o} />) : <p className="border-t border-stone pt-3 text-sm text-black/60">No offers waiting.</p>}
      </section>

      <section className="mt-6 rounded-2xl bg-white p-5">
        <h2 className="display mb-3 text-base">Orders to ship</h2>
        {toShip.length ? toShip.map((o) => (
          <div key={o.code + o.name} className="flex items-center justify-between border-t border-stone py-3 text-sm">
            <span>{o.name}{o.size ? ` · US ${o.size}` : ''}<span className="ml-2 text-xs text-black/60">Order {o.code}</span></span>
            <button onClick={() => router.post(`/dashboard/orders/${o.code}/ship`, {}, { preserveScroll: true })} className="rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-white">Mark shipped</button>
          </div>
        )) : <p className="border-t border-stone pt-3 text-sm text-black/60">Nothing to ship right now.</p>}
      </section>

      <section className="mt-6 overflow-x-auto rounded-2xl bg-white p-5">
        <h2 className="display mb-3 text-base">Listings</h2>
        {listings.length ? (
          <table className="w-full text-left text-xs">
            <thead className="text-black/50"><tr><th>Pair</th><th>Size</th><th>Price</th><th>Status</th><th /></tr></thead>
            <tbody>
              {listings.map((s) => (
                <tr key={s.slug} className="border-t border-stone">
                  <td className="flex items-center gap-3 py-3 font-semibold"><img src={s.image} alt="" className="h-10 w-10 rounded-lg bg-stone object-contain" />{s.name}</td>
                  <td>{s.sizes.join(' · ')}</td><td>{peso(s.price)}</td>
                  <td><span className={`rounded-full px-2.5 py-0.5 ${s.status === 'Sold' ? 'bg-paper' : 'bg-ink text-white'}`}>{s.status}</span></td>
                  <td className="text-right">{s.status === 'Active' && <button onClick={() => setDel(s)} className="underline">Delete</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="text-sm text-black/60">No listings yet.</p>}
      </section>

      <ConfirmModal open={!!del} danger busy={deleting} title={`Delete ${del?.name ?? 'listing'}?`} confirmLabel="Delete listing"
        message="This removes the pair from the marketplace. It can't be undone."
        onClose={() => setDel(null)}
        onConfirm={() => del && router.delete(`/listings/${del.slug}`, {
          preserveScroll: true,
          onStart: () => setDeleting(true),
          onFinish: () => setDeleting(false),
          onSuccess: () => setDel(null),
        })} />
    </AppLayout>
  );
}