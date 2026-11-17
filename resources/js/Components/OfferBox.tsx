import { useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { peso } from '@/lib/format';

interface Shared { auth: { user: unknown | null }; [key: string]: unknown }

export default function OfferBox({ slug, price, size }: { slug: string; price: number; size: number | null }) {
  const { auth } = usePage<Shared>().props;
  const [open, setOpen] = useState(false);
  const form = useForm({ slug, size: '', amount: 0 });
  const min = Math.ceil(price * 0.5);

  const send = () => {
    if (!auth.user) return router.visit('/sign-in');
    form.transform((d) => ({ ...d, size: String(size) })).post('/offers');
  };

  return (
    <div className="mt-4">
      <button onClick={() => setOpen(!open)} className="text-sm underline">Make an offer</button>
      {open && (
        <div className="mt-3 space-y-2 rounded-2xl bg-white p-4 text-sm">
          {!size && <p className="text-xs text-black/60">Pick a size above first.</p>}
          <label className="block text-xs">Your offer (₱{min.toLocaleString()} to {peso(price - 1)})
            <input type="number" value={form.data.amount || ''} onChange={(e) => form.setData('amount', +e.target.value)} className="mt-1 w-full rounded-full bg-paper px-4 py-2.5 text-sm" />
          </label>
          {form.errors.amount && <p className="text-xs text-ember">{form.errors.amount}</p>}
          <button disabled={!size || !form.data.amount || form.processing} onClick={send} className="rounded-full bg-ember px-5 py-2 text-xs font-semibold text-white disabled:opacity-40">Send offer</button>
        </div>
      )}
    </div>
  );
}