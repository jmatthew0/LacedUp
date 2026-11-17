import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

createInertiaApp({
  title: (t) => (t ? `${t} — Laced Up` : 'Laced Up — Sneaker Marketplace'),
  resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
  setup({ el, App, props }) { createRoot(el).render(<App {...props} />); },
});
