# GAUD-E SDK Quick Start Guide

Get started with BIM generation in 5 minutes.

## Prerequisites

- Node.js 16+ and npm/yarn
- Google Maps API key (for terrain selection)
- GAUD-E API key from https://platform.gaude.ai

## Installation

```bash
npm install gaud-e-sdk
# or
yarn add gaud-e-sdk
```

## 1. Get API Keys

### GAUD-E API Key
1. Visit https://platform.gaude.ai/api-keys
2. Sign up for a GAUD-E account
3. Create a new API key (format: `gde_...`)
4. Copy the key and add to `.env.local`:

```
VITE_GAUD_E_API_KEY=gde_your_key_here
VITE_GAUD_E_API_URL=https://api.gaude.ai/v1
```

### Google Maps API Key (Optional)
For terrain/location selection:

1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable Maps JavaScript API
4. Create an API key
5. Add to `.env.local`:

```
VITE_GOOGLE_MAPS_KEY=your_google_maps_key
```

## 2. Basic React App

```jsx
import React, { useState } from 'react';
import { useGaude, GaudePromptInput, GaudeBIMViewer } from 'gaud-e-sdk';

function App() {
  const [model, setModel] = useState(null);
  const { generateBIM, getModel, generating, progress } = useGaude(
    process.env.VITE_GAUD_E_API_KEY
  );

  const handleGeneratePrompt = async (promptData) => {
    try {
      // Start generation
      const jobId = await generateBIM({
        prompt: promptData.prompt,
        conceptStyle: promptData.conceptStyle,
      });

      // Poll status and get model when done
      let status = { status: 'running' };
      while (status.status === 'running') {
        await new Promise(r => setTimeout(r, 2000));
        // In real app, poll status here
      }

      // Load completed model
      if (status.modelId) {
        const generatedModel = await getModel(status.modelId);
        setModel(generatedModel);
      }
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  return (
    <div className="flex gap-6 p-6">
      {/* Input Panel */}
      <div className="flex-1">
        <GaudePromptInput
          onSubmit={handleGeneratePrompt}
          loading={generating}
        />
      </div>

      {/* 3D Viewer */}
      <div className="flex-1 h-96">
        {model && (
          <GaudeBIMViewer
            model={model}
            apiKey={process.env.VITE_GAUD_E_API_KEY}
          />
        )}
      </div>
    </div>
  );
}

export default App;
```

## 3. Generate Your First BIM Model

```bash
npm run dev
```

Then:
1. Enter a building description: "Modern office building with 5 floors, glass facade"
2. Select concept style (e.g., "Minimalist")
3. Click "Generate BIM Model"
4. Wait for generation (typically 1-2 minutes)
5. View and interact with the 3D model
6. Export to IFC format

## 4. Advanced: With Terrain Selection

```jsx
import { GaudeMapSelector } from 'gaud-e-sdk';

function AdvancedApp() {
  const [terrain, setTerrain] = useState(null);

  return (
    <>
      {/* Step 1: Select terrain */}
      <GaudeMapSelector
        onPolygonComplete={(polygon) => setTerrain(polygon)}
        apiKey={process.env.VITE_GOOGLE_MAPS_KEY}
      />

      {/* Step 2: Generate BIM on terrain */}
      {terrain && (
        <GaudePromptInput
          onSubmit={(prompt) =>
            generateBIM({
              ...prompt,
              polygon: terrain
            })
          }
        />
      )}
    </>
  );
}
```

## 5. Monitor Generation Progress

```jsx
import { GaudeGenerationStatus } from 'gaud-e-sdk';

function StatusMonitor({ jobId, apiKey }) {
  return (
    <GaudeGenerationStatus
      jobId={jobId}
      apiKey={apiKey}
      onComplete={(status) => {
        console.log('Generation complete!', status);
      }}
    />
  );
}
```

## 6. Export Generated Model

```jsx
import { GaudeClient } from 'gaud-e-sdk';

async function exportModel(modelId, apiKey) {
  const client = new GaudeClient(apiKey);

  // Export to IFC
  const ifcBlob = await client.exportIFC(modelId);
  const url = URL.createObjectURL(ifcBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'model.ifc';
  a.click();

  // Or export to glTF for web viewing
  const gltfBlob = await client.exportGLTF(modelId);
}
```

## Common Issues

### API Key Error: "Invalid API key format"
- Ensure key starts with `gde_`
- Get key from https://platform.gaude.ai/api-keys

### Generation Timeout
- Generation typically takes 1-2 minutes
- Check job status: `client.getGenerationStatus(jobId)`
- Review job logs: `client.getJobLogs(jobId)`

### Map Not Loading
- Verify Google Maps API key is correct
- Check that Maps JavaScript API is enabled
- Ensure key is not restricted by domain

### Rate Limiting
- Default: 100 requests per minute
- Check credit usage: `client.getCredits()`

## Next Steps

- See [API_REFERENCE.md](./API_REFERENCE.md) for complete API documentation
- Check [examples/](../examples/) for advanced usage patterns
- Review [JSON_BIM_SCHEMA.md](./JSON_BIM_SCHEMA.md) for model structure details
- Join GAUD-E community: https://community.gaude.ai

## Support

- Documentation: https://docs.gaude.ai
- Issues: https://github.com/rickygaude-rgb/gaud-e-sdk/issues
- Email: support@gaude.ai
- Discord: https://discord.gg/gaude
# GAUD-E SDK Quick Start Guide

