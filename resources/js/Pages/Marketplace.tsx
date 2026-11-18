import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import Carousel from '@/Components/Carousel';
import FilterBar from '@/Components/FilterBar';
import HeroSlide, { heroThemes } from '@/Components/HeroSlide';
import SellerCard from '@/Components/SellerCard';
import SneakerCard from '@/Components/SneakerCard';
import AppLayout from '@/Layouts/AppLayout';
import { HeroSlide as Hero, Seller, Sneaker } from '@/types';


interface Props { hero: Hero[]; sneakers: Sneaker[]; sellers: Seller[]; }

export default function Marketplace({ hero, sneakers, sellers }: Props) {
  const [size, setSize] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState(12000);
  const [deadstock, setDeadstock] = useState(false);

  const listings = useMemo(
    () => sneakers
      .filter((s) => (size ? s.sizes.includes(size) : true) && s.price <= maxPrice && (!deadstock || s.condition === 'Deadstock'))
      .sort((a, b) => a.price - b.price),
    [sneakers, size, maxPrice, deadstock],
  );

  const themes = useMemo(() => heroThemes(hero.map((h) => h.title)), [hero]);

  return (
    <AppLayout>
      <Head title="Marketplace" />

      <Carousel label="Featured drops" autoplayMs={6000} dots overlay>
      {hero.map((s, i) => <HeroSlide key={s.slug} s={s} theme={themes[i]} />)}
      </Carousel>

      <ul className="my-8 grid grid-cols-2 gap-4 border-y border-stone py-4 text-xs sm:grid-cols-4">
        {['Authenticity verified', 'Ships in 48 hours', 'Escrow payments', '4.9 average seller rating'].map((t) => <li key={t} className="font-semibold">{t}</li>)}
      </ul>

      <h2 className="display text-3xl">Shop all listings</h2>
      <div className="mt-4"><FilterBar size={size} onSize={setSize} maxPrice={maxPrice} onMaxPrice={setMaxPrice} deadstockOnly={deadstock} onDeadstock={setDeadstock} /></div>
      <p className="my-3 text-xs text-black/60">{listings.length} listings · Price: Low to High</p>

      {listings.length ? (
        <Carousel key={listings.map((l) => l.slug).join()} label="Listings" itemClass="w-[78%] sm:w-[calc(33.333%-11px)]">
          {listings.map((s) => <SneakerCard key={s.slug} s={s} />)}
        </Carousel>
      ) : (
        <p className="rounded-2xl bg-white p-8 text-center text-sm">No pairs match these filters. Try a higher max price or clear the size.</p>
      )}

      <h2 className="display mb-4 mt-14 text-3xl">Top sellers this week</h2>
      <Carousel label="Top sellers" itemClass="w-[80%] sm:w-[calc(25%-12px)]">
        {sellers.map((s) => <SellerCard key={s.handle} s={s} />)}
      </Carousel>
    </AppLayout>
  );
}
