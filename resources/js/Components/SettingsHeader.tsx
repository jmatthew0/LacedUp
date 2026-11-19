import { Link } from '@inertiajs/react';

const tabs = [
  ['profile', '/settings', 'Profile'],
  ['addresses', '/addresses', 'Addresses'],
  ['payments', '/settings/payments', 'Payment methods'],
  ['security', '/settings/security', 'Security'],
  ['notifications', '/settings/notifications', 'Notifications'],
] as const;

export default function SettingsHeader({ tab }: { tab: string }) {
  return (
    <>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ember">Account</p>
      <h1 className="display text-4xl sm:text-5xl">Account settings</h1>
      <nav aria-label="Settings sections" className="mt-4 flex gap-6 overflow-x-auto border-b border-stone text-sm">
        {tabs.map(([key, href, label]) => (
          <Link key={key} href={href} className={`-mb-px whitespace-nowrap border-b-2 pb-3 ${tab === key ? 'border-ember font-semibold text-ink' : 'border-transparent text-black/60 hover:text-ink'}`}>{label}</Link>
        ))}
      </nav>
      <div className="h-6" />
    </>
  );
}