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

  const handleTerrainSelected = useCallback( (polygon) => { setTerrain(polygon); setCurrentStep('prompt'); }, []);
  const handleGeneratePrompt = useCallback(async (promptData) => { try { setCurrentStep('generating'); const newJobId = await generateBIM({ prompt: promptData.prompt, negativePrompt: promptData.negativePrompt, polygon: terrain, conceptStyle: promptData.conceptStyle }); setJobId(newJobId); } catch (err) { setCurrentStep('prompt'); } }, [generateBIM, terrain]);
  const handleGenerationComplete = useCallback(async (status) => { if (status.modelId) { const model = await getModel(status.modelId); setGeneratedModel(model); setCurrentStep('preview'); } }, [getModel]);
  const handleReset = useCallback(() => { setCurrentStep('location'); setTerrain(null); setGeneratedModel(null); setJobId(null); }, []);

  return (
    <div className="min-h-screen bg-grad">
      <GaudeBimViewer model={generatedModel} apiKey={apiKey} />
      <GaudePromptInput onSubmit={handleGeneratePrompt} loading={generating} />
      <GaudeGenerationStatus jobId={jobId} apiKey={apiKey} onComplete={handleGenerationComplete} />
    </div>
  );
}

export default BasicGAUDEApp;