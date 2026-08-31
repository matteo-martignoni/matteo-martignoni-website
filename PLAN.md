# PLAN, riprogettazione del micro-sito OdE su sito di test isolato

> **Fase 2 del brief. Checkpoint obbligatorio.**
> Branch: `claude/ode-microsite-redesign-6ye3n5`. Nessun codice di produzione
> (Fasi 3 e seguenti) prima della conferma del committente.
> Convenzione: nessun trattino lungo nella prosa italiana.

---

## 0. Sintesi in una pagina

Il sito attuale `/OdE` è tecnicamente maturo e tonalmente sobrio. Non contiene
nessuna delle claim vietate. Il problema non è che dica cose false: è che apre
con una **promessa di prodotto** ("dal sottoprodotto animale, un ingrediente
cosmetico di precisione") mentre la ricerca ha stabilito che in questa categoria
le promesse valgono poco, e che **il fondamento tecnico reale di OdE, il numero
di acidità, oggi non compare da nessuna parte sul sito**.

La riprogettazione rovescia l'ordine. Il nuovo sito apre con il fatto verificato
e con il lavoro di verifica, non con la promessa. La tesi, resa leggibile su ogni
pagina:

> OdE non vende sego. Vende la certezza su cosa c'è dentro un lotto di sego.
> In un mercato dove nessuno misura, chi misura per primo definisce lo standard.

Il sito di test vive sotto `/OdE/test`, in un albero di file **interamente nuovo**.
Nessun file del sito originale viene modificato, e nemmeno `astro.config.mjs`
(sezione 2). Le due versioni si confrontano affiancate agli indirizzi `/OdE` e
`/OdE/test`.

---

## 1. Stack rilevato

Ispezione di `package.json`, `astro.config.mjs`, `wrangler.jsonc`, `README.md` e
dell'intero albero `src/`.

| Elemento | Rilevato |
|---|---|
| Generatore | **Astro 5.2+**, `output: 'static'`, prerender totale, nessuna rotta server |
| Stili | **Tailwind v4** via plugin Vite; il micro-sito OdE **non usa Tailwind**, usa CSS scoped con custom properties |
| Deploy | **Cloudflare** (adapter `@astrojs/cloudflare`), build automatica a ogni push su `main` |
| i18n host | Astro i18n nativo: EN alla radice, IT sotto `/it/`. **Il micro-sito OdE non usa questo meccanismo**: usa un proprio route map in `src/i18n/ode.ts`, con IT default a `/OdE` ed EN a `/OdE/en` |
| Sitemap | `@astrojs/sitemap` con `filter: (page) => !page.includes('/OdE')` |
| Node | v22, npm 10. `npm run build` verde in circa 5 s (baseline registrata prima di ogni modifica) |

### Impianto del micro-sito attuale

```
src/pages/OdE/            9 pagine IT (+ amsa/tecnica) e 9 mirror EN in en/
src/layouts/OdeLayout.astro    layout isolato, header e footer propri, noindex
src/styles/ode-theme.css       token OdE_Brand_System, scoped sotto .ode
src/components/ode/            11 componenti (Section, DataTag, StatCard, BarChart,
                               StatCard, ControlLoop, PassportSections, NormCard,
                               LifecycleFlow, CowGlyph, DropMark, OdeSources)
src/i18n/ode.ts                stringhe UI, route map, meta per pagina
src/lib/ode/                   motore di simulazione AMSA Live (TypeScript puro)
public/images/ode/             illustrazione mucca-maiale, favicon
```

**Componenti riusabili senza modifiche** (importati in sola lettura dal sito di
test): `Section`, `StatCard`, `BarChart`, `ControlLoop`, `PassportSections`,
`LifecycleFlow`, `CowGlyph`, `DropMark`. Il motore `src/lib/ode/` riceve le
etichette dalla pagina chiamante, quindi è riusabile in entrambe le lingue senza
toccarlo.

**Componenti che vanno duplicati e non riusati**: `DataTag` e `OdeSources`
(dipendono da `src/lib/ode/sources.ts`, che va esteso con i DOI della nuova
bibliografia: estenderlo in loco cambierebbe il rendering del sito originale,
perché le regole di risoluzione sono per sottostringa) e `OdeLayout` (navigazione
e struttura diverse).

### Sistema di etichette epistemiche esistente

Due meccanismi, oggi non formalizzati allo stesso modo:

1. **Provenienza del dato**, componente `DataTag`: `Fonte` / `Stima` /
   `Benchmark`. Registra la fonte in `Astro.locals`, emette un badge cliccabile
   con numero e la nota in calce viene resa da `OdeSources` a fondo pagina. È un
   meccanismo maturo e va ereditato integralmente.
2. **Stato epistemico dell'affermazione**: `Dimostrato` / `In costruzione` /
   `Scommessa`. Oggi esiste solo come stringa dentro `StatCard` in due pagine
   (`ricerca`, `visione`), senza componente dedicato. **Va formalizzato.**

---

## 2. Soluzione tecnica per l'isolamento

### Scelta: rotta parallela `/OdE/test`, albero di file interamente nuovo

**Nessun file esistente viene modificato**, con la sola eccezione documentata di
`README.md` (documentazione, non codice del sito) e dell'aggiunta di `PLAN.md` e
`docs/ode-v2/`. La prova sarà fornita in consegna con `git diff --stat`.

Il punto tecnico che rende questa soluzione pulita: **il filtro sitemap esistente
copre già `/OdE/test` senza modifiche**. La riga in `astro.config.mjs` è

```js
filter: (page) => !page.includes('/OdE'),
```

e la stringa `/OdE/test` contiene la sottostringa `/OdE`, quindi tutte le pagine
del sito di test sono già escluse dal sitemap. È la ragione per cui `/OdE/test` è
preferibile a nomi alternativi come `/ode-lab` o `/OdE2`: qualunque altro nome
avrebbe richiesto di toccare `astro.config.mjs`.

### Struttura dei file nuovi

```
src/pages/OdE/test/it/              10 pagine IT
src/pages/OdE/test/           mirror EN (Fase 5)
src/layouts/OdeV2Layout.astro  layout isolato, noindex, navigazione nuova
src/styles/ode-v2-theme.css    @import dei token esistenti + estensioni v2
src/components/ode-v2/         componenti nuovi (DataTag2, Sources2, Status,
                               Finding, ClaimRow, GateTable, Sequence, Doors)
src/i18n/ode-v2.ts             route map, stringhe UI, meta
src/lib/ode-v2/sources.ts      resolver fonti esteso (DOI, EUR-Lex, FAO)
docs/ode-v2/                   piano, mappatura tracce, checklist QA
```

### I cinque meccanismi di isolamento

| # | Meccanismo | Come si verifica |
|---|---|---|
| 1 | Layout proprio `OdeV2Layout`, nessun uso di `Header.astro` o `Navigation.astro` | grep sui file host |
| 2 | Nessun link in ingresso dal sito ospitante né da `/OdE` | `grep -r "OdE/test" src/pages/OdE src/components src/layouts/BaseLayout.astro` deve dare zero |
| 3 | Nessun link in uscita da `/OdE/test` verso `/OdE` | `grep -rn 'href="/OdE[^-]' src/pages/OdE/test` deve dare zero |
| 4 | `<meta name="robots" content="noindex, nofollow">` su ogni pagina | conteggio nell'HTML di `dist/OdE/test/it/**` |
| 5 | Esclusione dal sitemap ereditata dal filtro esistente | ispezione di `dist/sitemap-0.xml` |

A questi si aggiunge la verifica cardine: **nessun file sotto `src/pages/OdE/`,
`src/layouts/OdeLayout.astro`, `src/styles/ode-theme.css`, `src/i18n/ode.ts`,
`src/components/ode/`, `src/lib/ode/` compare nel diff**.

### Promozione, se approvata

Documentata nel README. In sintesi: rinominare `src/pages/OdE` in `_trash/`
(cestino locale git-ignored già previsto dal repository), rinominare
`src/pages/OdE/test` in `src/pages/OdE`, aggiornare `odeRoutes` nel nuovo
`ode-v2.ts`, ricostruire. Nessun'altra modifica richiesta, perché il filtro
sitemap e il `noindex` restano validi.

---

## 3. Mappa delle pagine attuali, con verdetto

| Rotta attuale | Contenuto | Verdetto | Destinazione in v2 |
|---|---|---|---|
| `/OdE` Home | Promessa di prodotto, tre idee (Circolarità, Territorio, Tecnologia), tre pilastri, due porte | **Riscrivere** | Nuova Home: apre con il fatto verificato, tre porte per tre pubblici |
| `/OdE/amsa` | Problema, dato causale provenienza-stabilità, Active Control Loop, Passaporto, fossato | **Riscrivere e rifocalizzare** | `/OdE/test/it/amsa`: lo strumento che misura, agganciato alla Tesi. Cade la sezione "fossato" nella forma attuale |
| `/OdE/amsa/tecnica` | Data ladder, stack modelli, few-shot, tre motori, esperimento decisivo | **Fondere** | Il livello tecnico confluisce in `/OdE/test/it/amsa`; l'esperimento si sposta in `Evidenza aperta` e cambia identità (sezione 5, voce 4) |
| `/OdE/mercato` | CAGR di cinque mercati adiacenti, disponibilità a pagare, bacino DOP, competizione a tre assi, orologio DPP | **Eliminare e sostituire** | `/OdE/test/it/posizione`. Il bacino DOP migra in `Filiera`, l'orologio in `Normativa`. I CAGR e la tabella competizione non sopravvivono (sezione 5, voci 1 e 3) |
| `/OdE/visione` | Tre spazi azzurri, roadmap a quattro fasi, fotografia onesta dello stato | **Fondere e riscrivere** | La fotografia onesta e i tre spazi azzurri migrano in `/OdE/test/it/tesi` (parte finale) e in `Investitori`. La roadmap a quattro fasi resta come sezione di `Investitori` |
| `/OdE/tracciabilita` | Doppio strato normativo, vita della vacca DOP, dove la tracciabilità si rompe, confini del disciplinare, dove OdE si integra | **Conservare con riscrittura di cornice** | `/OdE/test/it/filiera`. È già la pagina più onesta del sito (dichiara dove la tracciabilità si rompe). Cambia la cornice: da prova verificabile a input documentato del processo di qualificazione |
| `/OdE/normativa` | 5 norme vigenti, 2 in arrivo, con schema "cosa richiede, chi attrita, perché OdE vince" | **Conservare e aggiornare** | `/OdE/test/it/normativa`. Aggiunte: EUDR con la sua asimmetria e le sue qualificazioni, Reg. 655/2013 sulle claim, Reg. 1223/2009 art. 20. Va rivisto lo schema "perché OdE vince", troppo assertivo su ESPR |
| `/OdE/ricerca` | Domande aperte, metodo, esperimento pre-registrato, onestà sui limiti, invito | **Conservare l'impianto, riscrivere il contenuto** | `/OdE/test/it/evidenza`. La sezione "Onestà sui limiti" è il modello di tutto il sito e va estesa, non conservata come eccezione |
| `/OdE/investitori` | Tesi in 4 punti, incentivi fiscali, Investor Visa | **Riscrivere** | `/OdE/test/it/investitori`. La tesi in 4 punti cade e viene sostituita dal verdetto a tre gambe. Incentivi e visa restano, con le qualificazioni |
| `/OdE/glossario` | 5 gruppi, circa 35 voci | **Conservare ed estendere** | `/OdE/test/it/glossario`. Aggiunte circa 12 voci nuove (sezione 7) |
| `/OdE/amsa-live` | Dashboard simulativa, motore TypeScript | **Conservare** | `/OdE/test/it/amsa-live`. Motore importato in sola lettura, nessuna modifica al codice |

Nessuna pagina viene eliminata senza destinazione. Due pagine spariscono come
rotte (`amsa/tecnica` e `mercato`) e il loro contenuto valido viene ricollocato.

---

## 4. Nuova architettura dell'informazione

Dieci pagine, ciascuna con una funzione narrativa dichiarata, un pubblico
primario e un'azione che la pagina deve abilitare. Una pagina che non abilita
un'azione è decorativa e non entra.

| # | Rotta | Titolo | Funzione narrativa | Pubblico primario | Azione abilitata |
|---|---|---|---|---|---|
| 1 | `/OdE/test` | Home | Consegna la tesi in una schermata: apre con il fatto verificato, non con la promessa | Tutti e tre | Scegliere la propria porta in meno di dieci secondi |
| 2 | `/OdE/test/it/audit` | L'Audit | Motore di credibilità: che cosa abbiamo verificato e come. Il vuoto di evidenza, l'errore nella rassegna più citata, la tassonomia delle claim che non reggono | Investitore, poi partner scientifico | Verificare da sé, in un pomeriggio, che quanto affermiamo è vero |
| 3 | `/OdE/test/it/tesi` | La Tesi | Il numero di acidità come parametro che decide, la complicazione dell'idrolisi batterica, e perché ne consegue che il prodotto è la qualificazione | Partner commerciale, poi investitore | Capire che cosa si compra davvero, e che cosa non si compra |
| 4 | `/OdE/test/it/amsa` | AMSA | Lo strumento che misura, e i parametri che finiscono nel Passaporto | Partner commerciale, poi scientifico | Leggere l'elenco dei campi che riceve con ogni lotto |
| 5 | `/OdE/test/it/filiera` | Filiera | La provenienza come input documentato del processo, con il punto in cui la tracciabilità si rompe dichiarato | Partner commerciale | Sapere che cosa può dichiarare al proprio cliente senza esporsi |
| 6 | `/OdE/test/it/posizione` | Posizione | Dove OdE può esistere e dove no. La tenaglia volume contro differenziale, dichiarata | Investitore | Valutare se la posizione è reale o costruita per necessità |
| 7 | `/OdE/test/it/normativa` | Normativa | Ricognizione documentale del quadro, incluse le asimmetrie a favore e i loro limiti | Partner commerciale, poi investitore | Capire che cosa è requisito e che cosa è differenziale |
| 8 | `/OdE/test/it/evidenza` | Evidenza aperta | Le domande aperte, gli esperimenti con costi e sequenza, i criteri di arresto, l'invito | Partner scientifico | Proporre una tesi, un contratto conto terzi, una collaborazione |
| 9 | `/OdE/test/it/investitori` | Investitori | Il verdetto a tre gambe, i numeri reali del programma, i criteri di arresto | Investitore | Decidere se aprire una conversazione, con i limiti già noti |
| 10 | `/OdE/test/it/glossario` | Glossario | Infrastruttura di lettura | Tutti | Capire un termine senza uscire dal sito |
| + | `/OdE/test/it/amsa-live` | AMSA Live | Dimostrazione interattiva, dichiarata simulazione | Partner commerciale | Vedere come si legge un Passaporto |

### La singola idea da consegnare in tre minuti

Se un visitatore legge solo la Home e una pagina, deve uscire con questo:
**nessuno ha mai misurato che cosa fa il sego sulla pelle, e nessuno misura che
cosa c'è dentro il lotto che vende; OdE fa la seconda cosa, e su questo si può
essere verificati.**

La Home la consegna così, in una schermata:

- **Occhiello**: `Verificato su dodici banche dati in sei lingue`
- **Titolo**: *Non esiste uno studio clinico che misuri l'effetto del sego sulla pelle umana.*
- **Sottotitolo**: *Zero. Non uno debole, non uno vecchio, non uno in un'altra lingua. Lo abbiamo cercato prima di costruirci sopra un'azienda.*
- **La conseguenza, in una riga**: *Se nessuno sa e nessuno misura, il valore non è nel sego. È nel saperlo qualificare. OdE è un laboratorio prima che un produttore.*
- **Tre porte**: Investitore, Partner scientifico, Partner commerciale.

### Le tre porte, in chiaro

| Porta | Domanda che si porta dietro | Dove atterra | Seconda tappa suggerita |
|---|---|---|---|
| Investitore | Esiste una posizione difendibile? Il fondatore è credibile? Quali rischi sono dichiarati? | `/investitori` | `/posizione`, poi `/audit` |
| Partner scientifico | Le domande sono reali? Il metodo è rigoroso? C'è qualcosa da pubblicare? | `/evidenza` | `/audit`, poi `/tesi` |
| Partner commerciale | Posso fidarmi di questo fornitore? Che cosa posso dichiarare senza espormi? | `/tesi` | `/amsa`, poi `/normativa` e `/filiera` |

---

## 5. Inventario delle affermazioni del sito attuale che la ricerca smentisce

Nove voci. Per ciascuna: dove si trova, che cosa dice, che cosa dice la ricerca,
che cosa entra al suo posto.

### 1. Tabella competizione, asse "Prodotto finito"
**Dove**: `/OdE/mercato`, sezione 4.
**Dice**: "Origine vegetale: l'animale circolare tracciato è scoperto", cioè
presenta la spinta plant-based come uno spazio lasciato scoperto.
**La ricerca**: T7 sez. 4.6 e 13bis. Il verdetto sui grandi gruppi regge su tre
gambe indipendenti: **principio** (nel leave-on il criterio prevalente è l'origine
animale in quanto tale), **scala** (volumi, doppia fonte, audit multi-sito fuori
portata) e **prezzo** (nel risciacquo il sego è già comprato, con clausola di
alternanza sodio tallowate **o** sodio palmitato in etichetta: è fungibilità di
commodity, non porta chiusa). Lo spazio non è scoperto: nel risciacquo è
occupato e si compete a listino, nel leave-on premium il criterio non è la
tracciabilità.
**Al suo posto**: `/posizione`, sezione "Le tre gambe del verdetto" più
"La tenaglia".

### 2. Tracciabilità come vantaggio difendibile senza qualificazione
**Dove**: `/OdE` Home, blocco "Territorio" ("Un vantaggio difendibile, radicato
nel territorio"); ripreso in `/OdE/investitori` ("un fossato che nessuno può
comprare") e in `/OdE/amsa` sez. 5 ("Posizionamento e fossato").
**La ricerca**: T7 sez. 4.2. Lo spazio della tracciabilità **non è vergine**:
esiste almeno un operatore già posizionato esplicitamente su tracciabilità e
sostenibilità (BOTALLOW, Nuova Zelanda), oltre a più operatori statunitensi sul
grass-fed. Il differenziale di OdE è nella profondità documentale e analitica,
non nella primogenitura.
**Al suo posto**: `/posizione`, sezione "Chi c'è già", con la formulazione
letterale della traccia: OdE entra in uno spazio già presidiato sul concetto
"tracciato e pulito" e deve difendere un differenziale più sottile di quanto la
narrazione DOP suggerisca.

### 3. I CAGR dei mercati adiacenti come validazione di mercato
**Dove**: `/OdE/mercato`, sezione 1 (grafico a barre: emollienti 5,5%, naturali
UE 6,4%, upcycled 6,7%, oleochimica 6,73%, clean beauty UE 13,81%).
**La ricerca**: T7 sez. 11 e 12. Il mercato accessibile a OdE (leave-on premium
tracciato) **non è dimensionabile con dati pubblici**: nessuna statistica separa
risciacquo e leave-on per il sego, nessuna isola la destinazione cosmetica dai
2,3 milioni di tonnellate di Categoria 3 europea. La traccia ritira
esplicitamente il proprio dimensionamento precedente e conclude che "una cifra
inventata sarebbe peggio di una lacuna dichiarata". I CAGR di mercati adiacenti
convivono male con la tenaglia volume contro differenziale: descrivono mercati
in cui OdE non compete.
**Al suo posto**: `/posizione`, sezione "Che cosa non possiamo dirvi", con
l'elenco delle lacune di dimensionamento dichiarate come tali. I dati EFPRA
verificati (2,8 Mt grassi animali, 2,3 Mt Cat. 3, 1,58 Mt ai biocarburanti,
42.000 t bruciate con +28%) restano, perché sono l'unico punto di contatto
verificabile fra la narrazione di circolarità e un fatto.

### 4. L'esperimento decisivo provenienza contro stabilità
**Dove**: `/OdE/ricerca` sez. 3 e 4, `/OdE/amsa` sez. 2, `/OdE/amsa/tecnica`
sez. 7. Presentato come esperimento pre-registrato decisivo, 30-40 lotti,
Rancimat.
**La ricerca**: Consolidamento C.2 e C.3. Il **primo nodo del cammino critico**
non è quello: è l'**in vitro SFC e idrolisi lipasica** (T6 sez. 5.11.3), che
costa [STIMA] 8.000-18.000 €, non richiede soggetti umani né approvazione etica,
**produce valore in entrambi gli esiti** e definisce i tempi di campionamento di
tutto ciò che viene dopo. Il secondo è il **braccio 1 sicurezza barriera**
(acidità contro TEWL, T1 sez. 8), [STIMA] 15.000-30.000 €, che testa direttamente
il fondamento tecnico di OdE. Inoltre T2 sez. 8.2 nota che per i grassi animali
lo Schaal Oven a 40-60 °C è preferibile al Rancimat a 120 °C.
**Al suo posto**: `/evidenza`, sezione "La sequenza", con i dieci passi ordinati
per costo dell'informazione, i costi cumulati e i gate collegati. L'impianto
"criterio di successo dichiarato prima dell'analisi" si conserva e si estende:
ogni esperimento porta il proprio criterio di invalidazione pre-fissato.

### 5. Il DPP come obbligo che OdE anticipa e converte in prodotto
**Dove**: `/OdE/mercato` sez. 5, `/OdE/normativa` (voce ESPR), `/OdE/investitori`
("Il Digital Product Passport diventa obbligatorio dal 2027... converte un costo
di conformità del settore in prodotto vendibile").
**La ricerca**: nessuna traccia sostiene che l'ESPR copra gli ingredienti
lipidici cosmetici. Il roll-out è **per gruppo di prodotto via atti delegati**, e
nessun atto delegato reperito riguarda questa categoria. L'affermazione è
un'inferenza presentata come fatto.
**Al suo posto**: in `/normativa`, la voce ESPR resta ma con lo stato corretto:
il perimetro dei gruppi di prodotto è definito da atti delegati non ancora
adottati per questa categoria, quindi il Passaporto Lipidico è **oggi un
differenziale volontario** e solo potenzialmente un adempimento futuro. Etichetta
`In costruzione`, non `Dimostrato`.

### 6. Il quadro normativo senza EUDR
**Dove**: `/OdE/normativa`, che non menziona affatto l'EUDR.
**La ricerca**: T7 sez. 4.6.2. Il codice NC 1502 **non figura** nell'Allegato I
del Reg. UE 2023/1115: il sego è fuori ambito, e non genera obblighi per OdE.
Sotto la commodity olio di palma figurano invece acido stearico e palmitico,
glicerolo e alcoli grassi industriali (dal 30 dicembre 2026) e, per atto delegato
del 13 luglio 2026, acido oleico, alcoli grassi specifici e **il sapone** (dal 30
dicembre 2027). Gli stessi prodotti da fonte non-palma non sono pertinenti.
**Le tre qualificazioni obbligatorie**: (a) è argomento di **conformità
documentale**, mai di superiorità ambientale; (b) l'esenzione **non è esclusiva
del sego**, la condividono cocco, karité, colza e girasole, che in più sono
compatibili con il vegan; (c) l'atto delegato è adottato ma la conferma di codici
e date va fatta in Gazzetta ufficiale.
**Al suo posto**: `/normativa`, nuova sezione "L'asimmetria EUDR", con le tre
qualificazioni in evidenza pari al fatto favorevole.

### 7. "Ingredienti lipidici ultrapuri" come apertura
**Dove**: `/OdE` Home, lede.
**La ricerca**: T3 sez. 9 e Consolidamento A.2. "Ultrapuro" è un aggettivo di
prodotto in un mercato dove la soglia probatoria è già superata dai comparatori
vegetali (cocco, argan, jojoba hanno RCT; il sego ha zero A1 e zero A2).
Aprire sul prodotto colloca OdE sul terreno dove perde.
**Al suo posto**: la Home apre sul fatto verificato e sul lavoro di verifica.
"Sego a basso numero di acidità certificato per lotto" resta come formulazione
difendibile all'interno di `/tesi` e `/amsa`, dove è ancorata a un parametro
misurabile.

### 8. La cifra di investimento
**Dove**: `/OdE/investitori`, "Investimento iniziale indicativo di circa 300.000
euro".
**La ricerca**: il Consolidamento ragiona su **350.000 euro** in ogni calcolo di
percentuale (scenari MINIMO 5-11%, INTERMEDIO 16-26%, COMPLETO 33-69%).
**Azione**: discrepanza da risolvere con il committente prima della Fase 4.
Vedi placeholder P1.

### 9. Lo stato di startup innovativa dato per acquisito
**Dove**: `/OdE/investitori`, sezione 2, presenta detrazione IRPEF 30% e 65% e
deduzione IRES 30% come applicabili.
**La ricerca**: Consolidamento, Verifiche ancora aperte n. 1. Lo status di
startup innovativa (società di capitali iscritta alla sezione speciale, requisito
oggettivo soddisfatto, assenza di prevalenza di attività di consulenza) è una
**verifica aperta**, ed è prerequisito di due strumenti su tre. Presentare gli
incentivi senza la condizione è una promessa non verificata.
**Al suo posto**: gli incentivi restano, preceduti dalla condizione dichiarata
in modo esplicito e con etichetta epistemica. Vedi placeholder P2.

---

## 6. Mappatura fra contenuti nuovi e tracce di origine

Legenda: T1 - T7 tracce, **C** Consolidamento, **L** Lettera a Dennis.

### Home
| Blocco | Origine |
|---|---|
| Zero studi clinici, dodici banche dati in sei lingue | T5 sez. 2 e 8; L |
| "Il valore non è nel sego, è nel saperlo qualificare" | L, nota al committente |
| Tre porte per tre pubblici | brief; C parte E |
| Riga di onestà in calce alla Home (i tre limiti principali) | C A.2, punti 1, 2 e 5 |

### L'Audit
| Blocco | Origine |
|---|---|
| Il vuoto di evidenza: zero A1, zero A2 sul sego topico | T1 sez. 7; T3 sez. 2; T5 sez. 3.1 e 8; T6 sez. 2.1 |
| I dodici bacini e le sei lingue, elencati | T5 sez. 1.3 |
| Che cosa esiste davvero, ripulito: 8 record nel nucleo probatorio | T5 sez. 3.1 e 4 |
| L'errore di matrice nella rassegna più citata (Russell 2024, DOI 10.7759/cureus.60981) | T5 sez. 6.9 e 6.9.1; T6 sez. 6 |
| I tre esempi verificabili: tensioattivo per erbicidi (POE-tallow amine), infusione endovenosa in bovine, grasso vegetale (Engkabang, *Shorea stenoptera*) | T5 sez. 6.9 tabella; T6 scheda R23 |
| Il dato di idratazione che circola e non riguarda il sego (progressione 4,7% a 47,2%) | T5 sez. 6.9.1 |
| La conclusione di Russell sfavorevole a OdE, riportata integralmente | T5 sez. 6.9.2 |
| Che il sego non sia reef-safe: conclusione basata su ammine, non sul trigliceride | T5 sez. 6.9.3 |
| Tassonomia delle claim che non reggono, sei righe, con il criterio Reg. UE 655/2013 | T7 sez. 7 |
| Il contesto probatorio: 200 contenuti social, 82% raccomanda, 61% con bias finanziario, 7% dermatologi | T5 sez. 6.1; T7 sez. 7 (Almatroud 2025, DOI 10.1111/jocd.70544) |
| La catena virtuosa e dove si interrompe (anello 3) | T7 sez. 8 |
| Che OdE condivide la fragilità sull'anello 3 | T7 sez. 8 |

### La Tesi
| Blocco | Origine |
|---|---|
| Il principio: acido grasso libero disturba, esterificato no | T1 sez. 2 e 5.2 (Mack Correa 2014, DOI 10.1111/exd.12296) |
| Il numero di acidità come parametro che decide, e i suoi standard (EN ISO 660) | T1 sez. 5.4 |
| I valori reali: sego grezzo 0,8 mg KOH/g; limite Codex 2,5; interesterificato 17,4 | T5 sez. 6.4.1 (Kowalska 2020, DOI 10.3390/biom10010115) |
| Che il rendering determina l'acidità (bassa temperatura 0,20 contro microonde 0,76) | T5 sez. 6.4.2 (Limmatvapirat 2021, DOI 10.7324/JAPS.2021.110903) |
| La complicazione: le lipasi cutanee scindono i trigliceridi in situ | T6 sez. 5.6.1 |
| La calibrazione: circa 25% in superficie contro circa 90% nel comedone; tetto del 50% al contributo batterico | T6 sez. 5.6.2 |
| L'asimmetria: petrolato, olio minerale, squalano e dimeticone non hanno legami estere, sono immuni | T6 sez. 5.11.1 |
| Che non possiamo dire "siamo inerti come loro" | T6 sez. 5.11.1, punto 2 |
| La riformulazione onesta del claim, per esteso | T6 sez. 8.2 |
| Che la claim "simile al sebo" è vera solo per la frazione trigliceridica | T7 sez. 6.3; T1 sez. 6 |
| Che a 32 °C il sego è semisolido (SFC circa 21%), classe fisica del petrolato | T4 sez. 2.1 |
| Che quel dato è un calcolo derivato per interpolazione, non una misura diretta | T4 sez. 2.1, tabella |
| La conclusione: il prodotto è la qualificazione, non il sego | L; C E.4 |

### AMSA
| Blocco | Origine |
|---|---|
| I parametri del Passaporto, per lotto | T6 sez. 8.5; T7 sez. 13; T2 sez. 8.2 |
| ORS come metrica di qualità del materiale, **non** predittore di esito cutaneo | T2 sez. 8.1 (regola interna) |
| Le soglie difendibili (PV 10, PV 5 premium, acidità 2,5 e 1,3, ferro e rame) | T2 sez. 8.5 |
| Che nessuna ponderazione fine dello score è non arbitraria, e va dichiarato | T2 sez. 8.4 |
| I COPs come marcatore proprietario, con il contro-dato LXR | T2 sez. 5.3bis e 8.3 |
| Nessuna soglia pass/fail sui COPs: regime di misurazione e dichiarazione | T2 sez. 8.5 |
| Sette campi di processo che il Passaporto registra | T2 sez. 8.7 |
| Il campo "testato / non testato" per la comedogenicità | T6 sez. 8.5 |
| La dichiarazione di non derivazione da olio di palma | T7 sez. 4.3 e 13 |
| L'attestazione anti-contaminazione (i dati si riferiscono al trigliceride, non alle ammine) | T6 sez. 8.5 |
| Data ladder, chemiometria baseline-first, few-shot, conformal prediction | sito attuale `/amsa/tecnica`, conservato |

### Filiera
| Blocco | Origine |
|---|---|
| Anagrafe BDN, marca auricolare, Modello 4, disciplinare DOP | sito attuale `/tracciabilita`, conservato |
| Dove la tracciabilità si rompe (vacca di riforma, lotto di rendering) | sito attuale, conservato e rafforzato |
| Che la tracciabilità DOP **non** soddisfa i requisiti EUDR e la domanda è mal posta | T7 sez. 4.6.2 (c), punto 2 |
| Che l'anello "filiera migliore, quindi esito cutaneo migliore" è indimostrato | T7 sez. 8 |
| Che le 42.000 t bruciate (+28%) sono il fatto verificabile della circolarità | T7 sez. 4.1 |
| Bovino contro suino: quattro assi, nessuno favorisce il suino | T5 sez. 13 |
| Che per il suino il limite Codex applicabile è 1,3 e non 2,5 | T5 sez. 13.2 |
| Che manca una misura di acidità sul lardo di filiera: lacuna analitica dichiarata | T5 sez. 13.2 |

### Posizione
| Blocco | Origine |
|---|---|
| Le tre gambe del verdetto: principio, scala, prezzo | T7 sez. 13bis |
| La clausola di alternanza in etichetta come prova di fungibilità | T7 sez. 4.6.1, ragione (g) |
| La tenaglia: volume contro differenziale | T7 sez. 4.6.1; C A.3 |
| Chi c'è già nello spazio della tracciabilità | T7 sez. 4.2 |
| Che la base probatoria del verdetto è dichiaratamente debole (tre gruppi su sei, uno neutro) | T7 sez. 4.6.3 |
| Il cliente realistico: chi deve ancora costruire una storia di filiera | T7 sez. 5.2 e 6.5 |
| Il ciclo di attenzione fra picco e riflusso | T7 sez. 9 |
| Che il trend vegan esclude il sego per definizione | T7 sez. 13, rischi |
| Le lacune di dimensionamento, elencate | T7 sez. 11 e 12 |
| I quattro riposizionamenti se la tesi principale fallisse | C E.3 |

### Normativa
| Blocco | Origine |
|---|---|
| Reg. 1069/2009, 142/2011, 1223/2009, Codex CXS 211-1999, ISO 22716 | sito attuale, conservato |
| Reg. UE 655/2013, criteri comuni per le dichiarazioni cosmetiche | T7 sez. 7 |
| Art. 20 Reg. 1223/2009 e il confine con il medicinale | T7 sez. 6.3 |
| L'asimmetria EUDR con le tre qualificazioni | T7 sez. 4.6.2 |
| Il calendario EUDR (30.12.2026, 30.06.2027, 30.12.2027) e lo stato dell'atto delegato | T7 sez. 4.6.2 (c), punti 5 e 6; C nota metodologica |
| ESPR e DPP, con lo stato corretto | correzione di sezione 5, voce 5 |
| Requisiti contro differenziali: metalli pesanti e residui veterinari sono requisiti; 3-MCPD, glicidil esteri, IPA, ftalati, stato ossidativo sono differenziali | T6 sez. 5.10 e 8.3 |
| Che sono ricognizioni documentali e non pareri legali | C, Limiti del consolidamento |

### Evidenza aperta
| Blocco | Origine |
|---|---|
| Le lacune verificate, per traccia, con query e bacini | T1 sez. 7; T2 sez. 7; T3 sez. 8; T5 sez. 8; T6 sez. 7 |
| Nove esperimenti con domanda, disegno, endpoint, costo, durata, categoria | C C.1 |
| Le tre categorie: licenza a operare, asset commerciale, conoscenza interna | C C.1, convenzione |
| Il cammino critico e le dipendenze | C C.2 |
| La sequenza a dieci passi con costi cumulati e decisione abilitata | C C.3 |
| Il metodo dei cumulati (valori medi, non somma dei minimi) | C, nota metodologica |
| I tre scenari MINIMO, INTERMEDIO, COMPLETO con che cosa OdE potrà affermare | C C.5 |
| I gate decisionali con criteri numerici pre-fissati | C E.1 |
| Le condizioni di fallimento della tesi e che cosa resterebbe | C E.2 |
| Il criterio di invalidazione dell'in vitro (differenza sotto il 20%, o annullata entro 2 ore) | T6 sez. 5.11.3 |
| Le forme di collaborazione accademica con costi e controllo sui risultati | C D.2 |
| I partner accademici realistici e i CRO | C D.2 e D.3 |
| L'invito e le tre domande aperte | brief; T6 sez. 5.11.3 |

### Investitori
| Blocco | Origine |
|---|---|
| Il verdetto in due parti: che cosa non merita l'investimento, che cosa lo merita e a quali condizioni | C E.4 |
| Le quattro condizioni | C E.4 |
| Che la verifica costa meno di tremila euro e novanta giorni | C, sintesi esecutiva |
| Il programma completo a 115.000-240.000 € e la percentuale di capitale | C C.5 |
| I gate a costo zero e il Gate mercato (8-10 contatti qualificati) | C E.1 e F.1 |
| SWOT con forze, debolezze, opportunità e minacce | C B.1 |
| Le quattro combinazioni strategiche | C B.3 |
| La finanza agevolata: FESR preferibile a Smart&Start, e perché | C D.1 |
| Che Smart&Start in Emilia-Romagna è debito al 100%, anche a gate negativo | C D.1bis |
| Il vincolo del fondatore solo | C D.4 |
| Incentivi fiscali e Investor Visa, con la condizione dello status | sito attuale + C, nota metodologica su art. 25 DL 179/2012 |
| I quattro riposizionamenti | C E.3 |
| La roadmap a quattro fasi | sito attuale `/visione`, conservata |

---

## 7. Sistema di etichette epistemiche, ereditato ed esteso

### Ereditato senza modifiche
`Fonte` / `Stima` / `Benchmark`, con badge numerato cliccabile e nota in calce
resa a fondo pagina. Meccanismo identico all'attuale, in componenti duplicati
(`DataTag2`, `Sources2`) per non toccare l'originale.

### Formalizzato: componente `Status`
Oggi esiste solo come stringa dentro `StatCard`. Diventa un componente con
quattro valori, allineati alle tre categorie epistemiche del Consolidamento
(A.1) più il quarto che l'Audit richiede:

| Valore | Significato | Corrisponde a |
|---|---|---|
| `Dimostrato` | Fatto stabilito con evidenza verificata | C A.1, "fatti stabiliti" |
| `In costruzione` | Inferenza meccanicisticamente plausibile, non testata | C A.1, "inferenze plausibili non testate" |
| `Scommessa` | Capacità emergente o ipotesi, non un fatto | uso attuale del sito |
| `Lacuna verificata` | Si è cercato in modo esaustivo nel bacino pertinente e non si è trovato | C A.1, "lacune verificate"; T5 sez. 6.4.3 |

**Estensione da approvare.** Il quarto valore non è nell'elenco del brief. È
necessario perché l'Audit vive interamente su di esso, e perché la ricerca
distingue con cura, in T5 sez. 6.4.3, fra risultato negativo verificato, assenza
di dati dimostrata e ipotesi non testata. Senza `Lacuna verificata` l'affermazione
più importante del sito (zero studi) resterebbe senza etichetta, oppure verrebbe
etichettata `Dimostrato`, che è impreciso.

### Nuovo: componente `Finding`
Marca esplicitamente il segno di un risultato rispetto a OdE:
`Favorevole` / `Sfavorevole` / `Neutro`. Serve a rendere visibile che i risultati
sfavorevoli sono pubblicati con la stessa evidenza di quelli favorevoli, e con lo
stesso peso tipografico. È la traduzione visiva del requisito "onestà come
requisito di prodotto".

### Nuovo: componente `ClaimRow`
Riga della tassonomia delle claim: claim, che cosa afferma, evidenza,
difendibile sì o no, criterio Reg. 655/2013 messo in tensione. Valuta
l'affermazione, mai chi la formula.

---

## 8. I risultati sfavorevoli che il sito pubblica, e dove

Elenco vincolante. Nessuno di questi va attenuato, e ciascuno ha una collocazione
assegnata in modo che sia trovato, non nascosto in fondo.

| Risultato sfavorevole | Pagina | Posizione |
|---|---|---|
| Zero studi clinici sul sego topico: nessun A1, nessun A2 | Home e Audit | **titolo della Home** |
| L'unico dato meccanicistico favorevole è eroso dall'idrolisi lipasica in situ | Tesi | sezione 3 di 5, subito dopo il fondamento |
| Petrolato, olio minerale, squalano e dimeticone sono strutturalmente immuni a quel meccanismo | Tesi | stessa sezione |
| Il sego non batte il petrolato sull'occlusione né i ceramidi sulla riparazione | Tesi e Posizione | sezione "Dove non possiamo competere" |
| L'appiccicosità è un difetto sull'endpoint primario della categoria emolliente, misurata strumentalmente su sego **bovino** | Tesi | stessa sezione |
| La conclusione di Russell che pone olio di zucca e acido linoleico sopra il sego | Audit | dentro l'audit, non in nota |
| La tenaglia volume contro differenziale | Posizione | prima sezione |
| Lo spazio della tracciabilità non è vergine | Posizione | sezione "Chi c'è già" |
| La base probatoria del verdetto sui grandi gruppi è debole (tre gruppi su sei) | Posizione | dichiarata nella stessa sezione del verdetto |
| Il mercato accessibile non è dimensionabile con dati pubblici | Posizione | sezione "Che cosa non possiamo dirvi" |
| Il ciclo di attenzione è fra picco e riflusso | Posizione | sezione rischi |
| Il trend vegan esclude il sego per definizione | Posizione | sezione rischi |
| L'anello "filiera migliore quindi esito cutaneo migliore" è indimostrato, per OdE come per il mercato | Filiera e Audit | conclusione della Filiera |
| Il programma completo costa il 33-69% del capitale ed è insostenibile | Investitori | sezione "I numeri veri" |
| Come produttore di sego indifferenziato il progetto non regge | Investitori | **apertura della pagina** |
| Smart&Start in Emilia-Romagna è debito al 100%, anche a gate negativo | Investitori | sezione finanza agevolata |
| Il divario di accettazione consumer (49,4% contro 68,9% per l'olio di canapa) | Posizione | sezione domanda |
| Il sego è povero di acido linoleico, dato sfavorevole | Tesi | sezione composizione |
| Prokop 2022: su ferite di suinetto il lardo puro non dà beneficio | Audit | dentro il nucleo probatorio |
| ORS non è un predittore di esito cutaneo | AMSA | in evidenza, non in nota |

---

## 9. Claim vietate: come si applica il vincolo

Il sito non può contenere, in nessuna forma:

1. che il sego sia identico o quasi identico al sebo umano;
2. che rafforzi la barriera cutanea;
3. che calmi infiammazioni o tratti condizioni dermatologiche;
4. che sia superiore agli ingredienti di sintesi o di origine vegetale;
5. qualunque affermazione di efficacia cutanea non sostenuta da uno studio citabile.

**Come il sito ne parla senza usarle.** La tassonomia dell'Audit le cita come
**oggetto di analisi**, in tabella, con la colonna "difendibile: no" e il criterio
regolatorio messo in tensione. È l'unico contesto in cui compaiono, ed è un
contesto che le nega. In tutto il resto del sito non compaiono affatto.

**Due formulazioni da sorvegliare in fase di scrittura**, perché sono le più
facili da far scivolare:
- "il sego somiglia al sebo": ammessa **solo** nella forma "la claim di
  somiglianza è vera per la sola frazione trigliceridica; il sebo umano contiene
  circa il 25% di esteri cerosi e il 12-15% di squalene, assenti nel sego, e il
  suo acido grasso caratteristico, il sapienico, è esclusivo della specie umana",
  cioè come **smontaggio** della claim.
- "l'esenzione EUDR": ammessa **solo** come argomento di conformità documentale.
  Mai come argomento di superiorità ambientale. La catena illegittima è
  esplicitata nel testo di `/normativa`, come promemoria pubblico.

**Formulazioni difendibili, dalla ricerca** (T3 sez. 9): "sego bovino a basso
numero di acidità, con acidi grassi in forma esterificata"; "materia prima con
stabilità ossidativa qualificata per lotto"; "emolliente lipidico di origine
animale tracciata"; "lipide di origine rinnovabile e tracciata, candidato alla
sostituzione di occlusivi di derivazione petrolchimica" (asse di provenienza, non
di performance).

---

## 10. Un rilievo sul brief, da sciogliere prima della Fase 4

**La pagina Audit pubblica la mappa della lacuna.** Il Consolidamento la tratta
come un rischio esplicito, due volte: minaccia M4 ("rischio che un concorrente
pubblichi per primo un dato primario sul sego, azzerando il vantaggio della
lacuna") e condizione 4 di E.4 ("generare un solo dato proprietario difendibile,
la cinetica di idrolisi in vitro, **prima** di divulgare la libreria").

Il rilievo è reale e va detto. Tre elementi lo attenuano in modo sostanziale:

1. il sito eredita `noindex, nofollow` ed è escluso dal sitemap: non è
   pubblicazione, è un documento condiviso per URL diretto;
2. la lacuna sul sego è **già pubblica**: chiunque legga la conclusione di Russell
   2024 la trova dichiarata dagli autori stessi;
3. ciò che l'Audit **non** pubblica è il dato proprietario, che non esiste ancora,
   e nemmeno il disegno completo dell'esperimento in vitro, di cui `/evidenza`
   dichiara domanda, costo e criterio di arresto ma non il protocollo.

**Procedo su questa assunzione**: l'Audit pubblica il lavoro di verifica e il
suo esito, non il protocollo sperimentale. Se il committente preferisce una
soglia diversa, è una decisione da prendere adesso e non dopo la scrittura.

---

## 11. Placeholder che richiedono input del committente

Nessun dato verrà inventato. Dove il contenuto manca, entra un placeholder
visibile in pagina, marcato e raccolto nella PR.

| ID | Che cosa serve | Dove impatta | Stato provvisorio in Fase 4 |
|---|---|---|---|
| **P1** | Capitale di riferimento: 300.000 (sito attuale) o 350.000 euro (Consolidamento)? | Investitori, tutte le percentuali di scenario | Si usa 350.000 € coerentemente con il Consolidamento, con nota `[DA CONFERMARE]` |
| **P2** | Status di startup innovativa: iscritta alla sezione speciale, iscrivibile, o da verificare? | Investitori, sezione incentivi e finanza agevolata | Presentato come **verifica aperta**, con gli incentivi subordinati alla condizione |
| **P3** | Si può nominare BOTALLOW come operatore già posizionato? | Posizione, sezione "Chi c'è già" | Nominato in forma neutra e non valutativa (è un fatto di posizionamento, non un'accusa). Rimovibile in una riga |
| **P4** | Indirizzo di contatto per le tre porte: `mm@matteomartignoni.com` come oggi, o indirizzi distinti per pubblico? | Home, Evidenza, Investitori, Tesi | Si usa l'indirizzo attuale per tutte e tre le porte |
| **P5** | Esito delle tre verifiche a costo zero (capitolato Schmid e Donatelli, EUDR presso trasformatori, Gate mercato): già avviate? | Investitori, sezione gate | Presentate come "in corso", senza esito |
| **P6** | Data di riferimento della ricognizione normativa da stampare in pagina | Normativa | 27 agosto 2026, data di consultazione dichiarata nella Traccia 7 |
| **P7** | Il sito di test deve riportare il nome del fondatore e il ruolo? Il brief menziona la credibilità del fondatore fra le domande dell'investitore, ma il sito attuale non contiene una biografia | Investitori | Nessuna biografia inserita, sezione predisposta e segnalata |
| **P8** | La lettera a Dennis contiene tre domande aperte a un interlocutore esterno. Vanno riprese sul sito come domande pubbliche? | Evidenza, Investitori | Non riprese. Le domande del sito sono quelle scientifiche di `/evidenza` |

---

## 12. Piano delle fasi 3, 4, 5 e 6

| Fase | Contenuto | Verifica di uscita |
|---|---|---|
| **3, scaffolding** | Layout, tema, i18n, route map, componenti nuovi, dieci pagine IT con struttura e titoli, zero contenuto definitivo | `npm run build` verde; `git diff --name-only main` non contiene alcun file del sito originale; le cinque verifiche di isolamento della sezione 2 passano |
| **4, contenuti IT** | Scrittura pagina per pagina secondo la mappatura della sezione 6. Ogni dato quantitativo con `DataTag` e nota in calce | Rilettura nei panni di un dermatologo ostile e di un formulatore esperto; nessuna claim vietata; nessun trattino lungo |
| **5, versione EN** | Mirror sotto `/OdE/test`. Priorità dichiarata dal brief: Home, Audit, Investitori tradotte integralmente; le altre secondo capienza, con segnalazione esplicita di ciò che resta da completare | Ogni pagina IT ha il proprio mirror EN raggiungibile; le pagine non ancora tradotte portano un avviso in pagina |
| **6, QA e consegna** | Isolamento, coerenza estetica, responsività, performance, navigazione, `noindex`, link interni, note in calce. README aggiornato. Pull Request con checklist | Checklist completa in `docs/ode-v2/QA.md`; PR con prova del diff |

**Stima del volume**: circa 10 pagine IT più 10 EN, 8 componenti nuovi, 1 layout,
1 tema, 2 file di libreria. Nessuna nuova dipendenza, nessun framework nuovo.

---

## 13. Che cosa NON cambia

- Lo stack: Astro 5 statico, nessuna dipendenza aggiunta.
- I token di `OdE_Brand_System`: menta `#afdfc7`, inchiostro `#1c2620`, corpo
  `#243029`, accento `#2f5a44`, accenti da diagramma grigio-blu e pesca, Roboto e
  Roboto Mono, pesi leggeri, gerarchia da dimensione e colore, nessun gradiente.
- Il tono sobrio e la qualità tipografica.
- Il meccanismo delle note in calce numerate.
- L'esperimento con criterio di successo dichiarato prima dell'analisi, esteso a
  tutti gli esperimenti.
- Il glossario, esteso.
- AMSA Live, con il suo badge "Simulazione dimostrativa".
- La doppia lingua.

---

## 14. Checkpoint: decisioni del committente

Prese in data 28 agosto 2026, prima dell'inizio della Fase 3.

| Questione | Decisione |
|---|---|
| **Rotta e isolamento** | `/OdE/test`, albero di file interamente nuovo, zero file esistenti modificati. Il filtro sitemap esistente copre già la rotta |
| **Architettura** | **Approvata come proposta.** Dieci pagine più AMSA Live. `mercato` sparisce come rotta e diventa `posizione`; `amsa/tecnica` si fonde dentro `amsa` e l'esperimento decisivo si sposta in `evidenza` cambiando identità |
| **Soglia dell'Audit** (rilievo della sezione 10) | **Esito sì, protocollo no.** L'Audit pubblica il vuoto di evidenza, l'errore di matrice nella rassegna più citata e la tassonomia delle claim. `Evidenza aperta` dichiara domanda, costo, sequenza e criterio di arresto di ogni esperimento, **ma non il protocollo sperimentale**. Il criterio di invalidazione dell'in vitro resta pubblicato, perché è la garanzia di serietà, non il disegno |
| **P1, capitale** | **350.000 euro.** Le percentuali di scenario restano quelle del Consolidamento: MINIMO 5-11%, INTERMEDIO 16-26%, COMPLETO 33-69%. Il valore va comunque marcato `[DA CONFERMARE]` finché il committente non allinea il piano economico |
| **P3, concorrenti** | **Non nominati.** La formulazione è "esiste almeno un operatore già posizionato esplicitamente su tracciabilità e sostenibilità, oltre a più operatori statunitensi sul grass-fed". L'ammissione resta integra, il nome no |

Restano aperti i placeholder **P2, P4, P5, P6, P7, P8** della sezione 11, gestiti
con le assunzioni provvisorie dichiarate e raccolti nella Pull Request. La
sezione 16 registra lo scioglimento di P1 e il cambiamento di natura di P2.

---

## 15. Allineamento alla v4.0 del consolidamento

Il consolidamento della ricerca è passato alla **versione 4.0**, che integra una libreria
di intelligence scientifica multilingue. Il sito è stato riallineato. La tesi non
cambia. Cambiano il fondamento tecnico, che diventa più preciso e meno pessimistico di
come il sito lo raccontava, e il perimetro del fossato, che si stringe.

### Le tre revisioni sostanziali, e dove incidono

| # | Revisione | Pagine toccate |
|---|---|---|
| 1 | Il principio di Mack Correa riguarda **l'acido oleico**, non la classe degli acidi grassi liberi, e non è estendibile ai saturi. I due saturi dominanti del sego, insieme circa il 46% del profilo, hanno evidenza ex vivo di segno opposto | `tesi` §1 e §5, Home, `audit` |
| 2 | L'idrolisi lipasica passa da **rischio direzionale a domanda quantitativa aperta**: la miscela rilasciata è circa 38% oleico e circa 46% palmitico e stearico, e l'effetto netto è ignoto. Il dato proprietario diventa la **composizione** del rilascio, non la velocità | `tesi` §3, Home, `evidenza`, `investitori`, `amsa` |
| 3 | L'anello provenienza verso composizione ha un **primo candidato misurabile**, il differenziale di polinsaturi legato alla dieta. Fonte divulgativa non peer-reviewed, da riverificare su campione proprio prima di ogni uso in comunicazione | `filiera`, `evidenza` |

### Le due aggiunte pesanti

**Tre misure analitiche in testa alla sequenza**, per meno di 3.000 euro complessivi:
profilo acidi grassi con polinsaturi, contenuto di grasso solido via risonanza
magnetica pulsata, panel ossidativo con ossisteroli. Convertono tre stime che il sito
usava in tre dati primari, e il **primo nodo del cammino critico si sposta** dall'in
vitro al profilo acidi grassi.

**Il processo non è un fossato.** Frazionamento e raffinazione del sego sono arte nota,
coperta da famiglie brevettuali in gran parte scadute. È la debolezza D6 della nuova
SWOT e va pubblicata con lo stesso peso delle altre: se OdE si presentasse come
detentore di un processo distintivo, la posizione non reggerebbe a una due diligence
tecnica.

### Correzioni di dato

| Voce | Prima | Dopo |
|---|---|---|
| Scenario minimo | 17.000-39.000 €, 5-11% | **18.000-41.000 €, 5-12%** |
| Numeri sull'analisi dei contenuti social | 82%, 61% con interesse commerciale, 96% marchi, 7% dermatologi, quattro piattaforme | **82%, 7% dermatologi, 92% e 74% per piattaforma.** Il 61% e il 96% non sono confermati dalla v4.0 e cadono; il numero di piattaforme è discordante fra le sintesi interne e non viene dichiarato |
| Contenuto di grasso solido a 32 °C | stima 21,3%, marcata come calcolo derivato | invariata, ma con la **forbice attesa 15-25%** e la nota che nessuna tabella primaria pubblica quel valore |
| Programma sperimentale | nove voci | **dodici voci**, sequenza a tredici passi |
| Gate | quattro | **otto**, con tre soglie analitiche nuove e il gate sulla composizione del rilascio |
| Condizioni di fallimento | quattro | **sei** |

### Aggiunte favorevoli, con la loro cautela

Il ranking termico è ora ancorato a una fonte primaria: il sego è completamente fuso
solo a 46 °C, il burro di cacao è già liquido fra 35 e 37 °C, e a temperatura cutanea
l'ordine è palm stearin, sego, burro di cacao. Sostituisce in `tesi` §4 un calcolo
derivato con un fatto stabilito. L'audit conta ora **due** errori di attribuzione
ricostruiti fino alla fonte, non uno.

### La trappola, registrata perché non si ripeta

Lo studio che qualifica il rischio dell'idrolisi è di grado B1, su cute umana **ex vivo
e danneggiata**, con acidi grassi isolati e non con il sego, e con autori di provenienza
industriale. **Non autorizza in alcun modo un claim di barriera**, che resta fra le
affermazioni vietate. Il suo uso sul sito è stretto e uno solo: toglie il presupposto
che tutto ciò che si libera per idrolisi sia dannoso.

Analogamente, il differenziale compositivo legato alla dieta **non compare come
vantaggio** in `filiera`. Compare in `evidenza` come misura da fare, con la soglia già
scritta, perché la ricerca prescrive di riverificarlo prima di portarlo in
comunicazione e questo sito è comunicazione.

### Onestà aggiunta

`audit` dichiara ora anche i **bacini non interrogati** (CNKI, testo integrale di
J-STAGE, KoreaScience e KISS, DIALNET, SciELO, con Scopus e Web of Science accessibili
solo per aggregatori). L'affermazione più prominente del sito poggia su quella lacuna,
quindi il sito deve dichiararne il perimetro.

**Conseguenza operativa della soglia dell'Audit su `/evidenza`.** La pagina
pubblica per ogni esperimento: la domanda a cui risponde, la categoria (licenza a
operare, asset commerciale, conoscenza interna), l'ordine di grandezza del costo,
la durata, la posizione nella sequenza e il gate collegato. Non pubblica:
concentrazioni, temperature, enzimi specifici, punti di campionamento, numerosità
campionaria per braccio. La riga di confine è quella fra "che cosa vogliamo
sapere e quanto costa saperlo" e "come esattamente lo misuriamo".

---

## 16. Decisioni del committente su P1 e P2, e completamento della versione inglese

### P1, capitale: sciolto

**350.000 euro**, confermato. Il chip `Da confermare` è stato tolto dalle pagine
Investitori in entrambe le lingue, e la nota dichiara che il sito attualmente
online, con 300.000, riporta la cifra superata. Le percentuali di scenario
restano quelle del consolidamento, ora calcolate su una base non più
provvisoria.

### P2, startup innovativa: non sciolto, ma cambia natura

Il committente ha chiarito che l'iscrizione alla sezione speciale è un
**obiettivo**, non una condizione acquisita, e che l'asset innovativo candidato
a sostenerla è l'intelligenza artificiale dentro AMSA. Resta aperta una domanda
che il committente sta valutando: **se l'uso dell'intelligenza artificiale in
AMSA sia sostanziale o marginale**.

Questo sposta P2 da una casella amministrativa a una **questione di prodotto**, e
il sito la tratta come tale. Due interventi:

1. **AMSA, fondo della sezione 5.** Una sottosezione nuova, "Quanto pesa davvero
   l'intelligenza artificiale, qui dentro", pone la domanda per primi e le dà una
   forma verificabile: che cosa fa un modello appreso che l'analisi in componenti
   principali e la regressione ai minimi quadrati parziali non farebbero da sole,
   su una matrice prevalentemente satura e con il numero di lotti che avremo. Se
   la risposta è "produce lo stesso risultato con più complessità", la cosa
   corretta è dirlo e togliere il modello, non tenerlo per il nome.
2. **Investitori, sezione 6.** Un riquadro dichiara che lo status è un obiettivo
   e non un fatto, e che dipende da quella domanda tecnica. La sezione 7 apre ora
   dicendo che **a oggi nessuna agevolazione fiscale è disponibile**.

**L'incentivo perverso è pubblicato in entrambe le pagine.** Uno status con
benefici fiscali reali spinge a rispondere di sì a una domanda tecnica prima di
averla misurata. La regola interna di AMSA, scritta prima, dice l'opposto: un
modello avanzato che non batte la linea di base chemiometrica non entra in
produzione. Un sito che pubblica la tassonomia delle claim che non reggono non
può fare un'eccezione quando la claim non sostenuta converrebbe a sé.

### Versione inglese: completata

Tradotte le sei pagine che mancavano (AMSA, Filiera, Posizione, Normativa,
Evidenza aperta, Glossario), a partire dai sorgenti già allineati alla v4.0.
Le note in calce passano da 119 a 148 e sono ora identiche pagina per pagina
nelle due lingue, il che è anche il controllo più rapido di allineamento.

Due pulizie conseguenti: il componente `Pending`, che serviva a dichiarare in
pagina una rotta non tradotta, **è stato rimosso** insieme alle stringhe `todo`
e `todoEn`, perché non ha più consumatori; e gli ancoraggi del glossario restano
identici nelle due lingue, perché un ancoraggio è un identificatore e non testo.

Resta da fare, e non è stato fatto: una rilettura della versione inglese da parte
di un madrelingua tecnico. La traduzione è fedele e completa, ma su un testo che
vive di distinzioni epistemiche vale la pena.

### Una correzione trovata strada facendo

La sezione 5 di `evidenza` annunciava "Quattro" condizioni di fallimento mentre
la tabella ne conteneva sei dalla v4.0. Corretta.

---

## 17. L'inglese diventa la lingua sorgente

Decisione del committente: **il sito è concepito e scritto in inglese, e
l'italiano è la sua traduzione.** Non è una revisione di stile, è
un'inversione della direzione di autorità: dove le due lingue divergono, decide
l'inglese.

### Che cosa questo ha imposto di cambiare

**Le rotte inglesi portano slug inglesi.** `thesis`, `supply-chain`, `position`,
`regulation`, `open-evidence`, `investors`, `glossary`. Le chiavi della mappa di
rotte restano quelle di prima, perché sono identificatori e non testo: il
selettore di lingua lavora sulle chiavi, quindi continua a trovare la stessa
pagina nell'altra lingua. Un lettore inglese che atterrava su `/en/filiera`
capiva in mezzo secondo di essere su un sito tradotto.

**Il badge dei dati parlava italiano anche in inglese.** `DataTag` stampava
`Fonte` e `Stima` su tutte le pagine, comprese quelle inglesi, perché il
componente non aveva un parametro di lingua e le circa 150 chiamate non
glielo passavano. Ora legge la lingua dalla rotta e rende `Source` ed
`Estimate`. Era il difetto singolo più rivelatore dell'intero sito.

**Mancava una sezione intera.** La versione inglese di `investitori` aveva nove
sezioni contro le dieci italiane: la traiettoria in quattro fasi non era mai
stata tradotta, insieme ai suoi stili. Scritta.

### I calchi rimossi, con il criterio

| Calco | Perché non regge | Sostituito con |
|---|---|---|
| `basin` per "bacino" bibliografico | In inglese si cerca su *databases*. "Basin" è un bacino idrografico | `database` |
| `that is` come "cioè" | In inglese è pesante e ricorreva a ogni paragrafo | riformulazione, oppure `in other words` |
| `it must be said` per "va detto" | L'impersonale italiano diventa passivo debole in inglese | voce attiva, soggetto esplicito |
| `translated evidence` per "evidenza traslata" | Non è un termine inglese | `borrowed evidence` |
| `matrix error` per "errore di matrice" | Ambiguo: in chimica analitica "matrix" è il campione | `wrong-material error` |
| `perimeter` per "perimetro di mercato" | In inglese un perimetro è geometrico | `market`, `scope` |
| `2,3 mln t` | Notazione italiana | `2.3 million t` |

### Due nomi cambiati in entrambe le lingue

L'inglese naturale ha imposto la formulazione, e l'italiano l'ha seguita.

| Prima | Inglese | Italiano |
|---|---|---|
| Evidenza aperta | **Open questions** | **Domande aperte** |
| In costruzione | **Not yet tested** | **Non ancora testato** |

Il secondo conta più del primo. La definizione condivisa dell'etichetta è
"inferenza meccanicisticamente plausibile, non ancora testata", e le due lingue
la rendevano con due parole di angolazione diversa. Ora dicono la stessa cosa.

### Che cosa NON ho fatto, e perché

**Non ho ritradotto l'italiano riga per riga dall'inglese nuovo.** La revisione
ha cambiato il *modo di dire* le cose in inglese, non le cose dette: il
significato è invariante, quindi l'italiano resta un parallelo fedele.
Ritradurlo integralmente avrebbe peggiorato una prosa italiana già buona senza
cambiare un solo contenuto, e avrebbe moltiplicato il rischio di introdurre
errori in pagine che l'audit dichiara verificabili riga per riga.

**Non ho cambiato la lingua di default.** `/OdE/test` serve l'italiano,
`/OdE/test` l'inglese, come il sito originale. Se l'inglese è la lingua
sorgente si può sostenere che debba essere anche il default, con l'italiano
sotto `/it`. Ma quella è una decisione sul **pubblico primario del progetto**,
non sulla lingua dei testi, e ha conseguenze su SEO, su che cosa vede chi arriva
senza percorso, e su come il sito si presenta a un investitore italiano. La
lascio al committente, ed è l'unica questione aperta di questa revisione.

**Ho esteso all'inglese il divieto di trattino lungo.** In inglese sarebbe
idiomatico, ma farne a meno non costa nulla e tenere una sola regola di stile
per tutto il sito vale più della sfumatura.

---

## 18. Pubblicazione su matteomartignoni.com/OdE/test

Decisione del committente: l'area di test va pubblicata sul dominio reale, con
l'inglese come lingua di default.

### La rotta: perche' `/OdE/test` e non `/ode/test`

La richiesta era `/ode/test`, in minuscolo. Non e' praticabile, e la ragione non
e' estetica:

**Una cartella `src/pages/ode/` collide con `src/pages/OdE/`.** Su qualunque
filesystem case-insensitive, cioe' su quasi tutti i checkout macOS, sono lo
stesso percorso. Git ne registrerebbe due, il filesystem ne vedrebbe uno, e
l'albero di lavoro si romperebbe alla prima checkout, potenzialmente
sovrascrivendo i file del sito originale. Il rischio ricade esattamente su cio'
che tutta la consegna ha protetto.

**Il filtro sitemap smetterebbe di agganciare.** Il filtro e'
`!page.includes('/OdE')`, ed e' l'unica ragione per cui `astro.config.mjs` non e'
mai stato toccato. `/ode/test` in minuscolo non contiene `/OdE`: l'area di test
sarebbe finita nel sitemap del sito pubblico, cioe' esattamente il contrario del
requisito di isolamento.

`/OdE/test` risolve entrambi i problemi e in piu' e' coerente con la
capitalizzazione della rotta che esiste gia'. Il costo e' che l'URL in minuscolo
restituisce 404, perche' i percorsi HTTP sono case-sensitive.

### L'inglese diventa anche la lingua di default

| | Inglese, default | Italiano |
|---|---|---|
| Home | `/OdE/test` | `/OdE/test/it` |
| Sorgenti | `src/pages/OdE/test/` | `src/pages/OdE/test/it/` |

Rispecchia il sito ospitante, che ha gia' `defaultLocale: 'en'` e
`prefixDefaultLocale: false`, cioe' inglese su `/` e italiano su `/it`. Con la
sezione 17 l'inglese era diventato la lingua sorgente dei testi; qui diventa
anche quella di default delle rotte, che e' la conseguenza coerente.

Tre punti hanno richiesto un intervento oltre allo spostamento dei file: gli
import delle pagine italiane, scese di due livelli; il rilevamento della lingua
in `DataTag`, che ora riconosce l'italiano dal prefisso `/it` invece
dell'inglese da `/en`; e il valore di default della prop `lang` nel layout, che
segue il default locale.

### L'eccezione alla regola di isolamento, dichiarata

L'area di test vive ora **dentro `src/pages/OdE/`**, la cartella che tutta la
consegna ha trattato come intoccabile. La contraddizione e' apparente ma va
gestita, non taciuta: la verifica 1 dello script QA e' stata resa **piu'
precisa**, non piu' permissiva. Continua a vietare ogni modifica sotto
`src/pages/OdE/`, con una sola eccezione dichiarata in codice,
`src/pages/OdE/test/`, che contiene esclusivamente file nuovi. Nessun file
preesistente del sito originale risulta toccato, e lo script lo verifica a ogni
esecuzione.

### Il merge su main, e perche' e' a basso rischio

Pubblicare sul dominio richiede un merge su `main`, che finora la consegna aveva
escluso. Autorizzato dal committente. Il rischio e' misurato, non presunto:
fuori dall'area di test il branch tocca **due soli file**, `.gitignore` e
`README.md`, e il diff del README **non rimuove nemmeno una riga**. Il sito live
viene quindi ridistribuito identico, con in piu' l'area di test.

## 19. Costi del programma: dove stanno, e perche' restano dove sono

Il committente ha chiesto se il punto 2 di Domande aperte, il programma
sperimentale con i costi, non stia meglio nella pagina Investitori. La risposta
data e' no, con due correzioni al contorno che sono state applicate.

### Perche' la sezione non si sposta

Le due sezioni non sono lo stesso contenuto ripetuto. Sono lo stesso denaro
tagliato per due lettori, e chiudono due decisioni diverse.

- **Domande aperte §2** e' il programma voce per voce: dodici righe con domanda,
  ordine di costo, durata e categoria. Il lettore e' un gruppo di ricerca, e la
  decisione e' "questo esperimento lo so fare io".
- **Investitori §3** e' lo stesso denaro aggregato in tre scenari, con quota del
  capitale, durata e verdetto. Il lettore e' un investitore, e la decisione e'
  "il piano sta in piedi con 350.000 euro".

Spostare §2 toglierebbe le gambe alla pagina di ricerca. L'occhiello promette
"the experiments that would close them and roughly what each would cost", e §6,
le forme di collaborazione, ha una colonna "Cost to OdE" che si regge sui costi
per singola voce. In cambio caricherebbe dodici righe analitiche su una pagina
il cui lettore ha bisogno della vista a tre scenari. Peggiorerebbe entrambe.

C'e' anche una ragione di coerenza con la tesi del sito: pubblicare il costo
degli esperimenti nell'invito alla ricerca e' parte di cio' che il sito predica.
Chi valuta se collaborare deve vedere gli 8.000 euro dell'in vitro dichiarati,
non spostati nella sezione di chi mette i soldi.

### Le due correzioni applicate

Il problema reale non era la collocazione della sezione, ma due asimmetrie.

1. **Linguaggio da investitore su una pagina di ricerca.** Il callout di §2
   diceva che le prime tre voci costano "meno dell'1% del capitale e meno del 5%
   dell'esperimento piu' caro". La quota sul capitale e' una metrica che serve a
   chi valuta l'investimento, non a un ricercatore. Rimossa: resta il confronto
   con l'esperimento piu' caro, che regge da solo e parla al lettore giusto.
2. **Il rimando esisteva in una direzione sola.** Domande aperte §2 rinviava a
   Investitori per il peso sul capitale, ma Investitori §3 non aveva alcun link
   al programma voce per voce: chi leggeva "tra un terzo e piu' di due terzi del
   capitale" e voleva la derivazione non aveva dove andare. Aggiunto il rimando
   inverso, in entrambe le lingue.

File toccati: `open-evidence.astro`, `it/evidenza.astro`, `investors.astro`,
`it/investitori.astro`. Nessun altro. QA: 12 verifiche, 0 fallimenti.

## 20. P7 sciolto: la scheda del fondatore

Il placeholder P7 diceva che il sito non conteneva una scheda del fondatore.
Il controllo ha mostrato qualcosa di piu' netto: **ne' `/OdE` ne' `/OdE/test`
nominavano una sola volta chi c'e' dietro**. La pagina Investitori chiedeva
capitale, dichiarava un programma sperimentale fino a due terzi di 350.000 euro,
e chiudeva con un indirizzo email senza un nome.

### La forma: una scheda che si audita da sola

La sezione e' scritta nel registro del resto del sito, non in quello di una
biografia: due blocchi affiancati per senso, **che cosa copre questo percorso**
e **che cosa non copre**, con lo stesso codice visivo che la SWOT usa gia' su
questa pagina (pieno per cio' che gioca a favore, tratteggiato per cio' che
gioca contro). Un profilo del fondatore in tono promozionale sarebbe stato
l'unico punto del sito in cui si predica una cosa e se ne fa un'altra.

Impilati e non affiancati: con cinque voci da un lato e tre dall'altro, due
colonne avrebbero livellato le righe sull'elemento piu' alto e stretto la
misura, che e' il difetto corretto in Normativa alla sezione precedente.

### La riga che tiene insieme la sezione

Ad A&#275;sop il fondatore aveva quattro sedie occupate: i chimici, la
compliance internazionale, la relazione con i fornitori e chi decide che cosa
portare avanti. OdE oggi e' la stessa struttura con una sedia sola. Detto cosi',
il punto di forza e il buco stanno nella stessa frase, che e' esattamente il
modo in cui questo sito tratta ogni altro dato.

### Le correzioni del committente, applicate

1. **La categoria fragranze non e' stata creata da lui.** Dennis Paphitis
   l'aveva creata e collaudata anni prima. Il contributo e' stato studiare il
   mercato e l'impronta olfattiva del marchio e, con Paphitis e l'amministratore
   delegato, ampliare la categoria. Il titolo della voce lo dice per esteso:
   "A category widened, not created". La stessa scheda sul sito ospitante usa
   "establishing the fragrance category", che sovrastima: segnalato al
   committente, non modificato, perche' fuori dal mandato.
2. **Laboratorio, chimici e compliance.** Il titolo esatto era General Manager
   Marketing, Creativity and Product Development, e il ruolo comprendeva la
   direzione del laboratorio interno. Questo ha ristretto due delle mancanze
   che la prima bozza elencava: resta vero che non e' un chimico e che il
   percorso dei sottoprodotti di origine animale non e' quello di un cosmetico
   finito, ma non che manchi esperienza regolatoria o di processo.

### Che cosa la sezione non dice

Su indicazione del committente restano **fuori** tre punti: quanto tempo dedica
a OdE, se abbia oggi una controparte scientifica, quanto capitale proprio
investe. Non sono placeholder: sono assenze volute, e per questo la scheda non
afferma nulla sulla composizione attuale della squadra.

La nota di chiusura dichiara la natura della fonte: dati di percorso
autodichiarati, mentre tutto il resto del sito risale a un documento o a una
misura.

File toccati: `investors.astro`, `it/investitori.astro`. La sezione entra come
numero 10 e "Che cosa serve sapere prima di parlarci" scala a 11; nessun rimando
interno cita numeri di sezione oltre il nono. QA: 12 verifiche, 0 fallimenti,
placeholder in pagina da 10 a 8.

### Il ritratto nella scheda del fondatore

Il ritratto a tratto continuo della home del sito ospitante entra nella sezione
10, riquadrato accanto al cappello. **Riferito, non duplicato**:
`/images/home/portrait.png` sta gia' in `public/`, quindi la consegna non
aggiunge un file e il disegno resta in un posto solo. La verifica 1 dello script
QA continua a passare: nessun file del sito originale, del layout ospitante o
della configurazione risulta toccato.

Riquadro e non disco. La home mette il ritratto sopra un cerchio salvia, ma
dentro questo microsito non esiste un solo cerchio: bordo sottile, raggio del
sistema e fondo pannello, come ogni altra scheda della consegna.

Misure verificate nel browser: il riquadro sta in 104 per 125 pixel accanto a un
cappello di quattro righe, e sotto i 560px il ritratto passa sopra al testo alla
larghezza che aveva, invece di allargarsi. Il PNG e' RGBA con fondo trasparente,
quindi il tratto nero appoggia direttamente sul verde del tema senza un
rettangolo bianco intorno.
