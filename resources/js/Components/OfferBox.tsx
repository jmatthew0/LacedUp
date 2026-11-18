import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import SignInModal from '@/Components/SignInModal';
import { peso } from '@/lib/format';
import { Sneaker } from '@/types';

interface Shared { auth: { user: unknown | null }; [key: string]: unknown }

export default function OfferBox({ sneaker, size }: { sneaker: Sneaker; size: number | null }) {
  const { auth } = usePage<Shared>().props;
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const min = Math.ceil(sneaker.price * 0.5);
  const max = sneaker.price - 1;
  const chips = [0.9, 0.8, 0.7].map((p) => Math.round((sneaker.price * p) / 50) * 50).filter((n) => n >= min && n <= max);

  const close = () => { setOpen(false); setError(''); };
  const send = () => router.post('/offers', { slug: sneaker.slug, size: String(size), amount }, {
    onStart: () => { setBusy(true); setError(''); },
    onError: (e) => setError(e.amount ?? 'Could not send the offer.'),
    onFinish: () => setBusy(false),
  });

  return (
    <div className="mt-4">
      <button onClick={() => setOpen(true)} className="text-sm underline">Make an offer</button>

      {!auth.user ? (
        <SignInModal open={open} onClose={close} message="Sign in to make an offer. The seller can accept, counter, or decline." />
      ) : (
        <Modal open={open} onClose={close} title="Make an offer">
          <div className="flex items-center gap-3 rounded-2xl bg-paper p-3">
            <img src={sneaker.image} alt="" className="h-14 w-14 rounded-xl bg-stone object-contain" />
            <div className="text-sm"><b>{sneaker.name}</b><p className="text-xs text-black/60">{size ? `US ${size}` : 'No size picked'} · Asking {peso(sneaker.price)}</p></div>
          </div>

          {!size ? (
            <p className="mt-4 text-sm text-black/70">Pick a size on the page first, then make your offer.</p>
          ) : (
            <>
              <label className="mt-4 block text-xs font-semibold">Your offer (₱)
                <input type="number" autoFocus min={min} max={max} value={amount || ''} onChange={(e) => setAmount(+e.target.value)}
                  className="mt-1 w-full rounded-full bg-paper px-4 py-3 text-sm font-normal" />
              </label>
              <p className="mt-1 px-2 text-[11px] text-black/50">Between {peso(min)} and {peso(max)}</p>
              {chips.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {chips.map((n) => <button key={n} onClick={() => setAmount(n)} className="rounded-full border border-stone px-3 py-1.5 text-xs font-semibold hover:bg-paper">{peso(n)}</button>)}
                </div>
              )}
              {error && <p className="mt-3 text-xs text-ember">{error}</p>}
            </>
          )}

          <div className="mt-6 flex justify-end gap-2">
            <button onClick={close} className="rounded-full border border-ink/40 px-5 py-2.5 text-sm">Cancel</button>
            <button disabled={!size || !amount || busy} onClick={send} className="rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40">{busy ? 'Sending' : 'Send offer'}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}