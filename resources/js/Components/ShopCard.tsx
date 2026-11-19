import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import HeartButton from '@/Components/HeartButton';
import Modal from '@/Components/Modal';
import SignInModal from '@/Components/SignInModal';
import { peso } from '@/lib/format';
import { Sneaker } from '@/types';

export type ShopPair = Sneaker & { type: string };

export default function ShopCard({ s }: { s: ShopPair }) {
  const user = usePage<{ auth?: { user: unknown } }>().props.auth?.user;
  const [open, setOpen] = useState(false);
  const add = (size: number) => router.post('/bag', { slug: s.slug, size: String(size) });

  return (
    <article>
      <div className="relative">
        <Link href={`/sneakers/${s.slug}`} className="group relative block aspect-square overflow-hidden rounded-2xl bg-stone">
          <img src={s.image} alt={s.name} loading="lazy" className="h-full w-full object-contain p-5 transition-transform duration-300 group-hover:scale-105" />
        </Link>
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${s.condition === 'Deadstock' ? 'bg-ink text-white' : 'bg-white text-ink'}`}>{s.condition}</span>
        <HeartButton slug={s.slug} className="absolute right-3 top-3" />
      </div>
      <Link href={`/sneakers/${s.slug}`} className="mt-3 block text-sm font-bold hover:text-ember">{s.name}</Link>
      <p className="text-[11px] text-black/60">{s.type ? `${s.type} · ` : ''}{s.seller}</p>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-sm font-bold">{peso(s.price)}</p>
        <button onClick={() => setOpen(true)} className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white">Quick add</button>
      </div>

      {user ? (
        <Modal open={open} onClose={() => setOpen(false)} title="Pick a size">
          <p className="text-sm text-black/70">{s.name} · {peso(s.price)}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {s.sizes.map((n) => <button key={n} onClick={() => add(n)} className="h-11 min-w-12 rounded-lg border border-stone px-3 text-sm hover:border-ink">US {n}</button>)}
          </div>
        </Modal>
      ) : (
        <SignInModal open={open} onClose={() => setOpen(false)} message="Sign in to add pairs to your bag." />
      )}
    </article>
  );
}