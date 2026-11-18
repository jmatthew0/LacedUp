import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import HeartButton from '@/Components/HeartButton';
import AccountLayout from '@/Layouts/AccountLayout';
import { peso } from '@/lib/format';
import { Sneaker } from '@/types';

type Pair = Sneaker & { sold: boolean };
const sorts = ['Recently saved', 'Price: Low to High', 'Price: High to Low'];

export default function Saved({ pairs }: { pairs: Pair[] }) {
  const [sort, setSort] = useState(sorts[0]);
  const [picked, setPicked] = useState<string[]>([]);
  const [sizes, setSizes] = useState<Record<string, string>>({});

  const list = useMemo(() => {
    const copy = [...pairs];
    if (sort === sorts[1]) copy.sort((a, b) => a.price - b.price);
    if (sort === sorts[2]) copy.sort((a, b) => b.price - a.price);
    return copy;
  }, [pairs, sort]);

  const buyable = list.filter((p) => !p.sold);
  const sizeOf = (p: Pair) => sizes[p.slug] ?? String(p.sizes[0]);
  const toggle = (slug: string) => setPicked(picked.includes(slug) ? picked.filter((s) => s !== slug) : [...picked, slug]);
  const allOn = buyable.length > 0 && buyable.every((p) => picked.includes(p.slug));

  const addOne = (p: Pair) => router.post('/bag', { slug: p.slug, size: sizeOf(p) });
  const addPicked = () => router.post('/bag/bulk', { items: list.filter((p) => picked.includes(p.slug)).map((p) => ({ slug: p.slug, size: sizeOf(p) })) });

  return (
    <AccountLayout active="saved">
      <Head title="Saved pairs" />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="display text-4xl">Saved pairs</h1><p className="mt-1 text-xs text-black/60">{pairs.length} pair{pairs.length === 1 ? '' : 's'} saved</p></div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort" className="rounded-full bg-white px-4 py-2 text-xs">{sorts.map((s) => <option key={s}>{s}</option>)}</select>
      </div>

      {pairs.length > 0 && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-white p-3 text-xs">
          <label className="flex items-center gap-2 font-semibold">
            <input type="checkbox" className="accent-ember" checked={allOn} onChange={() => setPicked(allOn ? [] : buyable.map((p) => p.slug))} />Select all
          </label>
          <span className="flex items-center gap-3">
            <span className="text-black/60">{picked.length} selected</span>
            <button disabled={!picked.length} onClick={addPicked} className="rounded-full bg-ink px-4 py-2 font-semibold text-white disabled:opacity-30">Add selected to bag</button>
          </span>
        </div>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => (
          <article key={p.slug} className="rounded-2xl bg-white p-3">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-stone">
              <Link href={`/sneakers/${p.slug}`}><img src={p.image} alt={p.name} loading="lazy" className={`h-full w-full object-contain p-5 ${p.sold ? 'opacity-50' : ''}`} /></Link>
              {!p.sold && <input type="checkbox" aria-label={`Select ${p.name}`} checked={picked.includes(p.slug)} onChange={() => toggle(p.slug)} className="absolute left-3 top-3 h-5 w-5 accent-ember" />}
              <HeartButton slug={p.slug} className="absolute right-3 top-3" />
              <span className="absolute bottom-3 left-3 rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold text-white">{p.sold ? 'Sold out' : p.condition}</span>
            </div>
            <Link href={`/sneakers/${p.slug}`} className="mt-3 block text-sm font-bold hover:text-ember">{p.name}</Link>
            <p className="text-[11px] text-black/60">{p.condition} · from {p.seller}</p>
            {!p.sold && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.sizes.map((n) => (
                  <button key={n} onClick={() => setSizes({ ...sizes, [p.slug]: String(n) })} aria-pressed={sizeOf(p) === String(n)}
                    className={`rounded-md border px-2 py-1 text-[10px] font-semibold ${sizeOf(p) === String(n) ? 'border-ink bg-ink text-white' : 'border-stone'}`}>US {n}</button>
                ))}
              </div>
            )}
            <div className="mt-3 flex items-center justify-between">
              <p className={`display text-xl ${p.sold ? 'text-black/40' : ''}`}>{peso(p.price)}</p>
              {p.sold
                ? <button onClick={() => router.post(`/saved/${p.slug}`, {}, { preserveScroll: true })} className="rounded-full border border-ink/40 px-4 py-2 text-xs font-semibold">Remove</button>
                : <button onClick={() => addOne(p)} className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white">Add to bag</button>}
            </div>
          </article>
        ))}
      </div>

      {!pairs.length && <p className="mt-6 rounded-2xl bg-white p-8 text-center text-sm">Nothing saved yet. Tap the heart on any pair to keep it here. <Link href="/" className="text-ember underline">Browse pairs</Link></p>}
    </AccountLayout>
  );
}