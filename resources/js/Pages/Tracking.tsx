import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmModal from '@/Components/ConfirmModal';
import AppLayout from '@/Layouts/AppLayout';
import { peso } from '@/lib/format';
import { OrderData, OrderItem } from '@/types';
import CaseModal from '@/Components/CaseModal';

const stages = [
  ['Order placed', 'Your order was received'],
  ['Verified by Laced Up', 'Authenticity check passed'],
  ['Shipped via J&T Express', 'Left our partner hub'],
  ['Out for delivery', 'The courier is on the way'],
  ['Delivered', 'Delivered to you'],
];
const headline = ['Order placed', 'Verified', 'In transit', 'Out for delivery', 'Delivered'];

function ReviewBox({ code, item }: { code: string; item: OrderItem }) {
  const form = useForm({ rating: 0, comment: '' });

  if (item.review) {
    return (
      <p className="rounded-lg bg-paper p-3">
        You rated {item.seller} <b className="text-ember">{'★'.repeat(item.review.rating)}</b>
        {item.review.comment ? ` · “${item.review.comment}”` : ''}
      </p>
    );
  }

  return (
    <div className="space-y-2 rounded-lg bg-paper p-3">
      <p className="font-semibold">Rate {item.seller} for {item.name}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" aria-label={`${n} star${n > 1 ? 's' : ''}`} onClick={() => form.setData('rating', n)}
            className={`text-2xl leading-none ${n <= form.data.rating ? 'text-ember' : 'text-black/25'}`}>★</button>
        ))}
      </div>
      <textarea value={form.data.comment} onChange={(e) => form.setData('comment', e.target.value)} maxLength={500} rows={2}
        placeholder="How was the pair and the shipping? (optional)" aria-label="Review comment"
        className="w-full rounded-xl bg-white px-3 py-2 text-xs" />
      {form.errors.rating && <p className="text-ember">{form.errors.rating}</p>}
      <button disabled={!form.data.rating || form.processing} onClick={() => form.post(`/orders/${code}/items/${item.id}/review`, { preserveScroll: true })}
        className="rounded-full bg-ink px-4 py-1.5 font-semibold text-white disabled:opacity-40">Submit review</button>
    </div>
  );
}

export default function Tracking({ order }: { order: OrderData }) {
  const at = order.stage;
  const a = order.address;
  const [confirming, setConfirming] = useState(false);
  const [caseType, setCaseType] = useState<'dispute' | 'return' | null>(null);

  return (
    <AppLayout>
      <Head title={`Order ${order.code}`} />
      <section className="mt-6 rounded-3xl bg-ink p-5 text-white sm:p-8">
        <p className="text-xs text-ember">Order {order.code}</p>
        <h1 className="display mt-2 text-3xl sm:text-5xl">{headline[at]}</h1>
        <ol className="my-8 grid grid-cols-5 gap-2 text-center text-[11px]">
          {stages.map(([n], i) => (
            <li key={n}>
              <span className={`mx-auto mb-2 grid h-9 w-9 place-items-center rounded-full ${i <= at ? 'bg-ember' : 'bg-white/10'}`}>{i <= at ? '✓' : ''}</span>{n}
            </li>
          ))}
        </ol>
        <button disabled={at === 4} onClick={() => router.post(`/orders/${order.code}/advance`, {}, { preserveScroll: true })} className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink disabled:opacity-40">
          Simulate next update
        </button>
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-[1.6fr_1fr]">
        <div>
          <h2 className="display mb-3 text-xl">Tracking history</h2>
          <ol className="space-y-3">
            {stages.map(([n, d], i) => ({ n, d, i })).reverse().map(({ n, d, i }) => (
              <li key={n} className={`rounded-xl bg-white p-4 text-sm ${i > at ? 'opacity-50' : ''}`}>
                <b>{n}</b><p className="text-xs text-black/60">{i === 0 ? `${d} · ${order.placedAt}` : d}</p>
              </li>
            ))}
          </ol>
        </div>

        <aside className="h-fit space-y-3 rounded-2xl bg-white p-5 text-xs">
          {order.items.map((i) => (
            <div key={i.id} className="flex gap-3">
              <img src={i.image} alt="" className="h-14 w-14 rounded-lg bg-stone object-contain" />
              <div><b className="text-sm">{i.name}</b><br />{i.size ? `US ${i.size} · ` : ''}{peso(i.price)}</div>
            </div>
          ))}
          <p className="border-t border-stone pt-3">Total <b>{peso(order.total)}</b> · {order.paymentMethod}</p>
          <p className="rounded-lg bg-paper p-3">Deliver to<br /><b>{a.name}</b><br />{a.address}, {a.city} {a.postal}<br />{order.shippingMethod}</p>

          <button disabled={at < 4 || order.confirmed} onClick={() => setConfirming(true)}
            className="w-full rounded-full bg-ink py-2.5 font-semibold text-white disabled:opacity-30">
            {order.confirmed ? 'Delivery confirmed' : 'Confirm delivery'}
          </button>
          {!order.confirmed && <p className="text-black/50">Confirming tells us the pair arrived as described and releases the payment to the seller.</p>}

          {order.confirmed && order.items.map((i) => <ReviewBox key={i.id} code={order.code} item={i} />)}

          {order.disputes.map((d) => (
  <div key={d.id} className="rounded-lg bg-paper p-3">
    <p className="flex justify-between gap-2">
      <b>{d.type === 'dispute' ? 'Dispute' : 'Return request'} · {d.reason}</b>
      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${d.status === 'open' ? 'bg-ink text-white' : d.status === 'approved' ? 'bg-green-600 text-white' : 'border border-ink'}`}>
        {d.status === 'open' ? 'Waiting for seller' : d.status === 'approved' ? 'Approved' : 'Declined'}
      </span>
    </p>
    <p className="text-black/50">Sent {d.date}</p>
    {d.response && <p className="mt-1">Seller: “{d.response}”</p>}
  </div>
))}
<div className="flex gap-2">
  <button disabled={!order.canDispute} onClick={() => setCaseType('dispute')} className="flex-1 rounded-full border border-ink/40 py-2 disabled:opacity-30">Open dispute</button>
  <button disabled={!order.canReturn} onClick={() => setCaseType('return')} className="flex-1 rounded-full border border-ink/40 py-2 disabled:opacity-30">Request return</button>
</div>
{(order.disputeNote || order.returnNote) && (
  <p className="text-black/50">{[order.disputeNote, order.returnNote].filter(Boolean).join(' ')}</p>
)}
        </aside>
      </div>
      <ConfirmModal open={confirming} title="Confirm delivery?" confirmLabel="Yes, it arrived"
        message="Confirming tells us the pair arrived as described and releases the payment to the seller. You can't undo this."
        onClose={() => setConfirming(false)}
        onConfirm={() => router.post(`/orders/${order.code}/confirm`, {}, { preserveScroll: true, onSuccess: () => setConfirming(false) })} />
        <CaseModal code={order.code} type={caseType} onClose={() => setCaseType(null)} />
    </AppLayout>
  );
}