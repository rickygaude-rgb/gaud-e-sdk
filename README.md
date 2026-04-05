# GAUD-E Developer SDK

[![NPM Version](https://img.shields.io/npm/v/gaud-e-sdk)](https://www.npmjs.com/package/gaud-e-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/rickygaude-rgb/gaud-e-sdk/actions)
[![Code Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen)](https://github.com/rickygaude-rgb/gaud-e-sdk)

**GAUD-E SDK** is an open-source, production-ready developer toolkit for integrating AI-powered BIM (Building Information Modeling) generation into your React applications. Generate complex architectural designs and building models from natural language prompts, visualize them in 3D, and export to industry-standard formats.

```
GAUD-E Platform API
Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂ 4-Agent Pipeline
Ã¢ÂÂ   Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂ Ã¢ÂÂ¨ Enhancer (prompt optimization)
Ã¢ÂÂ   Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂ Ã°ÂÂÂÃ¯Â¸Â  Architect (design generation)
Ã¢ÂÂ   Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂ Ã°ÂÂÂ» Programmer (BIM geometry)
Ã¢ÂÂ   Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂ Ã¢ÂÂ  Reviewer (validation)
Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂ JSON BIM Output
    Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂ Structural elements
    Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂ Architectural features
    Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂ MEP systems
    Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂ Landscape/site
```

**All processing happens on GAUD-E's secure cloud platform.** The SDK is a lightweight wrapper that routes requests through `api.gaude.ai`. No proprietary generation code is exposedÃ¢ÂÂdevelopers get a clean, secure API.

## Features

- Ã°ÂÂÂ¯ **Natural Language BIM Generation** - Describe buildings in plain English
- Ã°ÂÂÂ¨ **Multiple Design Styles** - Minimalist, Bioclimatic, Parametric, Neoclassic, Industrial, and more
- Ã°ÂÂÂ **Terrain Selection** - Draw polygons on Google Maps to set your project location
- Ã°ÂÂÂ **Real-time Progress** - Monitor 4-agent pipeline: Enhancer Ã¢ÂÂ Architect Ã¢ÂÂ Programmer Ã¢ÂÂ Reviewer
- Ã°ÂÂÂ´ **3D Visualization** - Interactive Three.js viewer with multiple render modes (realistic, wireframe, xray)
- Ã°ÂÂÂ¤ **Multi-format Export** - IFC (Revit/ArchiCAD compatible), glTF/GLB, and more
- Ã°ÂÂÂ **Software Integration** - Connect to Revit, ArchiCAD, Rhino, SketchUp via MCP
- Ã¢ÂÂ¡ **React Hooks** - `useGaude`, `useBIMViewer` for seamless state management
- Ã°ÂÂÂ¡Ã¯Â¸Â **Secure by Design** - API keys never exposed in client code, rate limiting, error handling
- Ã°ÂÂÂ¦ **TypeScript Ready** - Full type definitions included

## Quick Start

### 1. Install

```bash
npm install gaud-e-sdk
# or
yarn add gaud-e-sdk
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
import { useGaude, GaudePromptInput, GaudeBIMViewer } from 'gaud-e-sdk';

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
Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
Ã¢ÂÂ      Your React Application         Ã¢ÂÂ
Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ¤
Ã¢ÂÂ  GAUD-E SDK (NPM Package)           Ã¢ÂÂ
Ã¢ÂÂ  Ã¢ÂÂÃ¢ÂÂ GaudeClient (API wrapper)       Ã¢ÂÂ
Ã¢ÂÂ  Ã¢ÂÂÃ¢ÂÂ React Hooks (useGaude, etc.)    Ã¢ÂÂ
Ã¢ÂÂ  Ã¢ÂÂÃ¢ÂÂ Components (Viewer, Prompt)     Ã¢ÂÂ
Ã¢ÂÂ  Ã¢ÂÂÃ¢ÂÂ Utilities (Schema, Materials)   Ã¢ÂÂ
Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ¤
Ã¢ÂÂ  GAUD-E Platform API                Ã¢ÂÂ
Ã¢ÂÂ  Ã¢ÂÂÃ¢ÂÂ Enhancer Agent                  Ã¢ÂÂ
Ã¢ÂÂ  Ã¢ÂÂÃ¢ÂÂ Architect Agent                 Ã¢ÂÂ
Ã¢ÂÂ  Ã¢ÂÂÃ¢ÂÂ Programmer Agent                Ã¢ÂÂ
Ã¢ÂÂ  Ã¢ÂÂÃ¢ÂÂ Reviewer Agent                  Ã¢ÂÂ
Ã¢ÂÂ  Ã¢ÂÂÃ¢ÂÂ BIM Database                    Ã¢ÂÂ
Ã¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂÃ¢ÂÂ
    All calls to: api.gaude.ai/v1
```

## API Usage Examples

### Generate BIM Model

```javascript
import { GaudeClient } from 'gaud-e-sdk';

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
console.log(status.agentProgress); // { enhancer, architect, programmer, reviewer }

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

Ã¢ÂÂ **API keys never exposed to client** - Use environment variables
Ã¢ÂÂ **Rate limiting** - 100 requests/minute per key
Ã¢ÂÂ **Secure webhooks** - Optional real-time job notifications
Ã¢ÂÂ **No generation code exposed** - All processing server-side
Ã¢ÂÂ **Request signing** - Bearer token authentication
Ã¢ÂÂ **Audit logs** - Track all API activity

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

## Developer

**Ricardo Riffo Q.**
Arquitecto Urbanista | MagÃÂ­ster en Inteligencia Artificial | Experto en Evaluaciones EnergÃÂ©ticas y Medioambiente

Desarrollador de productos de IA para IngenierÃÂ­a, Arquitectura y Salud.

- Ã°ÂÂÂÃ¯Â¸Â **Especialidades:** DiseÃÂ±o ArquitectÃÂ³nico ParamÃÂ©trico, BIM, Urbanismo, Smart Cities
- Ã°ÂÂ¤Â **IA Aplicada:** Modelos multiagente, generaciÃÂ³n 3D desde lenguaje natural, Computer Vision
- Ã°ÂÂÂ± **Sustentabilidad:** Certificaciones LEED, Passivhaus, evaluaciÃÂ³n de impacto ambiental
- Ã°ÂÂÂ¥ **Salud:** Soluciones de IA para infraestructura hospitalaria y bienestar

## License

MIT ÃÂ© 2026 Ricardo Riffo Q. Ã¢ÂÂ GAUD-E Architect AI

See [LICENSE](./LICENSE) file for details.

## Support

- Ã°ÂÂÂ§ **Email:** support@gaude.ai
- Ã°ÂÂÂ¬ **Discord:** https://discord.gg/gaude
- Ã°ÂÂÂ **Docs:** https://docs.gaude.ai
- Ã°ÂÂÂ **Issues:** https://github.com/rickygaude-rgb/gaud-e-sdk/issues
- Ã°ÂÂÂ **Status:** https://status.gaude.ai

## Related Resources

- [GAUD-E Platform](https://platform.gaude.ai)
- [GAUD-E Research Paper](https://arxiv.org/abs/2404.xxxxx)
- [Building Smart IFC Standard](https://www.buildingsmart.org/)
- [Three.js Documentation](https://threejs.org/)
- [glTF Specification](https://www.khronos.org/gltf/)

---

Developed by **Ricardo Riffo Q.** Ã¢ÂÂ Arquitecto Urbanista, MagÃÂ­ster en IA

Made with Ã¢ÂÂ¤Ã¯Â¸Â by GAUD-E Architect AI

**API Routes All Generation Through:** `https://api.gaude.ai/v1`