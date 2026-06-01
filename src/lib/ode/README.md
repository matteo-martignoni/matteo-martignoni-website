# OdE — motore di simulazione

Logica di dominio per la dashboard **AMSA LIVE**. Tutto client-side, zero
dipendenze, riusabile in Astro statico.

## Provenienza

`fa-engine.ts` e `fatty-acid-data.ts` sono portati **verbatim** dal repository
[`matteo-martignoni/fatty-acid-simulator`](https://github.com/matteo-martignoni/fatty-acid-simulator)
(TypeScript puro, nessuna dipendenza React/server). Entry point unico:

```ts
import { computeScenario } from './fa-engine';
const result = computeScenario({ fatType: 'beef_tallow', dietId: '...', renderId: '...' });
```

Calcola: profilo acidi grassi, totali SFA/MUFA/PUFA, iodine value, slip point,
tier di stabilità ossidativa, flag Codex (PV ≤ 10 meq O₂/kg), idoneità d'uso.

## Layer AMSA aggiunti sopra il motore

Per simulare in modo pedagogico e plausibile l'attività dell'agente AMSA,
attorno a `computeScenario` si costruiscono due strati (vedi PLAN.md, Fase 4):

- **`spectrum.ts`** (a monte): genera uno spettro NIR/Raman sintetico plausibile
  dal profilo lipidico (bande C-H, carbonile estere ~1745 cm⁻¹, insaturi
  ~3010 cm⁻¹) con rumore e baseline simulati. Mostra l'Active Control Loop.
- **`passport.ts`** (a valle): assembla il Passaporto Lipidico Digitale (le 9
  sezioni del pitch AMSA) + decisione industriale + Oxidative Risk Score 0–100.

> ⚠️ Tutti i dati prodotti sono **SIMULAZIONE DIMOSTRATIVA**, non misure reali.
> La UI deve dichiararlo esplicitamente (vincolo di committenza).
