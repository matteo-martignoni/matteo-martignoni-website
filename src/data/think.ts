// ──────────────────────────────────────────────────────────────
// Think / Pensiero — areas of practice.
//
// Seven practices, each with a description and a row of media slots.
// Copy is the source of truth (see think-build-brief.md). The slot
// count is not fixed: international development has two, the rest three.
// Each slot maps to an image under /media/think/{slug}-{n}.jpg.
// ──────────────────────────────────────────────────────────────
export interface ThinkSlot {
  subject: string;   // what the visual shows (brand / project), never a claim
  caption: string;   // short caption shown in the overlay
  src: string;       // image path
}

export interface ThinkPractice {
  number: string;
  slug: string;
  title: string;
  description: string;
  slots: ThinkSlot[];
}

export type ThinkLang = "en" | "it";

const img = (slug: string, n: number) => `/media/think/${slug}-${n}.jpg`;

export const thinkHero: Record<ThinkLang, { tagline: string; title: string; lead: string; body: string }> = {
  en: {
    tagline: "Areas of practice",
    title: "Few things I know how to do.",
    lead: "Brand work, end to end.",
    body:
      "At the top: opening markets, repositioning brands, reading a company's internal politics, working through a crisis. On the ground: store openings, fashion shows, product launches, advertising campaigns. And the founder's role, which starts with no brief, only a blank page.",
  },
  it: {
    tagline: "Aree di competenza",
    title: "Poche cose che so fare.",
    lead: "Lavoro sui marchi, dall'inizio alla fine.",
    body:
      "In alto: aprire mercati, riposizionare marchi, leggere le dinamiche interne di un'azienda, lavorare durante una crisi. Sul campo: aperture di negozi, sfilate, lanci di prodotto, campagne pubblicitarie. E il ruolo del fondatore, che parte senza brief, solo una pagina bianca.",
  },
};

