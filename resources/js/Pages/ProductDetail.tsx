import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import SneakerCard from '@/Components/SneakerCard';
import AppLayout from '@/Layouts/AppLayout';
import { peso } from '@/lib/format';
import { Sneaker } from '@/types';
import HeartButton from '@/Components/HeartButton';
import OfferBox from '@/Components/OfferBox';

export default function ProductDetail({ sneaker, similar }: { sneaker: Sneaker; similar: Sneaker[] }) {
  const [size, setSize] = useState<number | null>(null);
  const add = (checkout: boolean) => router.post('/bag', { slug: sneaker.slug, size: String(size), checkout });

  return (
    <AppLayout>
      <Head title={sneaker.name} />
      <div className="mt-4 grid gap-8 md:grid-cols-[1.3fr_1fr]">
        <div className="grid aspect-square place-items-center rounded-3xl bg-stone"><img src={sneaker.image} alt={sneaker.name} className="max-h-[80%] object-contain" /></div>
        <div>
          <p className="text-xs text-ember">{sneaker.category}</p>
          <h1 className="display mt-2 text-4xl">{sneaker.name}</h1>
          <p className="mt-1 text-xs text-black/60">{sneaker.condition} · Sold by {sneaker.seller}</p>
          <p className="mt-4 text-xs text-black/50">Lowest ask</p>
          <p className="display text-3xl" style={{ fontStretch: '110%' }}>{peso(sneaker.price)}</p>
          <p className="mb-2 mt-6 text-xs font-semibold">{size ? `Size US ${size}` : 'Select a size'}</p>
          <div className="flex flex-wrap gap-2">
            {sneaker.sizes.map((n) => (
              <button key={n} onClick={() => setSize(n)} className={`h-10 w-12 rounded-lg border text-sm ${size === n ? 'border-ink bg-ink text-white' : 'border-stone bg-white'}`}>{n}</button>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
          <HeartButton slug={sneaker.slug} className="!h-12 !w-12 border border-ink/40" />
            <button disabled={!size} onClick={() => add(true)} className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white disabled:opacity-40">Buy now</button>
            <button disabled={!size} onClick={() => add(false)} className="rounded-full border border-ink/40 px-6 py-3 text-sm disabled:opacity-40">Add to bag</button>
          </div>
        </div>
      </div>
      <h2 className="display mb-4 mt-14 text-2xl">Similar pairs</h2>
      <div className="grid gap-6 sm:grid-cols-3">{similar.map((s) => <SneakerCard key={s.slug} s={s} />)}</div>
    </AppLayout>
  );
}