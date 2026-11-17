import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { peso } from '@/lib/format';

interface Offer {
  id: number; status: string; size: string | null; amount: number; counter: number | null; final: number | null; sold: boolean;
  sneaker: { slug: string; name: string; image: string; price: number; seller: string };
}

const label: Record<string, string> = { pending: 'Waiting for seller', countered: 'Seller countered', accepted: 'Accepted', declined: 'Declined' };

export default function Offers({ offers }: { offers: Offer[] }) {
  const post = (url: string, data: object = {}) => router.post(url, data, { preserveScroll: true });
  return (
    <AppLayout>
      <Head title="My offers" />
      <h1 className="display mt-6 text-4xl">My offers</h1>
      <div className="mt-6 space-y-4">
        {offers.map((o) => (
          <article key={o.id} className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4">
            <img src={o.sneaker.image} alt="" className="h-16 w-16 rounded-xl bg-stone object-contain" />
            <div className="min-w-[180px] flex-1 text-sm">
              <Link href={`/sneakers/${o.sneaker.slug}`} className="font-bold hover:text-ember">{o.sneaker.name}</Link>
              <p className="text-xs text-black/60">{o.size ? `US ${o.size} · ` : ''}Asking {peso(o.sneaker.price)} · Sold by {o.sneaker.seller}</p>
              <p className="mt-1 text-xs">Your offer <b>{peso(o.amount)}</b>{o.counter ? <> · Counter <b>{peso(o.counter)}</b></> : null}</p>
            </div>
            <div className="flex flex-col items-end gap-2 text-xs">
              <span className="rounded-full bg-paper px-3 py-1">{o.sold && o.status !== 'accepted' ? 'Pair sold' : label[o.status]}</span>
              {o.status === 'countered' && !o.sold && (
                <div className="flex gap-2">
                  <button onClick={() => post(`/offers/${o.id}/reply`, { action: 'accept' })} className="rounded-full bg-ink px-4 py-1.5 font-semibold text-white">Accept {peso(o.counter!)}</button>
                  <button onClick={() => post(`/offers/${o.id}/reply`, { action: 'decline' })} className="rounded-full border border-ink/40 px-4 py-1.5">Decline</button>
                </div>
              )}
              {o.status === 'accepted' && !o.sold && (
                <button onClick={() => post(`/offers/${o.id}/checkout`)} className="rounded-full bg-ember px-4 py-1.5 font-semibold text-white">Buy at {peso(o.final!)}</button>
              )}
            </div>
          </article>
        ))}
        {!offers.length && <p className="rounded-2xl bg-white p-8 text-center text-sm">No offers yet. Open any pair and tap “Make an offer”. <Link href="/" className="text-ember underline">Browse pairs</Link></p>}
      </div>
    </AppLayout>
  );
}