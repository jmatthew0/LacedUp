import { Head, Link } from '@inertiajs/react';
import SneakerCard from '@/Components/SneakerCard';
import AppLayout from '@/Layouts/AppLayout';
import { Sneaker } from '@/types';

export default function Saved({ pairs }: { pairs: Sneaker[] }) {
  return (
    <AppLayout>
      <Head title="Saved pairs" />
      <h1 className="display mt-6 text-4xl">Saved pairs</h1>
      <p className="mb-6 text-xs text-black/60">{pairs.length} saved</p>
      {pairs.length ? (
        <div className="grid gap-6 sm:grid-cols-3">{pairs.map((s) => <SneakerCard key={s.slug} s={s} />)}</div>
      ) : (
        <p className="rounded-2xl bg-white p-8 text-center text-sm">
          Nothing saved yet. Tap the heart on any pair to keep it here. <Link href="/" className="text-ember underline">Browse pairs</Link>
        </p>
      )}
    </AppLayout>
  );
}