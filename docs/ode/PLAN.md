# PLAN — Microsito /OdE (Officina degli Estratti)

> Documento di Fase 1. Vive nel branch `feat/ode-microsite`. Non linkato dal
> sito ospitante. Aggiornato durante l'avanzamento.

## Stack rilevato (ci si adatta, non si cambia)

- **Astro 5**, `output: 'static'` (prerender totale, nessun backend).
- **Tailwind v4** via plugin Vite; token host in `src/styles/global.css` (`@theme`).
- **Cloudflare** adapter; deploy automatico ad ogni push su `main`.
- **i18n** nativo: EN alla root `/`, IT sotto `/it/`. Navigazione host con array
  hardcoded in `Header.astro` / `Navigation.astro`.
- **Sitemap** via `@astrojs/sitemap` (di default include tutte le pagine).

## Simulatore (riuso)

`fatty-acid-simulator` è TypeScript puro senza dipendenze. Portato verbatim in
`src/lib/ode/` (`fa-engine.ts`, `fatty-acid-data.ts`). Entry point
`computeScenario()`. Vedi `src/lib/ode/README.md`.

## Isolamento dalla HP (implementato)

1. Layout dedicato `OdeLayout.astro`, header/footer/nav OdE propri (mai
   l'header del sito personale).
2. Nessuna voce aggiunta agli array di navigazione del sito ospitante.
3. `<meta name="robots" content="noindex, nofollow">` su tutte le pagine OdE.
4. Filtro sitemap in `astro.config.mjs`: `filter: (p) => !p.includes('/OdE')`.
5. Raggiungibile solo via URL diretto.

## Routing e i18n

- IT default a `/OdE`; EN a `/OdE/en`.
- Stringhe UI e mappa rotte in `src/i18n/ode.ts`.
- Convenzione OdE: niente trattino lungo nei testi italiani (virgola, due punti,
  parentesi).

## Mappa pagine

| Rotta | Pilastro / scopo |
|---|---|
| `/OdE` · `/OdE/en` | Home: hero, proposta, tre porte d'accesso, CTA dashboard |
| `/OdE/amsa` | P1 — AMSA: cos'è, Active Control Loop, Passaporto Lipidico, vantaggio |
| `/OdE/mercato` | P2 — Validazione di mercato: dati, trend, competizione, DPP 2027 |
| `/OdE/visione` | P3 — Visione: 3 spazi azzurri, roadmap, da produttore a fornitore |
| `/OdE/amsa-live` | Dashboard interattiva "AMSA LIVE" |

## Dashboard "AMSA LIVE" (Fase 4)

Sopra `computeScenario`, narrazione in 4 step (pedagogica e plausibile):
1. Input materia prima (sego bovino filiera PR / grasso suino, dieta, rendering).
2. Acquisizione spettrale NIR/Raman **simulata** (bande C-H, carbonile ~1745
   cm⁻¹, insaturi ~3010 cm⁻¹) + Active Control Loop.
3. Profilo lipidico + Oxidative Risk Score 0–100 + flag Codex (PV ≤ 10 meq O₂/kg).
4. Passaporto Lipidico Digitale (9 sezioni) + decisione industriale.

Banner permanente "Simulazione dimostrativa" (vincolo). Grafici nativi CSS/SVG.

## Fusione estetica

- Da Matteo: impianto editoriale, ritmo, micro-interazioni, performance, a11y.
- Da OdE: palette, tipografia, tono (token in `src/styles/ode-theme.css`, scoped
  `.ode`, isolati dal tema host).

## Brand system (ricevuto e implementato)

`OdE_Brand_System` fornito dal committente e implementato in `ode-theme.css`
(token esatti, scoped `.ode`): menta `#afdfc7`, inchiostro `#1c2620`, accento
verde `#2f5a44`, accenti diagramma lavanda/rosa/verde, Roboto + Roboto Mono,
pesi leggeri, niente gradienti.

## ⚠️ Gap di dato (segnalati nel sito con tag)

- **TAM/SAM/SOM**: nessuna cifra ufficiale per la nicchia; in pagina è una
  forbice di mercati adiacenti marcata `[BENCHMARK]`, non un dato consolidato.
- **Roadmap visione**: nessuna data di calendario (logica, non temporale).
- Margini pharma "10–100x": etichetta `[SCOMMESSA]`, usati con prudenza.

## Stato

- [x] Fase 1 — Ispezione e piano
- [x] Fase 2 — Scaffolding (branch, routing, isolamento, port motore, layout)
- [x] Fase 3 — Contenuti dei tre pilastri (IT + EN) con visualizzazioni
- [x] Fase 4 — Dashboard interattiva "AMSA LIVE" (engine + spectrum + passport)
- [x] Fase 5 — QA (responsive, isolamento, build), README, PR
