// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// Astro configuration
// — Bilingual EN/IT: English at root (/), Italian at /it/
// — Tailwind v4 via official Vite plugin
// — Cloudflare adapter for Workers + Assets deployment
// — output: 'static' — all pages are prerendered at build time
//   (we have no server-side routes; this is faster and more reliable)
// https://docs.astro.build/en/reference/configuration-reference/

export default defineConfig({
  site: 'https://matteomartignoni.com',
  output: 'static',
  adapter: cloudflare(),
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'it'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', it: 'it' },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
