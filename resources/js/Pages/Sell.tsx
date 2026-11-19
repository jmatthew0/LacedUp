import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { peso } from '@/lib/format';
import { Sneaker } from '@/types';

const steps = ['Name your pair', 'Add photos', 'Size and condition', 'Set your price'];
const conditions = ['Deadstock', 'Like new', 'Worn once', 'Good condition'];
const types = ['Retro', 'Court', 'Runner', 'Trail', 'Mid', 'Slides', 'Other'];
const audiences = ["Men's", "Women's", 'Unisex', "Kids'"];
const pill = (on: boolean) => `rounded-full border px-4 py-2 text-xs ${on ? 'border-ink bg-ink text-white' : 'border-stone'}`;

export default function Sell({ models }: { models: Sneaker[] }) {
  const [step, setStep] = useState(0);
  const form = useForm({
    name: '', type: 'Retro', audience: "Men's", model: '', size: 9, condition: conditions[0], price: 0,
    photo: null as File | null, box_included: true, receipt_included: false,
  });
  const d = form.data;

  const chosen = models.find((m) => m.slug === d.model) ?? null;
  const suggestions = useMemo(() => {
    const q = d.name.trim().toLowerCase();
    return q.length < 2 ? [] : models.filter((m) => m.name.toLowerCase().includes(q) && m.name.toLowerCase() !== q).slice(0, 4);
  }, [models, d.name]);

  const preview = useMemo(() => (d.photo ? URL.createObjectURL(d.photo) : chosen?.image ?? null), [d.photo, chosen]);

  const rename = (value: string) => form.setData({ ...d, name: value, model: chosen && value.trim().toLowerCase() === chosen.name.toLowerCase() ? d.model : '' });
  const pick = (m: Sneaker) => {
    const [type, audience] = m.category.split(' · ');
    form.setData({ ...d, name: m.name, model: m.slug, type: types.includes(type) ? type : 'Other', audience: audiences.includes(audience) ? audience : "Men's" });
  };

  const ok = [d.name.trim().length >= 2, !!d.photo || !!chosen, true, d.price > 0][step];
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
            <div className="mt-4 space-y-4">
              <label className="block text-xs font-semibold">Pair name
                <input value={d.name} onChange={(e) => rename(e.target.value)} maxLength={80} placeholder="e.g. Jordan 1 High Cut" className="mt-1 w-full rounded-full bg-paper px-4 py-2.5 text-sm font-normal" />
              </label>
              {suggestions.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[11px] text-black/50">Use an existing model (fills in the photo and type for you):</p>
                  {suggestions.map((m) => <button key={m.slug} onClick={() => pick(m)} className="flex w-full justify-between rounded-xl border border-stone p-3 text-left text-sm">{m.name}<span>→</span></button>)}
                </div>
              )}
              {chosen && <p className="rounded-xl bg-paper p-3 text-xs">Using the <b>{chosen.name}</b> model. You can still add your own photo on the next step.</p>}
              <div>
                <p className="mb-2 text-xs font-semibold">Type</p>
                <div className="flex flex-wrap gap-2">{types.map((t) => <button key={t} type="button" onClick={() => form.setData('type', t)} aria-pressed={d.type === t} className={pill(d.type === t)}>{t}</button>)}</div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold">For</p>
                <div className="flex flex-wrap gap-2">{audiences.map((a) => <button key={a} type="button" onClick={() => form.setData('audience', a)} aria-pressed={d.audience === a} className={pill(d.audience === a)}>{a}</button>)}</div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="mt-4">
              <label className="block cursor-pointer rounded-xl border border-dashed border-stone p-10 text-center text-sm text-black/60">
                {d.photo ? d.photo.name : chosen ? 'Choose your own photo (JPG or PNG, up to 4 MB), or skip to use the catalog photo.' : 'Choose a photo of your pair (JPG or PNG, up to 4 MB).'}
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => form.setData('photo', e.target.files?.[0] ?? null)} />
              </label>
              {!chosen && !d.photo && <p className="mt-2 text-xs text-black/60">A photo is required, because “{d.name || 'this pair'}” isn't a catalog model.</p>}
            </div>
          )}

          {step === 2 && (
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap gap-2">
                {[7, 8, 9, 10, 11, 12, 13].map((n) => (
                  <button key={n} onClick={() => form.setData('size', n)} className={`h-10 w-12 rounded-lg border text-sm ${d.size === n ? 'border-ink bg-ink text-white' : 'border-stone'}`}>{n}</button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {conditions.map((c) => <button key={c} onClick={() => form.setData('condition', c)} className={pill(d.condition === c)}>{c}</button>)}
              </div>
              <div className="space-y-2 border-t border-stone pt-4 text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" className="accent-ember" checked={d.box_included} onChange={(e) => form.setData('box_included', e.target.checked)} />Original box included</label>
                <label className="flex items-center gap-2"><input type="checkbox" className="accent-ember" checked={d.receipt_included} onChange={(e) => form.setData('receipt_included', e.target.checked)} />Receipt included</label>
              </div>
            </div>
          )}

          {step === 3 && (
            <label className="mt-4 block text-sm">Ask price (₱)
              <input type="number" min={100} value={d.price || ''} onChange={(e) => form.setData('price', +e.target.value)} className="mt-2 w-full rounded-full bg-paper px-4 py-2.5" />
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
            {preview ? <img src={preview} alt={d.name || 'Preview'} className="max-h-[80%] object-contain" /> : <span className="px-6 text-center text-xs text-black/50">Add a photo to see your pair here</span>}
          </div>
          <div className="p-4">
            <p className="display text-lg">{d.name.trim() || 'Your pair'}</p>
            <p className="text-xs text-black/60">{d.type} · {d.audience} · US {d.size} · {d.condition}</p>
            <p className="mt-2 text-sm font-bold">{peso(d.price)}</p>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}