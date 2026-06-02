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
    amsaTecnica: '/OdE/amsa/tecnica',
    mercato: '/OdE/mercato',
    normativa: '/OdE/normativa',
    visione: '/OdE/visione',
    investitori: '/OdE/investitori',
    glossario: '/OdE/glossario',
    live: '/OdE/amsa-live',
  },
  en: {
    home: '/OdE/en',
    amsa: '/OdE/en/amsa',
    amsaTecnica: '/OdE/en/amsa/tecnica',
    mercato: '/OdE/en/mercato',
    normativa: '/OdE/en/normativa',
    visione: '/OdE/en/visione',
    investitori: '/OdE/en/investitori',
    glossario: '/OdE/en/glossario',
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
      normativa: 'Normativa',
      visione: 'Visione',
      investitori: 'Investitori',
    },
    footer: {
      glossario: 'Glossario',
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
      normativa: 'Regulation',
      visione: 'Vision',
      investitori: 'Investors',
    },
    footer: {
      glossario: 'Glossary',
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
    amsa: {
      title: 'AMSA — Officina degli Estratti',
      description:
        "AMSA, l'agente spettroscopico multimodale guidato dall'AI: Active Control Loop, Passaporto Lipidico Digitale e il vantaggio tecnologico di OdE.",
    },
    amsaTecnica: {
      title: 'AMSA, approfondimento tecnico — Officina degli Estratti',
      description:
        "Data ladder, stack di modelli chemiometrici e deep learning, few-shot learning e le ipotesi aperte dell'Active Control Loop.",
    },
    mercato: {
      title: 'Mercato — Officina degli Estratti',
      description:
        'Validazione di mercato di OdE: crescita dei segmenti, disponibilita a pagare, competizione su tre assi, bacino di feedstock locale.',
    },
    normativa: {
      title: 'Orologio Normativo — Officina degli Estratti',
      description:
        'Le norme che governano i lipidi animali cosmetici, oggi e in arrivo: dal Digital Product Passport alla tracciabilita, e perche OdE e posizionata per vincere.',
    },
    visione: {
      title: 'Visione — Officina degli Estratti',
      description:
        'La visione futura di OdE: da produttore di nicchia a fornitore di qualificazione multi-mercato. I tre spazi azzurri di AMSA e una roadmap a quattro fasi.',
    },
    investitori: {
      title: 'Investitori — Officina degli Estratti',
      description:
        'La tesi di investimento su OdE, gli incentivi per chi investe in startup innovative in Italia e i percorsi per investitori extra-UE.',
    },
    glossario: {
      title: 'Glossario — Officina degli Estratti',
      description:
        'I termini tecnici di OdE e AMSA spiegati con chiarezza: spettroscopia, sego, profilo lipidico, few-shot learning, perossidi, DPP e altro.',
    },
    live: {
      title: 'AMSA Live — Officina degli Estratti',
      description:
        'Dashboard dimostrativa: dal campione di grasso animale al Passaporto Lipidico Digitale, passo dopo passo.',
    },
  },
  en: {
    home: {
      title: 'Officina degli Estratti — AMSA',
      description:
        'Deep-tech platform for cosmetic animal lipid ingredients from a circular bioeconomy.',
    },
    amsa: {
      title: 'AMSA — Officina degli Estratti',
      description:
        'AMSA, the AI-driven multimodal spectroscopic agent: Active Control Loop, Digital Lipid Passport and OdE’s technological advantage.',
    },
    amsaTecnica: {
      title: 'AMSA, technical deep dive — Officina degli Estratti',
      description:
        'Data ladder, the chemometric and deep-learning model stack, few-shot learning and the open hypotheses of the Active Control Loop.',
    },
    mercato: {
      title: 'Market — Officina degli Estratti',
      description:
        'OdE market validation: segment growth, willingness to pay, competition on three axes, the local feedstock basin.',
    },
    normativa: {
      title: 'Regulatory Clock — Officina degli Estratti',
      description:
        'The rules governing cosmetic animal lipids, today and incoming: from the Digital Product Passport to traceability, and why OdE is positioned to win.',
    },
    visione: {
      title: 'Vision — Officina degli Estratti',
      description:
        'OdE’s future vision: from niche producer to multi-market qualification supplier. AMSA’s three blue oceans and a four-phase roadmap.',
    },
    investitori: {
      title: 'Investors — Officina degli Estratti',
      description:
        'The investment thesis for OdE, the incentives for investing in innovative startups in Italy and the routes open to non-EU investors.',
    },
    glossario: {
      title: 'Glossary — Officina degli Estratti',
      description:
        'OdE and AMSA technical terms explained clearly: spectroscopy, tallow, lipid profile, few-shot learning, peroxides, DPP and more.',
    },
    live: {
      title: 'AMSA Live — Officina degli Estratti',
      description:
        'Demonstration dashboard: from the animal-fat sample to the Digital Lipid Passport, step by step.',
    },
  },
} as const;
