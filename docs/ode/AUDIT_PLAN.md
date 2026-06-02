# AUDIT E PIANO DI ESPANSIONE — Microsito /OdE

> Documento di Fase 1 del brief di revisione ed espansione. Vive nel branch
> `feat/ode-expansion`. Si chiude con un CHECKPOINT: nessun codice di
> produzione (Fasi 3 e seguenti) prima della conferma del committente.
> Aggiornato durante l'avanzamento.

Convenzione testi italiani: nessun trattino lungo (virgola, due punti,
parentesi). Marcatura fonti: `[DA KNOWLEDGE BASE]`, `[DA RICERCA WEB]`,
`[DA INTEGRARE]`.

---

## 0. Sintesi esecutiva

Il microsito `/OdE` esistente (PR #1, già in produzione, isolato dalla HP del
sito personale) è solido sul piano tecnico e di brand, ma espone una frazione
della knowledge base. Tre pilastri (AMSA, Mercato, Visione) piu una dashboard
dimostrativa condensano in quattro pagine un patrimonio che la knowledge base
sviluppa con molta piu profondita e, soprattutto, con un livello di dato
verificato e citato che oggi resta in gran parte inutilizzato.

Il divario piu grave non e qualitativo ma di copertura: mancano del tutto tre
delle pagine chiave richieste dal brief (Orologio Normativo dedicato,
Investitori, Glossario), e i temi tecnici e di mercato sono compressi in un
unico livello, senza la stratificazione "superficie poi dettaglio dietro un
click" che il pubblico esigente richiede.

---

## 1. Stato attuale (cosa esiste e cosa funziona)

### Stack e impianto (da rispettare, non cambiare)
- Astro 5 statico, Tailwind v4, deploy Cloudflare ad ogni push su `main`.
- Layout isolato `OdeLayout.astro`, brand `ode-theme.css` scoped `.ode`
  (menta `#afdfc7`, inchiostro `#1c2620`, accento `#2f5a44`, Roboto + Roboto
  Mono), i18n IT default + EN mirror in `src/i18n/ode.ts`.
- Isolamento dalla HP funzionante e da preservare: layout proprio, nessun link
  in ingresso, `noindex, nofollow`, esclusione da sitemap.
- Componenti riusabili: `Section`, `StatCard`, `BarChart`, `DataTag`,
  `ControlLoop`, `PassportSections`. Buona base, riusabile per le nuove pagine.

### Pagine attuali e profondita
| Rotta | Contenuto attuale | Giudizio |
|---|---|---|
| `/OdE` | Hero, lede, 3 porte (pilastri), CTA dashboard | Funziona ma e piu indice che porta d'ingresso ispirazionale. Nessuna immagine, nessun racconto di visione. |
| `/OdE/amsa` | 4 sezioni: problema, Active Control Loop, Passaporto, fossato | Buona la narrazione alta, ma un solo livello: niente data ladder, stack modelli, few-shot, ne le ipotesi P1-P5 dell'Active Control Loop. |
| `/OdE/mercato` | CAGR, domanda, competizione 3 assi, timeline DPP (3 voci) | Solido ma sintetico. La timeline normativa e un riassunto di 3 punti su un tema che la KB sviluppa in modo molto piu ricco. |
| `/OdE/visione` | Framework, 3 spazi azzurri, roadmap 4 fasi, rischio | La pagina piu completa e fedele alla KB. Va bene cosi, semmai cross-link. |
| `/OdE/amsa-live` | Dashboard simulativa (engine FA, spettro, passaporto) | Distintiva e ben etichettata come simulazione. Mantenere. |

### Cosa funziona (da non toccare)
- Tono di brand e rigore (tag `[FONTE]`/`[STIMA]`/`[BENCHMARK]`, badge
  "Simulazione dimostrativa").
- Onesta del dato gia presente (es. nota `[BENCHMARK]` sul fatto che non esiste
  un TAM ufficiale di nicchia).
- Isolamento dalla HP e impianto i18n.

---

## 2. Audit dei divari (specifico: knowledge base vs sito)

L'agenda di lavoro e il divario fra cio che la KB contiene e cio che il sito
mostra. Divari concreti, tema per tema.

