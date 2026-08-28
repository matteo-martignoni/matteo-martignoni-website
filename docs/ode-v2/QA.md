# QA e consegna, sito di test /OdE-v2

Documento di Fase 6. Accompagna la Pull Request.
Convenzione: nessun trattino lungo nella prosa italiana.

## Come rieseguire tutte le verifiche

```bash
npm install
npm run build          # deve chiudersi con "[build] Complete!"
python3 docs/ode-v2/qa.py
```

Lo script esegue dodici controlli sul contenuto di `dist/` e sul diff git, e
esce con codice diverso da zero al primo fallimento. Non richiede dipendenze
oltre a Python 3.

## Esito dell'ultima esecuzione

**Fallimenti: 0. Avvisi: 3, tutti attesi e spiegati sotto.**

| # | Verifica | Esito |
|---|---|---|
| 0 | Pagine generate | 22 (11 IT, 11 EN) |
| 1 | Nessun file del sito originale toccato | **Superata** |
| 2 | `noindex, nofollow` su ogni pagina | **Superata**, 22 su 22 |
| 3 | Nessun link in ingresso dal sito ospitante o da `/OdE` | **Superata** |
| 4 | Nessun link in uscita verso `/OdE` | **Superata** |
| 5 | Esclusione dal sitemap | **Superata**, zero occorrenze |
| 6 | Nessun trattino lungo nel testo italiano | **Superata**, 11 su 11 |
| 7 | Claim vietate | **Superata con 3 avvisi**, vedi sotto |
| 8 | Link interni | **Superata**, nessun link rotto |
| 9 | Note in calce | **Superata**, 108 note, ogni riferimento ha la sua voce |
| 10 | Responsività | **Superata**, nessuna larghezza fissa, tabelle scorrevoli |
| 11 | Peso delle pagine | Max 55 KB, nessuna pagina oltre la soglia |
| 12 | Placeholder in pagina | 9, elencati sotto |

### I tre avvisi della verifica 7

Sono le uniche tre occorrenze di una claim vietata nell'intero sito, e stanno
tutte e tre **dentro la tabella della tassonomia** delle pagine Audit, in
italiano e in inglese, cioè nell'unico contesto in cui compaiono per essere
negate. La riga che le contiene porta la colonna "Difendibile: No" e il
criterio regolatorio messo in tensione.

Lo script le segnala come avviso e non come fallimento apposta: sono da
rileggere a ogni revisione, perché il confine fra citare una claim per
smontarla e usarla è sottile.

## Elenco dei file

### File nuovi

```
PLAN.md
docs/ode-v2/QA.md
docs/ode-v2/qa.py
src/i18n/ode-v2.ts
src/layouts/OdeV2Layout.astro
src/lib/ode-v2/sources.ts
src/styles/ode-v2-theme.css
src/components/ode-v2/Callout.astro
src/components/ode-v2/ClaimTable.astro
src/components/ode-v2/DataTag.astro
src/components/ode-v2/Doors.astro
src/components/ode-v2/Finding.astro
src/components/ode-v2/KeyValue.astro
src/components/ode-v2/Pending.astro
src/components/ode-v2/ReadNext.astro
src/components/ode-v2/Sources.astro
src/components/ode-v2/StatCard.astro
src/components/ode-v2/Status.astro
src/pages/OdE-v2/index.astro
src/pages/OdE-v2/audit.astro
src/pages/OdE-v2/tesi.astro
src/pages/OdE-v2/amsa.astro
src/pages/OdE-v2/filiera.astro
src/pages/OdE-v2/posizione.astro
src/pages/OdE-v2/normativa.astro
src/pages/OdE-v2/evidenza.astro
src/pages/OdE-v2/investitori.astro
src/pages/OdE-v2/glossario.astro
src/pages/OdE-v2/amsa-live.astro
src/pages/OdE-v2/en/index.astro
src/pages/OdE-v2/en/audit.astro
src/pages/OdE-v2/en/tesi.astro
src/pages/OdE-v2/en/investitori.astro
src/pages/OdE-v2/en/amsa-live.astro
src/pages/OdE-v2/en/amsa.astro
src/pages/OdE-v2/en/filiera.astro
src/pages/OdE-v2/en/posizione.astro
src/pages/OdE-v2/en/normativa.astro
src/pages/OdE-v2/en/evidenza.astro
src/pages/OdE-v2/en/glossario.astro
```

