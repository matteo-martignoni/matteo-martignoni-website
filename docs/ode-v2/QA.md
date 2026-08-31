# QA e consegna, sito di test /OdE-v2

Documento di Fase 6. Accompagna la Pull Request.
Convenzione: nessun trattino lungo nella prosa italiana.

## Come rieseguire tutte le verifiche

```bash
npm install
npm run build          # deve chiudersi con "[build] Complete!"
python3 docs/ode-v2/qa.py
```

## Come ottenere una copia navigabile offline

```bash
npm run build
python3 docs/ode-v2/export-static.py     # -> sito-ode-v2/
```

Produce una cartella che si apre in Chrome con un doppio clic su `index.html`,
senza server e senza rete. Lo script fa tre cose che il build non fa, perché il
build presume un web server:

1. **Percorsi relativi.** Astro emette `/OdE-v2/...` e `/_astro/...`: sotto
   `file://` gli assoluti puntano alla radice del disco. Diventano relativi,
   calcolati sulla profondità di ogni pagina.
2. **Link espliciti a `index.html`.** Un link a una directory non funziona
   sotto `file://`.
3. **Script classici invece che ES module.** Chrome blocca i moduli su
   `file://` per via del CORS, quindi la dashboard di AMSA Live non partirebbe.
   Lo script inlina `dashboard-ui` convertendone l'export in una globale, come
   fa il bundler dell'anteprima.

Il contenuto è identico a quello servito via HTTP: cambia solo il modo di
referenziarlo. La cartella riceve anche un proprio `index.html` con l'indice
delle due lingue e un `LEGGIMI.txt`. Entrambe le uscite sono in `.gitignore`.

**Verifica dell'esportazione**, eseguita in Chromium con la rete disattivata,
cioè nelle condizioni reali di chi apre il file offline: 23 pagine caricate da
`file://`, CSS applicato su tutte, zero link assoluti rimasti, i 47 link di una
pagina campione risolti tutti a file esistenti, dashboard popolata in entrambe
le lingue, menu a panino funzionante a 390px, zero errori JavaScript.

Lo script esegue dodici controlli sul contenuto di `dist/` e sul diff git, e
esce con codice diverso da zero al primo fallimento. Non richiede dipendenze
oltre a Python 3.

## Esito dell'ultima esecuzione

**Fallimenti: 0. Avvisi: 3, tutti attesi e spiegati sotto.**

I numeri qui sotto sono quelli dopo tre passaggi successivi, tutti riassunti in
fondo a questo documento e registrati nelle sezioni 15, 16 e 17 di `PLAN.md`:
l’allineamento alla versione 4.0 del consolidamento, il completamento della
versione inglese, e il rovesciamento della lingua sorgente, che rende
**l’inglese la lingua in cui il sito è scritto** e l’italiano la sua
traduzione.

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
| 9 | Note in calce | **Superata**, 148 note, ogni riferimento ha la sua voce |
| 10 | Responsività | **Superata**, nessuna larghezza fissa, tabelle scorrevoli |
| 11 | Peso delle pagine | Max 62,5 KB, nessuna pagina oltre la soglia |
| 12 | Placeholder in pagina | 10, cioè 5 voci in due lingue, elencati sotto |

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

Formalizzato in componente: `Dimostrato`, `Non ancora testato`, `Scommessa`, più
**`Lacuna verificata`**, che è l'estensione approvata al checkpoint e senza la
quale l'affermazione più importante del sito resterebbe senza etichetta.

Nuovo: `Finding`, che marca il segno di ogni risultato rispetto a OdE come
`Favorevole`, `Sfavorevole` o `Neutro`. Esiste perché i risultati sfavorevoli
abbiano lo stesso peso tipografico di quelli favorevoli.

## I risultati sfavorevoli pubblicati, e dove

