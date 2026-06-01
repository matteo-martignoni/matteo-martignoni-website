// ──────────────────────────────────────────────────────────────
// AMSA LIVE orchestrator. Single entry point for the dashboard: takes the
// user inputs and returns the full simulated analysis (scenario + spectrum +
// control loop + oxidation + risk + decision), ready for the UI to render.
//
// ⚠️ DEMONSTRATION SIMULATION end to end.
// ──────────────────────────────────────────────────────────────

import { computeScenario, type ScenarioInputs, type ComputedScenario } from './fa-engine';
import { simulateSpectrum, simulateAcquisition, type Spectrum, type AcquisitionStep } from './spectrum';
import {
  simulateOxidation,
  oxidativeRiskScore,
  processDecision,
  type OxidationState,
  type RiskResult,
  type Decision,
} from './passport';

export interface AmsaAnalysis {
  scenario: ComputedScenario;
  spectrum: Spectrum;       // clean, QC-passed spectrum
  acquisition: AcquisitionStep[];
  oxidation: OxidationState;
  risk: RiskResult;
  decision: Decision;
}

export function analyze(inputs: ScenarioInputs, lang: 'it' | 'en' = 'it'): AmsaAnalysis {
  const scenario = computeScenario(inputs);
  const oxidation = simulateOxidation(scenario);
  const risk = oxidativeRiskScore(scenario, oxidation);
  const decision = processDecision(scenario, oxidation, risk, lang);

  // The displayed spectrum is the clean one after the control loop converges
  // (low noise, fluorescence suppressed); its carbonyl band reflects oxidation.
  const spectrum = simulateSpectrum(scenario.profile, scenario.totals, scenario.iodineValue, {
    oxidation: oxidation.oxidation01,
    noise: 0.01,
    fluorescence: 0.02,
    // Seed derived from inputs so the (tiny) residual noise is stable per scenario.
    seed: (inputs.fatType.length * 131 + inputs.dietId.length * 17 + inputs.renderId.length * 7) >>> 0,
  });

  const acquisition = simulateAcquisition(85);

  return { scenario, spectrum, oxidation, risk, decision, acquisition };
}

// Re-export input helpers so the dashboard can build its selectors.
export { getDietPresets, getRenderPresets } from './fa-engine';
export { FAT_BASELINES } from './fatty-acid-data';
export type { ScenarioInputs } from './fa-engine';
