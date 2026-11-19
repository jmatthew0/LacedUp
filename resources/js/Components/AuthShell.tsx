import { Link } from '@inertiajs/react';
import { Fragment, PropsWithChildren } from 'react';

const steps = ['Request', 'Check email', 'New password'];

export default function AuthShell({ step, children }: PropsWithChildren<{ step: number }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-stone">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="display text-lg">Laced<span className="text-ember">Up</span></Link>
          <Link href="/sign-in" className="text-xs text-black/60 hover:text-ink">← Back to sign in</Link>
        </div>
      </header>
      <main className="flex flex-1 justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <ol className="mb-6 flex items-center gap-2 text-xs">
            {steps.map((s, i) => (
              <Fragment key={s}>
                {i > 0 && <span aria-hidden="true" className="h-px flex-1 bg-stone" />}
                <li className="flex items-center gap-2">
                  <span className={`grid h-6 w-6 place-items-center rounded-full border text-[11px] font-semibold ${i <= step ? 'border-ink bg-ink text-white' : 'border-stone bg-white'}`}>{i + 1}</span>
                  <span className={`hidden sm:inline ${i === step ? 'font-semibold' : 'text-black/50'}`}>{s}</span>
                </li>
              </Fragment>
            ))}
          </ol>
          <div className="rounded-3xl bg-white p-8">{children}</div>
        </div>
      </main>
      <footer className="border-t border-stone py-5 text-center text-xs text-black/60">© 2026 Laced Up. All rights reserved.</footer>
    </div>
  );
}