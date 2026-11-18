import { router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

const reasons = {
  dispute: ['Item not as described', 'Item damaged', 'Wrong item or size', 'Not authentic', 'Not delivered'],
  return: ['Wrong size', 'Not as described', 'Damaged', 'Changed my mind'],
};
const copy = {
  dispute: { title: 'Open a dispute', note: 'Tell us what went wrong. The seller will respond, and your payment stays in escrow meanwhile.', button: 'Submit dispute' },
  return: { title: 'Request a return', note: 'Returns are accepted within 3 days of delivery. The seller reviews your request.', button: 'Request return' },
};

export default function CaseModal({ code, type, onClose }: { code: string; type: 'dispute' | 'return' | null; onClose: () => void }) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const t = type ?? 'dispute';

  const close = () => { setReason(''); setDetails(''); setError(''); onClose(); };

  const submit = () => router.post(`/orders/${code}/disputes`, { type: t, reason, details }, {
    preserveScroll: true,
    onStart: () => { setBusy(true); setError(''); },
    onFinish: () => setBusy(false),
    onError: (e) => setError(e.reason ?? e.type ?? 'Could not send your request.'),
    onSuccess: close,
  });

  return (
    <Modal open={!!type} onClose={close} title={copy[t].title} size="md">
      <p className="text-sm text-black/70">{copy[t].note}</p>
      <fieldset className="mt-4 space-y-2">
        <legend className="mb-1 text-xs font-semibold">Reason</legend>
        {reasons[t].map((r) => (
          <label key={r} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm ${reason === r ? 'border-ink' : 'border-stone'}`}>
            <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} className="accent-ember" />{r}
          </label>
        ))}
      </fieldset>
      <label className="mt-4 block text-xs font-semibold">Details (optional)
        <textarea rows={3} maxLength={500} value={details} onChange={(e) => setDetails(e.target.value)} className="mt-1 w-full rounded-2xl bg-paper px-4 py-3 text-sm font-normal" />
      </label>
      {error && <p className="mt-2 text-xs text-ember">{error}</p>}
      <div className="mt-6 flex justify-end gap-2">
        <button onClick={close} className="rounded-full border border-ink/40 px-5 py-2.5 text-sm">Cancel</button>
        <button disabled={!reason || busy} onClick={submit} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40">
          {busy ? 'Sending' : copy[t].button}
        </button>
      </div>
    </Modal>
  );
}