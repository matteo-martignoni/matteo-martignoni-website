// ──────────────────────────────────────────────────────────────
// i18n dictionary for the /OdE-v2 test microsite (Officina degli Estratti).
//
// This file is a NEW file for the isolated redesign. It deliberately does not
// import from src/i18n/ode.ts: the original microsite must keep working
// untouched, and a shared module would couple the two.
//
// Convention (OdE): NO em-dash in Italian copy. Use commas, colons or
// parentheses instead. The em-dash is allowed only in code comments.
// ──────────────────────────────────────────────────────────────

export type OdeLang = 'it' | 'en';

export const ODE_LANGS: OdeLang[] = ['it', 'en'];

// Route map — IT default at /OdE-v2, EN under /OdE-v2/en.
export const odeRoutes = {
  it: {
    home: '/OdE-v2',
    audit: '/OdE-v2/audit',
    tesi: '/OdE-v2/tesi',
    amsa: '/OdE-v2/amsa',
    filiera: '/OdE-v2/filiera',
    posizione: '/OdE-v2/posizione',
    normativa: '/OdE-v2/normativa',
    evidenza: '/OdE-v2/evidenza',
    investitori: '/OdE-v2/investitori',
    glossario: '/OdE-v2/glossario',
    live: '/OdE-v2/amsa-live',
  },
  en: {
    home: '/OdE-v2/en',
    audit: '/OdE-v2/en/audit',
    tesi: '/OdE-v2/en/tesi',
    amsa: '/OdE-v2/en/amsa',
    filiera: '/OdE-v2/en/filiera',
    posizione: '/OdE-v2/en/posizione',
    normativa: '/OdE-v2/en/normativa',
    evidenza: '/OdE-v2/en/evidenza',
    investitori: '/OdE-v2/en/investitori',
    glossario: '/OdE-v2/en/glossario',
    live: '/OdE-v2/en/amsa-live',
  },
} as const;

export type OdeRouteKey = keyof (typeof odeRoutes)['it'];

export const odeUI = {
  it: {
    brand: 'Officina degli Estratti',
    tagline: 'Un laboratorio prima che un produttore',
    nav: {
      audit: 'Audit',
      tesi: 'Tesi',
      amsa: 'AMSA',
      filiera: 'Filiera',
      posizione: 'Posizione',
      normativa: 'Normativa',
      evidenza: 'Evidenza aperta',
      investitori: 'Investitori',
    },
    footer: {
      glossario: 'Glossario',
      live: 'AMSA Live',
    },
    sourcesTitle: 'Fonti e note',
    testBadge: 'Versione di prova',
    simBadge: 'Simulazione dimostrativa',
    backHome: 'Torna alla home',
    statusTitle: 'Stato dell’affermazione',
    findingTitle: 'Segno del risultato',
    todo: 'Da completare',
    todoEn: 'Questa pagina non è ancora tradotta.',
    placeholder: 'Richiede input del committente',
    readNext: 'Da leggere dopo',
  },
  en: {
    brand: 'Officina degli Estratti',
    tagline: 'A laboratory before it is a producer',
    nav: {
      audit: 'Audit',
      tesi: 'Thesis',
      amsa: 'AMSA',
      filiera: 'Supply chain',
      posizione: 'Position',
      normativa: 'Regulation',
      evidenza: 'Open evidence',
      investitori: 'Investors',
    },
    footer: {
      glossario: 'Glossary',
      live: 'AMSA Live',
    },
    sourcesTitle: 'Sources and notes',
    testBadge: 'Test version',
    simBadge: 'Demonstration simulation',
    backHome: 'Back to home',
    statusTitle: 'Status of the claim',
    findingTitle: 'Sign of the finding',
    todo: 'To be completed',
    todoEn: 'This page is not translated yet.',
    placeholder: 'Requires input from the client',
    readNext: 'Read next',
  },
} as const;

