import { Head, Link, router } from '@inertiajs/react';
import { MouseEvent, ReactNode, useState } from 'react';
import HeartButton from '@/Components/HeartButton';
import Modal from '@/Components/Modal';
import OfferBox from '@/Components/OfferBox';
import SneakerCard from '@/Components/SneakerCard';
import AppLayout from '@/Layouts/AppLayout';
import { peso } from '@/lib/format';
import { Sneaker } from '@/types';

type Pair = Sneaker & { colorway: string | null; styleCode: string | null; box: boolean; receipt: boolean };
interface Props {
  sneaker: Pair;
  stats: { lowest: number; listed: number; lastSold: number | null };
  others: { slug: string; size: number; price: number }[];
  sales: { size: string | null; condition: string; price: number; when: string }[];
  seller: { name: string; handle: string; avatar: string | null; sales: number; rating: number; reviews: number; canMessage: boolean };
  similar: Sneaker[];
}

const grade: Record<string, string> = {
  'Deadstock': 'Brand new and never worn. The box may show minor storage wear.',
  'Like new': 'Worn once or twice with no visible flaws. Cleaned and stored with care.',
  'Worn once': 'Worn once. Light signs of wear are shown in the seller photos.',
  'Good condition': 'Worn and well kept. Any wear or flaws are visible in the seller photos.',
};
const sizeGuide = [[7, 40, 25], [8, 41, 26], [9, 42.5, 27], [10, 44, 28], [11, 45, 29], [12, 46, 30], [13, 47.5, 31]];

function Zoom({ src, alt, badge }: { src: string; alt: string; badge: string }) {
  const [on, setOn] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const move = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };
  return (
    <div onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)} onMouseMove={move} className="relative aspect-square cursor-zoom-in overflow-hidden rounded-3xl bg-stone">
      <img src={src} alt={alt} style={{ transformOrigin: origin }} className={`h-full w-full object-contain p-8 transition-transform duration-200 ${on ? 'scale-[1.9]' : ''}`} />
      <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1 text-[10px] font-semibold uppercase text-white">{badge}</span>
      <span className="pointer-events-none absolute bottom-4 left-4 hidden rounded-full bg-white/90 px-3 py-1 text-[11px] md:block">{on ? 'Move to explore' : 'Hover to zoom'}</span>
    </div>
  );
}

function Item({ id, title, open, set, children }: { id: string; title: string; open: string | null; set: (v: string | null) => void; children: ReactNode }) {
  const on = open === id;
  return (
    <div className="rounded-2xl bg-white">
      <button onClick={() => set(on ? null : id)} aria-expanded={on} className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold">
        {title}<span aria-hidden="true">{on ? '−' : '+'}</span>
      </button>
      {on && <div className="px-5 pb-5 text-sm leading-relaxed text-black/70">{children}</div>}
    </div>
  );
}

