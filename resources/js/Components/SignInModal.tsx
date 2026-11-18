import { Link } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function SignInModal({ open, onClose, message }: { open: boolean; onClose: () => void; message: string }) {
  return (
    <Modal open={open} onClose={onClose} title="Sign in to continue">
      <p className="text-sm text-black/70">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-full border border-ink/40 px-5 py-2.5 text-sm">Not now</button>
        <Link href="/sign-in" className="rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-white">Sign in</Link>
      </div>
    </Modal>
  );
}