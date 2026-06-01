// ──────────────────────────────────────────────────────────────
// i18n dictionary for the /OdE microsite (Officina degli Estratti)
// Italian is the OdE default; English mirrors it for the extra-EU audience.
//
// Convention (OdE): NO em-dash (—) in Italian copy. Use commas, colons or
// parentheses instead. The em-dash is allowed only in code/technical contexts.
// ──────────────────────────────────────────────────────────────

export type OdeLang = 'it' | 'en';

export const ODE_LANGS: OdeLang[] = ['it', 'en'];

// Route map — IT default at /OdE, EN under /OdE/en.
export const odeRoutes = {
  it: {
    home: '/OdE',
    amsa: '/OdE/amsa',
    mercato: '/OdE/mercato',
    visione: '/OdE/visione',
    live: '/OdE/amsa-live',
  },
  en: {
    home: '/OdE/en',
    amsa: '/OdE/en/amsa',
    mercato: '/OdE/en/mercato',
    visione: '/OdE/en/visione',
    live: '/OdE/en/amsa-live',
  },
} as const;

export type OdeRouteKey = keyof typeof odeRoutes['it'];

export const odeUI = {
  it: {
    brand: 'Officina degli Estratti',
    tagline: 'AI-driven Multimodal Spectroscopic Agent',
    nav: {
      amsa: 'AMSA',
      mercato: 'Mercato',
      visione: 'Visione',
      live: 'AMSA Live',
    },
    simBadge: 'Simulazione dimostrativa',
    simNotice:
      'I dati di questa dashboard sono una simulazione dimostrativa, non misure di laboratorio reali.',
    backHome: 'Torna alla home OdE',
    cta: {
      explore: 'Esplora la dashboard',
    },
  },
  en: {
    brand: 'Officina degli Estratti',
    tagline: 'AI-driven Multimodal Spectroscopic Agent',
    nav: {
      amsa: 'AMSA',
      mercato: 'Market',
      visione: 'Vision',
      live: 'AMSA Live',
    },
    simBadge: 'Demonstration simulation',
    simNotice:
      'The data in this dashboard is a demonstration simulation, not real laboratory measurements.',
    backHome: 'Back to OdE home',
    cta: {
      explore: 'Explore the dashboard',
    },
  },
} as const;

// Per-page <title> / meta description, kept here so pages stay thin.
export const odeMeta = {
  it: {
    home: {
      title: 'Officina degli Estratti — AMSA',
      description:
        'Piattaforma deep-tech per ingredienti lipidici animali cosmetici da bioeconomia circolare.',
    },
    amsa: { title: 'AMSA — Officina degli Estratti', description: 'PLACEHOLDER' },
    mercato: { title: 'Mercato — Officina degli Estratti', description: 'PLACEHOLDER' },
    visione: { title: 'Visione — Officina degli Estratti', description: 'PLACEHOLDER' },
    live: { title: 'AMSA Live — Officina degli Estratti', description: 'PLACEHOLDER' },
  },
  en: {
    home: {
      title: 'Officina degli Estratti — AMSA',
      description:
        'Deep-tech platform for cosmetic animal lipid ingredients from a circular bioeconomy.',
    },
    amsa: { title: 'AMSA — Officina degli Estratti', description: 'PLACEHOLDER' },
    mercato: { title: 'Market — Officina degli Estratti', description: 'PLACEHOLDER' },
    visione: { title: 'Vision — Officina degli Estratti', description: 'PLACEHOLDER' },
    live: { title: 'AMSA Live — Officina degli Estratti', description: 'PLACEHOLDER' },
  },
} as const;
