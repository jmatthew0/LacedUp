import { router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export interface CaseRow { id: number; type: 'dispute' | 'return'; reason: string; details: string | null; code: string; buyer: string; date: string }

function Row({ c }: { c: CaseRow }) {
  const [action, setAction] = useState<'approve' | 'decline' | null>(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const kind = c.type === 'dispute' ? 'dispute' : 'return request';

  const send = () => action && router.post(`/disputes/${c.id}/respond`, { action, response: note }, {
    preserveScroll: true,
    onStart: () => setBusy(true),
    onFinish: () => setBusy(false),
    onSuccess: () => { setAction(null); setNote(''); },
  });

  return (
    <div className="border-t border-stone py-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span>
          <b>{c.type === 'dispute' ? 'Dispute' : 'Return'}</b> · {c.reason}
          <span className="ml-2 text-xs text-black/60">from {c.buyer} · order {c.code} · {c.date}</span>
        </span>
        <span className="flex gap-2">
          <button onClick={() => setAction('approve')} className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">Approve</button>
          <button onClick={() => setAction('decline')} className="rounded-full border border-ink/30 px-3 py-1 text-xs">Decline</button>
        </span>
      </div>
      {c.details && <p className="mt-1 text-xs text-black/70">“{c.details}”</p>}

      <Modal open={!!action} onClose={() => setAction(null)} title={`${action === 'approve' ? 'Approve' : 'Decline'} ${kind}`}>
        <p className="text-sm text-black/70">{c.buyer} reported: <b>{c.reason}</b> on order {c.code}.</p>
        <label className="mt-4 block text-xs font-semibold">Note to the buyer (optional)
          <textarea rows={3} maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} className="mt-1 w-full rounded-2xl bg-paper px-4 py-3 text-sm font-normal" />
        </label>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={() => setAction(null)} className="rounded-full border border-ink/40 px-5 py-2.5 text-sm">Cancel</button>
          <button disabled={busy} onClick={send} className={`rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 ${action === 'decline' ? 'bg-red-600' : 'bg-ink'}`}>
            {busy ? 'Sending' : action === 'approve' ? 'Approve' : 'Decline'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default function CaseList({ cases }: { cases: CaseRow[] }) {
  return (
    <section className="mt-6 rounded-2xl bg-white p-5">
      <h2 className="display mb-3 text-base">Disputes and returns</h2>
      {cases.length ? cases.map((c) => <Row key={c.id} c={c} />) : <p className="border-t border-stone pt-3 text-sm text-black/60">Nothing to review.</p>}
    </section>
  );
}