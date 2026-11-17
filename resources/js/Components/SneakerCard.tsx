import { Link } from '@inertiajs/react';
import { peso } from '@/lib/format';
import { Sneaker } from '@/types';

export default function SneakerCard({ s }: { s: Sneaker }) {
  return (
    <article>
      <Link href={`/sneakers/${s.slug}`} className="group relative block aspect-[4/3.4] overflow-hidden rounded-2xl bg-stone">
        <span className="absolute left-3 top-3 z-10 rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold text-white">{s.condition}</span>
        <img src={s.image} alt={s.name} loading="lazy" className="h-full w-full object-contain p-5 transition-transform duration-300 group-hover:scale-105" />
      </Link>
      <p className="mt-3 text-[10px] text-black/50">{s.category}</p>
      <h3 className="text-sm font-bold">{s.name}</h3>
      <p className="text-[11px] text-black/60">Sold by {s.seller} · ★ {s.rating.toFixed(1)}</p>
      <div className="mt-2 flex items-end justify-between">
        <div><p className="text-[10px] text-black/50">Lowest ask</p><p className="text-sm font-bold">{peso(s.price)}</p></div>
        <Link href="/checkout" className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white">Buy now</Link>
      </div>
      <p className="mt-1 text-[10px] text-black/50">Sizes {s.sizes.join(' · ')}</p>
    </article>
  );
}
