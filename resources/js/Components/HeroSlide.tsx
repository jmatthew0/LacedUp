import { Link } from '@inertiajs/react';
import { peso } from '@/lib/format';
import { HeroSlide as Slide } from '@/types';

export default function HeroSlide({ s }: { s: Slide }) {
  return (
    <article className="grid min-h-[340px] items-center gap-6 rounded-3xl bg-ink p-8 text-white md:grid-cols-2 md:p-12">
      <div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-[11px]">{s.badge}</span>
        <h1 className="display mt-5 text-4xl md:text-6xl">{s.title}</h1>
        <p className="mt-4 max-w-sm text-sm text-white/70">{s.blurb}</p>
        <p className="mt-5 text-xs text-white/60">Lowest ask</p>
        <p className="display text-2xl" style={{ fontStretch: '110%' }}>{peso(s.price)}</p>
        <div className="mt-4 flex gap-3">
          <Link href={`/sneakers/${s.slug}`} className="rounded-full bg-ember px-5 py-2.5 text-sm font-semibold">Shop this drop</Link>
          <button className="rounded-full border border-white/40 px-5 py-2.5 text-sm">Make an offer</button>
        </div>
      </div>
      <img src={s.image} alt={s.title} className="mx-auto max-h-64 object-contain drop-shadow-2xl" />
    </article>
  );
}
