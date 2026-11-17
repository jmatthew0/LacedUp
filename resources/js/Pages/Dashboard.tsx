import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { peso } from '@/lib/format';

interface Row { slug: string; name: string; image: string; sizes: number[]; price: number; status: string }
interface Props {
  seller: { handle: string; name: string } | null;
  stats: { earnings: number; active: number; sales: number; rating: number } | null;
  listings: Row[];
  toShip: { name: string; size: string | null; code: string }[];
}

export default function Dashboard({ seller, stats, listings, toShip }: Props) {
  if (!seller || !stats) {
    return (
      <AppLayout>
        <Head title="Seller dashboard" />
        <div className="mt-10 rounded-3xl bg-white p-10 text-center">
          <h1 className="display text-3xl">Start selling</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm text-black/60">List your first pair and your seller profile is created automatically.</p>
          <Link href="/sell" className="mt-6 inline-block rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white">List a pair</Link>
        </div>
      </AppLayout>
    );
  }

  const cards = [['Earnings this month', peso(stats.earnings)], ['Active listings', String(stats.active)], ['Pairs sold', String(stats.sales)], ['Rating', `${stats.rating} ★`]];

  return (
    <AppLayout>
      <Head title="Seller dashboard" />
      <div className="mt-6 flex items-center justify-between">
        <h1 className="display text-4xl">Hello, {seller.name.split(' ')[0]}</h1>
        <div className="flex gap-2">
          <Link href={`/sellers/${seller.handle}`} className="rounded-full border border-ink/40 px-4 py-2 text-xs">View profile</Link>
          <Link href="/sell" className="rounded-full bg-ember px-4 py-2 text-xs font-semibold text-white">New listing</Link>
        </div>
      </div>

      <div className="my-6 grid gap-3 sm:grid-cols-4">
        {cards.map(([l, v]) => <div key={l} className="rounded-2xl bg-white p-4"><p className="text-[10px] text-black/50">{l}</p><p className="display text-xl">{v}</p></div>)}
      </div>

      <section className="rounded-2xl bg-white p-5">
        <h2 className="display mb-3 text-base">Orders to ship</h2>
        {toShip.length ? toShip.map((o) => (
          <div key={o.code + o.name} className="flex items-center justify-between border-t border-stone py-3 text-sm">
            <span>{o.name}{o.size ? ` · US ${o.size}` : ''}</span><span className="text-xs text-black/60">Order {o.code}</span>
          </div>
        )) : <p className="border-t border-stone pt-3 text-sm text-black/60">Nothing to ship right now.</p>}
      </section>

      <section className="mt-6 overflow-x-auto rounded-2xl bg-white p-5">
        <h2 className="display mb-3 text-base">Listings</h2>
        {listings.length ? (
          <table className="w-full text-left text-xs">
            <thead className="text-black/50"><tr><th>Pair</th><th>Size</th><th>Price</th><th>Status</th><th /></tr></thead>
            <tbody>
              {listings.map((s) => (
                <tr key={s.slug} className="border-t border-stone">
                  <td className="flex items-center gap-3 py-3 font-semibold"><img src={s.image} alt="" className="h-10 w-10 rounded-lg bg-stone object-contain" />{s.name}</td>
                  <td>{s.sizes.join(' · ')}</td><td>{peso(s.price)}</td>
                  <td><span className={`rounded-full px-2.5 py-0.5 ${s.status === 'Sold' ? 'bg-paper' : 'bg-ink text-white'}`}>{s.status}</span></td>
                  <td className="text-right">
                    {s.status === 'Active' && (
                      <button onClick={() => confirm(`Delete ${s.name}?`) && router.delete(`/listings/${s.slug}`, { preserveScroll: true })} className="underline">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="text-sm text-black/60">No listings yet.</p>}
      </section>
    </AppLayout>
  );
}