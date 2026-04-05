# GAUD-E SDK API Reference

Complete API documentation for GAUD-E Client, Hooks, and Components.

## Table of Contents

1. [GaudeClient](#gaudeclient) - Core API client
2. [Hooks](#hooks) - React hooks for state management
3. [Components](#components) - Pre-built React UI components
4. [Utilities](#utilities) - Schema validation and materials
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)

---

## GaudeClient

Main API client for communicating with GAUD-E Platform.

### Constructor

```javascript
const client = new GaudeClient(apiKey, baseUrl);
```

**Parameters:**
- `apiKey` (string, required): GAUD-E API key (format: `gde_...`)
- `baseUrl` (string, optional): API base URL (default: `https://api.gaude.ai/v1`)

**Example:**
```javascript
import { GaudeClient } from '@gaude/sdk';

const client = new GaudeClient('gde_your_api_key');
```

### Methods

#### generateBIM(prompt, options)

Generate a BIM model from natural language prompt.

**Signature:**
```javascript
generateBIM(prompt: string, options?: object): Promise<object>
```

**Parameters:**
```javascript
{
  prompt: "5-story modern office building with atrium",
  negativePrompt: "avoid brutalism, no flat roof",
  polygon: [[40.7128, -74.0060], ...],
  conceptStyle: "Minimalist",
  generationParams: {
    detailLevel: "standard",
    iterations: 1,
    seed: null
  }
}
```

**Returns:**
```javascript
{
  jobId: "job_abc123xyz",
  status: "queued",
  createdAt: "2026-04-03T10:00:00Z",
  estimatedTime: 120 // seconds
}
```

**Example:**
```javascript
const job = await client.generateBIM(
  'Modern residential tower with 30 floors',
  {
    conceptStyle: 'Minimalist',
    generationParams: { detailLevel: 'detailed' }
  }
);
console.log(job.jobId); // Use for tracking progress
```

#### getGenerationStatus(jobId)

Check status of a BIM generation job.

**Signature:**
```javascript
getGenerationStatus(jobId: string): Promise<object>
```

**Returns:**
```javascript
{
  jobId: "job_abc123xyz",
  status: "running", // queued, running, completed, failed
  progress: 65,
  modelId: "mdl_xyz789abc",
  agentProgress: {
    enhancer: "completed",
    architect: "running",
    programmer: "pending",
    reviewer: "pending"
  },
  elapsedTime: "45s",
  estimatedTimeRemaining: "1m 30s"
}
```

**Example:**
```javascript
const status = await client.getGenerationStatus(jobId);
if (status.status === 'completed') {
  console.log('Done! Model ID:', status.modelId);
}
```

#### getModel(modelId)

Retrieve a generated BIM model as JSON.

**Signature:**
```javascript
getModel(modelId: string): Promise<object>
```

**Returns:**
```javascript
{
  metadata: {
    name: "Office Building",
    version: "1.0.0",
    created: "2026-04-03T10:00:00Z",
    location: { latitude: 40.7128, longitude: -74.0060 }
  },
  building: {
    name: "Office Tower",
    type: "commercial",
    storeys: [...],
    totalArea: 15000
  }
}
```

**Example:**
```javascript
const model = await client.getModel('mdl_xyz789abc');
console.log(model.building.totalArea); // Total floor area
```

#### exportIFC(modelId, options)

Export BIM model to IFC (Industry Foundation Classes) format.

**Signature:**
```javascript
exportIFC(modelId: string, options?: object): Promise<Blob>
```

**Options:**
```javascript
{
  includeMetadata: true  // Include all metadata
}
```

**Returns:** Blob containing IFC file data

**Example:**
```javascript
const ifcBlob = await client.exportIFC('mdl_xyz789abc');
const url = URL.createObjectURL(ifcBlob);
const a = document.createElement('a');
a.href = url;
a.download = 'model.ifc';
a.click();
```

#### exportGLTF(modelId, options)

Export BIM model to glTF/GLB format for 3D web viewing.

**Signature:**
```javascript
exportGLTF(modelId: string, options?: object): Promise<Blob>
```

**Options:**
```javascript
{
  format: "glb"  // "gltf" or "glb"
}
```

**Returns:** Blob containing glTF file data

#### generateConceptImage(prompt, style)

Generate a 2D rendering/concept image of the BIM model.

**Signature:**
```javascript
generateConceptImage(prompt: string, style?: string): Promise<object>
```

**Styles:** Photorealistic, Sketch, Wireframe, Technical, Artistic, Minimalist

**Returns:**
```javascript
{
  jobId: "img_job_123",
  imageUrl: "https://...",
  status: "completed"
}
```

#### connectSoftware(software, port)

Connect GAUD-E to external CAD/BIM software via MCP.

**Signature:**
```javascript
connectSoftware(software: string, port?: number): Promise<object>
```

**Supported Software:**
- revit
- archicad
- rhino
- sketchup
- autocad
- vectorworks

**Returns:**
```javascript
{
  status: "connected",
  software: "revit",
  port: 9090,
  token: "conn_abc123"
}
```

#### getCredits()

Get account credit usage and remaining balance.

**Signature:**
```javascript
getCredits(): Promise<object>
```

**Returns:**
```javascript
{
  creditsRemaining: 1500,
  creditsUsed: 500,
  creditLimit: 2000,
  resetDate: "2026-05-03",
  tier: "pro"
}
```

#### listModels(page, limit)

List all models in the account.

**Signature:**
```javascript
listModels(page?: number, limit?: number): Promise<object>
```

**Returns:**
```javascript
{
  models: [
    {
      id: "mdl_123",
      name: "Office Building",
      createdAt: "2026-04-03T10:00:00Z",
      area: 15000
    }
  ],
  total: 42,
  page: 1,
  pages: 3
}
```

#### getCapabilities()

Get information about available generation capabilities.

**Signature:**
```javascript
getCapabilities(): Promise<object>
```

**Returns:**
```javascript
{
  conceptStyles: ["Minimalist", "Bioclimatic", ...],
  elementTypes: ["wall", "column", "window", ...],
  maxStoreys: 100,
  maxArea: 100000
}
```

---

## Hooks

React hooks for managing GAUD-E state and generation.

### useGaude(apiKey, options)

Main hook for BIM generation workflow.

**Signature:**
```javascript
const {
  client,
  generating,
  progress,
  error,
  jobId,
  generationResult,
  generateBIM,
  getModel,
  cancelGeneration,
  exportModel,
  getCredits,
  pollJobStatus,
  ready
} = useGaude(apiKey, options);
```

**Parameters:**
```javascript
{
  apiKey: "gde_...",
  baseUrl: "https://api.gaude.ai/v1",
  pollingInterval: 2000  // ms between status checks
}
```

**Returns:**
- `client`: GaudeClient instance
- `generating`: boolean - Currently generating
- `progress`: number - 0-100
- `error`: string - Error message if any
- `jobId`: string - Current job ID
- `generationResult`: object - Final result with model
- `generateBIM`: function - Start generation
- `getModel`: function - Fetch model by ID
- `cancelGeneration`: function - Stop current generation
- `exportModel`: function - Export to IFC/glTF
- `getCredits`: function - Check account credits
- `ready`: boolean - Client initialized

**Example:**
```javascript
const { generateBIM, progress, generationResult } = useGaude(apiKey);

await generateBIM({
  prompt: 'Modern office',
  conceptStyle: 'Minimalist'
});

console.log(`Progress: ${progress}%`);
if (generationResult) {
  console.log('Model ready:', generationResult.model);
}
```

### useBIMViewer(bimModel, options)

Manage 3D viewer state and layer visibility.

**Signature:**
```javascript
const {
  elements,
  layers,
  renderMode,
  selectedElement,
  visibleLayers,
  highlightMode,
  highlightFilter,
  toggleLayer,
  setLayerVisibility,
  toggleAllLayers,
  selectElement,
  deselectElement,
  getElementsByType,
  getElementsByMaterial,
  getElementsByStorey,
  getVisibleElements,
  getHighlightedElements,
  highlightByType,
  highlightByMaterial,
  clearHighlight,
  getStats,
  zoomToElement,
  getBoundingBox,
  RENDER_MODES,
  LAYER_CATEGORIES
} = useBIMViewer(bimModel, options);
```

**Example:**
```javascript
const { toggleLayer, getStats } = useBIMViewer(model);

// Toggle visibility of a layer
toggleLayer('structure');

// Get statistics
const stats = getStats();
console.log(`Total elements: ${stats.totalElements}`);
```

---

## Components

Pre-built React components for BIM workflows.

### GaudeBIMViewer

3D BIM model visualization using Three.js.

**Props:**
```jsx
<GaudeBIMViewer
  model={bimModel}                // BIM JSON model
  onElementSelect={(elem) => {}}  // Selection callback
  renderMode="realistic"          // realistic | wireframe | xray
  apiKey={apiKey}                 // For export functionality
  visibleLayers={{}}              // Layer visibility
  cameraPreset="iso"              // iso | plan | front | side | top
/>
```

### GaudeMapSelector

Google Maps terrain selector with polygon drawing.

**Props:**
```jsx
<GaudeMapSelector
  onPolygonComplete={(coords) => {}}
  center={{ lat: 40.7128, lng: -74.006 }}
  apiKey={googleMapsKey}
  zoom={14}
/>
```

### GaudePromptInput

Natural language prompt input with style selector.

**Props:**
```jsx
<GaudePromptInput
  onSubmit={(prompt) => {}}
  loading={false}
  placeholder="Describe your building..."
  showNegativePrompt={true}
/>
```

**onSubmit callback receives:**
```javascript
{
  prompt: "Your building description",
  negativePrompt: "What to avoid",
  conceptStyle: "Minimalist",
  detailLevel: "standard"
}
```

### GaudeGenerationStatus

Real-time generation progress with 4-agent pipeline visualization.

**Props:**
```jsx
<GaudeGenerationStatus
  jobId={jobId}
  apiKey={apiKey}
  onComplete={(status) => {}}
  pollInterval={2000}
/>
```

---

## Utilities

### validateBIMModel(model)

Validate BIM model structure against schema.

```javascript
import { validateBIMModel } from '@gaude/sdk';

const result = validateBIMModel(bimModel);
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

### createEmptyModel(name, options)

Create a blank BIM model template.

```javascript
import { createEmptyModel } from '@gaude/sdk';

const template = createEmptyModel('New Project', {
  buildingType: 'commercial',
  units: 'meters'
});
```

### BIM_MATERIALS

Pre-configured material library.

```javascript
import { BIM_MATERIALS, getMaterialForElement } from '@gaude/sdk';

const material = getMaterialForElement('column');
// { color: '#a0a0a0', roughness: 0.85, ... }
```

---

## Error Handling

### GaudeAPIError

```javascript
import { GaudeClient, GaudeAPIError } from '@gaude/sdk';

try {
  await client.generateBIM(prompt);
} catch (error) {
  if (error instanceof GaudeAPIError) {
    console.error(`API Error (${error.code}): ${error.message}`);
    console.error('Details:', error.details);
  }
}
```

**Error Properties:**
- `message`: Error description
- `statusCode`: HTTP status code
- `code`: GAUD-E error code
- `details`: Additional error information

---

## Rate Limiting

- **Limit:** 100 requests per minute
- **Applies to:** All API calls except exports
- **Headers:** X-RateLimit-Remaining, X-RateLimit-Reset

**Check rate limit:**
```javascript
try {
  await client.generateBIM(prompt);
} catch (error) {
  if (error.statusCode === 429) {
    console.error('Rate limit exceeded');
  }
}
```

---

## Webhooks (Advanced)

Register webhooks for real-time generation updates:

```javascript
const client = new GaudeClient(apiKey);
await client.request('POST', '/webhooks', {
  url: 'https://your-server.com/gaud-e-webhook',
  events: ['generation.completed', 'generation.failed']
});
```

**Webhook payload:**
```javascript
{
  event: "generation.completed",
  jobId: "job_abc123",
  modelId: "mdl_xyz789",
  timestamp: "2026-04-03T10:00:00Z"
}
```

---

## Environment Variables

Required for development:

```env
VITE_GAUD_E_API_KEY=gde_your_key_here
VITE_GAUD_E_API_URL=https://api.gaude.ai/v1
VITE_GOOGLE_MAPS_KEY=your_google_maps_key
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=info
```

---

## Support & Resources

- **Docs:** https://docs.gaude.ai
- **API Status:** https://status.gaude.ai
- **GitHub:** https://github.com/rickygaude-rgb/gaud-e-sdk
- **Issues:** https://github.com/rickygaude-rgb/gaud-e-sdk/issues
- **Email:** support@gaude.ai
# GAUD-E SDK API Reference

Complete API documentation for GAUD-E Client, Hooks, and Components.

## Table of Contents

1. [GaudeClient](#gaudeclient) - Core API client
2. [Hooks](#hooks) - React hooks for state management
3. [Components](#components) - Pre-built React UI components
4. [Utilities](#utilities) - Schema validation and materials
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)

---

## GaudeClient

Main API client for communicating with GAUD-E Platform.

### Constructor

```javascript
const client = new GaudeClient(apiKey, baseUrl);
```

**Parameters:**
- `apiKey` (string, required): GAUD-E API key (format: `gde_...`)
- `baseUrl` (string, optional): API base URL (default: `https://api.gaude.ai/v1`)

**Example:**
```javascript
import { GaudeClient } from '@gaude/sdk';

const client = new GaudeClient('gde_your_api_key');
```

### Methods

#### generateBIM(prompt, options)

Generate a BIM model from natural language prompt.

**Signature:**
```javascript
generateBIM(prompt: string, options?: object): Promise<object>
```

**Parameters:**
```javascript
{
  prompt: "5-story modern office building with atrium",
  negativePrompt: "avoid brutalism, no flat roof",
  polygon: [[40.7128, -74.0060], ...],
  conceptStyle: "Minimalist",
  generationParams: {
    detailLevel: "standard",
    iterations: 1,
    seed: null
  }
}
```

**Returns:**
```javascript
{
  jobId: "job_abc123xyz",
  status: "queued",
  createdAt: "2026-04-03T10:00:00Z",
  estimatedTime: 120 // seconds
}
```

**Example:**
```javascript
const job = await client.generateBIM(
  'Modern residential tower with 30 floors',
  {
    conceptStyle: 'Minimalist',
    generationParams: { detailLevel: 'detailed' }
  }
);
console.log(job.jobId); // Use for tracking progress
```

#### getGenerationStatus(jobId)

Check status of a BIM generation job.

**Signature:**
```javascript
getGenerationStatus(jobId: string): Promise<object>
```

**Returns:**
```javascript
{
  jobId: "job_abc123xyz",
  status: "running", // queued, running, completed, failed
  progress: 65,
  modelId: "mdl_xyz789abc",
  agentProgress: {
    enhancer: "completed",
    architect: "running",
    programmer: "pending",
    reviewer: "pending"
  },
  elapsedTime: "45s",
  estimatedTimeRemaining: "1m 30s"
}
```

**Example:**
```javascript
const status = await client.getGenerationStatus(jobId);
if (status.status === 'completed') {
  console.log('Done! Model ID:', status.modelId);
}
```

#### getModel(modelId)

Retrieve a generated BIM model as JSON.

**Signature:**
```javascript
getModel(modelId: string): Promise<object>
```

**Returns:**
```javascript
{
  metadata: {
    name: "Office Building",
    version: "1.0.0",
    created: "2026-04-03T10:00:00Z",
    location: { latitude: 40.7128, longitude: -74.0060 }
  },
  building: {
    name: "Office Tower",
    type: "commercial",
    storeys: [...],
    totalArea: 15000
  }
}
```

**Example:**
```javascript
const model = await client.getModel('mdl_xyz789abc');
console.log(model.building.totalArea); // Total floor area
```

#### exportIFC(modelId, options)

Export BIM model to IFC (Industry Foundation Classes) format.

**Signature:**
```javascript
exportIFC(modelId: string, options?: object): Promise<Blob>
```

**Options:**
```javascript
{
  includeMetadata: true  // Include all metadata
}
```

**Returns:** Blob containing IFC file data

**Example:**
```javascript
const ifcBlob = await client.exportIFC('mdl_xyz789abc');
const url = URL.createObjectURL(ifcBlob);
const a = document.createElement('a');
a.href = url;
a.download = 'model.ifc';
a.click();
```

#### exportGLTF(modelId, options)

Export BIM model to glTF/GLB format for 3D web viewing.

**Signature:**
```javascript
exportGLTF(modelId: string, options?: object): Promise<Blob>
```

**Options:**
```javascript
{
  format: "glb"  // "gltf" or "glb"
}
```

**Returns:** Blob containing glTF file data

#### generateConceptImage(prompt, style)

Generate a 2D rendering/concept image of the BIM model.

**Signature:**
```javascript
generateConceptImage(prompt: string, style?: string): Promise<object>
```

**Styles:** Photorealistic, Sketch, Wireframe, Technical, Artistic, Minimalist

**Returns:**
```javascript
{
  jobId: "img_job_123",
  imageUrl: "https://...",
  status: "completed"
}
```

#### connectSoftware(software, port)

Connect GAUD-E to external CAD/BIM software via MCP.

**Signature:**
```javascript
connectSoftware(software: string, port?: number): Promise<object>
```

**Supported Software:**
- revit
- archicad
- rhino
- sketchup
- autocad
- vectorworks

**Returns:**
```javascript
{
  status: "connected",
  software: "revit",
  port: 9090,
  token: "conn_abc123"
}
```

#### getCredits()

Get account credit usage and remaining balance.

**Signature:**
```javascript
getCredits(): Promise<object>
```

**Returns:**
```javascript
{
  creditsRemaining: 1500,
  creditsUsed: 500,
  creditLimit: 2000,
  resetDate: "2026-05-03",
  tier: "pro"
}
```

#### listModels(page, limit)

List all models in the account.

**Signature:**
```javascript
listModels(page?: number, limit?: number): Promise<object>
```

**Returns:**
```javascript
{
  models: [
    {
      id: "mdl_123",
      name: "Office Building",
      createdAt: "2026-04-03T10:00:00Z",
      area: 15000
    }
  ],
  total: 42,
  page: 1,
  pages: 3
}
```

#### getCapabilities()

Get information about available generation capabilities.

**Signature:**
```javascript
getCapabilities(): Promise<object>
```

**Returns:**
```javascript
{
  conceptStyles: ["Minimalist", "Bioclimatic", ...],
  elementTypes: ["wall", "column", "window", ...],
  maxStoreys: 100,
  maxArea: 100000
}
```

---

## Hooks

React hooks for managing GAUD-E state and generation.

### useGaude(apiKey, options)

Main hook for BIM generation workflow.

**Signature:**
```javascript
const {
  client,
  generating,
  progress,
  error,
  jobId,
  generationResult,
  generateBIM,
  getModel,
  cancelGeneration,
  exportModel,
  getCredits,
  pollJobStatus,
  ready
} = useGaude(apiKey, options);
```

**Parameters:**
```javascript
{
  apiKey: "gde_...",
  baseUrl: "https://api.gaude.ai/v1",
  pollingInterval: 2000  // ms between status checks
}
```

**Returns:**
- `client`: GaudeClient instance
- `generating`: boolean - Currently generating
- `progress`: number - 0-100
- `error`: string - Error message if any
- `jobId`: string - Current job ID
- `generationResult`: object - Final result with model
- `generateBIM`: function - Start generation
- `getModel`: function - Fetch model by ID
- `cancelGeneration`: function - Stop current generation
- `exportModel`: function - Export to IFC/glTF
- `getCredits`: function - Check account credits
- `ready`: boolean - Client initialized

**Example:**
```javascript
const { generateBIM, progress, generationResult } = useGaude(apiKey);

await generateBIM({
  prompt: 'Modern office',
  conceptStyle: 'Minimalist'
});

console.log(`Progress: ${progress}%`);
if (generationResult) {
  console.log('Model ready:', generationResult.model);
}
```

### useBIMViewer(bimModel, options)

Manage 3D viewer state and layer visibility.

**Signature:**
```javascript
const {
  elements,
  layers,
  renderMode,
  selectedElement,
  visibleLayers,
  highlightMode,
  highlightFilter,
  toggleLayer,
  setLayerVisibility,
  toggleAllLayers,
  selectElement,
  deselectElement,
  getElementsByType,
  getElementsByMaterial,
  getElementsByStorey,
  getVisibleElements,
  getHighlightedElements,
  highlightByType,
  highlightByMaterial,
  clearHighlight,
  getStats,
  zoomToElement,
  getBoundingBox,
  RENDER_MODES,
  LAYER_CATEGORIES
} = useBIMViewer(bimModel, options);
```

**Example:**
```javascript
const { toggleLayer, getStats } = useBIMViewer(model);

// Toggle visibility of a layer
toggleLayer('structure');

// Get statistics
const stats = getStats();
console.log(`Total elements: ${stats.totalElements}`);
```

---

## Components

Pre-built React components for BIM workflows.

### GaudeBIMViewer

3D BIM model visualization using Three.js.

**Props:**
```jsx
<GaudeBIMViewer
  model={bimModel}                // BIM JSON model
  onElementSelect={(elem) => {}}  // Selection callback
  renderMode="realistic"          // realistic | wireframe | xray
  apiKey={apiKey}                 // For export functionality
  visibleLayers={{}}              // Layer visibility
  cameraPreset="iso"              // iso | plan | front | side | top
/>
```

### GaudeMapSelector

Google Maps terrain selector with polygon drawing.

**Props:**
```jsx
<GaudeMapSelector
  onPolygonComplete={(coords) => {}}
  center={{ lat: 40.7128, lng: -74.006 }}
  apiKey={googleMapsKey}
  zoom={14}
/>
```

### GaudePromptInput

Natural language prompt input with style selector.

**Props:**
```jsx
<GaudePromptInput
  onSubmit={(prompt) => {}}
  loading={false}
  placeholder="Describe your building..."
  showNegativePrompt={true}
/>
```

**onSubmit callback receives:**
```javascript
{
  prompt: "Your building description",
  negativePrompt: "What to avoid",
  conceptStyle: "Minimalist",
  detailLevel: "standard"
}
```

### GaudeGenerationStatus

Real-time generation progress with 4-agent pipeline visualization.

**Props:**
```jsx
<GaudeGenerationStatus
  jobId={jobId}
  apiKey={apiKey}
  onComplete={(status) => {}}
  pollInterval={2000}
/>
```

---

## Utilities

### validateBIMModel(model)

Validate BIM model structure against schema.

```javascript
import { validateBIMModel } from '@gaude/sdk';

const result = validateBIMModel(bimModel);
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

### createEmptyModel(name, options)

Create a blank BIM model template.

```javascript
import { createEmptyModel } from '@gaude/sdk';

const template = createEmptyModel('New Project', {
  buildingType: 'commercial',
  units: 'meters'
});
```

### BIM_MATERIALS

Pre-configured material library.

```javascript
import { BIM_MATERIALS, getMaterialForElement } from '@gaude/sdk';

const material = getMaterialForElement('column');
// { color: '#a0a0a0', roughness: 0.85, ... }
```

---

## Error Handling

### GaudeAPIError

```javascript
import { GaudeClient, GaudeAPIError } from '@gaude/sdk';

try {
  await client.generateBIM(prompt);
} catch (error) {
  if (error instanceof GaudeAPIError) {
    console.error(`API Error (${error.code}): ${error.message}`);
    console.error('Details:', error.details);
  }
}
```

**Error Properties:**
- `message`: Error description
- `statusCode`: HTTP status code
- `code`: GAUD-E error code
- `details`: Additional error information

---

## Rate Limiting

- **Limit:** 100 requests per minute
- **Applies to:** All API calls except exports
- **Headers:** X-RateLimit-Remaining, X-RateLimit-Reset

**Check rate limit:**
```javascript
try {
  await client.generateBIM(prompt);
} catch (error) {
  if (error.statusCode === 429) {
    console.error('Rate limit exceeded');
  }
}
```

---

## Webhooks (Advanced)

Register webhooks for real-time generation updates:

```javascript
const client = new GaudeClient(apiKey);
await client.request('POST', '/webhooks', {
  url: 'https://your-server.com/gaud-e-webhook',
  events: ['generation.completed', 'generation.failed']
});
```

**Webhook payload:**
```javascript
{
  event: "generation.completed",
  jobId: "job_abc123",
  modelId: "mdl_xyz789",
  timestamp: "2026-04-03T10:00:00Z"
}
```

---

## Environment Variables

Required for development:

```env
VITE_GAUD_E_API_KEY=gde_your_key_here
VITE_GAUD_E_API_URL=https://api.gaude.ai/v1
VITE_GOOGLE_MAPS_KEY=your_google_maps_key
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=info
```

---

## Support & Resources

- **Docs:** https://docs.gaude.ai
- **API Status:** https://status.gaude.ai
- **GitHub:** https://github.com/gaude-ai/gaud-e-sdk
- **Issues:** https://github.com/gaude-ai/gaud-e-sdk/issues
- **Email:** support@gaude.ai
