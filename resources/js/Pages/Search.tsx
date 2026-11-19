import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useMemo, useState } from 'react';
import HeartButton from '@/Components/HeartButton';
import AppLayout from '@/Layouts/AppLayout';
import { peso } from '@/lib/format';
import { Sneaker } from '@/types';

type Result = Sneaker & { brand: string; type: string; aud: string };
interface Props { q: string; results: Result[]; suggestion: string | null; close?: boolean }

const sorts = ['Price: Low to High', 'Price: High to Low', 'Name: A to Z'];
const categories = ['Men', 'Women', 'Kids'];
const conditionList = ['Deadstock', 'Like new', 'Worn once', 'Good condition'];
const baseSizes = [7, 8, 9, 10, 11, 12, 13];

const flip = (list: string[], set: (v: string[]) => void, v: string) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

function Card({ r }: { r: Result }) {
  return (
    <article>
      <div className="relative">
        <Link href={`/sneakers/${r.slug}`} className="group relative block aspect-[4/3.4] overflow-hidden rounded-2xl bg-stone">
          <img src={r.image} alt={r.name} loading="lazy" className="h-full w-full object-contain p-5 transition-transform duration-300 group-hover:scale-105" />
        </Link>
        <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold uppercase text-white">{r.condition}</span>
        <HeartButton slug={r.slug} className="absolute right-3 top-3" />
      </div>
      <p className="mt-3 text-[10px] uppercase text-black/50">{[r.brand, r.aud].filter(Boolean).join(' · ')}</p>
      <Link href={`/sneakers/${r.slug}`} className="block text-sm font-bold hover:text-ember">{r.name}</Link>
      <p className="text-[11px] text-black/60">by {r.seller} · {r.rating.toFixed(1)}</p>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-base font-bold">{peso(r.price)}</p>
        <Link href={`/sneakers/${r.slug}`} className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white">Buy now</Link>
      </div>
    </article>
  );
}

