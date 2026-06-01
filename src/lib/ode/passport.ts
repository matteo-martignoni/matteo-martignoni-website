// ──────────────────────────────────────────────────────────────
// Passport layer — the "downstream" of AMSA LIVE.
//
// ⚠️ DEMONSTRATION SIMULATION. Derives a simulated oxidation state, an
// Oxidative Risk Score (0–100), a predicted shelf-life and an industrial
// process decision from the computed scenario. Thresholds reference real
// standards (Codex CXS 211-1999, PV ≤ 10 meq O₂/kg); the values themselves
// are heuristic, not measured.
// ──────────────────────────────────────────────────────────────

import type { ComputedScenario } from './fa-engine';

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export interface OxidationState {
  pv: number;        // peroxide value, meq O₂/kg (simulated)
  anv: number;       // p-anisidine value (simulated)
  totox: number;     // 2·PV + AnV
  oxidation01: number; // 0..1, feeds the spectral carbonyl band
  pvOverCodex: boolean; // PV > 10 meq O₂/kg
}

/**
 * Simulate oxidation markers from the profile and rendering severity.
 * High-temperature dry rendering raises secondary oxidation (p-anisidine);
 * polyunsaturation raises primary oxidation susceptibility (PV).
 */
export function simulateOxidation(s: ComputedScenario): OxidationState {
  const pufa = s.totals.PUFA;
  const iv = s.iodineValue;
  const highTemp = s.render.id === 'dry_high_temp';
  const lowTemp = s.render.id === 'wet_low_temp';

  // Primary oxidation (peroxides): driven by unsaturation, modulated by render.
  let pv = 1.2 + pufa * 0.28 + (iv - 40) * 0.04;
  if (highTemp) pv += 1.8;
  if (lowTemp) pv -= 0.6;
  pv = Math.max(0.5, Math.round(pv * 10) / 10);

  // Secondary oxidation (aldehydes/ketones): high-temp rendering pushes this.
  let anv = 0.8 + pufa * 0.12 + (highTemp ? 4.5 : 0);
  anv = Math.max(0.3, Math.round(anv * 10) / 10);

  const totox = Math.round((2 * pv + anv) * 10) / 10;
  const oxidation01 = clamp01((pv / 10) * 0.6 + (anv / 8) * 0.4);

  return { pv, anv, totox, oxidation01, pvOverCodex: pv > 10 };
}

export type RiskBand = 'basso' | 'moderato' | 'alto';

export interface RiskResult {
  score: number;       // 0..100
  band: RiskBand;
  shelfLifeDays: number;
}

export function oxidativeRiskScore(s: ComputedScenario, ox: OxidationState): RiskResult {
  const fromPV = clamp01(ox.pv / 12);
  const fromPUFA = clamp01(s.totals.PUFA / 18);
  const fromIV = clamp01((s.iodineValue - 40) / 50);
  const fromAnV = clamp01(ox.anv / 8);
  const risk01 = clamp01(0.34 * fromPV + 0.3 * fromPUFA + 0.18 * fromIV + 0.18 * fromAnV);
  const score = Math.round(risk01 * 100);
  const band: RiskBand = score >= 66 ? 'alto' : score >= 33 ? 'moderato' : 'basso';

  // Predicted shelf-life scales inversely with risk, anchored to the baseline.
  const base = s.shelfLifeDays2C;
  const shelfLifeDays = Math.round(base * (1 - 0.62 * risk01));

  return { score, band, shelfLifeDays };
}

export interface Decision {
  action: string;    // localised label
  rationale: string; // localised explanation
}

/**
 * Industrial decision from the simulated evidence, mirroring the AMSA
 * decision table (PV vs p-anisidine, Codex flags, risk band).
 */
export function processDecision(
  s: ComputedScenario,
  ox: OxidationState,
  risk: RiskResult,
  lang: 'it' | 'en',
): Decision {
  const codexOut =
    s.codexFlags.C16_0 === 'out' ||
    s.codexFlags.C18_0 === 'out' ||
    s.codexFlags.C18_1 === 'out' ||
    s.codexFlags.C18_2 === 'out';

  const t = (it: string, en: string) => (lang === 'it' ? it : en);

  if (ox.pvOverCodex) {
    return {
      action: t('Scarta / declassa', 'Reject / downgrade'),
      rationale: t(
        'PV oltre la soglia Codex (10 meq O₂/kg): lotto fuori specifica per uso leave-on.',
        'PV above the Codex threshold (10 meq O₂/kg): batch out of spec for leave-on use.',
      ),
    };
  }
  if (codexOut) {
    return {
      action: t('Testa esternamente', 'Test externally'),
      rationale: t(
        'Profilo fuori dai range Codex per questa matrice: escalation a GC-MS / NMR prima della decisione.',
        'Profile outside Codex ranges for this matrix: escalate to GC-MS / NMR before deciding.',
      ),
    };
  }
  if (ox.anv > 4 && ox.pv < 5) {
    return {
      action: t('Deodora', 'Deodorise'),
      rationale: t(
        'Ossidazione secondaria elevata (p-anisidina): deodorazione o adsorbimento per rimuovere i carbonili.',
        'High secondary oxidation (p-anisidine): deodorise or adsorb to remove carbonyls.',
      ),
    };
  }
  if (risk.band === 'alto') {
    return {
      action: t('Purifica', 'Purify'),
      rationale: t(
        'Rischio ossidativo alto: purificazione e antiossidante, packaging barriera O₂ raccomandato.',
        'High oxidative risk: purify and add antioxidant, oxygen-barrier packaging recommended.',
      ),
    };
  }
  if (risk.band === 'moderato') {
    return {
      action: t('Accetta con condizioni', 'Accept with conditions'),
      rationale: t(
        'Rischio moderato: idoneo, con controllo dello stoccaggio e finestra di shelf-life dichiarata.',
        'Moderate risk: suitable, with storage control and a declared shelf-life window.',
      ),
    };
  }
  return {
    action: t('Accetta', 'Accept'),
    rationale: t(
      'Rischio ossidativo basso e profilo entro specifica: idoneo a formulazione cosmetica.',
      'Low oxidative risk and in-spec profile: suitable for cosmetic formulation.',
    ),
  };
}
