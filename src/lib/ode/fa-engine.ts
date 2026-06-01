// Computation engine for the fatty acid simulator.
// Implements the proxy formulas described in §5 of the research dataset:
// - SFA / UFA / MUFA / PUFA totals from the profile
// - Iodine value via per-FA weighted sum (Wikipedia IV)
// - Slip point linear proxy from SFA% and C18:1%
// - Oxidative stability tier from PUFA%
// - End-use suitability scoring per §7.1

import {
  FAT_BASELINES,
  TALLOW_DIET_PRESETS,
  LARD_DIET_PRESETS,
  RENDER_PRESETS,
  type DietPreset,
  type FAProfile,
  type FatTypeId,
  type RenderPreset,
} from "./fatty-acid-data";

export interface ScenarioInputs {
  fatType: FatTypeId;
  dietId: string;
  renderId: string;
  // optional fine-tune offsets (added to the diet+render derived profile)
  overrides?: {
    C16_0?: number;
    C18_0?: number;
    C18_1?: number;
    C18_2?: number;
  };
}

export interface ComputedScenario {
  inputs: ScenarioInputs;
  diet: DietPreset;
  render: RenderPreset;
  profile: FAProfile;
  totals: {
    SFA: number;
    MUFA: number;
    PUFA: number;
    UFA: number;
  };
  ratios: {
    SFA_UFA: number; // SFA / UFA
    M_S: number; // MUFA / SFA (lard quality index)
  };
  iodineValue: number;
  slipPointC: number;
  estCompleteMeltC: number;
  oxidativeStability: {
    tier: "Very High" | "High" | "Moderate" | "Low" | "Very Low";
    osi: string; // text range
    note: string;
  };
  smokePointC: { min: number; max: number };
  shelfLifeDays2C: number;
  codexFlags: {
    C16_0: "within" | "out";
    C18_0: "within" | "out";
    C18_1: "within" | "out";
    C18_2?: "within" | "out";
  };
  endUseScores: EndUseScore[];
}

export interface EndUseScore {
  id: string;
  label: string;
  description: string;
  star: 1 | 2 | 3 | 4 | 5;
  rationale: string;
  driver: string; // primary metric driving the score
}

export function getDietPresets(fat: FatTypeId): DietPreset[] {
  return fat === "beef_tallow" ? TALLOW_DIET_PRESETS : LARD_DIET_PRESETS;
}

export function getRenderPresets(): RenderPreset[] {
  return RENDER_PRESETS;
}

export function findDiet(fat: FatTypeId, id: string): DietPreset {
  const list = getDietPresets(fat);
  return list.find((d) => d.id === id) ?? list[0];
}

export function findRender(id: string): RenderPreset {
  return RENDER_PRESETS.find((r) => r.id === id) ?? RENDER_PRESETS[1];
}

function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * Build the fatty acid profile from the chosen diet + render adjustments
 * plus any user fine-tune overrides. Profile values are normalised so the
 * eight named fatty acids + "other_fa" sum back to ~100 % after adjustment.
 */
export function buildProfile(inputs: ScenarioInputs): FAProfile {
  const baseline = FAT_BASELINES[inputs.fatType];
  const diet = findDiet(inputs.fatType, inputs.dietId);
  const render = findRender(inputs.renderId);

  const base: FAProfile = { ...baseline.default_profile };

  // 1. Apply diet preset (absolute replacement for fields it specifies).
  const dietApplied: FAProfile = { ...base };
  for (const k of Object.keys(diet.absolute) as Array<keyof FAProfile>) {
    const v = diet.absolute[k];
    if (typeof v === "number") dietApplied[k] = v;
  }

  // 2. Apply render delta (additive offsets) to the diet profile.
  const adjusted: FAProfile = { ...dietApplied };
  const d = render.delta;
  if (d.C16_0) adjusted.C16_0 = clamp(adjusted.C16_0 + d.C16_0);
  if (d.C18_0) adjusted.C18_0 = clamp(adjusted.C18_0 + d.C18_0);
  if (d.C18_1) adjusted.C18_1 = clamp(adjusted.C18_1 + d.C18_1);
  if (d.C18_2) adjusted.C18_2 = clamp(adjusted.C18_2 + d.C18_2);
  if (d.C18_3) adjusted.C18_3 = clamp(adjusted.C18_3 + d.C18_3);

  // 3. Apply fine-tune overrides if provided.
  if (inputs.overrides) {
    if (inputs.overrides.C16_0 !== undefined) adjusted.C16_0 = inputs.overrides.C16_0;
    if (inputs.overrides.C18_0 !== undefined) adjusted.C18_0 = inputs.overrides.C18_0;
    if (inputs.overrides.C18_1 !== undefined) adjusted.C18_1 = inputs.overrides.C18_1;
    if (inputs.overrides.C18_2 !== undefined) adjusted.C18_2 = inputs.overrides.C18_2;
  }

  // 4. Normalise so the total sums to 100. Minor FAs (C14:0, C16:1, C17:0, C18:3)
  //    are scaled together with "other_fa" to absorb the residual.
  const fixedKeys: Array<keyof FAProfile> = ["C16_0", "C18_0", "C18_1", "C18_2"];
  const fixedSum = fixedKeys.reduce((s, k) => s + adjusted[k], 0);
  const minorKeys: Array<keyof FAProfile> = [
    "C14_0",
    "C16_1",
    "C17_0",
    "C18_3",
    "other_fa",
  ];
  const minorBaselineSum = minorKeys.reduce((s, k) => s + adjusted[k], 0);
  const remaining = Math.max(2, 100 - fixedSum);
  const scale = minorBaselineSum > 0 ? remaining / minorBaselineSum : 1;
  for (const k of minorKeys) {
    adjusted[k] = Math.max(0, adjusted[k] * scale);
  }

  return adjusted;
}