export const thinkPractices: Record<ThinkLang, ThinkPractice[]> = {
  en: [
    {
      number: "01",
      slug: "marketing-end-to-end",
      title: "Marketing, end to end",
      description:
        "The noble art of marketing, from the conception of a product or service to its market release. A delicate exercise that teaches you to navigate the steps in between, and the people whose sign-off you need to bring an idea to light. Part politics, part damage control.",
      slots: [
        { subject: "Aēsop Mouthwash", caption: "A refreshing product and a bet for the whole company. Many codes were rewritten to make room for an unconventional take on mouth wellbeing. The packaging features a masculine bottle, rather different from the brand’s unisex approach. The price is well above the conventional range for this category. The whole marketing push was supported by a sexy image hinting at the pleasure of kissing. A project that brought great fun to all those involved and possibly to those who bought it.", src: img("marketing-end-to-end", 1) },
        { subject: "NOVA", caption: "An ambitious project, born of the idea that art and AI will eventually meet. To support this marriage, NOVA is also building a technological platform to enhance the visitors’ experience. A complex, innovative and challenging project, from inception to release, designed to push the boundaries of interactivity.", src: img("marketing-end-to-end", 2) },
        { subject: "Tacit", caption: "The brand’s olfactory signature relied for years on two exceptionally good but unmarketable essential-oil-based perfumes. Until a new strategy was designed to build a category that has risen to the top of the profitability chart over the years. Tacit, built with IFF in New York, was the first.", src: img("marketing-end-to-end", 3) },
      ],
    },
    {
      number: "02",
      slug: "international-development",
      title: "International development",
      description:
        "No matter what business you are in, there comes a moment when you must expand and open new markets. A good practice is to ask yourself why before all the planning and sorting that come with it. If it still makes sense, then the premises are solid, and all that comes next has meaning.",
      slots: [
        { subject: "Uniqlo", caption: "Supporting the French market entry, developing a medium-term strategy for market penetration, brand launch and awareness, store opening.", src: img("international-development", 1) },
        { subject: "Aēsop", caption: "Avoiding brand dilution in a fast-paced expansion. Brand guidelines, retail opening strategy, full package for new market opening.", src: img("international-development", 2) },
      ],
    },
    {
      number: "03",
      slug: "retail-strategy",
      title: "Retail strategy",
      description:
        "Designing distribution, store networks, and the texture of physical retail experience. It is an exercise that flourishes with a dynamic, well-led and agile company that understands the implications of inviting its customers to its home.",
      slots: [
        { subject: "Aēsop Italy", caption: "A good example of a natural, effortless distribution strategy emerged from a brand DNA that requires a “house” to dialogue with customers. The less the mediation, the clearer the intent. The next step was to turn the stores into a replacement for marketing spend, delegating architecture, design, visual merchandising, and consultants’ training to a true dive into the wonders of the brand.", src: img("retail-strategy", 1) },
        { subject: "Uniqlo", caption: "When Uniqlo enters a new country, the discussion before profitability centres on culture. Understanding how the local customer base will adopt the newcomers is a delicate balance of research, diplomacy, persuasion, and ambassadorship. Once this is achieved and secured, the retail expansion is ensured, and the success of the formula is then extended to other countries.", src: img("retail-strategy", 2) },
        { subject: "Surface to Air", caption: "An exceptionally talented group of creatives opened two stores in Paris and one in New York, aiming to cement the brand’s hype on the world’s coolest streets. All the premises were right, yet the complexity of the fashion business and the lack of funds told a different story. Surface to Air is no longer, but it still echoes today for its vision and creative boldness.", src: img("retail-strategy", 3) },
      ],
    },
    {
      number: "04",
      slug: "brand-repositioning",
      title: "Brand repositioning",
      description:
        "Helping an established brand change how the market reads it. Perceived as the slowest of these practices, wrongly. With the right formulation, it can lift brand fatigue quickly. Yet it must be sustained with a continuous effort and a strong conviction that a brand deserves better.",
      slots: [
        { subject: "Diesel Germany", caption: "In Germany, the mission was to change the brand’s perception and align it with the rest of the world. A smart and powerful plan was implemented, boldly anticipating a 2-year decrease in turnover resulting from wholesale account cleanup and contract cuts. With discipline, this medicine did wonders, and the 3rd year saw a brand-new market emerge and flourish, changing all the KPIs and bringing them closer to the group’s.", src: img("brand-repositioning", 1) },
        { subject: "System Professional", caption: "Part of the Wella Group, it felt it was time for a full restage of the brand. In a highly competitive segment, professional haircare, where global companies can leverage their control over hair salons, changing skin is eventually the right solution to restart the narrative of the brand. With “longevity” in mind.", src: img("brand-repositioning", 2) },
        { subject: "Public Goods", caption: "As time passes, the need for a new self is not bizarre but rather an exercise in adaptation. When sales strategies evolve, market uncertainties expand, and new targets emerge, a brand must review how it communicates its DNA and to whom. As Public Goods did, challenging its core identity and product range.", src: img("brand-repositioning", 3) },
      ],
    },
    {
      number: "05",
      slug: "new-categories",
      title: "New categories",
      description:
        "Natural evolution of the main line, or a mere conversion tool, new categories extend a brand's reach. They carry a DNA that has to be carefully maintained, protected and realigned to bring the brand and the new market together. Eventually, they'll give the Compliance team headaches.",
      slots: [
        { subject: "Aēsop Perfumes", caption: "Building a case for why perfume could have become a key category for a skin care company's growth. Initiated the process with IFF. Now the most profitable category.", src: img("new-categories", 1) },
        { subject: "NOVA", caption: "All-new, from idea to execution: the blueprint for innovation in process, tools and product, distilling Art, AI and technology into something that can be sold and kept.", src: img("new-categories", 2) },
        { subject: "Napapijri", caption: "Building the A to Z of Ze-Knit, a bold statement of the brand that reaches for new, avant-garde targets.", src: img("new-categories", 3) },
      ],
    },
    {
      number: "06",
      slug: "licensing",
      title: "Licensing",
      description:
        "Above all, an exercise in trust. A company knows what it can and can't do; for the latter, there is a partner waiting to create a branch on their tree bearing your company's name. Your brand, their processes, their manufacturing, their distribution.",
      slots: [
        { subject: "Diesel", caption: "A long and complex alignment with L'Oréal, which masters production, distribution and marketing of this category. Eventually, it became a success story, extended to other brands in the OTB group.", src: img("licensing", 1) },
        { subject: "Diesel", caption: "Above all, a fun project that allowed the brand to inject its DNA in an unconventional way, well expressed at the launch event in Paris, held at the Hotel Amour.", src: img("licensing", 2) },
        { subject: "Diesel", caption: "The collaboration with Fossil became one of the most solid and stable in the Diesel ecosystem. It flourished through creative language and brought to light exceptional pieces, season after season.", src: img("licensing", 3) },
      ],
    },
    {
      number: "07",
      slug: "events",
      title: "Events",
      description:
        "A powerful tool, short, clinical, quantifiable. It is to a marketing strategy what a French kiss is to a long-term relationship. It can make or break a reputation. Done right, they create intense brand equity and high-value lead generation. Done wrong, they bring down the brand appeal.",
      slots: [
        { subject: "Sonus faber", caption: "An exciting challenge involved uniting a premium artisanal brand with a luxury car company in a public setting, which ultimately became “Casa Sonus faber,” a branded space within the famous Imola racetrack. Esteemed managers, pilots, and audiophiles savored the experience provided by Sonus faber’s cutting-edge speakers.", src: img("events", 1) },
        { subject: "Corneliani", caption: "Seasonal shows and collection presentations are essential for every fashion brand, effectively merging marketing and sales into a single event. Despite updating collections seasonally, the brand maintains a consistent tone of voice that must be preserved and respected each time it engages with the public.", src: img("events", 2) },
        { subject: "Saint Louis", caption: "A heritage brand warrants a heritage space for its public initiatives. Saint Louis and its creations are showcased inside a small church in the Brera district, where history and craftsmanship elevate the efforts of every employee of this French company.", src: img("events", 3) },
      ],
    },
  ],
  it: [
    {
      number: "01",
      slug: "marketing-end-to-end",
      title: "Marketing, dall'inizio alla fine",
      description:
        "La nobile arte del marketing, dalla concezione di un prodotto o servizio fino alla sua uscita sul mercato. Un esercizio delicato che insegna a muoversi tra i passaggi intermedi, e tra le persone la cui approvazione serve per portare un'idea alla luce. In parte politica, in parte limitazione dei danni.",
      slots: [
        { subject: "Aēsop Mouthwash", caption: "Un prodotto rinfrescante e una scommessa per l'intera azienda. Molti codici sono stati riscritti per fare spazio a un approccio non convenzionale al benessere della bocca. Il packaging presenta un flacone maschile, piuttosto diverso dall'approccio unisex del marchio. Il prezzo è ben al di sopra della fascia convenzionale per questa categoria. Tutta la spinta di marketing è stata sostenuta da un'immagine sensuale che alludeva al piacere del bacio. Un progetto che ha portato grande divertimento a tutti i coinvolti e, forse, anche a chi lo ha acquistato.", src: img("marketing-end-to-end", 1) },
        { subject: "NOVA", caption: "Un progetto ambizioso, nato dall'idea che arte e AI prima o poi si incontreranno. Per sostenere questo matrimonio, NOVA sta costruendo anche una piattaforma tecnologica per arricchire l'esperienza dei visitatori. Un progetto complesso, innovativo e impegnativo, dall'ideazione al rilascio, pensato per spingere i confini dell'interattività.", src: img("marketing-end-to-end", 2) },
        { subject: "Tacit", caption: "La firma olfattiva del marchio si è retta per anni su due profumi a base di oli essenziali, eccezionalmente buoni ma non commercializzabili. Finché è stata disegnata una nuova strategia per costruire una categoria che negli anni è salita in cima alla classifica della redditività. Tacit, realizzato con IFF a New York, è stato il primo.", src: img("marketing-end-to-end", 3) },
      ],
    },
    {
      number: "02",
      slug: "international-development",
      title: "Sviluppo internazionale",
      description:
        "Qualunque sia l'attività, arriva il momento in cui occorre espandersi e aprire nuovi mercati. È buona pratica chiedersi il perché prima di tutta la pianificazione e l'organizzazione che ne seguono. Se ha ancora senso, le premesse sono solide, e tutto ciò che viene dopo acquista significato.",
      slots: [
        { subject: "Uniqlo", caption: "Supporto all'ingresso nel mercato francese, sviluppo di una strategia di penetrazione a medio termine, lancio del marchio e notorietà, apertura del negozio.", src: img("international-development", 1) },
        { subject: "Aēsop", caption: "Evitare la diluizione del marchio in un'espansione rapida. Linee guida di marca, strategia di apertura retail, pacchetto completo per l'ingresso in un nuovo mercato.", src: img("international-development", 2) },
      ],
    },
    {
      number: "03",
      slug: "retail-strategy",
      title: "Strategia retail",
      description:
        "Disegnare la distribuzione, le reti di negozi e la trama dell'esperienza retail fisica. Un esercizio che fiorisce con un'azienda dinamica, ben guidata e agile, che comprende le implicazioni dell'invitare i propri clienti a casa propria.",
      slots: [
        { subject: "Aēsop Italy", caption: "Un buon esempio di strategia distributiva naturale e senza sforzo, nata da un DNA di marca che ha bisogno di una “casa” per dialogare con i clienti. Meno è la mediazione, più chiara è l'intenzione. Il passo successivo è stato trasformare i negozi in un sostituto della spesa di marketing, delegando architettura, design, visual merchandising e formazione dei consulenti a una vera immersione nelle meraviglie del marchio.", src: img("retail-strategy", 1) },
        { subject: "Uniqlo", caption: "Quando Uniqlo entra in un nuovo Paese, la discussione prima ancora della redditività si concentra sulla cultura. Capire come la base clienti locale adotterà i nuovi arrivati è un equilibrio delicato di ricerca, diplomazia, persuasione e capacità di rappresentanza. Una volta raggiunto e consolidato questo, l'espansione retail è assicurata, e il successo della formula viene poi esteso ad altri Paesi.", src: img("retail-strategy", 2) },
        { subject: "Surface to Air", caption: "Un gruppo di creativi di straordinario talento aprì due negozi a Parigi e uno a New York, con l'obiettivo di consolidare l'hype del marchio sulle strade più cool del mondo. Le premesse erano tutte giuste, eppure la complessità del business della moda e la mancanza di fondi raccontarono un'altra storia. Surface to Air non esiste più, ma ancora oggi riecheggia per la sua visione e l'audacia creativa.", src: img("retail-strategy", 3) },
      ],
    },
    {
      number: "04",
      slug: "brand-repositioning",
      title: "Riposizionamento di marca",
      description:
        "Aiutare un marchio affermato a cambiare il modo in cui il mercato lo legge. Percepita come la più lenta di queste pratiche, a torto. Con la formulazione giusta, può sollevare in fretta una condizione di stanchezza di marca. Ma va sostenuta con uno sforzo continuo e con la ferma convinzione che un marchio meriti di meglio.",
      slots: [
        { subject: "Diesel Germany", caption: "In Germania, la missione era cambiare la percezione del marchio e allinearla al resto del mondo. È stato attuato un piano intelligente e deciso, che metteva in conto con coraggio un calo del fatturato per due anni, conseguenza della pulizia degli account wholesale e del taglio dei contratti. Con disciplina, questa medicina ha fatto miracoli, e il terzo anno ha visto emergere e fiorire un mercato del tutto nuovo, cambiando tutti i KPI e avvicinandoli a quelli del gruppo.", src: img("brand-repositioning", 1) },
        { subject: "System Professional", caption: "Parte del gruppo Wella, sentiva che era il momento di un restage completo del marchio. In un segmento altamente competitivo, l'haircare professionale, dove le aziende globali possono far leva sul controllo dei saloni, cambiare pelle è alla fine la soluzione giusta per ripartire con la narrazione del marchio. Con la “longevity” in mente.", src: img("brand-repositioning", 2) },
        { subject: "Public Goods", caption: "Con il passare del tempo, il bisogno di un nuovo sé non è bizzarro, ma piuttosto un esercizio di adattamento. Quando le strategie di vendita evolvono, le incertezze di mercato aumentano e nuovi target emergono, un marchio deve rivedere come comunica il proprio DNA e a chi. Come ha fatto Public Goods, mettendo in discussione la propria identità di fondo e la gamma di prodotti.", src: img("brand-repositioning", 3) },
      ],
    },
    {
      number: "05",
      slug: "new-categories",
      title: "Nuove categorie",
      description:
        "Evoluzione naturale della linea principale, o semplice strumento di conversione, le nuove categorie estendono la portata di un marchio. Portano un DNA che va mantenuto con cura, protetto e riallineato per far incontrare il marchio e il nuovo mercato. Prima o poi, faranno venire il mal di testa all'ufficio Compliance.",
      slots: [
        { subject: "Aēsop Perfumes", caption: "Costruire le ragioni per cui il profumo poteva diventare una categoria chiave per la crescita di un'azienda di skincare. Avviato il processo con IFF. Oggi la categoria più redditizia.", src: img("new-categories", 1) },
        { subject: "NOVA", caption: "Tutto nuovo, dall'idea all'esecuzione: il modello per innovare processo, strumenti e prodotto, distillando arte, AI e tecnologia in qualcosa che si può vendere e custodire.", src: img("new-categories", 2) },
        { subject: "Napapijri", caption: "Costruire un approccio circolare attorno a un tessuto di nuova introduzione, in nylon riciclato, coinvolgendo le università per definire il posizionamento e arricchire il dialogo sull'adozione.", src: img("new-categories", 3) },
      ],
    },
    {
      number: "06",
      slug: "licensing",
      title: "Licensing",
      description:
        "Prima di tutto, un esercizio di fiducia. Un'azienda sa cosa può e cosa non può fare; per ciò che non può, c'è un partner pronto a far crescere sul proprio albero un ramo che porta il nome dell'azienda. Il marchio è dell'azienda. I processi, la produzione e la distribuzione, del partner.",
      slots: [
        { subject: "Diesel", caption: "Un allineamento lungo e complesso con L'Oréal, che padroneggia produzione, distribuzione e marketing di questa categoria. Alla fine è diventato un caso di successo, esteso ad altri marchi del gruppo OTB.", src: img("licensing", 1) },
        { subject: "Diesel", caption: "Soprattutto un progetto divertente, che ha permesso al marchio di iniettare il proprio DNA in modo non convenzionale, ben espresso all'evento di lancio a Parigi, all'Hotel Amour.", src: img("licensing", 2) },
        { subject: "Diesel", caption: "La collaborazione con Fossil è diventata una delle più solide e stabili nell'ecosistema Diesel. È fiorita attraverso il linguaggio creativo e ha portato alla luce pezzi eccezionali, stagione dopo stagione.", src: img("licensing", 3) },
      ],
    },
    {
      number: "07",
      slug: "events",
      title: "Eventi",
      description:
        "Uno strumento potente, breve, clinico, quantificabile. È per una strategia di marketing ciò che un bacio alla francese è per una relazione a lungo termine. Può costruire o distruggere una reputazione. Fatti bene, creano una forte brand equity e generano contatti di alto valore. Fatti male, abbassano l'appeal del marchio.",
      slots: [
        { subject: "Sonus faber", caption: "Una sfida entusiasmante: unire un marchio artigianale premium e una casa automobilistica di lusso in un contesto pubblico, diventato infine “Casa Sonus faber”, uno spazio brandizzato all'interno del celebre autodromo di Imola. Manager stimati, piloti e audiofili hanno assaporato l'esperienza offerta dai diffusori all'avanguardia di Sonus faber.", src: img("events", 1) },
        { subject: "Corneliani", caption: "Sfilate stagionali e presentazioni di collezione sono essenziali per ogni marchio di moda, e uniscono di fatto marketing e vendite in un unico evento. Pur aggiornando le collezioni a ogni stagione, il marchio mantiene un tono di voce coerente, che va preservato e rispettato ogni volta che si rivolge al pubblico.", src: img("events", 2) },
        { subject: "Saint Louis", caption: "Un marchio heritage merita uno spazio heritage per le sue iniziative pubbliche. Saint Louis e le sue creazioni sono esposte all'interno di una piccola chiesa nel quartiere di Brera, dove storia e artigianalità elevano l'impegno di ogni dipendente di questa azienda francese.", src: img("events", 3) },
      ],
    },
  ],
};
