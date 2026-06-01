// Fatty acid simulator dataset — beef tallow & pork lard
// All figures sourced from the research dataset compiled in /fatty-acid-saturation-simulator-dataset.pplx.md
// Each preset records its primary URL so the UI can show provenance inline.

export type FatTypeId = "beef_tallow" | "pork_lard";

export interface FAProfile {
  C14_0: number;
  C16_0: number;
  C16_1: number;
  C17_0: number;
  C18_0: number;
  C18_1: number;
  C18_2: number;
  C18_3: number;
  other_fa: number;
}

export interface FatBaseline {
  id: FatTypeId;
  name: string;
  animal: string;
  default_profile: FAProfile;
  physicochemical: {
    iodine_value: { min: number; max: number; typical: number };
    titre_C: { min: number; max: number; typical: number };
    saponification_value: { min: number; max: number };
    smoke_point_C: { min: number; max: number };
    density_40C_g_ml: number;
    refractive_index_40C: number;
    OSI_temp_C: number;
    OSI_hours: { min: number; max: number; typical: number };
    shelf_life_days_2C: number;
    shelf_life_days_minus18C: number;
  };
  codex: {
    C16_0: [number, number];
    C18_0: [number, number];
    C18_1: [number, number];
    C18_2?: [number, number];
  };
  note: string;
  sourceUrl: string;
}

export interface DietPreset {
  id: string;
  label: string;
  source: string;
  url: string;
  // Absolute profile values (% of total fatty acids)
  absolute: Partial<FAProfile>;
  notes: string;
}

export interface RenderPreset {
  id: string;
  label: string;
  shortLabel: string;
  tempRangeC: string;
  delta: {
    C16_0?: number;
    C18_0?: number;
    C18_1?: number;
    C18_2?: number;
    C18_3?: number;
  };
  quality: {
    color: string;
    flavor: string;
    stability: string;
    vitamins: string;
  };
}

export const FAT_BASELINES: Record<FatTypeId, FatBaseline> = {
  beef_tallow: {
    id: "beef_tallow",
    name: "Beef Tallow",
    animal: "Bovine (ruminant)",
    default_profile: {
      C14_0: 4.0,
      C16_0: 27.0,
      C16_1: 3.5,
      C17_0: 1.0,
      C18_0: 16.0,
      C18_1: 42.0,
      C18_2: 3.5,
      C18_3: 0.4,
      other_fa: 2.6,
    },
    physicochemical: {
      iodine_value: { min: 40, max: 55, typical: 46 },
      titre_C: { min: 38, max: 50, typical: 44 },
      saponification_value: { min: 190, max: 202 },
      smoke_point_C: { min: 190, max: 215 },
      density_40C_g_ml: 0.9,
      refractive_index_40C: 1.459,
      OSI_temp_C: 120,
      OSI_hours: { min: 3, max: 8, typical: 5 },
      shelf_life_days_2C: 150,
      shelf_life_days_minus18C: 210,
    },
    codex: { C16_0: [20, 30], C18_0: [15, 30], C18_1: [30, 45] },
    note: "Ruminant biohydrogenation buffers dietary FA shifts. Codex STAN 211-1999 Premier Jus.",
    sourceUrl: "https://www.fao.org/4/w3963e/w3963e03.htm",
  },
  pork_lard: {
    id: "pork_lard",
    name: "Pork Lard",
    animal: "Porcine (monogastric)",
    default_profile: {
      C14_0: 1.7,
      C16_0: 24.5,
      C16_1: 2.8,
      C17_0: 0.3,
      C18_0: 13.5,
      C18_1: 42.5,
      C18_2: 11.0,
      C18_3: 0.9,
      other_fa: 2.8,
    },
    physicochemical: {
      iodine_value: { min: 52, max: 68, typical: 62 },
      titre_C: { min: 30, max: 43, typical: 36 },
      saponification_value: { min: 192, max: 203 },
      smoke_point_C: { min: 175, max: 205 },
      density_40C_g_ml: 0.9,
      refractive_index_40C: 1.454,
      OSI_temp_C: 100,
      OSI_hours: { min: 1, max: 3, typical: 2 },
      shelf_life_days_2C: 90,
      shelf_life_days_minus18C: 150,
    },
    codex: {
      C16_0: [20, 32],
      C18_0: [5, 24],
      C18_1: [35, 62],
      C18_2: [3, 16],
    },
    note: "Monogastric — adipose tissue directly mirrors dietary FA after 4–5 wk lag.",
    sourceUrl: "https://www.pig333.com/articles/lard-as-pig-feed-ingredient_16103/",
  },
};

