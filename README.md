# Matteo Martignoni — Website

Personal website. Brand development, premium and luxury. Italy and abroad.

## Stack

- **Astro 5** — static site generator
- **Tailwind CSS v4** — styling
- **Cloudflare Pages** — hosting and CDN

Hero and project videos are self-hosted MP4s in `public/`, served over the
Cloudflare CDN.

## Structure

```
src/
├── pages/          Routes — EN at /, IT at /it/
├── layouts/        Shared HTML structure
├── components/     Reusable Astro components
├── content/        Markdown content (projects, mentors, competencies)
├── styles/         Global CSS and Tailwind tokens
└── i18n/           UI translation strings

public/             Static assets (images, fonts, favicon)
```

## Languages

- English — default, at `/`
- Italian — at `/it/`

## Design tokens

Defined in `src/styles/global.css` via Tailwind v4 `@theme`:

- **Sage** — thought, contemplation (`bg-sage-100`, `text-sage-900`, etc.)
- **Terracotta** — matter, craft (`bg-terracotta-500`, `text-terracotta-900`, etc.)
- **Warm neutrals** — backgrounds and text (`bg-warm-50`, `text-ink-900`, etc.)

## Local development

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Site runs at `http://localhost:4321`.

## Build

```bash
npm run build
```

Output in `dist/`. Cloudflare Pages runs this automatically on every push.