// Per-page <title> and meta description.
export const odeMeta = {
  it: {
    home: {
      title: 'Officina degli Estratti',
      description:
        'Non esiste uno studio clinico che misuri l’effetto del sego sulla pelle umana. OdE non vende sego: vende la certezza su cosa c’è dentro un lotto di sego.',
    },
    audit: {
      title: 'L’Audit · Officina degli Estratti',
      description:
        'Che cosa abbiamo verificato e come: il vuoto di evidenza sul sego topico, l’errore di matrice nella rassegna più citata e la tassonomia delle claim che non reggono.',
    },
    tesi: {
      title: 'La Tesi · Officina degli Estratti',
      description:
        'Il numero di acidità è il parametro che decide la sicurezza di un lotto di sego, ed è misurabile. La complicazione dell’idrolisi batterica, dichiarata.',
    },
    amsa: {
      title: 'AMSA · Officina degli Estratti',
      description:
        'Lo strumento che misura: spettroscopia multimodale, chemiometria e il Passaporto Lipidico Digitale, con i parametri che entrano in ogni lotto.',
    },
    filiera: {
      title: 'Filiera · Officina degli Estratti',
      description:
        'La provenienza come input documentato del processo di qualificazione, non come claim di superiorità. Compreso il punto esatto in cui la tracciabilità si rompe.',
    },
    posizione: {
      title: 'Posizione · Officina degli Estratti',
      description:
        'Dove OdE può esistere e dove no. Il verdetto a tre gambe sui grandi gruppi e la tenaglia volume contro differenziale, dichiarata apertamente.',
    },
    normativa: {
      title: 'Normativa · Officina degli Estratti',
      description:
        'Ricognizione documentale del quadro normativo: sottoprodotti animali, regolamento cosmetico, criteri per le dichiarazioni, e l’asimmetria EUDR con le sue qualificazioni.',
    },
    evidenza: {
      title: 'Evidenza aperta · Officina degli Estratti',
      description:
        'Le domande aperte, il programma sperimentale con costi e sequenza, i criteri di arresto pre-fissati e l’invito ai gruppi di ricerca.',
    },
    investitori: {
      title: 'Investitori · Officina degli Estratti',
      description:
        'Il verdetto in due parti, i numeri reali del programma sperimentale, i gate decisionali e le condizioni di fallimento della tesi. Nessuna proiezione gonfiata.',
    },
    glossario: {
      title: 'Glossario · Officina degli Estratti',
      description:
        'I termini tecnici usati sul sito, spiegati: numero di acidità, acidi grassi liberi, lipasi, SFC, comedogenicità, COPs, EUDR e altri.',
    },
    live: {
      title: 'AMSA Live · Officina degli Estratti',
      description:
        'Dashboard dimostrativa: dal campione di grasso animale al Passaporto Lipidico Digitale, passo dopo passo. Simulazione, non misure di laboratorio.',
    },
  },
  en: {
    home: {
      title: 'Officina degli Estratti',
      description:
        'There is no clinical study measuring what tallow does to human skin. OdE does not sell tallow: it sells certainty about what is inside a batch of tallow.',
    },
    audit: {
      title: 'The Audit · Officina degli Estratti',
      description:
        'What we verified and how: the evidence gap on topical tallow, the matrix error in the most cited review, and the taxonomy of claims that do not hold.',
    },
    tesi: {
      title: 'The Thesis · Officina degli Estratti',
      description:
        'Acid value is the parameter that decides the safety of a tallow batch, and it is measurable. The bacterial hydrolysis complication, declared.',
    },
    amsa: {
      title: 'AMSA · Officina degli Estratti',
      description:
        'The instrument that measures: multimodal spectroscopy, chemometrics and the Digital Lipid Passport, with the parameters carried by every batch.',
    },
    filiera: {
      title: 'Supply chain · Officina degli Estratti',
      description:
        'Provenance as a documented input to qualification, not as a superiority claim. Including the exact point at which traceability breaks.',
    },
    posizione: {
      title: 'Position · Officina degli Estratti',
      description:
        'Where OdE can exist and where it cannot. The three-legged verdict on the large groups and the volume-versus-differential pincer, stated openly.',
    },
    normativa: {
      title: 'Regulation · Officina degli Estratti',
      description:
        'A documentary survey of the regulatory frame: animal by-products, the cosmetic regulation, claim criteria, and the EUDR asymmetry with its qualifications.',
    },
    evidenza: {
      title: 'Open evidence · Officina degli Estratti',
      description:
        'The open questions, the experimental programme with costs and sequence, the pre-set stopping criteria, and the invitation to research groups.',
    },
    investitori: {
      title: 'Investors · Officina degli Estratti',
      description:
        'The two-part verdict, the real numbers of the experimental programme, the decision gates and the failure conditions of the thesis. No inflated projections.',
    },
    glossario: {
      title: 'Glossary · Officina degli Estratti',
      description:
        'The technical terms used on this site, explained: acid value, free fatty acids, lipase, SFC, comedogenicity, COPs, EUDR and others.',
    },
    live: {
      title: 'AMSA Live · Officina degli Estratti',
      description:
        'Demonstration dashboard: from the animal fat sample to the Digital Lipid Passport, step by step. A simulation, not laboratory measurements.',
    },
  },
} as const;
