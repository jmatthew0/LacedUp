import { Head } from '@inertiajs/react';
import { useState } from 'react';
import SneakerCard from '@/Components/SneakerCard';
import AppLayout from '@/Layouts/AppLayout';
import { Seller, Sneaker } from '@/types';

export default function SellerProfile({ seller, listings }: { seller: Seller; listings: Sneaker[] }) {
  const [following, setFollowing] = useState(false);
  const [alerts, setAlerts] = useState(false);
  return (
    <AppLayout>
      <Head title={seller.name} />
      <header className="mt-4 overflow-hidden rounded-3xl bg-ink text-white"><div className="h-32 bg-gradient-to-r from-ember to-ink" />
        <div className="flex flex-wrap items-center justify-between gap-4 p-6"><div><h1 className="display text-3xl">{seller.name}</h1><p className="text-xs text-white/60">@{seller.handle}</p><p className="mt-2 max-w-md text-sm text-white/80">{seller.bio}</p></div>
          <button onClick={() => setFollowing(!following)} className="rounded-full bg-white px-5 py-2 text-xs font-semibold text-ink">{following ? 'Following' : 'Follow'}</button></div></header>
      <div className="my-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{[[seller.sales, 'Sales'], [`${seller.rating} ★`, 'Rating'], [`${seller.onTime}%`, 'Shipped on time'], ['< 1h', 'Typical response']].map(([v, l]) => <div key={l as string} className="rounded-2xl bg-white p-4"><p className="display text-2xl">{v}</p><p className="text-[10px] text-black/50">{l}</p></div>)}</div>
      <div className="grid gap-6 md:grid-cols-[1fr_260px]">
        {listings.length ? <div className="grid gap-6 sm:grid-cols-2">{listings.map((s) => <SneakerCard key={s.slug} s={s} />)}</div> : <p className="rounded-2xl bg-white p-8 text-sm">No active listings right now. Follow to hear about the next drop.</p>}
        <aside className="h-fit rounded-2xl bg-ink p-5 text-white"><h2 className="display text-lg">Next drop Friday</h2><p className="my-2 text-xs text-white/70">Be first in line for new retro releases.</p>
          <button onClick={() => setAlerts(!alerts)} className="w-full rounded-full bg-white py-2.5 text-xs font-semibold text-ink">{alerts ? 'Alerts on' : 'Turn on alerts'}</button></aside>
      </div>
    </AppLayout>
  );
}