### 2.1 Orologio Normativo (divario piu grave)
Oggi: 3 voci di timeline dentro `/OdE/mercato` (ESPR in vigore, working plan,
DPP dal 2027).
Nella KB `[DA KNOWLEDGE BASE]` c'e invece un corpus regolatorio ampio e gia
strutturato come tesi:
- Norme vigenti che governano OdE oggi: Reg. (CE) 1069/2009 sui sottoprodotti
  di origine animale (categoria 3, e il nodo dell'"end point" art. 33 in cui il
  cosmetico esce dal regime SOA), Reg. (UE) 142/2011 (attuazione e tracciabilita
  documentale), Reg. (CE) 1223/2009 (cosmetici: Responsible Person, PIF, CPSR,
  INCI), Reg. 722/2012 (derivati del sego), Codex CXS 211-1999, ISO 22716 (GMP
  cosmetico), EFfCI GMP.
- Norme in arrivo: Reg. (UE) 2024/1781 ESPR con Digital Product Passport in
  roll-out dal 2027, Direttiva (UE) 2024/825 Green Claims.
- La tesi dei "due orologi": orologio normativo (DPP dal 2027) e orologio
  brevettuale (finestra IP di 2-3 anni). Per ogni norma la KB esplicita gia
  "chi perde / perche OdE vince" (es. la complessita ABP verso cosmetico e una
  barriera per tutti, il Passaporto la trasforma in prodotto vendibile).

Conclusione: il tema oggi e un elenco di 3 date, nella KB e una leva narrativa
completa. Serve una pagina dedicata.

### 2.2 AMSA e Active Control Loop (un solo livello, manca la profondita)
Oggi: 4 sezioni con buona narrazione media.
Nella KB `[DA KNOWLEDGE BASE]` resta fuori dal sito:
- La Data Ladder L1-L4 (dato pubblico, dato esterno reale, dataset proprietario
  70-90 campioni, data flywheel), centrale per spiegare perche il fossato sono
  i dati.
- Lo stack modelli completo (baseline chemiometrica PCA/PLS/PLS-DA/MCR-ALS vs
  modelli avanzati 1D-CNN, autoencoder, masked spectral model, reti
  siamesi/prototypical per il few-shot, GAN vincolati dalla chimica).
- Il few-shot learning spiegato (similarita in spazio embedding, non classi
  rigide), tema distintivo perche OdE parte da pochi campioni reali.
- Le cinque ipotesi aperte dell'Active Control Loop (P1 RL online vs offline,
  P2 reward operativa, P3 trasferibilita, P4 RL vs MPC, P5 safety con
  Constrained MDP e action shielding), esplicitamente etichettate "ipotesi di
  lavoro, non conclusioni di esperto": oro per il pubblico scienziato/R&D, se
  presentato con la sua riserva intatta.
- Le due direzioni operative (descrittiva e a-specifica) e le tre famiglie di
  prodotto (Tallow Active Base, lipidi animali-vegetali strutturati,
  nanocarrier lipidici).

Conclusione: la pagina AMSA fa da overview ma manca il "fondo della piramide"
per il lettore tecnico. Serve una sotto-pagina di approfondimento.

### 2.3 Mercato (buono ma comprimibile in modo piu navigabile)
Oggi: CAGR, 3 statistiche di domanda, tabella 3 assi, timeline.
Nella KB `[DA KNOWLEDGE BASE]` resta fuori:
- Il bacino di feedstock locale dimensionato (filiera Prosciutto di Parma DOP:
  130 aziende, 7,5 mln prosciutti 2023, comparto 850 mln alla produzione, circa
  il 20% degli animali avviato ad altre lavorazioni), che rende concreto da
  dove arriva la materia prima.
- Il dettaglio competitivo sui tre assi (renderer come SARIA e Darling con
  numeri, Stéarinerie Dubois come riferimento diretto plant-based, gli
  strumentisti) e i sostituti (squalano da fermentazione).
- La tensione strategica vegan vs circolare, che spiega quale segmento OdE puo
  e non puo vincere.

Conclusione: la pagina e corretta, va arricchita e resa piu navigabile, non
riscritta.

### 2.4 Home (manca la funzione di porta ispirazionale)
Oggi: indice funzionale a 3 porte.
Il brief (Fase 2) chiede una HP che introduca la visione (circolarita,
eccellenza territoriale, ambizione tecnologica) prima dei tecnicismi, nello
stile della HP di matteomartignoni.com, con l'immagine mucca/maiale. Oggi non
c'e ne racconto di visione ne immagine.