### File esistenti modificati

**Uno solo: `README.md`.** È documentazione, non codice del sito, e la modifica
è puramente additiva: una nuova sezione `## OdE test site (/OdE-v2)` inserita
prima della sottosezione `### Data honesty` già presente. Nessuna riga
preesistente è stata rimossa o riscritta.

### File del sito originale toccati

**Nessuno.** Non è stato modificato alcun file sotto `src/pages/OdE/`,
`src/components/ode/`, `src/lib/ode/`, né `src/layouts/OdeLayout.astro`,
`src/styles/ode-theme.css`, `src/i18n/ode.ts`. **Nemmeno `astro.config.mjs`**,
perché il filtro sitemap esistente copre già la rotta `/OdE-v2`.

Comando di verifica:

```bash
git diff --name-only main | grep -E 'src/(pages/OdE/|components/ode/|lib/ode/|layouts/OdeLayout|styles/ode-theme|i18n/ode\.ts)|astro\.config' 
# non deve restituire nulla
```

## Componenti del sito originale riusati in sola lettura

Importati senza alcuna modifica: `Section`, `BarChart`, `ControlLoop`,
`PassportSections`, `LifecycleFlow`, `CowGlyph`, `DropMark`, e il motore di
simulazione in `src/lib/ode/`. Anche `src/styles/ode-theme.css` è importato
invariato: i token di `OdE_Brand_System` non sono ridefiniti da nessuna parte.

`DataTag`, `OdeSources` e `StatCard` sono stati **duplicati** e non riusati,
perché il sito di test ha bisogno di un resolver di fonti esteso con i DOI
della nuova bibliografia. Estendere `src/lib/ode/sources.ts` in loco avrebbe
cambiato il rendering delle note in calce del sito originale, dato che le
regole di risoluzione lavorano per sottostringa.

## Sistema di etichette epistemiche

Ereditato: `Fonte`, `Stima`, `Benchmark`, con badge numerato cliccabile e nota
in calce a fondo pagina. Meccanismo identico all'originale.

Formalizzato in componente: `Dimostrato`, `In costruzione`, `Scommessa`, più
**`Lacuna verificata`**, che è l'estensione approvata al checkpoint e senza la
quale l'affermazione più importante del sito resterebbe senza etichetta.

Nuovo: `Finding`, che marca il segno di ogni risultato rispetto a OdE come
`Favorevole`, `Sfavorevole` o `Neutro`. Esiste perché i risultati sfavorevoli
abbiano lo stesso peso tipografico di quelli favorevoli.

## I risultati sfavorevoli pubblicati, e dove

| Risultato | Pagina | Posizione |
|---|---|---|
| Zero studi clinici sul sego topico | Home, Audit | Titolo della home |
| Il dato meccanicistico favorevole è eroso dall'idrolisi lipasica | Tesi | Sezione 3, subito dopo il fondamento |
| Petrolato, olio minerale, squalano e dimeticone sono immuni a quel meccanismo | Tesi | Stessa sezione |
| Non si batte il petrolato sull'occlusione né i ceramidi sulla riparazione | Tesi | Sezione 5, elenco chiuso |
| L'appiccicosità è un difetto sull'endpoint primario, misurato su sego bovino | Tesi | Sezione 5 |
| Il sego è povero di acido linoleico | Tesi | Riga tratteggiata nella tabella del profilo |
| La conclusione della rassegna che pone altri ingredienti sopra il sego | Audit | Sezione 2, in riquadro |
| Su ferite di suinetto il lardo puro non dà beneficio | Audit | Sezione 1, in riquadro |
| La tenaglia volume contro differenziale | Posizione | Prima sezione |
| Lo spazio della tracciabilità non è vergine | Posizione | Sezione 3 |
| La base probatoria del verdetto è dichiaratamente debole | Posizione | Nella stessa sezione del verdetto |
| Il mercato accessibile non è dimensionabile | Posizione | Sezione 5 |
| Ciclo di attenzione, trend vegan, dipendenza dal flusso a monte | Posizione | Sezione 7, elenco chiuso |
| L'anello causale filiera verso esito cutaneo è indimostrato | Filiera, Audit | Sezione 4 della Filiera |
| Il programma completo costa il 33-69% del capitale | Investitori | Sezione 3 |
| Come produttore di volume il progetto non regge | Investitori | Apertura della pagina |
| La finanza agevolata è debito da restituire anche a gate negativo | Investitori | Sezione 5 |
| Le tesi favorevoli poggiano su una traccia, le sfavorevoli su tre | Investitori | Sezione 4, in riquadro |
| L'Oxidative Risk Score non è un predittore di esito cutaneo | AMSA | Sezione 3, in riquadro |
| Il divario di accettazione consumer | Posizione | Sezione 6 |

