import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { peso } from '@/lib/format';
import { Sneaker } from '@/types';

const steps = ['Find your pair', 'Add photos', 'Size and condition', 'Set your price'];
const conditions = ['Deadstock', 'Like new', 'Worn once', 'Good condition'];

export default function Sell({ models }: { models: Sneaker[] }) {
  const [step, setStep] = useState(0);
  const [q, setQ] = useState('');
  const [model, setModel] = useState<Sneaker | null>(null);
  const form = useForm({ model: '', size: 9, condition: conditions[0], price: 0, photo: null as File | null, box_included: true, receipt_included: false });

  const preview = useMemo(() => (form.data.photo ? URL.createObjectURL(form.data.photo) : model?.image), [form.data.photo, model]);
  const ok = [!!model, true, true, form.data.price > 0][step];
  const firstError = Object.values(form.errors)[0];

  return (
    <AppLayout>
      <Head title="List a pair" />
      <h1 className="display mt-6 text-4xl sm:text-5xl">List a pair</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-[180px_1fr_300px]">
      <ol className="flex flex-wrap gap-x-4 gap-y-1 text-xs md:block md:space-y-3 md:text-sm">
          {steps.map((n, i) => <li key={n} className={i === step ? 'font-bold' : 'text-black/50'}>{i + 1}. {n}</li>)}
        </ol>

        <section className="h-fit rounded-2xl bg-white p-6">
          <h2 className="display text-lg">{steps[step]}</h2>

          {step === 0 && (
            <div className="mt-4 space-y-2">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Ember Retro High" className="w-full rounded-full bg-paper px-4 py-2.5 text-sm" aria-label="Search model" />
              {models.filter((m) => m.name.toLowerCase().includes(q.toLowerCase())).map((m) => (
                <button key={m.slug} onClick={() => { setModel(m); form.setData('model', m.slug); }} className={`flex w-full justify-between rounded-xl border p-3 text-left text-sm ${model?.slug === m.slug ? 'border-ink' : 'border-stone'}`}>
                  {m.name}<span>→</span>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <label className="mt-4 block cursor-pointer rounded-xl border border-dashed border-stone p-10 text-center text-sm text-black/60">
              {form.data.photo ? form.data.photo.name : 'Choose a photo of your pair (JPG or PNG, up to 4 MB). Skip to use the catalog photo.'}
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => form.setData('photo', e.target.files?.[0] ?? null)} />
            </label>
          )}

          {step === 2 && (
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap gap-2">
                {[7, 8, 9, 10, 11, 12].map((n) => (
                  <button key={n} onClick={() => form.setData('size', n)} className={`h-10 w-12 rounded-lg border text-sm ${form.data.size === n ? 'border-ink bg-ink text-white' : 'border-stone'}`}>{n}</button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {conditions.map((c) => (
                  <button key={c} onClick={() => form.setData('condition', c)} className={`rounded-full border px-4 py-2 text-xs ${form.data.condition === c ? 'border-ink bg-ink text-white' : 'border-stone'}`}>{c}</button>
                ))}
              </div>
            </div>
          )}

        {step === 2 && (
          <div className="mt-4 space-y-2 border-t border-stone pt-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-ember" checked={form.data.box_included} onChange={(e) => form.setData('box_included', e.target.checked)} />Original box included
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-ember" checked={form.data.receipt_included} onChange={(e) => form.setData('receipt_included', e.target.checked)} />Receipt included
            </label>
          </div>
        )}

          {step === 3 && (
            <label className="mt-4 block text-sm">Ask price (₱)
              <input type="number" min={100} value={form.data.price || ''} onChange={(e) => form.setData('price', +e.target.value)} className="mt-2 w-full rounded-full bg-paper px-4 py-2.5" />
            </label>
          )}

          {firstError && <p className="mt-3 text-xs text-ember">{firstError}</p>}

          <div className="mt-6 flex justify-between">
            <button disabled={!step} onClick={() => setStep(step - 1)} className="rounded-full border border-ink/40 px-5 py-2.5 text-sm disabled:opacity-30">Back</button>
            {step < 3 ? (
              <button disabled={!ok} onClick={() => setStep(step + 1)} className="rounded-full bg-ember px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-40">Continue</button>
            ) : (
              <button disabled={!ok || form.processing} onClick={() => form.post('/listings', { forceFormData: true })} className="rounded-full bg-ember px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-40">
                {form.processing ? 'Publishing' : 'Publish listing'}
              </button>
            )}
          </div>
        </section>

        <aside className="h-fit overflow-hidden rounded-2xl bg-white">
          <p className="p-3 text-[10px] text-black/50">Live preview · Draft</p>
          <div className="grid aspect-square place-items-center bg-stone">
            {preview ? <img src={preview} alt={model?.name ?? 'Preview'} className="max-h-[80%] object-contain" /> : <span className="text-xs text-black/50">Select a model to start</span>}
          </div>
          <div className="p-4">
            <p className="display text-lg">{model?.name ?? 'Your pair'}</p>
            <p className="text-xs text-black/60">US {form.data.size} · {form.data.condition}</p>
            <p className="mt-2 text-sm font-bold">{peso(form.data.price)}</p>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}