| Risultato | Pagina | Posizione |
|---|---|---|
| Zero studi clinici sul sego topico | Home, Audit | Titolo della home |
| L'idrolisi cutanea produce una miscela, e l'effetto netto non è mai stato misurato: la direzione è ignota, non sfavorevole né favorevole | Tesi, Home | Sezione 3 della Tesi, limite 2 della Home |
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
| Nessuna proprietà intellettuale difendibile sul frazionamento: è arte nota pubblica e scaduta | Investitori, Posizione, AMSA | Sezione 5 di Investitori, dedicata |
| Il compromesso del frazionamento non ha un ottimo unico | Tesi | Sezione 2, in riquadro |
| Se il grasso solido misurato a 32 °C è sotto il 15%, cade l'argomento della classe fisica | Tesi, Evidenza aperta | Sezione 4 della Tesi, condizioni di fallimento |
| La stima del grasso solido sta sull'estremità alta della forbice attesa | Tesi | Nella nota della stima stessa |
| Un concorrente che pubblichi per primo azzera la narrativa del primo arrivato | Evidenza aperta | Condizioni di fallimento |
| Il tasso di raccomandazione fra i dermatologi è del 7% | Audit | Sezione 3, tabella dei contenuti social |
| Cinque bacini di letteratura non sono stati interrogati, ed è dichiarato quali | Audit | Sezione 1, in riquadro |
| Due errori di lettura commessi da noi, ricostruiti fino alla fonte | Audit, Tesi | Sezione 1 dell'Audit, sezione 1 della Tesi |
| Non sappiamo se l'intelligenza artificiale in AMSA sia sostanziale o marginale, e da quella risposta dipendono due strumenti di finanza agevolata su tre e tutti gli incentivi fiscali | AMSA, Investitori | Fine della sezione 5 di AMSA, sezione 6 di Investitori |
| L'incentivo perverso a rispondere di sì a quella domanda prima di averla misurata | AMSA, Investitori | Negli stessi due riquadri |
| A oggi nessuna agevolazione fiscale per chi investe è disponibile | Investitori | Apertura della sezione 7 |

## Placeholder che richiedono input del committente

Segnalati in pagina con un chip tratteggiato "Da confermare".

| # | Pagina | Che cosa serve | Blocca la pubblicazione? |
|---|---|---|---|
| P2 | Investitori e AMSA, IT ed EN | Se l'uso dell'intelligenza artificiale in AMSA sia sostanziale o marginale, e quale sia il percorso di iscrizione alla sezione speciale una volta che la prima domanda abbia risposta | **Sì**, per la sezione 7 |
| P4 | Evidenza aperta, IT ed EN | Indirizzo di contatto. Le tre porte usano tutte quello attuale. Servono recapiti distinti per pubblico? | **Sì** |
| P6 | Normativa, IT ed EN | Data di riferimento della ricognizione normativa, oggi 27 agosto 2026. Va aggiornata a ogni revisione | No |
| P7 | Investitori, IT ed EN | Scheda del fondatore. Il sito non ne ha una, e la credibilità della persona è fra le domande dell'investitore | No |
| P9 | Normativa, IT ed EN | Decisione aperta sul grado alimentare del materiale. Se dichiarato, cambia la tabella requisito contro differenziale | No |

**P1 è sciolto.** Il capitale di riferimento è **350.000 euro**, confermato dal
committente. Le pagine Investitori in entrambe le lingue non portano più il chip
e dichiarano che il sito attualmente online, con i suoi 300.000, riporta la
cifra superata.

**P2 non è sciolto, ma ha cambiato natura, e la differenza conta.** Non è più
una verifica amministrativa in sospeso: lo status di startup innovativa è un
**obiettivo dichiarato**, e l'asset innovativo candidato a sostenerlo è
l'intelligenza artificiale dentro AMSA. Se quell'uso sia sostanziale o marginale
è una domanda **tecnica**, ancora aperta e in corso di valutazione. Il sito la
pubblica come tale, in fondo alla sezione 5 di AMSA e nella sezione 6 di
Investitori, insieme all'incentivo perverso che la circonda.

Decisi al checkpoint e non più aperti: la rotta e la soluzione di isolamento,
l'architettura a dieci pagine, la soglia di pubblicazione dell'Audit, la cifra
di capitale a 350.000 euro, e la scelta di non nominare i concorrenti.

## Correzioni applicate nella rilettura ostile

Rilettura finale nei panni di un dermatologo scettico e di un formulatore
esperto. Quattro punti corretti:

1. **I due valori 96% e 7%** dell'analisi dei contenuti social erano presentati
   come quote di composizione dei promotori. Sommano a 103, quindi quella
   lettura è aritmeticamente impossibile. Riformulati come tassi di
   raccomandazione per categoria, con nota che dichiara la discordanza fra le
   due sintesi interne e rimanda alla riverifica sul testo primario. **La
   versione 4.0 del consolidamento ha poi confermato che la correzione era
   giusta**, e ha fatto cadere sia il 96% sia il 61%: i valori pubblicati oggi
   sono 82%, 7% fra i dermatologi, 92% e 74% per piattaforma.
2. **"Eguaglia un corticosteroide"** era più forte del dato. Lo studio riporta
   assenza di differenza statisticamente significativa a 28 giorni, che non è
   una dimostrazione di equivalenza. Riformulato.
3. **I moltiplicatori del rendering** erano arrotondati a "quattro volte" e
   "due volte". Sostituiti con i valori derivati, 3,8 e 2,3.
4. **Il calendario del regolamento sulla deforestazione** ometteva che la data
   del 30 dicembre 2026 copre anche i micro e piccoli operatori già coperti dal
   regolamento sul legname. Aggiunto.