### 2.5 Pagine mancanti del tutto
- **Investitori**: assente. Il brief (Fase 4) la richiede con incentivi startup
  innovativa, benefici per investitori extra-UE (Golden Visa), tesi
  d'investimento, dati fiscali verificati e citati con disclaimer.
- **Glossario**: assente. La KB fornisce decine di termini (spettroscopia, sego,
  profilo lipidico, NIR, Raman, few-shot, perossidi, TOTOX, DPP, SOA, ISCC,
  LNP, ecc.) oggi usati inline senza definizione linkabile.

---

## 3. Nuova mappa pagine (architettura dell'informazione)

Principio guida: piramide invertita per ogni tema. In cima il "perche conta"
(per tutti), sotto il "come funziona" (per i curiosi), in fondo il dettaglio
tecnico (per scienziati e R&D). Una lente per pubblico: investitore, scienziato,
partner.

```
/OdE                      Home ridisegnata (visione, ispirazione, immagine)
│
├── /OdE/amsa             P1 overview tecnica (perche + come) [esiste, da alleggerire/cross-link]
│   └── /OdE/amsa/tecnica NUOVA: fondo della piramide (data ladder, modelli,
│                         few-shot, ipotesi P1-P5 dell'ACL) [scienziati/R&D]
│
├── /OdE/mercato          P2 validazione [esiste, da arricchire e rendere navigabile]
│
├── /OdE/normativa        NUOVA: Orologio Normativo, pagina-tesi [chiave del brief]
│
├── /OdE/visione          P3 visione [esiste, ok, solo cross-link]
│
├── /OdE/investitori      NUOVA: tesi + incentivi + extra-UE, dati verificati [Fase 4]
│
├── /OdE/glossario        NUOVA: termini linkabili inline (ancore #termine)
│
└── /OdE/amsa-live        Dashboard simulativa [esiste, mantenere]
```

Tutto in IT default piu mirror EN, come l'esistente.

### Logica di stratificazione (cosa in superficie, cosa dietro un click)
- **Superficie (Home)**: solo visione e "perche conta". Invita a entrare, non
  spiega tutto.
- **Pagine pilastro (amsa, mercato, normativa, visione)**: livello medio, il
  "come funziona", leggibile senza muri di testo, con visualizzazioni.
- **Fondo della piramide (amsa/tecnica, sezioni espandibili nella normativa)**:
  dettaglio tecnico e regolatorio, raggiunto da chi clicca per approfondire.
- **Investitori**: lente dedicata al capitale, autosufficiente.
- **Glossario**: strato di supporto trasversale, linkato inline da tutte le
  pagine (i termini tecnici diventano link verso `/OdE/glossario#termine`).

### Navigazione
Nav attuale: AMSA, Mercato, Visione, AMSA Live. Proposta:
- Nav principale: AMSA, Mercato, Normativa, Visione, Investitori.
- AMSA Live e Glossario nel footer (utility), piu link "AMSA Live" come CTA in
  home e in pagina AMSA. `/OdE/amsa/tecnica` raggiunta da un link "Approfondisci
  la tecnica" in fondo alla pagina AMSA, non in nav (evita sovraccarico).

---

## 4. Elenco nuove pagine e contenuto (superficie / dietro click)

### 4.1 `/OdE/normativa` — Orologio Normativo [DA KNOWLEDGE BASE]
Pagina-tesi, non elenco. Struttura proposta:
- Superficie: i "due orologi" (normativo e brevettuale) e la tesi in una riga
  (la regola in arrivo e una barriera per tutti, OdE arriva con lo strumento
  pronto).
- Norme vigenti oggi (blocchi sintetici espandibili): 1069/2009 e l'end point
  art. 33, 142/2011, 1223/2009, Codex CXS 211-1999, ISO 22716, EFfCI.
- Norme in arrivo: timeline ESPR/DPP (in vigore 2024, working plan 2025, DPP
  dal 2027) e Green Claims 2024/825.
- Per ogni norma il riquadro "chi perde / perche OdE vince".
- La timeline oggi in `/OdE/mercato` si sposta o si cross-linka qui (fonte
  unica), lasciando in mercato un rimando.

