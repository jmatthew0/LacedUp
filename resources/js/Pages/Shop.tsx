import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import ShopCard, { ShopPair } from '@/Components/ShopCard';
import AppLayout from '@/Layouts/AppLayout';
import { Seller } from '@/types';

interface Props {
  section: { key: string; eyebrow: string; title: string; blurb: string };
  sneakers: ShopPair[];
  sellers: Seller[];
  live: number;
}

const sorts = ['Featured', 'Price: Low to High', 'Price: High to Low'];
const sizeList = [7, 8, 9, 10, 11, 12, 13];
const PAGE = 8;

export default function Shop({ section, sneakers, sellers, live }: Props) {
  const [type, setType] = useState('All');
  const [size, setSize] = useState<number | null>(null);
  const [sort, setSort] = useState(sorts[0]);
  const [count, setCount] = useState(PAGE);
  const apply = (fn: () => void) => { fn(); setCount(PAGE); };

  const types = useMemo(() => ['All', ...Array.from(new Set(sneakers.map((s) => s.type).filter(Boolean)))], [sneakers]);
  const list = useMemo(() => {
    const out = sneakers.filter((s) => (type === 'All' || s.type === type) && (!size || s.sizes.includes(size)));
    if (sort === sorts[1]) out.sort((a, b) => a.price - b.price);
    if (sort === sorts[2]) out.sort((a, b) => b.price - a.price);
    return out;
  }, [sneakers, type, size, sort]);

  const chip = (on: boolean) => `rounded-full px-5 py-2 text-xs font-semibold ${on ? 'bg-ink text-white' : 'bg-white hover:bg-stone'}`;

  return (
    <AppLayout>
      <Head title={section.eyebrow} />
      <p className="mt-4 text-xs text-black/60"><Link href="/" className="hover:text-ink">Home</Link> › {section.eyebrow}</p>

      <section className="mt-4 rounded-3xl bg-ink p-6 text-white sm:p-10">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-ember">{section.eyebrow}</p>
        <h1 className="display mt-3 max-w-xl text-4xl sm:text-6xl">{section.title}</h1>
        <p className="mt-4 max-w-md text-sm text-white/70">{section.blurb}</p>
        <div className="mt-6 flex flex-wrap gap-2 text-xs">
          {[`${live.toLocaleString()} pairs live`, 'Ships in 48h', 'Authenticity checked'].map((t) => <span key={t} className="rounded-full bg-white/10 px-4 py-2">{t}</span>)}
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        {types.map((t) => <button key={t} onClick={() => apply(() => setType(t))} aria-pressed={type === t} className={chip(type === t)}>{t}</button>)}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-stone pb-4">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <b className="mr-1">{list.length}</b><span className="mr-2 text-black/60">pair{list.length === 1 ? '' : 's'}</span>
          {sizeList.map((n) => (
            <button key={n} onClick={() => apply(() => setSize(size === n ? null : n))} aria-pressed={size === n}
              className={`h-7 w-7 rounded-md border text-[11px] ${size === n ? 'border-ink bg-ink text-white' : 'border-stone bg-white'}`}>{n}</button>
          ))}
        </div>
        <select value={sort} onChange={(e) => apply(() => setSort(e.target.value))} aria-label="Sort" className="rounded-full bg-white px-4 py-2 text-xs">
          {sorts.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {list.length ? (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">{list.slice(0, count).map((s) => <ShopCard key={s.slug} s={s} />)}</div>
      ) : (
        <p className="mt-6 rounded-2xl bg-white p-8 text-center text-sm">
          {sneakers.length ? 'No pairs match these filters.' : 'Nothing listed here yet.'} <Link href="/" className="text-ember underline">Browse all pairs</Link>
        </p>
      )}

      {count < list.length && (
        <div className="mt-8 text-center"><button onClick={() => setCount(count + PAGE)} className="rounded-full border border-ink/40 px-6 py-2.5 text-sm font-semibold">Load more</button></div>
      )}

      <div className="mb-4 mt-14 flex items-end justify-between"><h2 className="display text-2xl">Shop by seller</h2><Link href="/sellers" className="text-xs underline">All sellers</Link></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {sellers.map((s) => (
          <Link key={s.handle} href={`/sellers/${s.handle}`} className="flex items-center gap-3 rounded-2xl bg-white p-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-xs font-semibold text-white">{s.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}</span>
            <span className="min-w-0 text-sm"><b className="block truncate">{s.handle}</b><span className="text-[11px] text-black/60">{s.sales} sales · {s.rating}</span></span>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}