export function totalsOf(p: FAProfile) {
  const SFA = p.C14_0 + p.C16_0 + p.C17_0 + p.C18_0 + p.other_fa * 0.3; // ~30% of other_fa assumed saturated
  const MUFA = p.C16_1 + p.C18_1;
  const PUFA = p.C18_2 + p.C18_3;
  const UFA = MUFA + PUFA + p.other_fa * 0.2;
  return { SFA, MUFA, PUFA, UFA };
}

// Iodine value via per-FA constants (Wikipedia IV)
export function iodineValue(p: FAProfile): number {
  const iv =
    p.C18_1 * 0.899 +
    p.C16_1 * 0.998 +
    p.C18_2 * 1.81 +
    p.C18_3 * 2.735;
  return Math.round(iv * 10) / 10;
}

// Slip point linear proxy from dataset §5.3
export function slipPointC(SFA: number, C18_1: number): number {
  return Math.round((15 + 0.45 * SFA - 0.15 * C18_1) * 10) / 10;
}

// Complete-melt heuristic: roughly slip + 10 °C for tallow-like SFA, slip + 6 °C for lard
export function completeMeltC(slip: number, SFA: number): number {
  const offset = SFA > 45 ? 11 : SFA > 40 ? 9 : 7;
  return Math.round((slip + offset) * 10) / 10;
}

export function stabilityTier(PUFA: number) {
  if (PUFA < 3)
    return {
      tier: "Very High" as const,
      osi: "6–10+ h @ 120 °C",
      note: "Excellent — tallow-grade frying & oleochemistry",
    };
  if (PUFA < 6)
    return {
      tier: "High" as const,
      osi: "3–8 h @ 120 °C",
      note: "Good — tallow-grade",
    };
  if (PUFA < 12)
    return {
      tier: "Moderate" as const,
      osi: "1–3 h @ 100 °C",
      note: "Acceptable — lard-grade",
    };
  if (PUFA < 18)
    return {
      tier: "Low" as const,
      osi: "0.5–1.5 h @ 100 °C",
      note: "Marginal — antioxidant recommended",
    };
  return {
    tier: "Very Low" as const,
    osi: "<0.5 h @ 100 °C",
    note: "Poor — antioxidant required",
  };
}

export function codexFlags(p: FAProfile, fat: FatTypeId) {
  const codex = FAT_BASELINES[fat].codex;
  const within = (v: number, [lo, hi]: [number, number]) =>
    v >= lo && v <= hi ? "within" : "out";
  return {
    C16_0: within(p.C16_0, codex.C16_0) as "within" | "out",
    C18_0: within(p.C18_0, codex.C18_0) as "within" | "out",
    C18_1: within(p.C18_1, codex.C18_1) as "within" | "out",
    C18_2: codex.C18_2
      ? (within(p.C18_2, codex.C18_2) as "within" | "out")
      : undefined,
  };
}

