// ──────────────────────────────────────────────────────────────
// i18n dictionary for the /OdE-v2 test microsite (Officina degli Estratti).
//
// This file is a NEW file for the isolated redesign. It deliberately does not
// import from src/i18n/ode.ts: the original microsite must keep working
// untouched, and a shared module would couple the two.
//
// ENGLISH IS THE SOURCE LANGUAGE of this microsite. Italian is the translation.
// Copy is drafted in English and rendered into Italian, not the other way
// round, which is why the English routes carry English slugs while the keys
// that address them stay stable and language-neutral.
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
    tesi: '/OdE-v2/en/thesis',
    amsa: '/OdE-v2/en/amsa',
    filiera: '/OdE-v2/en/supply-chain',
    posizione: '/OdE-v2/en/position',
    normativa: '/OdE-v2/en/regulation',
    evidenza: '/OdE-v2/en/open-evidence',
    investitori: '/OdE-v2/en/investors',
    glossario: '/OdE-v2/en/glossary',
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
        'Acid value decides whether a batch of tallow is safe, it costs a few tens of euros to measure, and almost nobody states it. The hydrolysis complication, spelled out.',
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
