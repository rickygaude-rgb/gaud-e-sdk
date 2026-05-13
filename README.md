# GAUD-E Developer SDK

[![GitHub Packages](https://img.shields.io/badge/registry-GitHub_Packages-181717?logo=github)](https://github.com/rickygaude-rgb/gaud-e-sdk/pkgs/npm/gaud-e-sdk)
[![License: Commercial](https://img.shields.io/badge/License-Commercial_Paid_Only-red.svg)](./LICENSE) [![No Modification](https://img.shields.io/badge/No-Modification-red)](./NOTICE.md)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/rickygaude-rgb/gaud-e-sdk/actions)
[![C++ Core](https://img.shields.io/badge/motor-C%2B%2B%2093%25-blue?logo=cplusplus)](https://github.com/rickygaude-rgb/C---Gps-2-Bim)
[![IFC Generation](https://img.shields.io/badge/IFC%20generation-~50ms-brightgreen)](https://github.com/rickygaude-rgb/C---Gps-2-Bim)
[![Performance](https://img.shields.io/badge/vs%20Python-40x%20faster-orange)](https://github.com/rickygaude-rgb/C---Gps-2-Bim)
[![Scientific Paper](https://img.shields.io/badge/📄_Scientific_Paper-2026-blueviolet?style=for-the-badge)](./paper/GAUD-E_Scientific_Paper_2026.pdf)
[![Official Site](https://img.shields.io/badge/🌐_Official_Site-gps--2--bim.app-00d2ff?style=for-the-badge)](https://www.gps-2-bim.app/)

**GAUD-E SDK** is a production-ready developer toolkit for integrating AI-powered BIM (Building Information Modeling) generation into your React applications. Generate complex architectural designs and building models from natural language prompts, visualize them in 3D, and export to industry-standard formats.

> **⚡ Powered by a native C++ motor (93% C++)** — IFC 2X3 generation in ~50ms, 40× faster than Python-based alternatives. The backend engine (`gaude-bridge`) runs as a local HTTP server on port 19724 and handles all geometry, IFC serialization, and CAD exports natively.

> ⚠️ **License Change Notice (v2.2.0 — May 2026):** This SDK is **no longer open source**. Licensed under the **GAUD-E Commercial License v1.0** (proprietary, paid-only). You may **NOT** use, copy, modify, or distribute without a signed paid commercial license from **contacto@gaud-e.ai**. PRs not accepted.

---

## 📄 Scientific Paper — Published Research

> ### **GAUD-E: A Native C++ Architecture for Real-Time AI-Driven BIM Generation from Natural Language and Geospatial Inputs**
>
> Published research describing the 7-agent pipeline, C++ engine architecture (40× faster than Python-based alternatives), IFC 2X3 generation methodology, and validation against industry benchmarks.
>
> 📖 **Read the full paper:** [GAUD-E_Scientific_Paper_2026.pdf](./paper/GAUD-E_Scientific_Paper_2026.pdf)
> 📊 **Highlights:** ~50ms IFC generation · 7 specialized AI agents · parallel execution in Phase 2 · multi-format export (IFC/Revit/Rhino/ArchiCAD)
> 📧 **Author contact:** contacto@gaud-e.ai

---

## 📦 Installation — Paid License Required

> ⚠️ **Signed commercial license required** before install/use.
> Contact **contacto@gaud-e.ai** for pricing.

The SDK is hosted on **GitHub Packages** (not NPM).

```bash
# Step 1: GitHub PAT with scope read:packages (github.com/settings/tokens/new)
echo "//npm.pkg.github.com/:_authToken=YOUR_PAT" >> ~/.npmrc
echo "@rickygaude-rgb:registry=https://npm.pkg.github.com" >> ~/.npmrc

# Step 2: Install
npm install @rickygaude-rgb/gaud-e-sdk

# Step 3: Use
# import { GaudeMapSelector, useGaude } from '@rickygaude-rgb/gaud-e-sdk'
```

---

## Architecture

```
GAUD-E Platform — C++ Native Motor + 7-Agent AI Pipeline
│
├── 🔧 C++ Native Bridge (gaude-bridge) — Port 19724
│   ├── gps2bim      → IFC 2X3 generation   (~50ms, 40× faster than Python)
│   ├── gaude-pipeline → 7-agent Claude API  (parallel execution)
│   └── Exporters:   IFC / Revit / Rhino / Grasshopper / ArchiCAD
│
├── Phase 1: Architectural Design
│   ├── ✨ Agent 1 — Instruction Enhancer (CoT prompt optimization)
│   └── 🏗️  Agent 2 — Architect (spatial layout, roofs, furniture)
│
├── Phase 2: Engineering Systems (parallel execution)
│   ├── 🔩 Agent 3 — Structural Engineer (beams, foundations, bracing)
│   ├── ⚡ Agent 4 — MEP Engineer (plumbing, electrical, HVAC, fire)
│   └── 🌿 Agent 5 — Landscape Architect (vegetation, hardscape, site)
│
├── Phase 3: BIM Consolidation
│   └── 💻 Agent 6 — BIM Programmer (unified JSON BIM schema)
│
├── Phase 4: Quality Assurance
│   └── ✓  Agent 7 — Quality Reviewer (validation + IFC export via C++)
│
└── Output Formats (all via C++ exporters)
    ├── IFC 2X3    — Revit / ArchiCAD / BIM-native
    ├── glTF/GLB   — Three.js / web viewer
    ├── 3DM        — Rhino / Rhino.Compute
    └── JSON BIM   — structural, architectural, MEP, landscape
```

**C++ Motor Repository:** [github.com/rickygaude-rgb/C---Gps-2-Bim](https://github.com/rickygaude-rgb/C---Gps-2-Bim)
**Live Platform:** [https://www.gps-2-bim.app/](https://www.gps-2-bim.app/) (production) · [https://gaud-e-gps2bim-web.vercel.app](https://gaud-e-gps2bim-web.vercel.app) (preview)

**All AI processing happens on GAUD-E's secure cloud platform.** The SDK is a lightweight wrapper that routes requests through `api.gaude.ai`. The C++ motor runs locally for maximum performance—no round-trips for geometry computation.

## How It Works — From Address to Full Project, in Minutes

GAUD-E is not just a "BIM generator." It's a complete design platform that turns your idea into a delivered project. Here is the end-to-end workflow:

### 1. Anchor your project in the real world

Enter an **address** or coordinates, then **draw the polygon** of your site directly on the **satellite map**. GAUD-E pulls real-world context automatically: terrain elevation, solar exposure, climate data, surrounding buildings, zoning rules, and utility access. No more designing in a vacuum — your project starts grounded in measured reality.

### 2. Describe your idea — your way

Feed the platform anything that helps it understand your vision:

- **Natural-language prompts** — *"a three-story bioclimatic clinic with two surgery rooms and a green roof"*
- **Reference files** — sketches, hand drawings, mood boards, PDFs of programmatic briefs, photos, existing CAD/DWG
- **Project data** — square meters per room, materials palette, budget caps, normative constraints, client preferences
- **Negative prompts** to steer the AI away from styles you don't want

You stay in the language of design and intent. GAUD-E translates that into geometry, materials, and engineering.

### 3. Connect to your tool of choice

GAUD-E speaks the language of every major professional design suite via MCP bridges:

| Software | What you get |
|----------|--------------|
| **Revit** | Native families and parameters, ready to schedule and document |
| **ArchiCAD** | GDL objects + IFC import, full library integration |
| **Rhino + Grasshopper** | Parametric definitions, live recompute, NURBS surfaces |
| **SketchUp** | Editable components and groups, materials preserved |
| **AutoCAD** | DWG plans, sections, elevations, layered and dimensioned |
| **Vectorworks** | Native objects with metadata |

One JSON BIM model — every authoring tool. Edit in your software, push back, keep iterating.

### 4. Get everything a project needs — at once

From a single generation run you receive a complete project deliverable set:

- **2D drawings** — floor plans, sections, elevations, façades, urban context, technical details
- **3D models** — IFC, glTF/GLB, photorealistic renders, navigable walkthroughs
- **MEP systems** — sanitary, water, electrical, HVAC, gas, fire protection — sized and traced
- **Structural calculations** — beam/column/foundation design, load analysis, calculation memorandum (NCh 433, ACI 318, Eurocódigo, ASCE 7)
- **Energy & environmental analysis** — thermal performance, daylight, ventilation, U-values, carbon footprint, LEED / Passivhaus prechecks
- **Quantity takeoffs & cost estimates** — itemized BOQ, unit prices, total CAPEX, S-curve cashflow
- **Regulatory & permitting docs** — compliance checks against local urban codes (OGUC, plano regulador, IBC, etc.)

### The GAUD-E Promise

> **Master years of specialist software in minutes, by speaking design.**

Revit, ArchiCAD, Rhino, Grasshopper, Civil 3D, AutoCAD — each tool normally takes a career to master. GAUD-E lets you **control them all** through real-world data and natural language. You bring the architectural vision; the platform handles the complex software manipulation for you.

The result: a newcomer ships work that looks and behaves like the output of a senior professional with twenty years at the desk. An experienced architect ships **ten times faster**, with engineering, MEP, energy and budget already integrated and coordinated from the first iteration.

**You stop fighting the tools. You start building ideas.**

---

## Features

- ⚡ **C++ Native Motor (93% C++)** — IFC 2X3 generation in ~50ms, 40× faster than Python (`gaude-bridge` on port 19724)
- 🎯 **Natural Language BIM Generation** - Describe buildings in plain English
- 🎨 **Multiple Design Styles** - Minimalist, Bioclimatic, Parametric, Neoclassic, Industrial, and more
- 🌍 **Terrain Selection** - Draw polygons on Google Maps to set your project location
- 📊 **Real-time Progress** - Monitor 7-agent pipeline across 4 phases with parallel engineering execution
- 🔴 **3D Visualization** - Interactive Three.js viewer with multiple render modes (realistic, wireframe, xray)
- 📤 **Multi-format Export** — IFC 2X3 (Revit/ArchiCAD), glTF/GLB, 3DM (Rhino) — all via native C++ exporters
- 🔗 **Software Integration** - Connect to Revit, ArchiCAD, Rhino, SketchUp via MCP
- ⚡ **React Hooks** - `useGaude`, `useBIMViewer` for seamless state management
- 🛡️ **Secure by Design** - API keys never exposed in client code, rate limiting, error handling
- 📦 **TypeScript Ready** - Full type definitions included

## Quick Start

### 1. Install

```bash
npm install @gaude/sdk
# or
yarn add @gaude/sdk
```

### 2. Get Your API Key

1. Visit https://platform.gaude.ai
2. Sign up and create an API key
3. Add to `.env`:

```env
VITE_GAUD_E_API_KEY=gde_your_api_key_here
VITE_GAUD_E_API_URL=https://api.gaude.ai/v1
VITE_GOOGLE_MAPS_KEY=your_google_maps_key_here
```

### 3. Generate Your First BIM Model

```jsx
import React, { useState } from 'react';
import { useGaude, GaudePromptInput, GaudeBIMViewer } from '@gaude/sdk';

function App() {
  const [model, setModel] = useState(null);
  const { generateBIM, getModel, generating } = useGaude(
    process.env.VITE_GAUD_E_API_KEY
  );

  const handleGenerate = async (promptData) => {
    const jobId = await generateBIM({
      prompt: promptData.prompt,
      conceptStyle: promptData.conceptStyle,
    });

    // Poll status and get model...
    const generatedModel = await getModel(modelId);
    setModel(generatedModel);
  };

  return (
    <div className="flex gap-6">
      <GaudePromptInput onSubmit={handleGenerate} loading={generating} />
      {model && <GaudeBIMViewer model={model} />}
    </div>
  );
}

export default App;
```

## Architecture

```
┌──────────────────────────────────────────────────┐
│         Your React Application                   │
├──────────────────────────────────────────────────┤
│  GAUD-E SDK (NPM Package)                        │
│  ├─ GaudeClient (API wrapper)                    │
│  ├─ React Hooks (useGaude, useBIMViewer)         │
│  ├─ Components (Viewer, Prompt, Map, Status)     │
│  └─ Utilities (Schema, Materials, Geometry)      │
├──────────────────────────────────────────────────┤
│  GAUD-E Platform API — 7-Agent Pipeline          │
│  ├─ Phase 1: Enhancer → Architect                │
│  ├─ Phase 2: Structural ∥ MEP ∥ Landscape       │
│  ├─ Phase 3: BIM Programmer (consolidation)      │
│  ├─ Phase 4: Quality Reviewer (validation)       │
│  └─ BIM Database + IFC Export Engine             │
└──────────────────────────────────────────────────┘
  Live: https://www.gps-2-bim.app
  API:  https://api.gaude.ai/v1
```

## API Usage Examples

### Generate BIM Model

```javascript
import { GaudeClient } from '@gaude/sdk';

const client = new GaudeClient(process.env.VITE_GAUD_E_API_KEY);

// Start generation
const job = await client.generateBIM(
  'Modern office building with 15 floors and glass facade',
  {
    conceptStyle: 'Minimalist',
    negativePrompt: 'avoid brutalism',
    polygon: [[40.7128, -74.0060], ...], // Terrain bounds
  }
);

console.log(job.jobId); // Track progress
```

### Monitor Progress

```javascript
// Check status periodically
const status = await client.getGenerationStatus(jobId);
console.log(status.progress); // 0-100
console.log(status.agentProgress); // { enhancer, architect, structural, mep, landscape, programmer, reviewer }

if (status.status === 'completed') {
  const model = await client.getModel(status.modelId);
}
```

### Export Models

```javascript
// Export to IFC (Revit compatible)
const ifcBlob = await client.exportIFC(modelId);
const url = URL.createObjectURL(ifcBlob);
// Download...

// Export to glTF (Web viewing)
const gltfBlob = await client.exportGLTF(modelId, { format: 'glb' });
```

### Check Credits

```javascript
const credits = await client.getCredits();
console.log(`Credits remaining: ${credits.creditsRemaining}`);
console.log(`Tier: ${credits.tier}`); // free, pro, enterprise
```

## React Components

### GaudeBIMViewer

Interactive 3D model viewer with render modes and layer controls.

```jsx
<GaudeBIMViewer
  model={bimModel}
  renderMode="realistic" // realistic | wireframe | xray
  apiKey={apiKey}
  visibleLayers={{ structure: true, mep: false }}
/>
```

### GaudeMapSelector

Draw terrain polygon on Google Maps.

```jsx
<GaudeMapSelector
  onPolygonComplete={(coordinates) => console.log(coordinates)}
  apiKey={googleMapsKey}
  center={{ lat: 40.7128, lng: -74.0060 }}
/>
```

### GaudePromptInput

Natural language prompt entry with style selector.

```jsx
<GaudePromptInput
  onSubmit={(prompt) => generateBIM(prompt)}
  loading={isGenerating}
  showNegativePrompt={true}
/>
```

### GaudeGenerationStatus

Real-time pipeline progress visualization.

```jsx
<GaudeGenerationStatus
  jobId={jobId}
  apiKey={apiKey}
  onComplete={(status) => setModel(status.modelId)}
/>
```

## React Hooks

### useGaude

```javascript
const {
  generateBIM,      // (prompt, options) => jobId
  getModel,         // (modelId) => model
  exportModel,      // (modelId, format) => blob
  generating,       // boolean
  progress,         // 0-100
  error,            // string | null
  jobId,            // current job ID
  getCredits,       // () => credits info
  ready             // client initialized
} = useGaude(apiKey);
```

### useBIMViewer

```javascript
const {
  elements,              // all BIM elements
  renderMode,            // current render mode
  visibleLayers,         // layer visibility map
  selectedElement,       // currently selected element
  toggleLayer,           // (layerName) => void
  setRenderMode,         // (mode) => void
  selectElement,         // (element) => void
  getElementsByType,     // (type) => elements[]
  getStats,              // () => stats
  getBoundingBox,        // () => bbox
  RENDER_MODES,          // { REALISTIC, WIREFRAME, XRAY }
  LAYER_CATEGORIES       // { STRUCTURE, ARCHITECTURE, MEP, LANDSCAPE }
} = useBIMViewer(bimModel);
```

## Documentation

- **[Quick Start Guide](./docs/QUICKSTART.md)** - Get started in 5 minutes
- **[API Reference](./docs/API_REFERENCE.md)** - Complete API documentation
- **[BIM JSON Schema](./docs/JSON_BIM_SCHEMA.md)** - Model structure specification
- **[Examples](./examples/)** - Complete working examples
  - `basic-usage.jsx` - Full workflow demo
  - `nextjs-integration.jsx` - Next.js integration with server-side API key

## Concept Styles

Choose from multiple architectural design styles:

- **Minimalist** - Clean, simple forms with minimal ornamentation
- **Bioclimatic** - Climate-responsive design with natural ventilation
- **Industrial** - Raw, functional aesthetics with exposed structure
- **Parametric** - Rule-based algorithmic geometry
- **Neoclassic** - Classical proportions and symmetry
- **Sustainable** - Eco-friendly materials and features
- **Futuristic** - Cutting-edge contemporary design
- **Vernacular** - Local architectural traditions

## Security

✓ **API keys never exposed to client** - Use environment variables
✓ **Rate limiting** - 100 requests/minute per key
✓ **Secure webhooks** - Optional real-time job notifications
✓ **No generation code exposed** - All processing server-side
✓ **Request signing** - Bearer token authentication
✓ **Audit logs** - Track all API activity

For production:
- Store API keys in backend environment variables
- Use next.js or similar to proxy API calls through your server
- Implement user authentication and rate limiting at your layer

See `examples/nextjs-integration.jsx` for secure backend pattern.

## Supported Export Formats

| Format | Use Case | Software |
|--------|----------|----------|
| **IFC** | Industry standard BIM exchange | Revit, ArchiCAD, BIMx |
| **glTF/GLB** | Web 3D visualization | Three.js, Babylon.js, Cesium |
| **JSON** | Programmatic access | Custom tools, analysis |

## Software Integration

Connect to professional CAD/BIM software:

```javascript
// Connect to Revit
await client.connectSoftware('revit', 9090);

// Supported: revit, archicad, rhino, sketchup, autocad, vectorworks
```

Real-time bidirectional sync via MCP (Model Connection Protocol).

## Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

```bash
# Development setup
git clone https://github.com/rickygaude-rgb/gaud-e-sdk.git
cd gaud-e-sdk
npm install
npm run dev

# Run tests
npm test

# Build
npm run build
```

## Performance

- **Typical generation time:** 1-2 minutes
- **Streaming status updates:** Every 2-5 seconds
- **3D viewer:** 60 FPS on modern hardware
- **Export:** 30s-2 min depending on model complexity

## Limitations

- Maximum 100 storeys per model
- Maximum 100,000 elements per model
- Maximum 100MB per export file
- Rate limit: 100 requests/minute

## Troubleshooting

**Q: API Key validation fails**
A: Ensure key starts with `gde_` and is from https://platform.gaude.ai/api-keys

**Q: Generation timeout**
A: Check `client.getJobLogs(jobId)` for details. Typical time is 1-2 minutes.

**Q: Map not loading**
A: Verify Google Maps API key is correct and Maps API is enabled.

**Q: Out of credits**
A: Check usage at https://platform.gaude.ai/account/usage

## License

**Elastic License 2.0 (ELv2)** © 2026 Ricardo Riffo — GAUD-E / GPS2BIM

See [LICENSE](./LICENSE) file for full terms.

**In summary:**
- ✅ You can use, modify, and distribute this SDK in your own applications
- ✅ You can build commercial products that call the GAUD-E API
- ❌ You may **not** offer this SDK or a derivative as a competing hosted/managed service
- ❌ You may **not** remove or bypass license/copyright notices

For commercial licensing or enterprise agreements: contacto@gaud-e.ai

> **Prior version notice:** v2.0.0 was released under MIT. That version remains
> under MIT for those who downloaded it before 2026-05-07. All subsequent
> versions (v2.0.1+) are governed by ELv2. See [NOTICE.md](./NOTICE.md).

## Support

- 📧 **Email:** contacto@gaud-e.ai
- 💬 **Discord:** https://discord.gg/gaude
- 📖 **Docs:** https://docs.gaude.ai
- 🐛 **Issues:** https://github.com/rickygaude-rgb/gaud-e-sdk/issues
- 📊 **Status:** https://status.gaude.ai

## Related Resources

- [GAUD-E Platform](https://platform.gaude.ai)
- [GAUD-E Research Paper](https://github.com/rickygaude-rgb/gaud-e-sdk/blob/main/paper/GAUD-E_Scientific_Paper_2026.pdf)
- [Building Smart IFC Standard](https://www.buildingsmart.org/)
- [Three.js Documentation](https://threejs.org/)
- [glTF Specification](https://www.khronos.org/gltf/)

---

Made with ❤️ by GAUD-E Architect AI

**API Routes All Generation Through:** `https://api.gaude.ai/v1`