export const TALLOW_DIET_PRESETS: DietPreset[] = [
  {
    id: "standard_mixed_commercial",
    label: "Standard Commercial (mixed)",
    source: "UC Davis feedlot ref / WHO FA table",
    url: "https://aqua.ucdavis.edu/sites/g/files/dgvnsk446/files/inline-files/12.pdf",
    absolute: {
      C14_0: 4.0,
      C16_0: 26.5,
      C16_1: 3.5,
      C17_0: 1.0,
      C18_0: 16.0,
      C18_1: 42.0,
      C18_2: 3.0,
      C18_3: 0.4,
      other_fa: 3.6,
    },
    notes: "Population-level average across temperate breeds. Default baseline.",
  },
  {
    id: "grass_pasture",
    label: "Grass-Fed / Pasture-Finished",
    source: "Weston A. Price Foundation / Univ. Illinois GC",
    url: "https://www.westonaprice.org/health-topics/know-your-fats/fatty-acid-analysis-of-grass-fed-and-grain-fed-beef-tallow/",
    absolute: {
      C14_0: 3.8,
      C16_0: 27.45,
      C16_1: 3.2,
      C17_0: 0.9,
      C18_0: 17.45,
      C18_1: 37.55,
      C18_2: 1.1,
      C18_3: 0.8,
      other_fa: 7.75,
    },
    notes: "Higher C18:0 (stearic). Lower PUFA. Better omega-3 / omega-6 ratio.",
  },
  {
    id: "grain_finished",
    label: "Grain-Finished (corn/soy feedlot)",
    source: "Weston A. Price / Univ. Illinois GC",
    url: "https://www.westonaprice.org/health-topics/know-your-fats/fatty-acid-analysis-of-grass-fed-and-grain-fed-beef-tallow/",
    absolute: {
      C14_0: 3.5,
      C16_0: 27.7,
      C16_1: 4.0,
      C17_0: 0.9,
      C18_0: 12.8,
      C18_1: 30.9,
      C18_2: 3.25,
      C18_3: 0.2,
      other_fa: 16.75,
    },
    notes: "Lower stearic; higher linoleic via grain. Softer, more variable.",
  },
  {
    id: "high_oleic_grain",
    label: "High-Oleic Grain (Wagyu / Akaushi)",
    source: "JAPSON Pon Yang Kham / Texas A&M Wagyu",
    url: "https://digicomst.ie/wp-content/uploads/2020/05/2018_06_49.pdf",
    absolute: {
      C14_0: 3.0,
      C16_0: 24.4,
      C16_1: 4.5,
      C17_0: 0.8,
      C18_0: 10.8,
      C18_1: 40.1,
      C18_2: 2.5,
      C18_3: 0.2,
      other_fa: 13.7,
    },
    notes: "FASN SNP–driven desaturation. Softer fat, higher C18:1, lower SFA.",
  },
];