export default function ProductDetail({ sneaker, stats, others, sales, seller, similar }: Props) {
  const [size, setSize] = useState<number | null>(null);
  const [open, setOpen] = useState<string | null>('condition');
  const [guide, setGuide] = useState(false);

  const [type] = sneaker.category.split(' · ');
  const add = (checkout: boolean) => router.post('/bag', { slug: sneaker.slug, size: String(size), checkout });
  const allSizes = Array.from(new Set([7, 8, 9, 10, 11, 12, 13, ...sneaker.sizes, ...others.map((o) => o.size)])).sort((a, b) => a - b);
  const spec = [sneaker.colorway && `Colorway: ${sneaker.colorway}`, sneaker.styleCode && `Style code ${sneaker.styleCode}`].filter(Boolean).join(' · ');
  const initials = seller.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <AppLayout>
      <Head title={sneaker.name} />
      <p className="mt-4 text-xs text-black/60">
        <Link href="/" className="hover:text-ink">Home</Link> › <Link href={`/search?q=${encodeURIComponent(type)}`} className="hover:text-ink">{type}</Link> › <span className="text-ink">{sneaker.name}</span>
      </p>

      <div className="mt-4 grid gap-8 md:grid-cols-[1.25fr_1fr]">
        <Zoom src={sneaker.image} alt={sneaker.name} badge={sneaker.condition} />

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ember">{sneaker.category}</p>
          <h1 className="display mt-2 text-4xl sm:text-5xl">{sneaker.name}</h1>
          {spec && <p className="mt-2 text-xs text-black/60">{spec}</p>}
          <p className="mt-3 flex flex-wrap items-center gap-x-3 text-xs">
            <span><span className="text-ember">★</span> <b>{sneaker.rating.toFixed(1)}</b> <span className="text-black/60">{seller.reviews ? `${seller.reviews} review${seller.reviews === 1 ? '' : 's'}` : 'seller rating'}</span></span>
            <span className="text-black/60">{stats.listed} pair{stats.listed === 1 ? '' : 's'} listed</span>
          </p>

          <div className="mt-5 flex items-end justify-between border-y border-stone py-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-black/50">Asking price</p>
              <p className="display text-3xl" style={{ fontStretch: '110%' }}>{peso(sneaker.price)}</p>
              {stats.lowest < sneaker.price && <p className="text-[11px] text-black/60">Lowest ask for this model {peso(stats.lowest)}</p>}
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-black/50">Last sold</p>
              <p className="text-lg font-bold">{stats.lastSold ? peso(stats.lastSold) : '—'}</p>
            </div>
          </div>

          <div className="mb-2 mt-5 flex items-center justify-between text-xs">
            <span className="font-semibold">{size ? `Size US ${size}` : 'Select size'}</span>
            <button onClick={() => setGuide(true)} className="underline">Size guide</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {allSizes.map((n) => {
              if (sneaker.sizes.includes(n)) {
                return <button key={n} onClick={() => setSize(n)} aria-pressed={size === n} className={`h-10 min-w-12 rounded-lg border px-3 text-sm ${size === n ? 'border-ink bg-ink text-white' : 'border-stone bg-white'}`}>{n}</button>;
              }
              const other = others.find((o) => o.size === n);
              return other
                ? <Link key={n} href={`/sneakers/${other.slug}`} title={`Size ${n} is in another listing, ${peso(other.price)}`} className="grid h-10 min-w-12 place-items-center rounded-lg border border-dashed border-ink/50 px-3 text-sm">{n}</Link>
                : <span key={n} aria-label={`Size ${n} not available`} className="grid h-10 min-w-12 place-items-center rounded-lg border border-stone bg-paper px-3 text-sm text-black/30 line-through">{n}</span>;
            })}
          </div>
          <p className="mt-2 text-[11px] text-black/50">Struck-through sizes are not available. Dashed sizes are in another listing of this model.</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button disabled={!size} onClick={() => add(true)} className="rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white disabled:opacity-40">Buy now</button>
            <button disabled={!size} onClick={() => add(false)} className="rounded-full border border-ink/40 px-6 py-3 text-sm disabled:opacity-40">Add to bag</button>
            <HeartButton slug={sneaker.slug} className="!h-12 !w-12 border border-ink/40" />
          </div>
          <OfferBox sneaker={sneaker} size={size} />

          <ul className="mt-5 space-y-2 text-xs">
            <li className={sneaker.box ? '' : 'text-black/50'}><span className="mr-2 text-ember">{sneaker.box ? '✓' : '–'}</span>{sneaker.box ? 'Original box included' : 'No original box'}</li>
            <li className={sneaker.receipt ? '' : 'text-black/50'}><span className="mr-2 text-ember">{sneaker.receipt ? '✓' : '–'}</span>{sneaker.receipt ? 'Receipt included' : 'No receipt'}</li>
            <li><span className="mr-2 text-ember">✓</span>Authenticity verified by Laced Up</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-[1.25fr_1fr]">
        <section>
          <h2 className="display mb-3 text-xl">Details</h2>
          <div className="space-y-2">
            <Item id="condition" title={`Condition · ${sneaker.condition}`} open={open} set={setOpen}>
              <p>{grade[sneaker.condition] ?? 'See the seller photos for the full condition.'}</p>
              <p className="mt-2">{sneaker.box ? 'The original box is included.' : 'This pair does not come with the original box.'} {sneaker.receipt ? 'A receipt is included.' : ''}</p>
            </Item>
            <Item id="shipping" title="Shipping and returns" open={open} set={setOpen}>
              <p>Sellers ship within 48 hours of payment with tracking. Standard delivery takes 3 to 5 days and Express takes 1 to 2 days, or pick up free at a Laced Up hub.</p>
              <p className="mt-2">You can request a return within 3 days of delivery if the pair fails authentication or does not match the listing.</p>
            </Item>
            <Item id="authentication" title="Authentication" open={open} set={setOpen}>
              <p>Every pair is checked by our team before it ships, including materials, stitching, labels, and condition. Your payment is held in escrow until you confirm delivery.</p>
            </Item>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-white p-4">
            <div className="flex items-center gap-3">
              {seller.avatar ? <img src={seller.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                : <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-sm font-semibold text-white">{initials}</span>}
              <div className="min-w-0 flex-1">
                <Link href={`/sellers/${seller.handle}`} className="block truncate text-sm font-bold hover:text-ember">{seller.name}</Link>
                <p className="text-[11px] text-black/60">@{seller.handle} · {seller.sales} sales · ★ {seller.rating.toFixed(1)}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2 text-xs">
              <Link href={`/sellers/${seller.handle}`} className="flex-1 rounded-full border border-ink/40 py-2 text-center font-semibold">View profile</Link>
              {seller.canMessage && <button onClick={() => router.post('/messages/start', { seller: seller.handle, slug: sneaker.slug })} className="flex-1 rounded-full bg-ink py-2 font-semibold text-white">Message</button>}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4">
            <h2 className="mb-2 text-sm font-bold">Recent sales</h2>
            {sales.length ? sales.map((s, i) => (
              <div key={i} className="flex items-center justify-between border-t border-stone py-2.5 text-xs first:border-t-0">
                <span>{s.size ? `Size ${s.size} · ` : ''}{s.condition}</span>
                <span className="text-right"><b>{peso(s.price)}</b><span className="block text-[10px] text-black/50">{s.when}</span></span>
              </div>
            )) : <p className="text-xs text-black/60">No sales yet for this model.</p>}
          </div>
        </aside>
      </div>

      <h2 className="display mb-4 mt-14 text-2xl">Similar pairs</h2>
      <div className="grid gap-6 sm:grid-cols-3">{similar.map((s) => <SneakerCard key={s.slug} s={s} />)}</div>

      <Modal open={guide} onClose={() => setGuide(false)} title="Size guide">
        <table className="w-full text-center text-sm">
          <thead className="text-xs text-black/50"><tr><th className="pb-2">US</th><th>EU</th><th>CM</th></tr></thead>
          <tbody>{sizeGuide.map(([us, eu, cm]) => <tr key={us} className="border-t border-stone"><td className="py-2 font-semibold">{us}</td><td>{eu}</td><td>{cm}</td></tr>)}</tbody>
        </table>
        <p className="mt-3 text-[11px] text-black/50">Men's sizes, approximate. Fit varies by brand, so check the seller's notes.</p>
      </Modal>
    </AppLayout>
  );
}