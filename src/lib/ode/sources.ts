// ──────────────────────────────────────────────────────────────
// Source-URL resolver for the OdE microsite footnotes.
//
// DataTag labels are free text written at the call site. Here we map
// them — by case-insensitive substring — to the official public
// document, so the [FONTE]/[STIMA]/[BENCHMARK] footnotes can link out.
// Internal OdE documents and research-frontier notes have no public
// URL and are intentionally left without a link (listed as text only).
// Order matters: the first matching rule wins.
// ──────────────────────────────────────────────────────────────
interface Rule {
  match: string;       // lowercase substring to look for in the label
  url: string;
}

const RULES: Rule[] = [
  // EU regulations — ESPR (Ecodesign for Sustainable Products Regulation)
  { match: '2024/1781', url: 'https://eur-lex.europa.eu/eli/reg/2024/1781/oj' },
  { match: 'espr', url: 'https://eur-lex.europa.eu/eli/reg/2024/1781/oj' },
  // Generic EUR-Lex (consolidated texts of cited regulations)
  { match: 'eur-lex', url: 'https://eur-lex.europa.eu/homepage.html' },
  // Codex Alimentarius — Standard for Named Animal Fats (CXS 211-1999)
  { match: 'cxs 211', url: 'https://www.fao.org/fao-who-codexalimentarius/codex-texts/list-standards/en/' },
  { match: 'codex', url: 'https://www.fao.org/fao-who-codexalimentarius/codex-texts/list-standards/en/' },
  // ISO 6886 — oxidation stability (accelerated test / Rancimat)
  { match: 'iso 6886', url: 'https://www.iso.org/standard/69594.html' },
  // Italian Investor Visa programme (MIMIT)
  { match: 'investor visa', url: 'https://investorvisa.mise.gov.it/' },
  // Consorzio del Parmigiano Reggiano
  { match: 'parmigiano reggiano', url: 'https://www.parmigianoreggiano.com/' },
];

/** Returns the public source URL for a DataTag label, or undefined. */
export function resolveSource(label: string): string | undefined {
  const l = label.toLowerCase();
  for (const rule of RULES) {
    if (l.includes(rule.match)) return rule.url;
  }
  return undefined;
}
