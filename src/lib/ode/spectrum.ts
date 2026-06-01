// ──────────────────────────────────────────────────────────────
// Synthetic spectral acquisition — the "upstream" layer of AMSA LIVE.
//
// ⚠️ DEMONSTRATION SIMULATION, not real measurements. Generates a
// pedagogically plausible NIR/Raman-style spectrum from a fatty-acid
// profile, plus a simulated Active Control Loop that improves signal
// quality over iterations. Band assignments are real (vibrational
// spectroscopy of lipids); intensities are heuristic functions of the
// profile, calibrated only for clarity.
// ──────────────────────────────────────────────────────────────

import type { FAProfile } from './fatty-acid-data';

export interface SpectralBand {
  center: number;   // wavenumber cm⁻¹
  sigma: number;    // peak width
  intensity: number; // 0..~1 relative
  label: string;     // assignment shown in the UI
}

export interface SpectrumPoint {
  x: number; // wavenumber cm⁻¹
  y: number; // intensity 0..1
}

export interface Spectrum {
  points: SpectrumPoint[];
  bands: SpectralBand[];
  xMin: number;
  xMax: number;
}

export interface Totals {
  SFA: number;
  MUFA: number;
  PUFA: number;
  UFA: number;
}

// Deterministic PRNG (mulberry32) so server and client renders match and the
// loop animation is reproducible. We avoid Math.random for SSR stability.
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s |= 0; s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(x: number, center: number, sigma: number, intensity: number) {
  const d = x - center;
  return intensity * Math.exp(-(d * d) / (2 * sigma * sigma));
}

/**
 * Band table driven by the profile. Intensities are clamped to ~[0,1].
 * `oxidation` (0..1) lifts the secondary-carbonyl band (rancidity marker).
 */
export function bandsFor(p: FAProfile, totals: Totals, iv: number, oxidation = 0): SpectralBand[] {
  const unsat = Math.min(1, iv / 90);             // iodine value → unsaturation
  const sat = Math.min(1, totals.SFA / 60);
  const chain = Math.min(1, (totals.SFA + totals.MUFA) / 80);
  return [
    { center: 3010, sigma: 22, intensity: 0.18 + 0.6 * unsat, label: '=C–H stretch (insaturazione)' },
    { center: 2925, sigma: 35, intensity: 0.65 + 0.35 * chain, label: 'CH₂ asym. stretch' },
    { center: 2855, sigma: 32, intensity: 0.5 + 0.3 * chain, label: 'CH₂ sym. stretch' },
    { center: 1745, sigma: 20, intensity: 0.55 + 0.15 * oxidation, label: 'C=O estere (trigliceridi)' },
    { center: 1710, sigma: 18, intensity: 0.05 + 0.55 * oxidation, label: 'C=O ossidazione (aldeidi/chetoni)' },
    { center: 1655, sigma: 18, intensity: 0.1 + 0.5 * unsat, label: 'C=C stretch (insaturazione)' },
    { center: 1465, sigma: 24, intensity: 0.35 + 0.35 * sat, label: 'CH₂ scissoring' },
    { center: 1170, sigma: 28, intensity: 0.3 + 0.15 * chain, label: 'C–O stretch' },
  ];
}

/**
 * Build a spectrum from bands, optionally adding fluorescence baseline and
 * noise (both reduced by the Active Control Loop over iterations).
 */
export function simulateSpectrum(
  p: FAProfile,
  totals: Totals,
  iv: number,
  opts: { oxidation?: number; noise?: number; fluorescence?: number; seed?: number } = {},
): Spectrum {
  const { oxidation = 0, noise = 0, fluorescence = 0, seed = 1234 } = opts;
  const bands = bandsFor(p, totals, iv, oxidation);
  const xMin = 900;
  const xMax = 3150;
  const step = 8;
  const rng = makeRng(seed);
  const points: SpectrumPoint[] = [];

  for (let x = xMin; x <= xMax; x += step) {
    let y = 0;
    for (const b of bands) y += gaussian(x, b.center, b.sigma, b.intensity);
    // Fluorescence baseline: smooth rising curve toward low wavenumbers (Raman).
    const f = fluorescence * (1 - (x - xMin) / (xMax - xMin)) ** 1.5;
    y += f;
    // Detector noise.
    if (noise) y += (rng() - 0.5) * 2 * noise;
    points.push({ x, y: Math.max(0, y) });
  }

  // Normalise to [0,1] for display.
  const max = Math.max(...points.map((pt) => pt.y), 1);
  for (const pt of points) pt.y = pt.y / max;

  return { points, bands, xMin, xMax };
}

export interface AcquisitionStep {
  iteration: number;
  action: string;     // what the Policy Controller did
  snr: number;        // signal-to-noise (higher better)
  fluorescence: number; // residual fluorescence (lower better)
  qc: number;         // 0..100 quality score
  accepted: boolean;  // QC ok?
}

/**
 * Simulated Active Control Loop: each iteration the Policy Controller picks an
 * action, SNR rises and fluorescence falls until QC clears the threshold.
 * Pedagogical, not a real RL policy.
 */
export function simulateAcquisition(qcTarget = 85): AcquisitionStep[] {
  const actions = [
    'Scout scan iniziale',
    'Aumenta tempo di integrazione',
    'Media più scansioni, sottrae dark/reference',
    'Riduce potenza laser, sposta finestra spettrale',
    'Termostata la cella, deconvolve effetto fisico',
  ];
  const steps: AcquisitionStep[] = [];
  let snr = 6;
  let fluo = 0.7;
  for (let i = 0; i < actions.length; i++) {
    snr = snr + (28 - snr) * 0.45;        // converges toward ~28
    fluo = fluo * 0.6;                     // decays
    const qc = Math.min(100, Math.round(snr * 3.1 + (1 - fluo) * 18));
    const accepted = qc >= qcTarget;
    steps.push({
      iteration: i,
      action: actions[i],
      snr: Math.round(snr * 10) / 10,
      fluorescence: Math.round(fluo * 100) / 100,
      qc,
      accepted,
    });
    if (accepted) break;
  }
  return steps;
}
