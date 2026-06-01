// ──────────────────────────────────────────────────────────────
// Client-side renderer for the AMSA LIVE dashboard. Imported by the two
// dashboard pages (IT/EN), which provide only the localised labels.
// Pure DOM, no framework. All data is a DEMONSTRATION SIMULATION.
// ──────────────────────────────────────────────────────────────

import { analyze, getDietPresets, getRenderPresets, FAT_BASELINES, type ScenarioInputs } from './amsa';
import type { FatTypeId, FAProfile } from './fatty-acid-data';

export interface DashboardLabels {
  fatNames: Record<FatTypeId, string>;
  fatLabel: string;
  dietLabel: string;
  renderLabel: string;
  acqTitle: string;
  acqIntro: string;
  qcOk: string;
  snr: string;
  spectrumTitle: string;
  spectrumIntro: string;
  wavenumber: string;
  profileTitle: string;
  iodine: string;
  slip: string;
  stability: string;
  riskTitle: string;
  pv: string;
  totox: string;
  codexOk: string;
  codexOut: string;
  shelfLife: string;
  days: string;
  riskBands: { basso: string; moderato: string; alto: string };
  passportTitle: string;
  decision: string;
  lang: 'it' | 'en';
}

const FA_LABELS: Array<[keyof FAProfile, string]> = [
  ['C16_0', 'C16:0'],
  ['C18_0', 'C18:0'],
  ['C18_1', 'C18:1'],
  ['C18_2', 'C18:2'],
  ['C14_0', 'C14:0'],
  ['C16_1', 'C16:1'],
  ['C18_3', 'C18:3'],
];

function el<T extends HTMLElement = HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`#${id} not found`);
  return node as T;
}

function option(value: string, label: string) {
  const o = document.createElement('option');
  o.value = value;
  o.textContent = label;
  return o;
}

export function initDashboard(L: DashboardLabels) {
  const fatSel = el<HTMLSelectElement>('ode-fat');
  const dietSel = el<HTMLSelectElement>('ode-diet');
  const renderSel = el<HTMLSelectElement>('ode-render');

  // Populate fat + render once.
  (Object.keys(FAT_BASELINES) as FatTypeId[]).forEach((f) =>
    fatSel.append(option(f, L.fatNames[f])),
  );
  getRenderPresets().forEach((r) => renderSel.append(option(r.id, r.label)));

  function fillDiets() {
    dietSel.innerHTML = '';
    getDietPresets(fatSel.value as FatTypeId).forEach((d) => dietSel.append(option(d.id, d.label)));
  }

  function inputs(): ScenarioInputs {
    return {
      fatType: fatSel.value as FatTypeId,
      dietId: dietSel.value,
      renderId: renderSel.value,
    };
  }

  function render() {
    const a = analyze(inputs(), L.lang);
    renderAcquisition(a.acquisition, L);
    renderSpectrum(a.spectrum, L);
    renderProfile(a.scenario, L);
    renderRisk(a, L);
    renderPassport(a, L);
  }

  fatSel.addEventListener('change', () => { fillDiets(); render(); });
  dietSel.addEventListener('change', render);
  renderSel.addEventListener('change', render);

  fillDiets();
  render();
}

// ── Step 2: Active Control Loop ───────────────────────────────
function renderAcquisition(steps: ReturnType<typeof analyze>['acquisition'], L: DashboardLabels) {
  const host = el('ode-acq');
  host.innerHTML = steps
    .map((s) => {
      const cls = s.accepted ? 'acq-step is-ok' : 'acq-step';
      const badge = s.accepted ? `<span class="acq-ok">${L.qcOk}</span>` : '';
      return `<li class="${cls}">
        <span class="acq-action">${s.action}</span>
        <span class="acq-meta">QC ${s.qc} · ${L.snr} ${s.snr}</span>
        ${badge}
        <span class="acq-bar"><span style="width:${s.qc}%"></span></span>
      </li>`;
    })
    .join('');
}

