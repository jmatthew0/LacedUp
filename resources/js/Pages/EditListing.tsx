import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { peso } from '@/lib/format';

interface Pair {
  slug: string; name: string; image: string; type: string; audience: string; size: number;
  condition: string; price: number; box: boolean; receipt: boolean;
}

const conditions = ['Deadstock', 'Like new', 'Worn once', 'Good condition'];
const types = ['Retro', 'Court', 'Runner', 'Trail', 'Mid', 'Slides', 'Other'];
const audiences = ["Men's", "Women's", 'Unisex', "Kids'"];
const pill = (on: boolean) => `rounded-full border px-4 py-2 text-xs ${on ? 'border-ink bg-ink text-white' : 'border-stone'}`;

export default function EditListing({ pair }: { pair: Pair }) {
  const form = useForm({
    _method: 'put', name: pair.name, type: pair.type, audience: pair.audience, size: pair.size,
    condition: pair.condition, price: pair.price, photo: null as File | null, box_included: pair.box, receipt_included: pair.receipt,
  });
  const d = form.data;
  const e = form.errors;
  const preview = useMemo(() => (d.photo ? URL.createObjectURL(d.photo) : pair.image), [d.photo, pair.image]);
  const sizes = Array.from(new Set([7, 8, 9, 10, 11, 12, 13, pair.size])).sort((a, b) => a - b);

  const submit = (ev: FormEvent) => { ev.preventDefault(); form.post(`/listings/${pair.slug}`, { forceFormData: true }); };
  const label = 'mb-2 block text-xs font-semibold';

  return (
    <AppLayout>
      <Head title={`Edit ${pair.name}`} />
      <p className="mt-6 text-xs text-black/60"><Link href="/dashboard" className="hover:text-ink">Dashboard</Link> › Edit listing</p>
      <h1 className="display mt-2 text-4xl sm:text-5xl">Edit listing</h1>

      <form onSubmit={submit} className="mt-6 grid gap-6 md:grid-cols-[1fr_300px]">
        <section className="space-y-5 rounded-2xl bg-white p-6">
          <div>
            <label className={label} htmlFor="name">Pair name</label>
            <input id="name" value={d.name} maxLength={80} onChange={(ev) => form.setData('name', ev.target.value)} className="w-full rounded-full bg-paper px-4 py-2.5 text-sm" />
            {e.name && <p className="mt-1 px-2 text-xs text-ember">{e.name}</p>}
          </div>

          <div><p className={label}>Type</p><div className="flex flex-wrap gap-2">{types.map((t) => <button key={t} type="button" onClick={() => form.setData('type', t)} aria-pressed={d.type === t} className={pill(d.type === t)}>{t}</button>)}</div></div>
          <div><p className={label}>For</p><div className="flex flex-wrap gap-2">{audiences.map((a) => <button key={a} type="button" onClick={() => form.setData('audience', a)} aria-pressed={d.audience === a} className={pill(d.audience === a)}>{a}</button>)}</div></div>

          <div>
            <p className={label}>Size (US)</p>
            <div className="flex flex-wrap gap-2">{sizes.map((n) => <button key={n} type="button" onClick={() => form.setData('size', n)} aria-pressed={d.size === n} className={`h-10 min-w-12 rounded-lg border px-3 text-sm ${d.size === n ? 'border-ink bg-ink text-white' : 'border-stone'}`}>{n}</button>)}</div>
          </div>

          <div><p className={label}>Condition</p><div className="flex flex-wrap gap-2">{conditions.map((c) => <button key={c} type="button" onClick={() => form.setData('condition', c)} aria-pressed={d.condition === c} className={pill(d.condition === c)}>{c}</button>)}</div></div>

          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" className="accent-ember" checked={d.box_included} onChange={(ev) => form.setData('box_included', ev.target.checked)} />Original box included</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="accent-ember" checked={d.receipt_included} onChange={(ev) => form.setData('receipt_included', ev.target.checked)} />Receipt included</label>
          </div>

          <div>
            <label className={label} htmlFor="price">Ask price (₱)</label>
            <input id="price" type="number" min={100} value={d.price || ''} onChange={(ev) => form.setData('price', +ev.target.value)} className="w-full rounded-full bg-paper px-4 py-2.5 text-sm" />
            {e.price && <p className="mt-1 px-2 text-xs text-ember">{e.price}</p>}
            {d.price > 0 && d.price !== pair.price && <p className="mt-1 px-2 text-[11px] text-black/60">Changing the price closes any open offers at or above {peso(d.price)}.</p>}
          </div>

          <div>
            <p className={label}>Photo</p>
            <label className="block cursor-pointer rounded-xl border border-dashed border-stone p-5 text-center text-xs text-black/60">
              {d.photo ? d.photo.name : 'Choose a new photo (JPG or PNG, up to 4 MB), or leave this to keep the current one.'}
              <input type="file" accept="image/*" className="sr-only" onChange={(ev) => form.setData('photo', ev.target.files?.[0] ?? null)} />
            </label>
            {e.photo && <p className="mt-1 px-2 text-xs text-ember">{e.photo}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-stone pt-5">
            <Link href="/dashboard" className="rounded-full border border-ink/40 px-5 py-2.5 text-sm">Cancel</Link>
            <button disabled={form.processing || d.name.trim().length < 2 || d.price < 100} className="rounded-full bg-ember px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-40">{form.processing ? 'Saving' : 'Save changes'}</button>
          </div>
        </section>

        <aside className="h-fit overflow-hidden rounded-2xl bg-white">
          <p className="p-3 text-[10px] text-black/50">Live preview</p>
          <div className="grid aspect-square place-items-center bg-stone"><img src={preview} alt={d.name} className="max-h-[80%] object-contain" /></div>
          <div className="p-4">
            <p className="display text-lg">{d.name.trim() || 'Your pair'}</p>
            <p className="text-xs text-black/60">{d.type} · {d.audience} · US {d.size} · {d.condition}</p>
            <p className="mt-2 text-sm font-bold">{peso(d.price)}</p>
          </div>
        </aside>
      </form>
    </AppLayout>
  );
}