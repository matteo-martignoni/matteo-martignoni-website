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

## OdE test site (`/OdE-v2`)

A **redesign of the OdE microsite, published side by side with the original** for
comparison. It lives at `/OdE-v2` (IT) and `/OdE-v2/en` (EN). The original `/OdE`
is untouched: not one of its files is modified, and neither is
`astro.config.mjs`.

### Why the route is named `/OdE-v2`

Because the sitemap filter already covers it. `astro.config.mjs` contains

```js
filter: (page) => !page.includes('/OdE'),
```

and the string `/OdE-v2` contains `/OdE`, so every page of the test site is
already excluded from the sitemap **without touching the config**. Any other
name would have required editing a shared file.

### Structure

```
src/pages/OdE-v2/            IT default (/OdE-v2) + EN mirror under /OdE-v2/en
src/layouts/OdeV2Layout.astro  isolated layout (own header/footer/nav, noindex)
src/styles/ode-v2-theme.css    v2-only additions, scoped under .ode-v2
src/components/ode-v2/         DataTag, Sources, StatCard, Status, Finding,
                               Callout, ClaimTable, Doors, KeyValue, ReadNext
src/i18n/ode-v2.ts             route map, UI strings, per-page meta
src/lib/ode-v2/sources.ts      footnote source resolver (DOIs, EUR-Lex, FAO)
PLAN.md                        the redesign plan and the checkpoint decisions
docs/ode-v2/QA.md              the delivery checklist and how to re-run it
```

The v2 site **imports the original OdE brand tokens unchanged**
(`src/styles/ode-theme.css`) and reuses several original components read-only
(`Section`, `BarChart`, `ControlLoop`, `PassportSections`, `LifecycleFlow`,
`CowGlyph`, `DropMark`) plus the AMSA Live simulation engine in `src/lib/ode/`.
`DataTag`, `Sources` and `StatCard` are duplicated rather than reused, because
they resolve against an extended source list; extending the original in place
would have changed how `/OdE` renders its own footnotes.

### Pages

| IT | EN | What it does |
|---|---|---|
| `/OdE-v2` | `/OdE-v2/en` | Opens with the verified fact, not the promise. Three doors, three stated limits |
| `/OdE-v2/audit` | `/OdE-v2/en/audit` | The evidence gap, the matrix errors in the most cited review, the claim taxonomy |
| `/OdE-v2/tesi` | `/OdE-v2/en/thesis` | Acid value, the hydrolysis complication, where OdE cannot compete |
| `/OdE-v2/amsa` | `/OdE-v2/en/amsa` | The instrument, the measured parameters, the Digital Lipid Passport |
| `/OdE-v2/filiera` | `/OdE-v2/en/supply-chain` | Provenance as documented input, and where traceability breaks |
| `/OdE-v2/posizione` | `/OdE-v2/en/position` | The squeeze, the three-legged verdict, the sizing gaps |
| `/OdE-v2/normativa` | `/OdE-v2/en/regulation` | Documentary survey, the EUDR asymmetry with its caveats |
| `/OdE-v2/evidenza` | `/OdE-v2/en/open-evidence` | Gaps, experiments with costs, gates and stopping criteria |
| `/OdE-v2/investitori` | `/OdE-v2/en/investors` | The two-part verdict, the real numbers, the failure conditions |
| `/OdE-v2/glossario` | `/OdE-v2/en/glossary` | Seven groups of terms |
| `/OdE-v2/amsa-live` | `/OdE-v2/en/amsa-live` | The demonstration dashboard |

**English is the source language.** Copy is written in English and rendered into
Italian, which is why the English routes carry English slugs while the route
keys that address them stay stable and language-neutral: the language switch
resolves on keys, so it always lands on the same page in the other language.
`DataTag` reads the locale from the route, so a source badge says "Source" in
English and "Fonte" in Italian.

Both languages are complete, and the two versions carry the same number of
footnotes page by page, which is the quickest way to spot a reference lost on
one side.

The default locale has **not** been flipped: `/OdE-v2` still serves Italian.
Whether English should also become the default, with Italian moving under
`/it`, is a decision about the project's primary audience and is left to the
client.

### Isolation (five independent mechanisms)

1. **Separate layout** — `OdeV2Layout` renders its own header and footer; the
   host `Header.astro` / `Navigation.astro` are never used.
