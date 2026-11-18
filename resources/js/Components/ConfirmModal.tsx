import Modal from '@/Components/Modal';

interface Props {
  open: boolean; title: string; message: string;
  confirmLabel?: string; cancelLabel?: string; danger?: boolean; busy?: boolean;
  onConfirm: () => void; onClose: () => void;
}

export default function ConfirmModal({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger, busy, onConfirm, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-black/70">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-full border border-ink/40 px-5 py-2.5 text-sm">{cancelLabel}</button>
        <button disabled={busy} onClick={onConfirm} className={`rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 ${danger ? 'bg-red-600' : 'bg-ink'}`}>
          {busy ? 'Please wait' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}