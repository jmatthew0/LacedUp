import { router, usePage } from '@inertiajs/react';

interface Shared { auth: { user: unknown | null }; saved: string[]; [key: string]: unknown }

export default function HeartButton({ slug, className = '' }: { slug: string; className?: string }) {
  const { auth, saved } = usePage<Shared>().props;
  const on = saved.includes(slug);

  const click = () => {
    if (!auth.user) return router.visit('/sign-in');
    router.post(`/saved/${slug}`, {}, { preserveScroll: true, preserveState: true });
  };

  return (
    <button onClick={click} aria-pressed={on} aria-label={on ? 'Remove from saved pairs' : 'Save pair'}
      className={`grid h-8 w-8 place-items-center rounded-full bg-white/90 text-base hover:text-ember ${on ? 'text-ember' : 'text-ink/50'} ${className}`}>
      {on ? '♥' : '♡'}
    </button>
  );
}