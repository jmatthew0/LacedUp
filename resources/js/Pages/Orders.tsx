import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { peso } from '@/lib/format';
import { Sneaker } from '@/types';

interface Order { id: string; status: string; note: string; total: number; seller: string; item: Sneaker; }
const tabs = ['All', 'To pay', 'To ship', 'In transit', 'Delivered', 'Returns'];

export default function Orders({ orders }: { orders: Order[] }) {
  const [tab, setTab] = useState('All');
  const shown = orders.filter((o) => tab === 'All' || o.status === tab);
  return (
    <AppLayout>
      <Head title="My orders" />
      <h1 className="display mt-6 text-4xl">My orders</h1>
      <div className="my-4 flex flex-wrap gap-2">{tabs.map((t) => (
        <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-1.5 text-xs ${tab === t ? 'bg-ink text-white' : 'bg-white'}`}>{t} {t === 'All' ? orders.length : orders.filter((o) => o.status === t).length}</button>))}</div>
      <div className="space-y-4">{shown.map((o) => (
        <article key={o.id} className="rounded-2xl bg-white p-4">
          <p className="flex justify-between border-b border-stone pb-2 text-xs"><b>Order {o.id}</b><span className="rounded-full bg-paper px-2.5 py-0.5">{o.status}</span></p>
          <div className="flex items-center gap-4 pt-3"><img src={o.item.image} alt="" className="h-16 w-16 rounded-xl bg-stone object-contain" />
            <div className="flex-1 text-sm"><b>{o.item.name}</b><p className="text-xs text-black/60">Sold by {o.seller}</p></div>
            <div className="text-right"><b>{peso(o.total)}</b><p className="text-[11px] text-black/50">{o.note}</p>
              <Link href={`/orders/${o.id}`} className="mt-2 inline-block rounded-full border border-ink/40 px-4 py-1.5 text-xs">{o.status === 'To pay' ? 'Pay now' : 'Track order'}</Link></div></div>
        </article>))}
        {!shown.length && <p className="rounded-2xl bg-white p-8 text-center text-sm">No orders in “{tab}”.</p>}</div>
    </AppLayout>
  );
}