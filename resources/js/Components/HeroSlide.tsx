import { Link } from '@inertiajs/react';
import { peso } from '@/lib/format';
import { HeroSlide as Slide } from '@/types';

interface Theme { bg: string; primary: string }

// Background and main button color for each featured pair, matched by name.
const themes: Record<string, Theme> = {
  'Bone Court Low': { bg: '#1c1b19', primary: 'bg-ember text-white' },
  'Night Tide Runner': { bg: '#141c2e', primary: 'bg-white text-ink' },
  'Ember Retro High': { bg: '#e8552f', primary: 'bg-white text-ink' },
};
const fallback: Theme[] = Object.values(themes);

export default function HeroSlide({ s, index = 0 }: { s: Slide; index?: number }) {
  const t = themes[s.title] ?? fallback[index % fallback.length];

  return (
    <article
      className="relative grid min-h-[460px] items-center gap-4 overflow-hidden rounded-3xl p-6 pb-20 text-white sm:p-10 sm:pb-20 md:min-h-[500px] md:grid-cols-[1fr_1.3fr]"
      style={{ backgroundColor: t.bg, backgroundImage: 'radial-gradient(circle at 72% 50%, rgba(255,255,255,.16), transparent 55%)' }}>
      <div className="relative z-10">
        <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">{s.badge}</span>
        <h1 className="display mt-5 text-4xl sm:text-5xl md:text-6xl">{s.title}</h1>
        <p className="mt-4 max-w-sm text-sm text-white/80">{s.blurb}</p>
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-wider text-white/70">Lowest ask</p>
        <p className="display text-3xl" style={{ fontStretch: '110%' }}>{peso(s.price)}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/sneakers/${s.slug}`} className={`rounded-full px-5 py-2.5 text-sm font-semibold ${t.primary}`}>Shop this drop</Link>
          <Link href={`/sneakers/${s.slug}`} className="rounded-full border border-white/50 px-5 py-2.5 text-sm">Make an offer</Link>
        </div>
      </div>
      <img src={s.image} alt={s.title}
        className="order-first mx-auto max-h-56 w-full object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,.35)] md:order-none md:max-h-[400px] md:scale-110" />
    </article>
  );
}