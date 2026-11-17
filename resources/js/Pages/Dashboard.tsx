import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { peso } from '@/lib/format';
import { Sneaker } from '@/types';

const stats = [['Earnings this month', '₱48,200'], ['Active listings', '14'], ['Pending offers', '3'], ['Avg ship time', '1.2 days'], ['Rating', '4.9 ★']];

export default function Dashboard({ listings }: { listings: Sneaker[] }) {
  const [offers] = useState([['Ember Retro High · US 9', 8500], ['Bone Court Low · US 10', 6000], ['Night Tide Runner · US 11', 10500]] as [string, number][]);
  const [done, setDone] = useState<Record<string, string>>({});
  return (
    <AppLayout>
      <Head title="Seller dashboard" />
      <div className="mt-6 flex items-center justify-between"><h1 className="display text-4xl">Good morning, Ryan</h1><Link href="/sell" className="rounded-full bg-ember px-4 py-2 text-xs font-semibold text-white">New listing</Link></div>
      <div className="my-6 grid gap-3 sm:grid-cols-5">{stats.map(([l, v]) => <div key={l} className="rounded-2xl bg-white p-4"><p className="text-[10px] text-black/50">{l}</p><p className="display text-xl">{v}</p></div>)}</div>
      <section className="rounded-2xl bg-white p-5"><h2 className="display mb-3 text-base">Pending offers</h2>
        {offers.map(([n, p]) => (<div key={n} className="flex items-center justify-between border-t border-stone py-3 text-sm"><span>{n}</span><span className="flex items-center gap-2"><b>{peso(p)}</b>
          {done[n] ? <i className="text-xs text-black/60">{done[n]}</i> : (<>{['Accept', 'Counter', 'Decline'].map((a) => <button key={a} onClick={() => setDone({ ...done, [n]: a === 'Accept' ? 'Accepted' : a === 'Counter' ? 'Counter sent' : 'Declined' })} className={`rounded-full px-3 py-1 text-xs ${a === 'Accept' ? 'bg-ink text-white' : 'border border-ink/30'}`}>{a}</button>)}</>)}</span></div>))}
      </section>
      <section className="mt-6 overflow-x-auto rounded-2xl bg-white p-5"><h2 className="display mb-3 text-base">Listings</h2>
        <table className="w-full text-left text-xs"><thead className="text-black/50"><tr><th>Pair</th><th>Sizes</th><th>Price</th><th>Status</th></tr></thead>
          <tbody>{listings.map((s, i) => <tr key={s.slug} className="border-t border-stone"><td className="py-3 font-semibold">{s.name}</td><td>{s.sizes.join(' · ')}</td><td>{peso(s.price)}</td><td>{i === 4 ? 'Sold' : 'Active'}</td></tr>)}</tbody></table></section>
    </AppLayout>
  );
}