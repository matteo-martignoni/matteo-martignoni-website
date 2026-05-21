// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Astro configuration
// — Bilingual EN/IT: English at root (/), Italian at /it/
// — Tailwind v4 via official Vite plugin
// https://docs.astro.build/en/reference/configuration-reference/

export default defineConfig({
  site: 'https://matteomartignoni.com',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'it'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
