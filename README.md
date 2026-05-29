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
