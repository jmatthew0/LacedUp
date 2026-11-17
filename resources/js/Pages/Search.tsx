import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import SneakerCard from '@/Components/SneakerCard';
import AppLayout from '@/Layouts/AppLayout';
import { Sneaker } from '@/types';

export default function Search({ q, results }: { q: string; results: Sneaker[] }) {
  const [text, setText] = useState(q);
  return (
    <AppLayout>
      <Head title="Search" />
      <h1 className="display mt-6 text-4xl">Results for “{q}”</h1>
      <form onSubmit={(e) => { e.preventDefault(); router.get('/search', { q: text }); }} className="my-4 flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} className="w-64 rounded-full bg-white px-4 py-2 text-sm" aria-label="Search" />
        {['retro', 'court', 'runner', 'trail'].map((t) => <button type="button" key={t} onClick={() => router.get('/search', { q: t })} className="rounded-full bg-white px-3 text-xs">{t}</button>)}
      </form>
      <p className="mb-4 text-xs text-black/60">{results.length} results</p>
      {results.length ? <div className="grid gap-6 sm:grid-cols-3">{results.map((s) => <SneakerCard key={s.slug} s={s} />)}</div>
        : <p className="rounded-2xl bg-white p-8 text-center text-sm">No pairs found. Try “retro” or “runner”.</p>}
    </AppLayout>
  );
}