2. **No inbound links** — nothing in the host site or in `/OdE` mentions
   `/OdE-v2`.
3. **No outbound links** — nothing in `/OdE-v2` links to `/OdE`.
4. **`noindex, nofollow`** — on every page, plus an explicit `googlebot` tag.
5. **Sitemap exclusion** — inherited from the existing filter, no config change.

All five are verified automatically. See `docs/ode-v2/QA.md`.

### Browsing it offline

To get a copy that opens in a browser with a double click, no server involved:

```bash
npm run build
python3 docs/ode-v2/export-static.py     # -> sito-ode-v2/
```

The exporter rewrites the absolute paths Astro emits (`/OdE-v2/...`,
`/_astro/...`) into relative ones, points directory links at their `index.html`,
and turns the ES module scripts into classic ones, because Chrome blocks modules
over `file://`. The AMSA Live dashboard is inlined so it still runs. Content is
identical to what the server serves; only the referencing changes. The folder
gets an `index.html` of its own listing both languages, plus a short `LEGGIMI.txt`.

Both `sito-ode-v2/` and `sito-ode-v2.zip` are gitignored.

### Comparing the two versions

```bash
npm install
npm run dev
```

Then open the two side by side:

| | Original | Test site |
|---|---|---|
| Home | http://localhost:4321/OdE | http://localhost:4321/OdE-v2 |
| English | http://localhost:4321/OdE/en | http://localhost:4321/OdE-v2/en |
| Dashboard | http://localhost:4321/OdE/amsa-live | http://localhost:4321/OdE-v2/amsa-live |

Both are built from the same `main`, so a single `npm run dev` serves both. The
test site carries a black bar at the top of every page saying it is a test
version; that bar is the first thing to remove on promotion.

### Verifying the isolation yourself

```bash
git diff --name-only main           # nothing under src/pages/OdE/, src/lib/ode/,
                                    # src/components/ode/, src/i18n/ode.ts,
                                    # src/styles/ode-theme.css, astro.config.mjs
npm run build
python3 docs/ode-v2/qa.py           # the full Phase 6 checklist
```

### Promoting the test site, if approved

The promotion is a rename plus three deletions. Nothing else changes: the
sitemap filter and the `noindex` stay valid for `/OdE` as they are.

```bash
git checkout -b promote-ode-v2

# 1. Park the current site in the local recycle bin (git-ignored, outside src/)
mkdir -p _trash/OdE-v1
git mv src/pages/OdE            _trash/OdE-v1/pages-OdE
git mv src/layouts/OdeLayout.astro _trash/OdE-v1/
git mv src/i18n/ode.ts          _trash/OdE-v1/

# 2. Promote the test site into the live route
git mv src/pages/OdE-v2 src/pages/OdE

# 3. Rename the v2 modules to the plain names and update the imports
git mv src/layouts/OdeV2Layout.astro src/layouts/OdeLayout.astro
git mv src/i18n/ode-v2.ts            src/i18n/ode.ts
#    then, in src/i18n/ode.ts, replace every '/OdE-v2' with '/OdE'
#    and, across src/pages/OdE/ and src/components/ode-v2/, replace
#    'OdeV2Layout' with 'OdeLayout' and 'i18n/ode-v2' with 'i18n/ode'

# 4. Remove the test banner
#    in src/layouts/OdeLayout.astro delete the <p class="testbar"> line
#    and the .testbar rule in src/styles/ode-v2-theme.css

npm run build                        # must end with "[build] Complete!"
```

Only after the client decides the site should also become **visible** from the
personal site do the existing instructions in the section above apply: add a nav
entry, remove the `noindex`, and drop the sitemap `filter` line.

### What still needs client input

Five placeholders (in both languages) are marked in-page with a hatched "Da
confermare" chip and listed in `docs/ode-v2/QA.md`. The reference capital figure
is settled at 350,000 euros. Two items still gate publication: whether the use
of artificial intelligence in AMSA is substantial or marginal, which is what the
innovative-startup classification would rest on, and whether the three doors
need separate contact addresses.

### Data honesty

The AMSA LIVE dashboard is a **demonstration simulation**, labelled as such in
the UI; band assignments are real, intensities and scores are heuristics. Market
figures carry `[FONTE]` / `[STIMA]` / `[BENCHMARK]` tags per the OdE brand rules.
