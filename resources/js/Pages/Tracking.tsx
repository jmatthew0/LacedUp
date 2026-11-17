import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { peso } from '@/lib/format';
import { OrderData } from '@/types';

const stages = [
  ['Order placed', 'Your order was received'],
  ['Verified by Laced Up', 'Authenticity check passed'],
  ['Shipped via J&T Express', 'Left our partner hub'],
  ['Out for delivery', 'The courier is on the way'],
  ['Delivered', 'Delivered to you'],
];
const headline = ['Order placed', 'Verified', 'In transit', 'Out for delivery', 'Delivered'];

export default function Tracking({ order }: { order: OrderData }) {
  const at = order.stage;
  const a = order.address;
  return (
    <AppLayout>
      <Head title={`Order ${order.code}`} />
      <section className="mt-6 rounded-3xl bg-ink p-8 text-white">
        <p className="text-xs text-ember">Order {order.code}</p>
        <h1 className="display mt-2 text-5xl">{headline[at]}</h1>
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
            <div key={i.name} className="flex gap-3">
              <img src={i.image} alt="" className="h-14 w-14 rounded-lg bg-stone object-contain" />
              <div><b className="text-sm">{i.name}</b><br />{i.size ? `US ${i.size} · ` : ''}{peso(i.price)}</div>
            </div>
          ))}
          <p className="border-t border-stone pt-3">Total <b>{peso(order.total)}</b> · {order.paymentMethod}</p>
          <p className="rounded-lg bg-paper p-3">Deliver to<br /><b>{a.name}</b><br />{a.address}, {a.city} {a.postal}<br />{order.shippingMethod}</p>
          <button disabled={at < 4} className="w-full rounded-full bg-ink py-2.5 font-semibold text-white disabled:opacity-30">Confirm delivery</button>
          <div className="flex gap-2">
            <button className="flex-1 rounded-full border border-ink/40 py-2">Open dispute</button>
            <button className="flex-1 rounded-full border border-ink/40 py-2">Request return</button>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}