// End-use suitability. Each end-use returns a 1–5 star rating with a rationale
// pointing to the dominant metric driving the score. Encodes the matrix in §7.1.
export function endUseScores(
  fat: FatTypeId,
  totals: { SFA: number; MUFA: number; PUFA: number },
  iv: number,
  slip: number,
  c18_0: number,
  c18_1: number
): EndUseScore[] {
  const round = (s: number): 1 | 2 | 3 | 4 | 5 =>
    Math.max(1, Math.min(5, Math.round(s))) as 1 | 2 | 3 | 4 | 5;

  // Deep frying / high-heat
  const fryS =
    (totals.SFA >= 45 ? 2 : totals.SFA >= 38 ? 1.2 : 0.6) +
    (iv <= 50 ? 2 : iv <= 60 ? 1.2 : 0.4) +
    (totals.PUFA < 5 ? 1 : totals.PUFA < 12 ? 0.5 : 0);

  // Bakery / pastry shortening — plasticity at 20–35 °C, lard-friendly
  const bakeS =
    (slip >= 26 && slip <= 38 ? 2 : 0.8) +
    (fat === "pork_lard" ? 1.6 : 1.0) +
    (totals.PUFA < 14 ? 1.2 : 0.6);

  // Soap / oleochemistry — hardness needs C18:0 + SFA
  const soapS =
    (totals.SFA >= 42 ? 2 : totals.SFA >= 36 ? 1.4 : 0.8) +
    (c18_0 >= 14 ? 2 : c18_0 >= 11 ? 1.4 : 0.8) +
    (iv <= 60 ? 0.8 : 0.4);

  // Cosmetics / skincare — biocompatibility + low PUFA for stability + C18:1 for penetration
  const cosmeticsS =
    (totals.PUFA < 6 ? 2 : totals.PUFA < 12 ? 1.2 : 0.4) +
    (c18_1 >= 38 ? 1.6 : 1.0) +
    (totals.SFA >= 42 ? 1 : 0.6) +
    (fat === "beef_tallow" ? 0.2 : 0.0); // tallow traditional for skincare

  // Pet food — palatability + stability
  const petS =
    (totals.PUFA < 10 ? 1.6 : totals.PUFA < 16 ? 1.2 : 0.7) +
    (totals.MUFA + totals.PUFA > 45 ? 1.4 : 1.0) + // calorie dense
    (iv <= 65 ? 1.4 : 1.0);

  // Candle / industrial wax — needs hardness, high SFA, low IV
  const candleS =
    (totals.SFA >= 45 ? 2.4 : totals.SFA >= 38 ? 1.4 : 0.6) +
    (iv <= 50 ? 1.8 : iv <= 60 ? 1.0 : 0.4) +
    (slip >= 38 ? 1.4 : slip >= 32 ? 0.8 : 0.4);

  return [
    {
      id: "frying",
      label: "Deep Frying / High-Heat",
      description: "Industrial fryers, food-service",
      star: round(fryS),
      driver: `SFA ${totals.SFA.toFixed(0)}%, IV ${iv.toFixed(0)}, PUFA ${totals.PUFA.toFixed(1)}%`,
      rationale:
        "Smoke point and oxidative resistance scale with saturation; PUFA <5% gives long fryer life.",
    },
    {
      id: "bakery",
      label: "Bakery / Shortening",
      description: "Pastry plasticity 20–35 °C",
      star: round(bakeS),
      driver: `Slip ${slip.toFixed(1)} °C, ${fat === "pork_lard" ? "lard" : "tallow"}`,
      rationale:
        "Plasticity window 26–38 °C gives good creaming; lard's softer crystal matrix is preferred for flaky doughs.",
    },
    {
      id: "soap",
      label: "Soap / Oleochemistry",
      description: "Hard bar, oleochemical feedstock",
      star: round(soapS),
      driver: `SFA ${totals.SFA.toFixed(0)}%, C18:0 ${c18_0.toFixed(1)}%`,
      rationale:
        "Hardness and lather come from stearic + palmitic. IV <60 yields a stable, long-shelf bar.",
    },
    {
      id: "cosmetics",
      label: "Cosmetics / Skincare",
      description: "Balms, salves, emollients",
      star: round(cosmeticsS),
      driver: `PUFA ${totals.PUFA.toFixed(1)}%, C18:1 ${c18_1.toFixed(0)}%`,
      rationale:
        "Low PUFA prevents rancidity in finished product; C18:1 aids skin penetration; tallow has historical bio-compatibility.",
    },
    {
      id: "petfood",
      label: "Pet Food",
      description: "Palatant, calorie-dense coater",
      star: round(petS),
      driver: `PUFA ${totals.PUFA.toFixed(1)}%, IV ${iv.toFixed(0)}`,
      rationale:
        "Stability across kibble shelf life matters; moderate unsaturation aids palatability.",
    },
    {
      id: "candle",
      label: "Candle / Industrial",
      description: "Hard wax, lubricants",
      star: round(candleS),
      driver: `SFA ${totals.SFA.toFixed(0)}%, Slip ${slip.toFixed(1)} °C`,
      rationale:
        "Higher SFA and slip point give a hard, slow-burning candle; high-IV fats slump at room temp.",
    },
  ];
}

export function computeScenario(inputs: ScenarioInputs): ComputedScenario {
  const baseline = FAT_BASELINES[inputs.fatType];
  const diet = findDiet(inputs.fatType, inputs.dietId);
  const render = findRender(inputs.renderId);
  const profile = buildProfile(inputs);
  const totals = totalsOf(profile);
  const iv = iodineValue(profile);
  const slip = slipPointC(totals.SFA, profile.C18_1);
  const meltC = completeMeltC(slip, totals.SFA);
  const stab = stabilityTier(totals.PUFA);
  const cFlags = codexFlags(profile, inputs.fatType);
  const scores = endUseScores(
    inputs.fatType,
    totals,
    iv,
    slip,
    profile.C18_0,
    profile.C18_1
  );
  const mOverS = totals.SFA > 0 ? totals.MUFA / totals.SFA : 0;
  return {
    inputs,
    diet,
    render,
    profile,
    totals,
    ratios: {
      SFA_UFA: totals.UFA > 0 ? totals.SFA / totals.UFA : 0,
      M_S: mOverS,
    },
    iodineValue: iv,
    slipPointC: slip,
    estCompleteMeltC: meltC,
    oxidativeStability: stab,
    smokePointC: baseline.physicochemical.smoke_point_C,
    shelfLifeDays2C: baseline.physicochemical.shelf_life_days_2C,
    codexFlags: cFlags,
    endUseScores: scores,
  };
}
