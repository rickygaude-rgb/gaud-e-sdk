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
} from 'gaud-e-sdk';

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