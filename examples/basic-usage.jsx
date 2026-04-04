/**
 * GAUD-E SDK Basic Usage Example
 * Complete React application demonstrating BIM generation workflow
 * - Initialize GAUD-E client
 * - Select terrain on map
 * - Enter generation prompt
 * - Monitor generation progress
 * - View 3D BIM model
 * - Export to IFC
 */

import React, { useState, useCallback } from 'react';
import {
  useGaude,
  useBIMViewer,
  GaudeBIMViewer,
  GaudeMapSelector,
  GaudePromptInput,
  GaudeGenerationStatus,
  GaudeClient,
} from '@gaude/sdk';

/**
 * BasicGAUDEApp Component
 * Main application component demonstrating full BIM generation workflow
 */
export function BasicGAUDEApp() {
  // Application state
  const [currentStep, setCurrentStep] = useState('location'); // location, prompt, generating, preview
  const [terrain, setTerrain] = useState(null);
  const [generatedModel, setGeneratedModel] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [apiKey] = useState(process.env.VITE_GAUDE_API_KEY || '');

  // GAUD-E hooks
  const { generateBIM, generating, progress, error, getModel } = useGaude(apiKey);
  const {
    elements,
    renderMode,
    setRenderMode,
    visibleLayers,
    toggleLayer,
  } = useBIMViewer(generatedModel);

  /**
   * Step 1: Handle terrain selection
   */
  const handleTerrainSelected = useCallback((polygon) => {
    setTerrain(polygon);
    setCurrentStep('prompt');
  }, []);

  /**
   * Step 2: Handle BIM generation request
   */
  const handleGeneratePrompt = useCallback(
    async (promptData) => {
      try {
        setCurrentStep('generating');

        // Start generation
        const newJobId = await generateBIM({
          prompt: promptData.prompt,
          negativePrompt: promptData.negativePrompt,
          polygon: terrain,
          conceptStyle: promptData.conceptStyle,
          generationParams: {
            detailLevel: promptData.detailLevel,
          },
        });

        setJobId(newJobId);
      } catch (err) {
        console.error('Generation failed:', err);
        setCurrentStep('prompt');
      }
    },
    [generateBIM, terrain]
  );

  /**
   * Step 3: Handle generation completion
   */
  const handleGenerationComplete = useCallback(
    async (status) => {
      if (status.modelId) {
        try {
          const model = await getModel(status.modelId);
          setGeneratedModel(model);
          setCurrentStep('preview');
        } catch (err) {
          console.error('Failed to load generated model:', err);
        }
      }
    },
    [getModel]
  );

  /**
   * Export model to IFC format
   */
  const handleExportIFC = useCallback(async () => {
    if (!apiKey || !generatedModel?.metadata?.id) {
      alert('Cannot export: API key or model ID missing');
      return;
    }

    try {
      const client = new GaudeClient(apiKey);
      const blob = await client.exportIFC(generatedModel.metadata.id);

      // Download file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedModel.metadata.name || 'model'}.ifc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('Model exported successfully!');
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed: ' + err.message);
    }
  }, [apiKey, generatedModel]);

  /**
   * Reset to start new generation
   */
  const handleReset = useCallback(() => {
    setCurrentStep('location');
    setTerrain(null);
    setGeneratedModel(null);
    setJobId(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">GAUD-E BIM Generator</h1>
              <p className="text-gray-600 text-sm mt-1">
                AI-Powered Architectural Design & Building Information Modeling
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">SDK Version: 1.0.0</p>
              <p className="text-xs text-gray-500">All processing via api.gaude.ai</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div
              className={`flex items-center space-x-2 ${
                currentStep === 'location' ? 'text-blue-600 font-bold' : 'text-gray-500'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                1
              </div>
              <span>Location</span>
            </div>
            <div className="w-8 h-px bg-gray-300" />
            <div
              className={`flex items-center space-x-2 ${
                currentStep === 'prompt' ? 'text-blue-600 font-bold' : 'text-gray-500'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                2
              </div>
              <span>Design</span>
            </div>
            <div className="w-8 h-px bg-gray-300" />
            <div
              className={`flex items-center space-x-2 ${
                currentStep === 'generating' ? 'text-blue-600 font-bold' : 'text-gray-500'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                3
              </div>
              <span>Generate</span>
            </div>
            <div className="w-8 h-px bg-gray-300" />
            <div
              className={`flex items-center space-x-2 ${
                currentStep === 'preview' ? 'text-blue-600 font-bold' : 'text-gray-500'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                4
              </div>
              <span>Preview</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel: Controls */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* Step 1: Location Selection */}
              {currentStep === 'location' && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Step 1: Select Location</h2>
                  <p className="text-gray-600 text-sm mb-4">
                    Draw a polygon on the map to define your building's terrain area
                  </p>
                  {terrain && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm text-green-800">
                        ✓ Location selected: {terrain.length} points
                      </p>
                      <button
                        onClick={() => setCurrentStep('prompt')}
                        className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                      >
                        Next: Design Prompt
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Prompt Input */}
              {currentStep === 'prompt' && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <GaudePromptInput onSubmit={handleGeneratePrompt} loading={false} />
                  <button
                    onClick={() => setCurrentStep('location')}
                    className="w-full mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                  >
                    Back
                  </button>
                </div>
              )}

              {/* Step 3: Generation Progress */}
              {currentStep === 'generating' && (
                <GaudeGenerationStatus jobId={jobId} apiKey={apiKey} onComplete={handleGenerationComplete} />
              )}

              {/* Step 4: Preview Controls */}
              {currentStep === 'preview' && (
                <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Render Mode</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {['realistic', 'wireframe', 'xray'].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setRenderMode(mode)}
                          className={`px-3 py-2 rounded text-sm font-medium capitalize ${
                            renderMode === mode
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Layers</h3>
                    <div className="space-y-2 text-sm">
                      {Object.keys(visibleLayers).map((layer) => (
                        <label key={layer} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={visibleLayers[layer]}
                            onChange={() => toggleLayer(layer)}
                            className="w-4 h-4"
                          />
                          <span className="capitalize">{layer}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <button
                      onClick={handleExportIFC}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium text-sm"
                    >
                      Export IFC
                    </button>
                    <button
                      onClick={handleReset}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-sm"
                    >
                      New Generation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
              {currentStep === 'location' && (
                <GaudeMapSelector
                  onPolygonComplete={handleTerrainSelected}
                  apiKey={process.env.VITE_GOOGLE_MAPS_KEY}
                />
              )}

              {currentStep === 'prompt' && (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <p className="text-gray-600 mb-2">Map preview hidden during prompt input</p>
                    <p className="text-sm text-gray-500">Go back to location to modify selection</p>
                  </div>
                </div>
              )}

              {currentStep === 'generating' && (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
                    <p className="text-gray-600 font-medium">Generating your BIM model...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a few minutes</p>
                    <p className="text-xs text-gray-400 mt-4">
                      Running 4-agent pipeline: Enhancer → Architect → Programmer → Reviewer
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 'preview' && generatedModel && (
                <GaudeBIMViewer model={generatedModel} apiKey={apiKey} renderMode={renderMode} />
              )}
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-gray-900 mb-4">About GAUD-E SDK</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
            <div>
              <p className="font-semibold text-gray-900 mb-2">Secure by Design</p>
              <p>
                No generation code is exposed in the SDK. All AI processing happens securely on the
                GAUD-E platform.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-2">API Key Required</p>
              <p>
                Developers need an API key from platform.gaude.ai. Keys are validated and rate-limited.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-2">4-Agent Pipeline</p>
              <p>
                Enhancer, Architect, Programmer, and Reviewer agents collaborate to create high-quality
                BIM models.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BasicGAUDEApp;
