import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import SignInModal from '@/Components/SignInModal';

interface Shared { auth: { user: unknown | null }; saved: string[]; [key: string]: unknown }

export default function HeartButton({ slug, className = '' }: { slug: string; className?: string }) {
  const { auth, saved } = usePage<Shared>().props;
  const [ask, setAsk] = useState(false);
  const on = saved.includes(slug);

  const click = () => {
    if (!auth.user) return setAsk(true);
    router.post(`/saved/${slug}`, {}, { preserveScroll: true, preserveState: true });
  };

  return (
    <>
      <button onClick={click} aria-pressed={on} aria-label={on ? 'Remove from saved pairs' : 'Save pair'}
        className={`grid h-9 w-9 place-items-center rounded-full bg-white/90 text-base hover:text-ember ${on ? 'text-ember' : 'text-ink/50'} ${className}`}>
        {on ? '♥' : '♡'}
      </button>
      <SignInModal open={ask} onClose={() => setAsk(false)} message="Sign in to save pairs and find them again on your Saved pairs page." />
    </>
  );
}