// ── Step 3a: Spectrum (SVG) ───────────────────────────────────
function renderSpectrum(spec: ReturnType<typeof analyze>['spectrum'], L: DashboardLabels) {
  const W = 720, H = 240, padL = 8, padR = 8, padT = 14, padB = 26;
  const x = (wn: number) => padL + ((wn - spec.xMin) / (spec.xMax - spec.xMin)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - v) * (H - padT - padB);

  const d = spec.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.x).toFixed(1)},${y(p.y).toFixed(1)}`).join(' ');
  const area = `${d} L${x(spec.xMax).toFixed(1)},${y(0).toFixed(1)} L${x(spec.xMin).toFixed(1)},${y(0).toFixed(1)} Z`;

  // Annotate the 3 most intense bands.
  const top = [...spec.bands].sort((a, b) => b.intensity - a.intensity).slice(0, 4);
  const markers = top
    .map(
      (b) => `<line x1="${x(b.center).toFixed(1)}" y1="${padT}" x2="${x(b.center).toFixed(1)}" y2="${H - padB}" class="spec-mark"/>
        <text x="${x(b.center).toFixed(1)}" y="${padT + 8}" class="spec-mark-lbl">${b.center}</text>`,
    )
    .join('');

  const ticks = [1000, 1500, 2000, 2500, 3000]
    .map((wn) => `<text x="${x(wn).toFixed(1)}" y="${H - 8}" class="spec-tick">${wn}</text>`)
    .join('');

  el('ode-spectrum').innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${L.spectrumTitle}">
      <path d="${area}" class="spec-area"/>
      <path d="${d}" class="spec-line"/>
      ${markers}
      <line x1="${padL}" y1="${H - padB}" x2="${W - padR}" y2="${H - padB}" class="spec-axis"/>
      ${ticks}
    </svg>`;

  el('ode-bands').innerHTML = top
    .map((b) => `<li><span class="band-dot"></span><strong>${b.center} cm⁻¹</strong> · ${b.label}</li>`)
    .join('');
}

// ── Step 3b: Lipid profile ────────────────────────────────────
function renderProfile(s: ReturnType<typeof analyze>['scenario'], L: DashboardLabels) {
  const max = Math.max(...FA_LABELS.map(([k]) => s.profile[k]));
  el('ode-fabars').innerHTML = FA_LABELS.map(([k, lbl]) => {
    const v = s.profile[k];
    return `<div class="fa-row">
      <span class="fa-lbl">${lbl}</span>
      <span class="fa-track"><span class="fa-bar" style="width:${Math.max(2, (v / max) * 100)}%"></span></span>
      <span class="fa-val">${v.toFixed(1)}%</span>
    </div>`;
  }).join('');

  el('ode-metrics').innerHTML = `
    <div class="metric"><span class="metric-v">${s.iodineValue.toFixed(1)}</span><span class="metric-l">${L.iodine}</span></div>
    <div class="metric"><span class="metric-v">${s.slipPointC.toFixed(1)} °C</span><span class="metric-l">${L.slip}</span></div>
    <div class="metric"><span class="metric-v">${s.totals.SFA.toFixed(0)} / ${s.totals.MUFA.toFixed(0)} / ${s.totals.PUFA.toFixed(0)}</span><span class="metric-l">SFA / MUFA / PUFA %</span></div>
    <div class="metric"><span class="metric-v">${s.oxidativeStability.tier}</span><span class="metric-l">${L.stability}</span></div>`;
}

// ── Step 4a: Oxidative Risk ───────────────────────────────────
function renderRisk(a: ReturnType<typeof analyze>, L: DashboardLabels) {
  const { risk, oxidation } = a;
  const bandLabel = L.riskBands[risk.band];
  const codex = oxidation.pvOverCodex
    ? `<span class="codex codex--out">${L.codexOut}</span>`
    : `<span class="codex codex--ok">${L.codexOk}</span>`;

  el('ode-risk').innerHTML = `
    <div class="gauge gauge--${risk.band}">
      <div class="gauge-score">${risk.score}<span>/100</span></div>
      <div class="gauge-band">${bandLabel}</div>
      <div class="gauge-track"><span style="width:${risk.score}%"></span></div>
    </div>
    <div class="ox">
      <div class="ox-row"><span>${L.pv}</span><strong>${oxidation.pv} meq O₂/kg</strong></div>
      <div class="ox-row"><span>${L.totox}</span><strong>${oxidation.totox}</strong></div>
      <div class="ox-row"><span>Codex CXS 211-1999</span>${codex}</div>
    </div>`;
}

// ── Step 4b: Passport + decision ──────────────────────────────
function renderPassport(a: ReturnType<typeof analyze>, L: DashboardLabels) {
  const { decision, risk, scenario } = a;
  el('ode-passport').innerHTML = `
    <div class="pp-decision">
      <span class="pp-label">${L.decision}</span>
      <span class="pp-action">${decision.action}</span>
      <p class="pp-rationale">${decision.rationale}</p>
    </div>
    <div class="pp-grid">
      <div><span class="pp-k">${L.shelfLife}</span><span class="pp-v">${risk.shelfLifeDays} ${L.days}</span></div>
      <div><span class="pp-k">Matrix</span><span class="pp-v">${scenario.diet.label}</span></div>
      <div><span class="pp-k">Rendering</span><span class="pp-v">${scenario.render.shortLabel}</span></div>
    </div>`;
}
