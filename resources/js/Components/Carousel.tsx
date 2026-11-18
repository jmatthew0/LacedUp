import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  children: ReactNode[];
  itemClass?: string;       // width of each slide, e.g. "w-full" or "w-[78%] sm:w-[31%]"
  autoplayMs?: number;      // omit to disable
  label: string;
  dots?: boolean;
  overlay?: boolean;        // draw dots and arrows on top of the slide (for the hero)
}

export default function Carousel({ children, itemClass = 'w-full', autoplayMs, label, dots, overlay }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = children.length;

  const go = useCallback((i: number) => {
    const el = track.current; if (!el) return;
    const next = (i + count) % count;
    const child = el.children[next] as HTMLElement;
    el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: 'smooth' });
    setIndex(next);
  }, [count]);

  useEffect(() => {
    if (!autoplayMs || paused || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => go(index + 1), autoplayMs);
    return () => clearInterval(t);
  }, [autoplayMs, paused, index, go]);

  const onScroll = () => {
    const el = track.current; if (!el) return;
    const w = (el.children[0] as HTMLElement).offsetWidth;
    setIndex(Math.round(el.scrollLeft / w));
  };

  const bar = overlay
    ? 'pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between p-6 sm:p-8'
    : 'mt-4 flex items-center justify-between';
  const dot = (on: boolean) => overlay
    ? `${on ? 'w-8 bg-white' : 'w-1.5 bg-white/40'}`
    : `${on ? 'w-8 bg-ember' : 'w-1.5 bg-black/25'}`;
  const arrow = overlay
    ? 'border-white/40 bg-black/10 text-white hover:bg-white hover:text-ink'
    : 'border-ink/30 bg-paper hover:bg-ink hover:text-white';

  return (
    <section aria-roledescription="carousel" aria-label={label} className="relative"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') go(index + 1); if (e.key === 'ArrowLeft') go(index - 1); }}>
      <div ref={track} onScroll={onScroll} tabIndex={0}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth">
        {children.map((c, i) => (
          <div key={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${count}`}
            className={`shrink-0 snap-start ${itemClass}`}>{c}</div>
        ))}
      </div>
      <div className={bar}>
        {dots ? (
          <div className="pointer-events-auto flex gap-1.5">
            {children.map((_, i) => (
              <button key={i} aria-label={`Go to slide ${i + 1}`} onClick={() => go(i)} className={`h-1.5 rounded-full transition-all ${dot(i === index)}`} />
            ))}
          </div>
        ) : <span />}
        <div className="pointer-events-auto flex gap-2">
          {(['←', '→'] as const).map((a, k) => (
            <button key={a} aria-label={k ? 'Next' : 'Previous'} onClick={() => go(index + (k ? 1 : -1))}
              className={`grid h-9 w-9 place-items-center rounded-full border text-sm ${arrow}`}>{a}</button>
          ))}
        </div>
      </div>
    </section>
  );
}