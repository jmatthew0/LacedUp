import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function SupportModal({ type, onClose }: { type: 'message' | 'issue' | null; onClose: () => void }) {
  const user = usePage<{ auth?: { user: { email: string } | null } }>().props.auth?.user;
  const [email, setEmail] = useState(user?.email ?? '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const close = () => { onClose(); setTimeout(() => { setSent(false); setMessage(''); setError(''); }, 200); };
  const send = () => router.post('/support', { type, email, message }, {
    preserveScroll: true,
    onStart: () => { setBusy(true); setError(''); },
    onFinish: () => setBusy(false),
    onError: (e) => setError(e.message ?? e.email ?? 'Could not send your message.'),
    onSuccess: () => setSent(true),
  });

  return (
    <Modal open={!!type} onClose={close} title={type === 'issue' ? 'Report an issue' : 'Message support'} size="md">
      {sent ? (
        <>
          <p className="text-sm text-black/70">Thanks, we got your message. Our team usually replies within a few hours.</p>
          <div className="mt-6 flex justify-end"><button onClick={close} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">Done</button></div>
        </>
      ) : (
        <>
          <label className="block text-xs font-semibold">Your email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-full bg-paper px-4 py-2.5 text-sm font-normal" />
          </label>
          <label className="mt-3 block text-xs font-semibold">{type === 'issue' ? 'What went wrong?' : 'How can we help?'}
            <textarea rows={5} maxLength={2000} value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1 w-full rounded-2xl bg-paper px-4 py-3 text-sm font-normal" />
          </label>
          {error && <p className="mt-2 text-xs text-ember">{error}</p>}
          <div className="mt-6 flex justify-end gap-2">
            <button onClick={close} className="rounded-full border border-ink/40 px-5 py-2.5 text-sm">Cancel</button>
            <button disabled={busy || !email || message.trim().length < 10} onClick={send} className="rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40">{busy ? 'Sending' : 'Send'}</button>
          </div>
        </>
      )}
    </Modal>
  );
}