function Inner({ q, results, suggestion, close }: Props) {
  const ceil = useMemo(() => Math.max(12000, Math.ceil(Math.max(0, ...results.map((r) => r.price)) / 1000) * 1000), [results]);
  const sizes = useMemo(() => Array.from(new Set([...baseSizes, ...results.flatMap((r) => r.sizes)])).sort((a, b) => a - b), [results]);
  const brandList = useMemo(() => Array.from(new Set(results.map((r) => r.brand))).sort(), [results]);

  const [text, setText] = useState(q);
  const [cats, setCats] = useState<string[]>([]);
  const [size, setSize] = useState<number | null>(null);
  const [max, setMax] = useState(ceil);
  const [brands, setBrands] = useState<string[]>([]);
  const [conds, setConds] = useState<string[]>([]);
  const [sort, setSort] = useState(sorts[0]);
  const [panel, setPanel] = useState(false);

  const active = cats.length + (size ? 1 : 0) + (max < ceil ? 1 : 0) + brands.length + conds.length;
  const clear = () => { setCats([]); setSize(null); setMax(ceil); setBrands([]); setConds([]); };

  const shown = useMemo(() => {
    const out = results.filter((r) => {
      if (cats.length) {
        const a = r.aud.toLowerCase();
        const ok = cats.some((c) => (c === 'Kids' ? a.startsWith('kids') : a === `${c.toLowerCase()}'s` || a === 'unisex'));
        if (!ok) return false;
      }
      return (!size || r.sizes.includes(size)) && r.price <= max && (!brands.length || brands.includes(r.brand)) && (!conds.length || conds.includes(r.condition));
    });
    if (sort === sorts[0]) out.sort((a, b) => a.price - b.price);
    if (sort === sorts[1]) out.sort((a, b) => b.price - a.price);
    if (sort === sorts[2]) out.sort((a, b) => a.name.localeCompare(b.name));
    return out;
  }, [results, cats, size, max, brands, conds, sort]);

  const search = (e: FormEvent) => { e.preventDefault(); router.get('/search', { q: text }); };
  const check = (label: string, on: boolean, toggle: () => void) => (
    <label key={label} className="flex cursor-pointer items-center gap-2 py-1 text-xs">
      <input type="checkbox" checked={on} onChange={toggle} className="accent-ember" />{label}
    </label>
  );
  const heading = 'mb-1 mt-4 text-xs font-bold first:mt-0';

  return (
    <AppLayout>
      <Head title={q ? `Results for ${q}` : 'All pairs'} />
      <p className="mt-6 text-[10px] font-semibold uppercase tracking-wider text-ember">Search</p>
      <h1 className="display text-4xl sm:text-5xl">{q ? `Results for “${q}”` : 'All pairs'}</h1>
      {suggestion && <p className="mt-2 text-xs text-black/60">Did you mean <Link href={`/search?q=${encodeURIComponent(suggestion)}`} className="font-semibold text-ink underline">{suggestion}</Link>?</p>}
      {close && <p className="mt-2 text-xs text-black/60">No exact matches, so these are the closest pairs.</p>}

      <form onSubmit={search} className="mt-4 flex max-w-md gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} aria-label="Search" placeholder="Search models, brands, sellers" className="min-w-0 flex-1 rounded-full bg-white px-4 py-2.5 text-sm" />
        <button className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">Search</button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-black/60">Popular:</span>
        <button onClick={() => router.get('/search', { q: 'retro high' })} className="rounded-full bg-white px-3 py-1.5">Retro high</button>
        <button onClick={() => router.get('/search', { q: 'court low' })} className="rounded-full bg-white px-3 py-1.5">Court low</button>
        <button onClick={() => setConds(['Deadstock'])} className="rounded-full bg-white px-3 py-1.5">Deadstock</button>
        <button onClick={() => setMax(Math.min(5000, ceil))} className="rounded-full bg-white px-3 py-1.5">Under ₱5,000</button>
      </div>

      <button onClick={() => setPanel(!panel)} aria-expanded={panel} className="mt-5 rounded-full border border-ink/40 px-5 py-2 text-xs font-semibold lg:hidden">
        {panel ? 'Hide filters' : 'Filters'}{active > 0 ? ` (${active})` : ''}
      </button>

      <div className="mt-5 grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className={`${panel ? 'block' : 'hidden'} h-fit rounded-2xl bg-white p-4 lg:block`}>
          <p className={heading}>Category</p>
          {categories.map((c) => check(c, cats.includes(c), () => flip(cats, setCats, c)))}

          <p className={heading}>Size (US)</p>
          <div className="grid grid-cols-4 gap-1.5">
            {sizes.map((n) => (
              <button key={n} onClick={() => setSize(size === n ? null : n)} aria-pressed={size === n}
                className={`h-8 rounded-md border text-[11px] ${size === n ? 'border-ink bg-ink text-white' : 'border-stone'}`}>{n}</button>
            ))}
          </div>

          <p className={`${heading} flex justify-between`}>Max price <span>{peso(max)}</span></p>
          <input type="range" min={2000} max={ceil} step={250} value={max} onChange={(e) => setMax(+e.target.value)} aria-label="Max price" className="w-full accent-ember" />
          <div className="flex justify-between text-[10px] text-black/50"><span>{peso(2000)}</span><span>{peso(ceil)}</span></div>

          {brandList.length > 0 && (<>
            <p className={heading}>Brand</p>
            {brandList.map((b) => check(b, brands.includes(b), () => flip(brands, setBrands, b)))}
          </>)}

          <p className={heading}>Condition</p>
          {conditionList.map((c) => check(c, conds.includes(c), () => flip(conds, setConds, c)))}

          <button onClick={clear} disabled={!active} className="mt-4 text-xs underline disabled:opacity-30">Clear all</button>
        </aside>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs text-black/60"><b className="text-ink">{shown.length}</b> result{shown.length === 1 ? '' : 's'}</p>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort" className="rounded-full bg-white px-4 py-2 text-xs">
              {sorts.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {shown.length ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 xl:grid-cols-3">{shown.map((r) => <Card key={r.slug} r={r} />)}</div>
          ) : (
            <div className="rounded-2xl bg-white p-8 text-center text-sm">
              <p>{results.length ? 'No pairs match these filters.' : `No pairs found${q ? ` for “${q}”` : ''}.`}</p>
              {results.length > 0 && active > 0 && <button onClick={clear} className="mt-3 text-ember underline">Clear all filters</button>}
              {suggestion && <p className="mt-3">Try <Link href={`/search?q=${encodeURIComponent(suggestion)}`} className="text-ember underline">{suggestion}</Link></p>}
              {!results.length && <p className="mt-3"><Link href="/" className="text-ember underline">Browse all pairs</Link></p>}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}

export default function Search(props: Props) {
  return <Inner key={props.q} {...props} />;
}