Get started with BIM generation in 5 minutes.

## Prerequisites

- Node.js 16+ and npm/yarn
- Google Maps API key (for terrain selection)
- GAUD-E API key from https://platform.gaude.ai

## Installation

```bash
npm install gaud-e-sdk
# or
yarn add gaud-e-sdk
```

## 1. Get API Keys

### GAUD-E API Key
1. Visit https://platform.gaude.ai/api-keys
2. Sign up for a GAUD-E account
3. Create a new API key (format: `gde_...`)
4. Copy the key and add to `.env.local`:

```
VITE_GAUD_E_API_KEY=gde_your_key_here
VITE_GAUD_E_API_URL=https://api.gaude.ai/v1
```

### Google Maps API Key (Optional)
For terrain/location selection:

1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable Maps JavaScript API
4. Create an API key
5. Add to `.env.local`:

```
VITE_GOOGLE_MAPS_KEY=your_google_maps_key
```

## 2. Basic React App

```jsx
import React, { useState } from 'react';
import { useGaude, GaudePromptInput, GaudeBIMViewer } from 'gaud-e-sdk';

function App() {
  const [model, setModel] = useState(null);
  const { generateBIM, getModel, generating, progress } = useGaude(
    process.env.VITE_GAUD_E_API_KEY
  );

  const handleGeneratePrompt = async (promptData) => {
    try {
      // Start generation
      const jobId = await generateBIM({
        prompt: promptData.prompt,
        conceptStyle: promptData.conceptStyle,
      });

      // Poll status and get model when done
      let status = { status: 'running' };
      while (status.status === 'running') {
        await new Promise(r => setTimeout(r, 2000));
        // In real app, poll status here
      }

      // Load completed model
      if (status.modelId) {
        const generatedModel = await getModel(status.modelId);
        setModel(generatedModel);
      }
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  return (
    <div className="flex gap-6 p-6">
      {/* Input Panel */}
      <div className="flex-1">
        <GaudePromptInput
          onSubmit={handleGeneratePrompt}
          loading={generating}
        />
      </div>

      {/* 3D Viewer */}
      <div className="flex-1 h-96">
        {model && (
          <GaudeBIMViewer
            model={model}
            apiKey={process.env.VITE_GAUD_E_API_KEY}
          />
        )}
      </div>
    </div>
  );
}

export default App;
```

## 3. Generate Your First BIM Model

```bash
npm run dev
```

Then:
1. Enter a building description: "Modern office building with 5 floors, glass facade"
2. Select concept style (e.g., "Minimalist")
3. Click "Generate BIM Model"
4. Wait for generation (typically 1-2 minutes)
5. View and interact with the 3D model
6. Export to IFC format

## 4. Advanced: With Terrain Selection

```jsx
import { GaudeMapSelector } from 'gaud-e-sdk';

function AdvancedApp() {
  const [terrain, setTerrain] = useState(null);

  return (
    <>
      {/* Step 1: Select terrain */}
      <GaudeMapSelector
        onPolygonComplete={(polygon) => setTerrain(polygon)}
        apiKey={process.env.VITE_GOOGLE_MAPS_KEY}
      />

      {/* Step 2: Generate BIM on terrain */}
      {terrain && (
        <GaudePromptInput
          onSubmit={(prompt) =>
            generateBIM({
              ...prompt,
              polygon: terrain
            })
          }
        />
      )}
    </>
  );
}
```

## 5. Monitor Generation Progress

```jsx
import { GaudeGenerationStatus } from 'gaud-e-sdk';

function StatusMonitor({ jobId, apiKey }) {
  return (
    <GaudeGenerationStatus
      jobId={jobId}
      apiKey={apiKey}
      onComplete={(status) => {
        console.log('Generation complete!', status);
      }}
    />
  );
}
```

## 6. Export Generated Model

```jsx
import { GaudeClient } from 'gaud-e-sdk';

async function exportModel(modelId, apiKey) {
  const client = new GaudeClient(apiKey);

  // Export to IFC
  const ifcBlob = await client.exportIFC(modelId);
  const url = URL.createObjectURL(ifcBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'model.ifc';
  a.click();

  // Or export to glTF for web viewing
  const gltfBlob = await client.exportGLTF(modelId);
}
```

## Common Issues

### API Key Error: "Invalid API key format"
- Ensure key starts with `gde_`
- Get key from https://platform.gaude.ai/api-keys

### Generation Timeout
- Generation typically takes 1-2 minutes
- Check job status: `client.getGenerationStatus(jobId)`
- Review job logs: `client.getJobLogs(jobId)`

### Map Not Loading
- Verify Google Maps API key is correct
- Check that Maps JavaScript API is enabled
- Ensure key is not restricted by domain

### Rate Limiting
- Default: 100 requests per minute
- Check credit usage: `client.getCredits()`

## Next Steps

- See [API_REFERENCE.md](./API_REFERENCE.md) for complete API documentation
- Check [examples/](../examples/) for advanced usage patterns
- Review [JSON_BIM_SCHEMA.md](./JSON_BIM_SCHEMA.md) for model structure details
- Join GAUD-E community: https://community.gaude.ai

## Support

- Documentation: https://docs.gaude.ai
- Issues: https://github.com/gaude-ai/gaud-e-sdk/issues
- Email: support@gaude.ai
- Discord: https://discord.gg/gaude