## Allineamento alla versione 4.0 del consolidamento

Il registro completo è nella **sezione 15 di `PLAN.md`**. Qui interessa che cosa
ne è seguito per la verifica.

**Che cosa è cambiato nella sostanza.** Tre revisioni. Il fondamento
meccanicistico riguarda una molecola precisa, l'acido oleico, e non la classe
degli acidi grassi liberi. L'idrolisi cutanea smette di essere un rischio
direzionale e diventa una domanda quantitativa aperta, con l'effetto netto mai
misurato. L'anello fra provenienza e composizione acquista un primo candidato
misurabile, che però **non viene usato come vantaggio** perché la ricerca
prescrive di riverificarlo prima di portarlo in comunicazione.

**Che cosa si è stretto.** Il processo non è un fossato: frazionamento e
raffinazione del sego sono arte nota con famiglie brevettuali in gran parte
scadute. È pubblicato in una sezione dedicata di Investitori, in un riquadro di
Posizione e in uno di AMSA, non in nota.

**Effetto sulle verifiche automatiche.** Nessuna verifica ha cambiato esito.
Le note in calce passano da 108 a 119, la pagina più pesante da 55 a 62,5 KB, i
placeholder restano nove, i tre avvisi della verifica 7 restano gli stessi tre e
sempre dentro la tabella della tassonomia. Le pagine restano ventidue e i file
del sito originale toccati restano zero.

**Effetto sull'onestà pubblicata.** La tabella dei risultati sfavorevoli qui
sopra cresce di otto righe, e una riga preesistente è stata riscritta perché la
formulazione precedente, "il dato favorevole è eroso dall'idrolisi", oggi
sarebbe più pessimistica del dato. La direzione dell'effetto è ignota, ed è così
che viene dichiarata.

**Una trappola registrata perché non si ripeta.** Lo studio che qualifica il
rischio dell'idrolisi è di grado B1, su cute umana ex vivo e danneggiata, con
acidi grassi isolati e non con il sego. Un risultato che va nella nostra
direzione è esattamente il caso in cui il controllo va stretto, non allentato:
il riquadro che lo introduce dichiara per esteso che cosa il dato **non**
autorizza a dire, e il claim di barriera resta fra quelli vietati.

## La versione inglese, completata

Tutte e undici le pagine esistono ora in inglese come traduzioni integrali. Le
sei che mancavano (AMSA, Filiera, Posizione, Normativa, Evidenza aperta,
Glossario) sono state tradotte a partire dai sorgenti italiani allineati alla
v4.0, quindi non c'è disallineamento fra le due lingue.

**Conseguenze verificabili.** Le note in calce salgono da 119 a 148, e le due
lingue hanno ora lo stesso numero di note pagina per pagina: 6 su AMSA, 14
sull'Audit, 5 su Evidenza aperta, 7 su Filiera, 13 su Investitori, 4 su
Normativa, 7 su Posizione, 17 sulla Tesi, 1 sulla home. È il controllo più
rapido per accorgersi se una delle due versioni perde un riferimento.

**Il componente `Pending` è stato rimosso**, insieme alle due stringhe `todo` e
`todoEn` del dizionario. Esisteva per dichiarare in pagina che una rotta inglese
non era ancora tradotta, e non ha più consumatori: lasciarlo sarebbe stato
codice morto in un progetto che pubblica una tassonomia delle affermazioni non
sostenute.

**Gli ancoraggi del glossario sono identici nelle due lingue** (`#acidita`,
`#ffa`, `#oleico` e così via, anche dove il termine inglese è diverso). Serve a
tenere allineate le due versioni e a non rompere link futuri: un ancoraggio è un
identificatore, non testo.

**Che cosa NON è stato fatto.** La traduzione è fedele e completa, ma non è
passata sotto gli occhi di un madrelingua tecnico. Su un testo che vive di
distinzioni epistemiche (dimostrato contro traslato, lacuna verificata contro
assenza di dati) vale la pena farlo prima della pubblicazione.

## L'inglese come lingua sorgente

Il sito è ora concepito e scritto in inglese, e l'italiano è la traduzione. Il
registro delle modifiche è nella sezione 17 di `PLAN.md`. Qui interessa che cosa
è verificabile.

### Le rotte inglesi hanno slug inglesi

| Chiave | Italiano | Inglese |
|---|---|---|
| `tesi` | `/OdE-v2/tesi` | `/OdE-v2/en/thesis` |
| `filiera` | `/OdE-v2/filiera` | `/OdE-v2/en/supply-chain` |
| `posizione` | `/OdE-v2/posizione` | `/OdE-v2/en/position` |
| `normativa` | `/OdE-v2/normativa` | `/OdE-v2/en/regulation` |
| `evidenza` | `/OdE-v2/evidenza` | `/OdE-v2/en/open-evidence` |
| `investitori` | `/OdE-v2/investitori` | `/OdE-v2/en/investors` |
| `glossario` | `/OdE-v2/glossario` | `/OdE-v2/en/glossary` |

