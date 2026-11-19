import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { peso } from '@/lib/format';
import { Sneaker } from '@/types';

const copy: Record<number, [string, string]> = {
  404: ['This page ran out of stock', 'The link may be broken or the page may have moved. Try searching for what you need.'],
  403: ["You can't go in here", 'You do not have permission to see this page.'],
  500: ['Something went wrong', 'We hit a problem on our side. Please try again in a moment.'],
  503: ['Back soon', 'Laced Up is down for a quick update. Please check back shortly.'],
};
const quick = [['Help center', '/help'], ['My orders', '/orders'], ['Sell a pair', '/sell'], ['Contact support', '/help']];

export default function Error({ status, popular }: { status: number; popular: Sneaker[] }) {
  const [q, setQ] = useState('');
  const [title, note] = copy[status] ?? copy[500];
  const digits = String(status).split('');
  const search = (e: FormEvent) => { e.preventDefault(); router.get('/search', { q }); };

  return (
    <AppLayout>
      <Head title={title} />
      <section className="mx-auto mt-10 max-w-xl text-center">
        <p aria-label={`Error ${status}`} className="display text-8xl sm:text-9xl">
          {digits.map((d, i) => <span key={i} className={i === 1 ? 'text-ember' : ''}>{d}</span>)}
        </p>
        <h1 className="display mt-4 text-3xl sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-black/60">{note}</p>
        <form onSubmit={search} className="mx-auto mt-6 flex max-w-md gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search models, brands, sellers" aria-label="Search" className="min-w-0 flex-1 rounded-full bg-white px-5 py-3 text-sm" />
          <button className="rounded-full bg-ember px-5 py-3 text-sm font-semibold text-white">Search</button>
        </form>
        <div className="mt-4 flex justify-center gap-2">
          <Link href="/" className="rounded-full bg-ink px-5 py-2.5 text-xs font-semibold text-white">Back to home</Link>
          <Link href="/shop/new-in" className="rounded-full border border-ink/40 px-5 py-2.5 text-xs font-semibold">Shop new arrivals</Link>
        </div>
      </section>

      {popular.length > 0 && (
        <section className="mt-14">
          <div className="mb-4 flex items-end justify-between"><h2 className="display text-xl">Popular right now</h2><Link href="/shop/new-in" className="text-xs underline">View all</Link></div>
          <div className="grid gap-4 sm:grid-cols-3">
            {popular.map((s) => (
              <Link key={s.slug} href={`/sneakers/${s.slug}`}>
                <div className="grid aspect-square place-items-center rounded-2xl bg-stone"><img src={s.image} alt={s.name} className="max-h-[80%] object-contain" /></div>
                <p className="mt-2 text-sm font-bold">{s.name}</p><p className="text-xs text-black/60">{peso(s.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12 border-t border-stone pt-6">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-black/50">Quick links</p>
        <div className="flex flex-wrap gap-2">{quick.map(([l, h]) => <Link key={l} href={h} className="rounded-full bg-white px-4 py-2 text-xs font-semibold">{l}</Link>)}</div>
      </section>
    </AppLayout>
  );
}