export const LARD_DIET_PRESETS: DietPreset[] = [
  {
    id: "standard_corn_soy",
    label: "Standard Corn-Soy Grower",
    source: "pig333 FEDNA / NRC / INRA consensus",
    url: "https://www.pig333.com/articles/lard-as-pig-feed-ingredient_16103/",
    absolute: {
      C14_0: 1.7,
      C16_0: 24.5,
      C16_1: 2.8,
      C17_0: 0.3,
      C18_0: 13.5,
      C18_1: 42.5,
      C18_2: 11.0,
      C18_3: 0.9,
      other_fa: 2.8,
    },
    notes: "Industry-standard US/EU grower. Moderate linoleic from soy.",
  },
  {
    id: "high_unsaturated_ddgs",
    label: "High-DDGS / High-Linoleic",
    source: "Massey diet-tissue meta-analysis",
    url: "https://mro.massey.ac.nz/bitstreams/35b6d3a1-1730-46ca-8f39-559c0ad77ea3/download",
    absolute: {
      C14_0: 1.5,
      C16_0: 23.0,
      C16_1: 2.5,
      C17_0: 0.3,
      C18_0: 12.0,
      C18_1: 40.0,
      C18_2: 16.0,
      C18_3: 1.4,
      other_fa: 3.3,
    },
    notes: "Elevated PUFA. Soft belly, IV often >70, oxidation risk.",
  },
  {
    id: "high_oleic_hoso",
    label: "High-Oleic Sunflower (HOSO)",
    source: "PubMed 22056055 — HOSO pork study",
    url: "https://pubmed.ncbi.nlm.nih.gov/22056055/",
    absolute: {
      C14_0: 1.3,
      C16_0: 24.0,
      C16_1: 2.5,
      C17_0: 0.3,
      C18_0: 11.0,
      C18_1: 56.0,
      C18_2: 6.0,
      C18_3: 0.5,
      other_fa: -1.6,
    },
    notes: "M/S ratio in subcut fat 1.58→3.76. Softer, more stable than DDGS.",
  },
  {
    id: "pasture_free_range",
    label: "Pasture / Free-Range",
    source: "ITJFS lard comparison",
    url: "https://www.itjfs.com/index.php/ijfs/article/download/1962/643/9412",
    absolute: {
      C14_0: 1.6,
      C16_0: 24.5,
      C16_1: 2.8,
      C17_0: 0.3,
      C18_0: 13.0,
      C18_1: 44.0,
      C18_2: 9.0,
      C18_3: 1.1,
      other_fa: 3.7,
    },
    notes: "Intermediate profile, modest omega-3 lift vs indoor.",
  },
  {
    id: "palm_tallow_supplemented",
    label: "Palm / Tallow-Supplemented",
    source: "PMC12771593 (2026) palm oil trial",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12771593/",
    absolute: {
      C14_0: 1.8,
      C16_0: 25.5,
      C16_1: 2.6,
      C17_0: 0.3,
      C18_0: 14.5,
      C18_1: 43.0,
      C18_2: 9.0,
      C18_3: 0.7,
      other_fa: 2.6,
    },
    notes: "Firmer fat, preferred for bellies; lower IV vs corn-soy.",
  },
];

export const RENDER_PRESETS: RenderPreset[] = [
  {
    id: "wet_low_temp",
    label: "Wet Render (Low Temp 85–100 °C)",
    shortLabel: "Wet, low temp",
    tempRangeC: "85–100",
    delta: { C18_0: -1.0, C18_1: 1.5, C18_2: 0.3 },
    quality: {
      color: "Pale, near-white",
      flavor: "Neutral",
      stability: "Best PUFA retention",
      vitamins: "Water-soluble partially leached",
    },
  },
  {
    id: "dry_standard",
    label: "Dry Render (Standard 100–130 °C)",
    shortLabel: "Dry, standard",
    tempRangeC: "100–130",
    delta: {},
    quality: {
      color: "White to light cream",
      flavor: "Clean, mild animal",
      stability: "Baseline",
      vitamins: "Well retained",
    },
  },
  {
    id: "dry_high_temp",
    label: "Dry Render (High Temp 135–175 °C)",
    shortLabel: "Dry, high temp",
    tempRangeC: "135–175",
    delta: { C18_0: 0.5, C18_1: -2.0, C18_2: -0.8 },
    quality: {
      color: "Yellow to golden",
      flavor: "Toasted, pronounced",
      stability: "Reduced (PUFA oxidized)",
      vitamins: "CLA & vit-E partially degraded",
    },
  },
];

// Tuneable slider ranges for fine adjustments (percentage points)
export const FINE_TUNE_RANGES = {
  C16_0: { min: 18, max: 33, step: 0.5, label: "Palmitic (C16:0)" },
  C18_0: { min: 5, max: 25, step: 0.5, label: "Stearic (C18:0)" },
  C18_1: { min: 25, max: 60, step: 0.5, label: "Oleic (C18:1)" },
  C18_2: { min: 0.5, max: 20, step: 0.5, label: "Linoleic (C18:2)" },
};

