import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { peso } from '@/lib/format';
import { Sneaker } from '@/types';

const stages = [['Order placed', 'Monday, 2:08 PM'], ['Verified by Laced Up', 'Yesterday, 4:15 PM'], ['Shipped via J&T Express', 'Today, 10:42 AM'], ['Out for delivery', 'Courier is on the way'], ['Delivered', 'Thursday, 3 PM']];

export default function Tracking({ id, item }: { id: string; item: Sneaker }) {
  const [at, setAt] = useState(2);
  return (
    <AppLayout>
      <Head title={`Order ${id}`} />
      <section className="mt-6 rounded-3xl bg-ink p-8 text-white">
        <p className="text-xs text-ember">Order {id}</p>
        <h1 className="display mt-2 text-5xl">{at === 4 ? 'Delivered' : at === 3 ? 'Out for delivery' : at === 2 ? 'In transit' : 'Processing'}</h1>
        <ol className="my-8 grid grid-cols-5 gap-2 text-center text-[11px]">{stages.map(([n], i) => (
          <li key={n}><span className={`mx-auto mb-2 grid h-9 w-9 place-items-center rounded-full ${i <= at ? 'bg-ember' : 'bg-white/10'}`}>{i <= at ? '✓' : ''}</span>{n}</li>))}</ol>
        <button disabled={at === 4} onClick={() => setAt(at + 1)} className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink disabled:opacity-40">Simulate next update</button>
      </section>
      <div className="mt-6 grid gap-6 md:grid-cols-[1.6fr_1fr]">
        <div><h2 className="display mb-3 text-xl">Tracking history</h2><ol className="space-y-3">
          {[...stages].map(([n, d], i) => ({ n, d, i })).reverse().map(({ n, d, i }) => (
            <li key={n} className={`rounded-xl bg-white p-4 text-sm ${i > at ? 'opacity-50' : ''}`}><b>{n}</b><p className="text-xs text-black/60">{d}</p></li>))}</ol></div>
        <aside className="h-fit space-y-3 rounded-2xl bg-white p-5 text-xs">
          <div className="flex gap-3"><img src={item.image} alt="" className="h-14 w-14 rounded-lg bg-stone object-contain" /><div><b className="text-sm">{item.name}</b><br />{peso(item.price + 210)} total</div></div>
          <p className="rounded-lg bg-paper p-3">Tracking number<br /><b>JT4482910PH</b></p>
          <button disabled={at < 4} className="w-full rounded-full bg-ink py-2.5 font-semibold text-white disabled:opacity-30">Confirm delivery</button>
          <div className="flex gap-2"><button className="flex-1 rounded-full border border-ink/40 py-2">Open dispute</button><button className="flex-1 rounded-full border border-ink/40 py-2">Request return</button></div>
        </aside>
      </div>
    </AppLayout>
  );
}