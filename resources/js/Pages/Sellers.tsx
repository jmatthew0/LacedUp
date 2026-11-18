import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Seller } from '@/types';

type Row = Seller & { listings: number };
const sorts = ['Top rated', 'Most sales', 'Most listings'];

export default function Sellers({ sellers }: { sellers: Row[] }) {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState(sorts[0]);

  const list = useMemo(() => {
    const found = sellers.filter((s) => `${s.name} ${s.handle}`.toLowerCase().includes(q.toLowerCase()));
    return found.sort((a, b) =>
      sort === 'Most sales' ? b.sales - a.sales : sort === 'Most listings' ? b.listings - a.listings : b.rating - a.rating || b.sales - a.sales);
  }, [sellers, q, sort]);

  return (
    <AppLayout>
      <Head title="Sellers" />
      <p className="mt-6 text-[10px] font-semibold uppercase tracking-wider text-ember">Community</p>
      <h1 className="display text-4xl sm:text-5xl">Sellers</h1>
      <p className="mt-1 text-xs text-black/60">{sellers.length} verified sellers</p>

      <div className="my-5 flex flex-wrap items-center gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search sellers" aria-label="Search sellers" className="w-64 rounded-full bg-white px-4 py-2.5 text-sm" />
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort sellers" className="rounded-full bg-white px-4 py-2.5 text-xs">
          {sorts.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <Link key={s.handle} href={`/sellers/${s.handle}`} className="rounded-2xl bg-white p-5 transition-shadow hover:shadow-md">
            <div className="flex items-center gap-3">
              {s.avatar
                ? <img src={s.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                : <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-sm font-semibold text-white">{s.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}</span>}
              <div className="min-w-0"><p className="truncate text-sm font-bold">{s.name}</p><p className="truncate text-[11px] text-black/50">@{s.handle}</p></div>
            </div>
            <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-xs text-black/70">{s.bio}</p>
            <dl className="mt-4 grid grid-cols-4 border-t border-stone pt-3 text-center">
              {[[s.sales, 'Sales'], [`${s.rating}★`, 'Rating'], [`${s.onTime}%`, 'On time'], [s.listings, 'Listed']].map(([v, l]) => (
                <div key={l as string}><dd className="text-sm font-bold">{v}</dd><dt className="text-[10px] text-black/50">{l}</dt></div>
              ))}
            </dl>
          </Link>
        ))}
      </div>
      {!list.length && <p className="rounded-2xl bg-white p-8 text-center text-sm">No sellers match “{q}”.</p>}
    </AppLayout>
  );
}