export const PRIMARY_SOURCES: Array<{
  name: string;
  type: string;
  url: string;
  contribution: string;
}> = [
  {
    name: "FAO / Codex STAN 211-1999",
    type: "Official standard",
    url: "https://www.fao.org/4/w3963e/w3963e03.htm",
    contribution: "FA acceptance ranges, IV, titre, saponification limits",
  },
  {
    name: "Weston A. Price Foundation / Univ. Illinois GC (2016)",
    type: "GC analysis",
    url: "https://www.westonaprice.org/health-topics/know-your-fats/fatty-acid-analysis-of-grass-fed-and-grain-fed-beef-tallow/",
    contribution: "Grain vs grass tallow profiles",
  },
  {
    name: "Food Science of Animal Resources (PMC8728510, 2022)",
    type: "Peer-reviewed review",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8728510/",
    contribution: "Multi-study tallow SFA/MUFA/PUFA averages",
  },
  {
    name: "Journal of Animal Science 2026 (skaf436)",
    type: "Peer-reviewed, n=300+",
    url: "https://academic.oup.com/jas/article/doi/10.1093/jas/skaf436/8383911",
    contribution: "Grass vs grain variation, ALA, omega ratios",
  },
  {
    name: "pig333 FEDNA / NRC / INRA / CVB lard data",
    type: "Industry database",
    url: "https://www.pig333.com/articles/lard-as-pig-feed-ingredient_16103/",
    contribution: "Lard FA profile across 5 production systems",
  },
  {
    name: "International Journal of Food Science (ITJFS)",
    type: "Peer-reviewed",
    url: "https://www.itjfs.com/index.php/ijfs/article/download/1962/643/9412",
    contribution: "Native lard vs beef tallow comparison",
  },
  {
    name: "Myfoodresearch Indonesian rendering study",
    type: "Peer-reviewed",
    url: "https://www.myfoodresearch.com/uploads/8/4/8/5/84855864/_11__fr-2023-021_vera.pdf",
    contribution: "Rendering method effects on FA & physicochemistry",
  },
  {
    name: "JAPSON Beef Tallow Review (2021)",
    type: "Peer-reviewed",
    url: "https://japsonline.com/admin/php/uploads/3447_pdf.pdf",
    contribution: "IV / PV / AV / SV by rendering method",
  },
  {
    name: "PMC12771593 (2026)",
    type: "Peer-reviewed RCT",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12771593/",
    contribution: "Stearic acid / palm oil feed effects on lard",
  },
  {
    name: "PubMed HOSO study 22056055",
    type: "Peer-reviewed",
    url: "https://pubmed.ncbi.nlm.nih.gov/22056055/",
    contribution: "High-oleic feed effect on lard M/S ratio",
  },
  {
    name: "Wikipedia Iodine Value",
    type: "Reference",
    url: "https://en.wikipedia.org/wiki/Iodine_value",
    contribution: "IV calculation formula, per-FA constants",
  },
  {
    name: "Metrohm Rancimat AB-204",
    type: "Industry technical",
    url: "https://www.metrohm.com/content/dam/metrohm/shared/documents/application-bulletins/AB-204_3.pdf",
    contribution: "OSI / Rancimat values for tallow & lard",
  },
  {
    name: "IFRJ Storage Stability Study (2014)",
    type: "Peer-reviewed",
    url: "http://www.ifrj.upm.edu.my/21%20(04)%202014/34%20IFRJ%2021%20(04)%202014%20Flavia%20628.pdf",
    contribution: "Shelf life, IV change, storage stability",
  },
  {
    name: "WHO FA Composition Table",
    type: "WHO official",
    url: "https://cdn.who.int/media/docs/default-source/nutritionlibrary/replace-transfat/typical-fa-composition-of-some-edible-oils-and-fats.xlsx?sfvrsn=c37bc686_7",
    contribution: "Tallow / lard C16:0, C18:0, C18:1 reference",
  },
  {
    name: "PMC8746982 — Melting Study (2022)",
    type: "Peer-reviewed",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8746982/",
    contribution: "SMP, SFC, TAG composition vs melting",
  },
];