## Placeholder che richiedono input del committente

Segnalati in pagina con un chip tratteggiato "Da confermare".

| # | Pagina | Che cosa serve | Blocca la pubblicazione? |
|---|---|---|---|
| P1 | Investitori, IT ed EN | Capitale di riferimento. Il sito usa 350.000 euro, coerente con tutti i calcoli della ricerca. Il sito attuale ne dichiara 300.000 | **Sì** |
| P2 | Investitori, IT ed EN | Status di startup innovativa. Condiziona due strumenti di finanza agevolata su tre e tutti gli incentivi fiscali della sezione 6 | **Sì** |
| P4 | Evidenza aperta | Indirizzo di contatto. Le tre porte usano tutte quello attuale. Servono recapiti distinti per pubblico? | **Sì** |
| P6 | Normativa | Data di riferimento della ricognizione normativa, oggi 27 agosto 2026. Va aggiornata a ogni revisione | No |
| P7 | Investitori, IT ed EN | Scheda del fondatore. Il sito non ne ha una, e la credibilità della persona è fra le domande dell'investitore | No |
| P9 | Normativa | Decisione aperta sul grado alimentare del materiale. Se dichiarato, cambia la tabella requisito contro differenziale | No |

Decisi al checkpoint e non più aperti: la rotta e la soluzione di isolamento,
l'architettura a dieci pagine, la soglia di pubblicazione dell'Audit, la cifra
di capitale a 350.000 euro con nota, e la scelta di non nominare i concorrenti.

## Correzioni applicate nella rilettura ostile

Rilettura finale nei panni di un dermatologo scettico e di un formulatore
esperto. Quattro punti corretti:

1. **I due valori 96% e 7%** dell'analisi dei contenuti social erano presentati
   come quote di composizione dei promotori. Sommano a 103, quindi quella
   lettura è aritmeticamente impossibile. Riformulati come tassi di
   raccomandazione per categoria, con nota che dichiara la discordanza fra le
   due sintesi interne e rimanda alla riverifica sul testo primario.
2. **"Eguaglia un corticosteroide"** era più forte del dato. Lo studio riporta
   assenza di differenza statisticamente significativa a 28 giorni, che non è
   una dimostrazione di equivalenza. Riformulato.
3. **I moltiplicatori del rendering** erano arrotondati a "quattro volte" e
   "due volte". Sostituiti con i valori derivati, 3,8 e 2,3.
4. **Il calendario del regolamento sulla deforestazione** ometteva che la data
   del 30 dicembre 2026 copre anche i micro e piccoli operatori già coperti dal
   regolamento sul legname. Aggiunto.

## Che cosa resta da fare

- **Traduzione inglese** di AMSA, Filiera, Posizione, Normativa, Evidenza
  aperta e Glossario. Le rotte esistono e portano un avviso esplicito con
  rimando alla versione italiana, quindi la navigazione non si rompe mai.
  Tradotte integralmente: Home, Audit, Tesi, Investitori e AMSA Live.
- **Sciogliere P1, P2 e P4**, che bloccano la pubblicazione.
- **Rileggere le tre righe della tassonomia** segnalate dalla verifica 7 a ogni
  revisione dei contenuti.
