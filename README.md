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
_trash/             Local recycle bin — content removed from the site (git-ignored)
```

`_trash/` is a holding area for content pulled from the site. It lives outside
`src/` (so Astro never builds it) and is git-ignored (so it stays out of the repo
and deploys). See `_trash/README.md`. To restore an item, move it back into the
matching `src/` or `public/` location and re-add it to git.

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

## Making changes

`main` is what's live: every push to `main` triggers a Cloudflare rebuild and
deploy. A push that fails to build means the change never goes live — so always
build locally first.

Standard loop:

```bash
git checkout main
git pull origin main          # always pull first — keeps you in sync

git checkout -b my-change     # work on a branch, not directly on main
# ...make changes...

npm install                   # only if dependencies changed
npm run build                 # must end with "[build] Complete!", no errors

git add -A
git commit -m "Describe the change"

git checkout main
git merge my-change
git push origin main          # Cloudflare deploys automatically
```

For tiny, safe edits (a typo, some copy) you can skip the branch and work
directly on `main` — but still `pull` first and `build` before pushing.

Two rules that prevent trouble:

- **Always `git pull` before starting.** Skipping it causes the push to be
  rejected when `main` has moved on (e.g. a file edited on GitHub's website).
- **Edit in one place — your machine *or* GitHub's web UI, not both at once.**
  If you do edit on the web, `git pull` before touching anything locally.

If a push is rejected with a "fast-forward" error: `git pull origin main`,
build again, then push again.

## OdE microsite (`/OdE`)

An isolated, investor-facing microsite for **Officina degli Estratti** lives
under `/OdE`. It is built inside this repo but is **not** part of the personal
site: it has its own layout, its own brand system (Roboto + mint palette), and
is reachable only via direct URL.

### Structure

```
src/pages/OdE/         IT default (/OdE) + EN mirror under /OdE/en
src/layouts/OdeLayout.astro   isolated layout (own header/footer/nav)
src/components/ode/     OdE-only components (NormCard for the regulatory page;
                        LifecycleFlow + CowGlyph for the traceability infographic)
src/styles/ode-theme.css      OdE brand tokens, scoped under .ode
src/i18n/ode.ts        OdE UI strings + route map
src/lib/ode/           AMSA LIVE simulation engine (ported + extended)
public/images/ode/     OdE-only assets (the cow/pig single-line hero illustration)
docs/ode/PLAN.md        original build plan and content gaps
docs/ode/AUDIT_PLAN.md  audit + expansion plan (second pass)
```

Pages: a vision-led home (with the cow/pig illustration), three content pillars
(`amsa`, `mercato`, `visione`), a technical deep-dive (`amsa/tecnica`), the
regulatory clock (`normativa`), the traceability page (`tracciabilita`, with the
birth-to-slaughter lifecycle infographic), the investor page (`investitori`), a
linkable glossary (`glossario`) and the interactive dashboard (`amsa-live`).
Every page has an EN mirror under `/OdE/en`.

### Isolation (how it stays hidden)

Four independent mechanisms keep `/OdE` off the personal site:

1. **Separate layout** — `OdeLayout` renders its own header/footer; the host
   `Header.astro` / `Navigation.astro` are never used, so no menu entry appears.
2. **No inbound links** — nothing in the host pages links to `/OdE`.
3. **`noindex, nofollow`** — every OdE page carries the robots meta tag.
4. **Sitemap exclusion** — `astro.config.mjs` filters `/OdE` out of the sitemap.

Local dev and deploy are the same as the rest of the site (`npm run dev`,
push to `main`). The dashboard is fully client-side (no backend).

### Enabling the navigation link later

When OdE should become visible from the personal site, add an entry to the
`nav` arrays in `src/components/Navigation.astro` **and** `src/components/Header.astro`
(both the desktop `navItems` and the mobile menu), pointing to `/OdE`. Then
remove the `noindex` meta in `src/layouts/OdeLayout.astro` and drop the
`filter` line in `astro.config.mjs` so the pages re-enter the sitemap. No other
change is required.

### Data honesty

The AMSA LIVE dashboard is a **demonstration simulation**, labelled as such in
the UI; band assignments are real, intensities and scores are heuristics. Market
figures carry `[FONTE]` / `[STIMA]` / `[BENCHMARK]` tags per the OdE brand rules.
