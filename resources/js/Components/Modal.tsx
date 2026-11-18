import { PropsWithChildren, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface Props { open: boolean; onClose: () => void; title: string; size?: 'sm' | 'md' }

const focusable = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

export default function Modal({ open, onClose, title, size = 'sm', children }: PropsWithChildren<Props>) {
  const panel = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return close.current();
      if (e.key !== 'Tab' || !panel.current) return;
      const items = panel.current.querySelectorAll<HTMLElement>(focusable);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-end sm:place-items-center">
      <button aria-label="Close dialog" tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-black/50" />
      <div ref={panel} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1}
        className={`relative max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-xl outline-none sm:rounded-3xl ${size === 'md' ? 'sm:max-w-lg' : 'sm:max-w-sm'}`}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="display text-xl">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-paper">✕</button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}