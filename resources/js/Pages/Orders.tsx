import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { peso } from '@/lib/format';
import { OrderData } from '@/types';

const tabs = ['All', 'To ship', 'In transit', 'Delivered'];

export default function Orders({ orders }: { orders: OrderData[] }) {
  const [tab, setTab] = useState('All');
  const shown = orders.filter((o) => tab === 'All' || o.status === tab);
  return (
    <AppLayout>
      <Head title="My orders" />
      <h1 className="display mt-6 text-4xl">My orders</h1>
      <div className="my-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-1.5 text-xs ${tab === t ? 'bg-ink text-white' : 'bg-white'}`}>
            {t} {t === 'All' ? orders.length : orders.filter((o) => o.status === t).length}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {shown.map((o) => (
          <article key={o.code} className="rounded-2xl bg-white p-4">
            <p className="flex justify-between border-b border-stone pb-2 text-xs"><b>Order {o.code} · {o.placedAt}</b><span className="rounded-full bg-paper px-2.5 py-0.5">{o.status}</span></p>
            <div className="space-y-3 pt-3">
              {o.items.map((i) => (
                <div key={i.name} className="flex items-center gap-4">
                  <img src={i.image} alt="" className="h-16 w-16 rounded-xl bg-stone object-contain" />
                  <div className="flex-1 text-sm"><b>{i.name}</b><p className="text-xs text-black/60">{i.size ? `US ${i.size} · ` : ''}Sold by {i.seller}</p></div>
                  <b className="text-sm">{peso(i.price)}</b>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-stone pt-3">
              <p className="text-sm">Total <b>{peso(o.total)}</b></p>
              <Link href={`/orders/${o.code}`} className="rounded-full border border-ink/40 px-4 py-1.5 text-xs">Track order</Link>
            </div>
          </article>
        ))}
        {!shown.length && (
          <p className="rounded-2xl bg-white p-8 text-center text-sm">
            {orders.length ? `No orders in “${tab}”.` : 'No orders yet. '}
            {!orders.length && <Link href="/" className="text-ember underline">Browse pairs</Link>}
          </p>
        )}
      </div>
    </AppLayout>
  );
}