import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

createInertiaApp({
  title: (t) => (t ? `${t} — Laced Up` : 'Laced Up — Sneaker Marketplace'),
  // Pages load lazily. The cast only satisfies Inertia's stricter types.
  resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')) as never,
  setup({ el, App, props }) {
    if (!el) return;
    createRoot(el).render(<App {...props} />);
  },
});