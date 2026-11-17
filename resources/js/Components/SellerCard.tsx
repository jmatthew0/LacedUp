import { Link } from '@inertiajs/react';
import { Seller } from '@/types';

export default function SellerCard({ s }: { s: Seller }) {
  return (
    <article className="h-full rounded-2xl bg-white p-4">
      <Link href={`/sellers/${s.handle}`} className="text-sm font-bold hover:text-ember">{s.name}</Link>
      <p className="text-[11px] text-black/50">@{s.handle}</p>
      <p className="mt-3 min-h-[48px] text-xs text-black/70">{s.bio}</p>
      <dl className="my-4 grid grid-cols-3 border-y border-stone py-3 text-center">
        {[[s.sales, 'Sales'], [s.rating.toFixed(1), 'Rating'], [`${s.onTime}%`, 'On time']].map(([v, l]) => (
          <div key={l as string}><dd className="font-bold">{v}</dd><dt className="text-[10px] text-black/50">{l}</dt></div>
        ))}
      </dl>
      <button className="w-full rounded-full border border-ink/40 py-2 text-xs font-semibold hover:bg-ink hover:text-white">Follow</button>
    </article>
  );
}
