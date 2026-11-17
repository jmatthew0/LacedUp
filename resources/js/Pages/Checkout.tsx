import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { peso } from '@/lib/format';
import { BagLine } from '@/types';

const methods = [['Standard', '3 to 5 days', 120], ['Express', '1 to 2 days', 260], ['Meetup at Laced Up hub', 'Pick up on a scheduled slot', 0]] as const;
const pays = ['GCash', 'Credit or debit card', 'Cash on meetup'];
const field = 'w-full rounded-full bg-paper px-4 py-2.5 text-sm';
type Key = 'name' | 'phone' | 'address' | 'city' | 'postal';

export default function Checkout({ items, fee }: { items: BagLine[]; fee: number }) {
  const [step, setStep] = useState(0);
  const form = useForm({ name: '', phone: '', address: '', city: '', postal: '', shipping: 'Standard', payment: 'GCash' });
  const shipCost = methods.find((m) => m[0] === form.data.shipping)![2];
  const sub = items.reduce((t, s) => t + s.price, 0);

  const input = (key: Key, placeholder: string) => (
    <div>
      <input className={field} placeholder={placeholder} aria-label={placeholder} value={form.data[key]} onChange={(e) => form.setData(key, e.target.value)} />
      {form.errors[key] && <p className="mt-1 px-2 text-xs text-ember">{form.errors[key]}</p>}
    </div>
  );

  return (
    <AppLayout>
      <Head title="Checkout" />
      <h1 className="display mt-6 text-5xl">Checkout</h1>
      <ol className="my-6 grid grid-cols-3 gap-2 text-xs">
        {['Shipping', 'Payment', 'Review'].map((n, i) => (
          <li key={n} className={`border-t-2 pt-2 ${i <= step ? 'border-ember font-semibold' : 'border-stone'}`}>{i + 1}. {n}</li>
        ))}
      </ol>
      <div className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl bg-white p-6">
          {step === 0 && (
            <div className="space-y-3">
              <h2 className="display text-lg">Shipping address</h2>
              {input('name', 'Full name')}{input('phone', 'Mobile number')}{input('address', 'Unit, street, barangay')}
              <div className="grid grid-cols-2 gap-3">{input('city', 'City')}{input('postal', 'Postal code')}</div>
              <h3 className="pt-3 text-sm font-semibold">Shipping method</h3>
              {methods.map(([n, d, c]) => (
                <label key={n} className={`flex cursor-pointer justify-between rounded-xl border p-3 text-sm ${form.data.shipping === n ? 'border-ink' : 'border-stone'}`}>
                  <span><input type="radio" checked={form.data.shipping === n} onChange={() => form.setData('shipping', n)} className="mr-2 accent-ember" />{n}<br /><small className="pl-5 text-black/50">{d}</small></span>
                  <b>{c ? peso(c) : 'Free'}</b>
                </label>
              ))}
            </div>
          )}
          {step === 1 && (
            <div className="space-y-3">
              <h2 className="display text-lg">Payment</h2>
              {pays.map((n) => (
                <label key={n} className={`flex cursor-pointer gap-2 rounded-xl border p-3 text-sm ${form.data.payment === n ? 'border-ink' : 'border-stone'}`}>
                  <input type="radio" checked={form.data.payment === n} onChange={() => form.setData('payment', n)} className="accent-ember" />{n}
                </label>
              ))}
            </div>
          )}
          {step === 2 && (
            <div className="space-y-2 text-sm">
              <h2 className="display text-lg">Review</h2>
              <p>Ship to {form.data.name}, {form.data.address}, {form.data.city} {form.data.postal}</p>
              <p>Shipping: {form.data.shipping}</p>
              <p>Payment: {form.data.payment}</p>
              <p className="text-xs text-black/60">Your money is held in escrow until you confirm delivery.</p>
            </div>
          )}
          <div className="mt-6 flex justify-between">
            <button disabled={!step} onClick={() => setStep(step - 1)} className="rounded-full border border-ink/40 px-5 py-2.5 text-sm disabled:opacity-30">Back</button>
            {step < 2 ? (
              <button onClick={() => setStep(step + 1)} className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white">Continue to {step ? 'review' : 'payment'}</button>
            ) : (
              <button disabled={form.processing} onClick={() => form.post('/checkout', { onError: () => setStep(0) })} className="rounded-full bg-ember px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                {form.processing ? 'Placing order' : 'Place order'}
              </button>
            )}
          </div>
        </section>
        <aside className="h-fit rounded-2xl bg-white p-5 text-xs">
          <h2 className="display mb-3 text-base">Order summary</h2>
          <div className="space-y-3">
            {items.map((s) => (
              <div key={s.id} className="flex gap-3">
                <img src={s.image} alt="" className="h-14 w-14 rounded-lg bg-stone object-contain" />
                <div><b className="text-sm">{s.name}</b><br />{s.size ? `US ${s.size} · ` : ''}{peso(s.price)}</div>
              </div>
            ))}
          </div>
          <dl className="my-4 space-y-2">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{peso(sub)}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd>{shipCost ? peso(shipCost) : 'Free'}</dd></div>
            <div className="flex justify-between"><dt>Service fee</dt><dd>{peso(fee)}</dd></div>
          </dl>
          <p className="display border-t border-stone pt-3 text-xl">{peso(sub + shipCost + fee)}</p>
        </aside>
      </div>
    </AppLayout>
  );
}