Le **chiavi non cambiano**: sono identificatori, e il selettore di lingua
continua a trovare la stessa pagina nell'altra lingua perché lavora sulle chiavi
e non sugli slug. Un lettore inglese che vedeva `/en/filiera` capiva subito di
essere su un sito tradotto, ed è esattamente ciò che questa revisione elimina.

### Il difetto più rivelatore, e la sua correzione

`DataTag` stampava **"Fonte" e "Stima" anche sulle pagine inglesi**. Il
componente non aveva un parametro di lingua, e le circa 150 chiamate non lo
passavano. Ora il badge segue la lingua della rotta, letta da
`Astro.url.pathname`, e rende `Source` ed `Estimate` in inglese. Verifica:

```bash
grep -o 'ode-tag--fonte[^>]*>[A-Za-z]*' dist/OdE-v2/en/thesis/index.html | head -1
# deve finire con ">Source"
```

### Una sezione che mancava del tutto

La versione inglese di Investitori aveva **nove sezioni contro le dieci
italiane**: mancava la traiettoria in quattro fasi. È stata scritta, con i suoi
stili, e la pagina inglese ha ora le stesse dieci sezioni.

### Allineamenti di etichetta

Due nomi cambiano in entrambe le lingue, perché l'inglese naturale ha imposto la
formulazione e l'italiano la segue:

| Prima | Adesso, in inglese | Adesso, in italiano |
|---|---|---|
| Evidenza aperta / Open evidence | **Open questions** | **Domande aperte** |
| In costruzione / Under construction | **Not yet tested** | **Non ancora testato** |

Il secondo è il più importante: la definizione condivisa dei due sistemi di
etichette dice "inferenza plausibile non ancora testata", e ora l'etichetta dice
la stessa cosa nelle due lingue invece di dirne due diverse.

### Calchi rimossi

Il più diffuso era **"basin" per "bacino"**: in inglese una ricerca
bibliografica si fa su *databases*, non su bacini. Ricorreva in quattro pagine.
Tolti anche `that is` come calco di "cioè", le costruzioni impersonali del tipo
"it must be said", `perimeter` per "perimetro" di mercato, `translated evidence`
per "evidenza traslata" (in inglese *borrowed evidence*), `matrix error` per
"errore di matrice" (*wrong-material error*), e le unità scritte all'italiana
(`2,3 mln t` reso `2.3 million t`).

### Che cosa NON è stato fatto, ed è deliberato

**L'italiano non è stato ritradotto dall'inglese riga per riga.** Il significato
è invariante: la revisione ha cambiato il modo di dire le cose in inglese, non
le cose dette. L'italiano resta quindi un parallelo fedele, e ritradurlo
integralmente avrebbe peggiorato una prosa italiana già buona senza cambiare un
solo contenuto. Dove la revisione inglese ha davvero spostato qualcosa (i due
nomi della tabella qui sopra), l'italiano è stato allineato.

**La lingua di default del sito non è stata cambiata.** `/OdE-v2` serve ancora
l'italiano e `/OdE-v2/en` l'inglese, come il sito originale. Se l'inglese è la
lingua sorgente, si può sostenere che debba essere anche quella di default, con
l'italiano sotto `/it`: è però una decisione sul pubblico primario del progetto,
non sulla lingua, e va presa dal committente. È l'unica cosa di questa revisione
che ho lasciato aperta.

**Il divieto di trattino lungo è stato esteso all'inglese**, come scelta di
stile della casa. In inglese il trattino lungo sarebbe idiomatico, ma non costa
nulla farne a meno e la regola resta una sola per tutto il sito.

## Che cosa resta da fare

- **Rispondere alla domanda di P2**, che è tecnica e non amministrativa: che
  cosa fa l'intelligenza artificiale in AMSA che la chemiometria matura non
  farebbe da sola. Blocca la sezione 7 di Investitori.
- **Sciogliere P4**, che blocca la pubblicazione.
- **Rileggere le tre righe della tassonomia** segnalate dalla verifica 7 a ogni
  revisione dei contenuti.
- **Far leggere l'inglese a un madrelingua tecnico.** La revisione ha portato il
  testo dalla traduzione fedele alla scrittura inglese, ma un lettore nativo del
  settore resta il controllo finale.
- **Decidere se l'inglese debba diventare anche la lingua di default**, cioè se
  `/OdE-v2` debba servire l'inglese e l'italiano spostarsi sotto `/it`.
