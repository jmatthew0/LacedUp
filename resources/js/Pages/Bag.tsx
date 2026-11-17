import { Head, Link, router } from '@inertiajs/react';
import SneakerCard from '@/Components/SneakerCard';
import AppLayout from '@/Layouts/AppLayout';
import { peso } from '@/lib/format';
import { BagLine, Sneaker } from '@/types';

export default function Bag({ items, more }: { items: BagLine[]; more: Sneaker[] }) {
  const sub = items.reduce((t, s) => t + s.price, 0);
  return (
    <AppLayout>
      <Head title="Your bag" />
      <h1 className="display mt-6 text-4xl">Your bag</h1>
      <p className="mb-4 text-right text-xs text-black/60">{items.length} items · each pair is one of a kind</p>
      <div className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
        <div className="divide-y divide-stone rounded-2xl bg-white">
          {items.length === 0 && <p className="p-8 text-center text-sm">Your bag is empty. <Link href="/" className="text-ember underline">Browse pairs</Link></p>}
          {items.map((s) => (
            <div key={s.id} className="flex gap-4 p-4">
              <img src={s.image} alt={s.name} className="h-20 w-20 rounded-xl bg-stone object-contain" />
              <div className="flex-1">
                <Link href={`/sneakers/${s.slug}`} className="text-sm font-bold hover:text-ember">{s.name}</Link>
                <p className="text-xs text-black/60">{s.size ? `US ${s.size} · ` : ''}{s.condition} · Sold by {s.seller}</p>
                <button onClick={() => router.delete(`/bag/${s.id}`, { preserveScroll: true })} className="mt-3 text-xs underline">Remove</button>
              </div>
              <p className="font-bold">{peso(s.price)}</p>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-2xl bg-white p-5 text-sm">
          <h2 className="display text-base">Summary</h2>
          <dl className="my-4 space-y-2 text-xs">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{peso(sub)}</dd></div>
            <div className="flex justify-between"><dt>Shipping estimate</dt><dd>{peso(items.length ? 120 : 0)}</dd></div>
            <div className="flex justify-between"><dt>Service fee</dt><dd>{peso(items.length ? 90 : 0)}</dd></div>
          </dl>
          <p className="display border-t border-stone pt-3 text-xl">{peso(items.length ? sub + 210 : 0)}</p>
          {items.length > 0 && <Link href="/checkout" className="mt-4 block rounded-full bg-ember py-3 text-center font-semibold text-white">Checkout</Link>}
        </aside>
      </div>
      <h2 className="display mb-4 mt-12 text-2xl">You may also like</h2>
      <div className="grid gap-6 sm:grid-cols-3">{more.map((s) => <SneakerCard key={s.slug} s={s} />)}</div>
    </AppLayout>
  );
}