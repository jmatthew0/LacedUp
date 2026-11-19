import { Head } from '@inertiajs/react';
import { ReactNode, useEffect, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';

export interface Section { id: string; title: string; body: string; extra?: ReactNode }
interface Props { title: string; updated: string; summary: string[]; sections: Section[]; sidebarExtra?: ReactNode }

export default function LegalLayout({ title, updated, summary, sections, sidebarExtra }: Props) {
  const [active, setActive] = useState(sections[0].id);

  useEffect(() => {
    const seen = new Map<string, number>();
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.set(e.target.id, e.boundingClientRect.top) : seen.delete(e.target.id)));
      const first = [...seen.entries()].sort((a, b) => a[1] - b[1])[0];
      if (first) setActive(first[0]);
    }, { rootMargin: '-15% 0px -70% 0px' });
    sections.forEach((s) => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [sections]);

  return (
    <AppLayout>
      <Head title={title} />
      <div className="mt-8 flex flex-wrap items-start justify-between gap-4 border-b border-stone pb-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ember">Legal</p>
          <h1 className="display text-4xl sm:text-5xl">{title}</h1>
          <p className="mt-2 text-xs text-black/60">Last updated {updated}</p>
        </div>
        <button onClick={() => window.print()} className="no-print rounded-full border border-ink/40 px-5 py-2 text-xs font-semibold">Print</button>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[220px_1fr]">
        <aside className="no-print h-fit space-y-4 md:sticky md:top-4">
          <nav aria-label="Contents" className="rounded-2xl bg-white p-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-black/50">Contents</p>
            <ol className="space-y-1">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className={`flex gap-2 rounded-lg px-3 py-2 text-xs ${active === s.id ? 'bg-ink font-semibold text-white' : 'bg-paper hover:bg-stone'}`}>
                    <span>{i + 1}</span><span>{s.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          {sidebarExtra}
        </aside>

        <article className="max-w-2xl">
          <div className="rounded-2xl bg-ink p-5 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ember">Summary</p>
            <ul className="mt-3 space-y-2 text-xs">
              {summary.map((t) => <li key={t} className="flex gap-2"><span className="text-ember">✓</span>{t}</li>)}
            </ul>
          </div>
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-6 pt-10">
              <h2 className="display text-xl">{i + 1}. {s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-black/70">{s.body}</p>
              {s.extra}
            </section>
          ))}
        </article>
      </div>
    </AppLayout>
  );
}