### 4.2 `/OdE/amsa/tecnica` — Approfondimento tecnico [DA KNOWLEDGE BASE]
- Data Ladder L1-L4.
- Stack modelli (baseline chemiometrica vs avanzati) in tabella.
- Few-shot learning spiegato.
- Le cinque ipotesi aperte dell'Active Control Loop, con la riserva esplicita
  "ipotesi di lavoro" mantenuta (vincolo di onesta).
- Due direzioni operative e tre famiglie di prodotto.

### 4.3 `/OdE/investitori` — Pagina Investitori [DA RICERCA WEB + DA KNOWLEDGE BASE]
- Tesi d'investimento in sintesi (da KB: fossato di dati, timing normativo,
  white space).
- Benefici startup innovativa in Italia (detrazioni IRPEF/IRES, quadro
  normativo): da verificare via web, citare fonte e anno.
- Benefici investitori extra-UE (Golden Visa / visto investitori Italia: soglie,
  condizioni): da verificare via web, citare fonte e anno.
- Disclaimer "non costituisce consulenza legale o fiscale".
- Nota: i dati fiscali NON sono nella KB e verranno verificati in Fase 4.

### 4.4 `/OdE/glossario` — Glossario [DA KNOWLEDGE BASE]
- Termini raggruppati (materia prima e chimica lipidica, ossidazione e
  stabilita, spettroscopia, chemiometria e AI, controllo e normativa).
- Ogni voce con ancora `#termine` per il link inline dalle altre pagine.
- Definizioni chiare e brevi, ancorate alla KB.

### 4.5 Home ridisegnata (Fase 2)
- Racconto di visione (circolarita, territorio, ambizione) prima dei
  tecnicismi.
- Immagine mucca/maiale (vedi [DA INTEGRARE], asset non presente nel repo):
  opzione A placeholder segnalato, opzione B ricostruzione come SVG a tratto
  unico (coerente con il tratto di Matteo) per non dipendere da un file non
  validato.
- Porte verso i pilastri e nuove pagine, CTA dashboard.

---

## 5. [DA INTEGRARE]: cosa serve dal committente

1. **Asset immagine mucca/maiale**: non presente nel repo (in `public/images`
   ci sono solo gli asset del sito personale). Il file citato nel brief
   (`Mucca_e_maiale_trasparente.png`) non e nel repository. Serve: o il PNG a
   fondo trasparente caricato in `public/`, oppure il via libera a ricostruirlo
   come SVG a tratto unico. Senza uno dei due, la HP usa un placeholder
   segnalato (nessun layout dipendera da un asset non validato).
2. **Dati fiscali/normativi per Investitori**: non sono nella KB. Verranno
   reperiti via ricerca web in Fase 4 (incentivi startup innovativa, Golden
   Visa). Conferma se ci sono fonti o cifre gia preferite dal committente,
   altrimenti si procede con fonti ufficiali citate (anno) e disclaimer.
3. **Documenti `.gdoc`**: alcune fonti (THESIS, Studio AI Spectroscopic Agent,
   Strategia data acquisition, Statuto, ATECO) sono Google Doc accessibili solo
   come puntatori dal filesystem. Il contenuto narrativo principale e gia stato
   letto dai file HTML, Markdown e PDF della KB. Se in quei `.gdoc` ci sono dati
   non altrove presenti che il committente vuole esporre, va indicato.
4. **Profondita EN**: l'esistente ha il mirror EN completo. Confermare se le
   nuove pagine vanno tradotte subito in EN (raddoppia il lavoro di Fase 3-4) o
   se IT prima ed EN in coda.

---

## 6. Checklist vincoli (verifica continua)
- [x] Nessun trattino lungo nei testi italiani di questo documento.
- [x] Contenuti ancorati alla KB; dati mancanti segnalati come [DA INTEGRARE].
- [x] Stack esistente rispettato (nessun framework nuovo).
- [x] Isolamento dalla HP preservato nel piano.
- [ ] Dati fiscali/normativi verificati via web e citati (Fase 4).
- [ ] Estetica OdE_Brand_System + tratto Matteo (Fasi 2-5).

---

## 7. CHECKPOINT

Fine Fase 1. In attesa di conferma del committente su:
- la nuova mappa pagine e la logica di stratificazione (sezione 3);
- le scelte aperte in [DA INTEGRARE] (sezione 5), in particolare l'asset
  immagine e l'ordine IT/EN.

Alla conferma si procede con la Fase 2 (Home) e la Fase 3 (nuove pagine).
