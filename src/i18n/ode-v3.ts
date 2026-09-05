// ──────────────────────────────────────────────────────────────
// i18n dictionary for the /OdE-v2 test microsite (Officina degli Estratti).
//
// This file is a NEW file for the isolated redesign. It deliberately does not
// import from src/i18n/ode.ts: the original microsite must keep working
// untouched, and a shared module would couple the two.
//
// ENGLISH IS THE SOURCE LANGUAGE of this microsite, and it is also the default
// locale: English sits at the root of the test area and Italian lives under
// /it, exactly as the host site does. Copy is drafted in English and rendered
// into Italian, not the other way round, which is why the English routes carry
// English slugs while the keys that address them stay stable and
// language-neutral.
//
// The area lives at /OdE/test2 rather than /ode/test on purpose. A lowercase
// `ode` folder would collide with the existing `OdE` one on a case-insensitive
// filesystem, which is most macOS checkouts, and the collision would break the
// working tree. Capitalising it also keeps the existing sitemap filter,
// !page.includes('/OdE'), excluding the test area with no config change.
//
// House style, both languages: NO em-dash in body copy. Use commas, colons or
// parentheses instead. The em-dash is allowed only in code comments.
// ──────────────────────────────────────────────────────────────

export type OdeLang = 'it' | 'en';

export const ODE_LANGS: OdeLang[] = ['it', 'en'];

// Route map. The keys are identifiers and never change; only the slugs are
// localised, so the language switch can always find the same page in the
// other language.
export const odeRoutes = {
  en: {
    home: '/OdE/test2',
    audit: '/OdE/test2/audit',
    tesi: '/OdE/test2/thesis',
    amsa: '/OdE/test2/amsa',
    filiera: '/OdE/test2/supply-chain',
    posizione: '/OdE/test2/position',
    normativa: '/OdE/test2/regulation',
    evidenza: '/OdE/test2/open-evidence',
    investitori: '/OdE/test2/investors',
    glossario: '/OdE/test2/glossary',
    live: '/OdE/test2/amsa-live',
  },
  it: {
    home: '/OdE/test2/it',
    audit: '/OdE/test2/it/audit',
    tesi: '/OdE/test2/it/tesi',
    amsa: '/OdE/test2/it/amsa',
    filiera: '/OdE/test2/it/filiera',
    posizione: '/OdE/test2/it/posizione',
    normativa: '/OdE/test2/it/normativa',
    evidenza: '/OdE/test2/it/evidenza',
    investitori: '/OdE/test2/it/investitori',
    glossario: '/OdE/test2/it/glossario',
    live: '/OdE/test2/it/amsa-live',
  },
} as const;

export type OdeRouteKey = keyof (typeof odeRoutes)['en'];

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
      evidenza: 'Domande aperte',
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
    placeholder: 'Richiede input del committente',
    readNext: 'Da leggere dopo',
  },
  en: {
    brand: 'Officina degli Estratti',
    tagline: 'A laboratory first, a producer second',
    nav: {
      audit: 'Audit',
      tesi: 'Thesis',
      amsa: 'AMSA',
      filiera: 'Supply chain',
      posizione: 'Position',
      normativa: 'Regulation',
      evidenza: 'Open questions',
      investitori: 'Investors',
    },
    footer: {
      glossario: 'Glossary',
      live: 'AMSA Live',
    },
    sourcesTitle: 'Sources and notes',
    testBadge: 'Test build',
    simBadge: 'Worked simulation',
    backHome: 'Back to the home page',
    statusTitle: 'How well we know this',
    findingTitle: 'Which way it cuts',
    placeholder: 'Waiting on the client',
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
        'Numero di acidità come parametro della materia, distinzione della forma chimica e domande aperte sull’idrolisi cutanea.',
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
      title: 'Domande aperte · Officina degli Estratti',
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
        'Nobody has ever measured what tallow does to human skin. OdE does not sell tallow. It sells certainty about what is inside the drum.',
    },
    audit: {
      title: 'The Audit · Officina degli Estratti',
      description:
        'What we checked, and how: the hole in the evidence on topical tallow, the wrong-material errors in the most cited review, and the claims that would not survive scrutiny.',
    },
    tesi: {
      title: 'The Thesis · Officina degli Estratti',
      description:
        'Acid value as a material-quality parameter, the chemical-form distinction and the questions that remain about hydrolysis on skin.',
    },
    amsa: {
      title: 'AMSA · Officina degli Estratti',
      description:
        'The instrument: multimodal spectroscopy, chemometrics and the Digital Lipid Passport, with every parameter that travels with a batch.',
    },
    filiera: {
      title: 'Supply chain · Officina degli Estratti',
      description:
        'Provenance is an input we can document, not a claim we can sell. Including the exact point where traceability breaks down.',
    },
    posizione: {
      title: 'Position · Officina degli Estratti',
      description:
        'Where OdE can compete and where it cannot. The three-legged verdict on the big groups, and the squeeze between volume and difference.',
    },
    normativa: {
      title: 'Regulation · Officina degli Estratti',
      description:
        'A paper trail, not legal advice: animal by-products, the cosmetic regulation, the rules on claims, and the deforestation asymmetry with its three caveats.',
    },
    evidenza: {
      title: 'Open questions · Officina degli Estratti',
      description:
        'What we still cannot answer, what each experiment would cost, the order we would run them in, and the numbers that would make us stop.',
    },
    investitori: {
      title: 'Investors · Officina degli Estratti',
      description:
        'The verdict in two halves, what the experimental programme really costs, the decision gates, and the conditions under which the thesis fails. No hockey sticks.',
    },
    glossario: {
      title: 'Glossary · Officina degli Estratti',
      description:
        'Every technical term this site uses, explained: acid value, free fatty acids, lipase, solid fat content, comedogenicity, oxysterols, the deforestation rules and the rest.',
    },
    live: {
      title: 'AMSA Live · Officina degli Estratti',
      description:
        'A worked simulation: from a sample of animal fat to a Digital Lipid Passport, step by step. Simulated numbers, not laboratory measurements.',
    },
  },
} as const;
