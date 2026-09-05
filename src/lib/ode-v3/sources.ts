// ──────────────────────────────────────────────────────────────
// Source-URL resolver for the /OdE-v2 microsite footnotes.
//
// New file for the isolated redesign. It is NOT the original
// src/lib/ode/sources.ts: extending that one in place would change how the
// live /OdE microsite renders its own footnotes, because the rules match by
// substring. This file may therefore grow freely.
//
// DataTag labels are free text written at the call site. Here we map them,
// by case-insensitive substring, to the public document, so [FONTE] /
// [STIMA] / [BENCHMARK] footnotes can link out. Internal OdE documents and
// research-frontier notes have no public URL and are intentionally left
// without a link (listed as text only). Order matters: first match wins.
// ──────────────────────────────────────────────────────────────
interface Rule {
  match: string; // lowercase substring to look for in the label
  url: string;
}

const RULES: Rule[] = [
  // ── Peer-reviewed literature, by DOI ──
  { match: '10.1111/exd.12296', url: 'https://doi.org/10.1111/exd.12296' },
  { match: '10.7759/cureus.60981', url: 'https://doi.org/10.7759/cureus.60981' },
  { match: '10.3390/biom10010115', url: 'https://doi.org/10.3390/biom10010115' },
  { match: '10.1111/jocd.70544', url: 'https://doi.org/10.1111/jocd.70544' },
  { match: '10.7324/japs.2021.110903', url: 'https://doi.org/10.7324/JAPS.2021.110903' },
  { match: '10.1111/j.1525-1470.2012.01865.x', url: 'https://doi.org/10.1111/j.1525-1470.2012.01865.x' },
  { match: '10.1128/mbio.01725-15', url: 'https://doi.org/10.1128/mBio.01725-15' },
  { match: '10.1099/00221287-124-2-393', url: 'https://doi.org/10.1099/00221287-124-2-393' },
  { match: '10.1016/j.foodchem.2018.03.142', url: 'https://doi.org/10.1016/j.foodchem.2018.03.142' },
  { match: '10.1055/a-1646-2959', url: 'https://doi.org/10.1055/a-1646-2959' },
  { match: '10.35702/derm.10039', url: 'https://doi.org/10.35702/Derm.10039' },
  { match: '10.1371/journal.pone.0336602', url: 'https://doi.org/10.1371/journal.pone.0336602' },
  { match: '10.3109/10915819009078731', url: 'https://doi.org/10.3109/10915819009078731' },
  { match: '10.36849/jdd.6795', url: 'https://doi.org/10.36849/JDD.6795' },
  { match: '10.1021/acs.molpharmaceut.3c00648', url: 'https://doi.org/10.1021/acs.molpharmaceut.3c00648' },
  // Generic fallback: any label carrying a DOI prefix we did not list above.
  { match: 'doi 10.', url: 'https://doi.org/' },

  // ── EU law, EUR-Lex ──
  { match: '2023/1115', url: 'https://eur-lex.europa.eu/eli/reg/2023/1115/oj' },
  { match: '2025/2650', url: 'https://eur-lex.europa.eu/eli/reg/2025/2650/oj' },
  { match: '2024/1781', url: 'https://eur-lex.europa.eu/eli/reg/2024/1781/oj' },
  { match: '655/2013', url: 'https://eur-lex.europa.eu/eli/reg/2013/655/oj' },
  { match: '1223/2009', url: 'https://eur-lex.europa.eu/eli/reg/2009/1223/oj' },
  { match: '1069/2009', url: 'https://eur-lex.europa.eu/eli/reg/2009/1069/oj' },
  { match: '142/2011', url: 'https://eur-lex.europa.eu/eli/reg/2011/142/oj' },
  { match: '2023/915', url: 'https://eur-lex.europa.eu/eli/reg/2023/915/oj' },
  { match: '2024/825', url: 'https://eur-lex.europa.eu/eli/dir/2024/825/oj' },
  { match: '651/2014', url: 'https://eur-lex.europa.eu/eli/reg/2014/651/oj' },
  { match: 'espr', url: 'https://eur-lex.europa.eu/eli/reg/2024/1781/oj' },
  { match: 'eudr', url: 'https://eur-lex.europa.eu/eli/reg/2023/1115/oj' },
  { match: 'eur-lex', url: 'https://eur-lex.europa.eu/homepage.html' },

  // ── Standards ──
  { match: 'cxs 211', url: 'https://www.fao.org/fao-who-codexalimentarius/sh-proxy/es/?lnk=1&url=https%253A%252F%252Fworkspace.fao.org%252Fsites%252Fcodex%252FStandards%252FCXS%2B211-1999%252FCXS_211e.pdf' },
  { match: 'codex', url: 'https://www.fao.org/fao-who-codexalimentarius/codex-texts/list-standards/en/' },
  { match: 'iso 660', url: 'https://www.iso.org/standard/75594.html' },
  { match: 'iso 3960', url: 'https://www.iso.org/standard/71268.html' },
  { match: 'iso 6885', url: 'https://www.iso.org/standard/64766.html' },
  { match: 'iso 6886', url: 'https://www.iso.org/standard/69594.html' },
  { match: 'iso 22716', url: 'https://www.iso.org/standard/36437.html' },
  { match: 'oecd 442', url: 'https://www.oecd.org/en/topics/sub-issues/assessment-of-chemicals.html' },
  { match: 'cosing', url: 'https://ec.europa.eu/growth/tools-databases/cosing/' },

  // ── Institutions and registries ──
  { match: 'efpra', url: 'https://efpra.eu/' },
  { match: 'invitalia', url: 'https://www.invitalia.it/' },
  { match: 'smart&start', url: 'https://www.mimit.gov.it/it/incentivi/smart-start-italia' },
  { match: 'smart e start', url: 'https://www.mimit.gov.it/it/incentivi/smart-start-italia' },
  { match: 'fesr', url: 'https://fesr.regione.emilia-romagna.it/' },
  { match: 'registro imprese', url: 'https://startup.registroimprese.it/' },
  { match: 'startup innovativ', url: 'https://startup.registroimprese.it/' },
  { match: 'investor visa', url: 'https://investorvisa.mise.gov.it/' },
  { match: 'parmigiano reggiano', url: 'https://www.parmigianoreggiano.com/' },
  { match: 'prosciutto di parma', url: 'https://www.prosciuttodiparma.com/' },
  { match: 'cbi', url: 'https://www.cbi.eu/market-information/natural-ingredients-cosmetics/doing-business' },
];

/** Returns the public source URL for a DataTag label, or undefined. */
export function resolveSource(label: string): string | undefined {
  const l = label.toLowerCase();
  // A search log cites databases consulted, not documents published by them.
  if (l.startsWith('internal research:') || l.startsWith('ricerca interna:')) return undefined;
  for (const rule of RULES) {
    if (l.includes(rule.match)) {
      // The generic DOI fallback appends the DOI found in the label.
      if (rule.match === 'doi 10.') {
        const m = l.match(/doi\s+(10\.[^\s,;)\]]+)/);
        return m ? `https://doi.org/${m[1].replace(/[.:]+$/, '')}` : undefined;
      }
      return rule.url;
    }
  }
  return undefined;
}
