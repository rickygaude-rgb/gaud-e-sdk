/**
 * GAUD-E SDK Next.js Integration Example
 * Server-side API key handling and client-side GAUD-E SDK usage
 * Best practice: API key stays on server, frontend only gets session token
 */

// ============================================================================
// PAGES/API/GAUD-E.JS - Backend API Route (Server-side)
// ============================================================================

/**
 * Next.js API route for GAUD-E integration
 * Handles:
 * - Session token generation (frontend gets token, not API key)
 * - Backend API communication with GAUD-E
 * - Secure credential handling
 */
export async function handleGaudeAPI(req, res) {
  const { method, body } = req;

  // Validate that API key is set on server
  if (!process.env.GAUD_E_API_KEY) {
    return res.status(500).json({
      error: 'GAUD-E API key not configured on server',
    });
  }

  try {
    switch (method) {
      // Generate BIM model
      case 'POST':
        if (body.action === 'generate') {
          return await handleGenerate(body, res);
        }
        break;

      // Get generation status
      case 'GET':
        if (req.query.jobId) {
          return await handleStatus(req.query.jobId, res);
        }
        break;

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('GAUD-E API error:', error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * Handle BIM generation request
 * @private
 */
async function handleGenerate(body, res) {
  const { GaudeClient } = await import('gaud-e-sdk');

  try {
    const client = new GaudeClient(
      process.env.GAUD_E_API_KEY,
      process.env.GAUD_E_API_URL || 'https://api.gaude.ai/v1'
    );

    const response = await client.generateBIM(body.prompt, {
      negativePrompt: body.negativePrompt,
      polygon: body.polygon,
      conceptStyle: body.conceptStyle,
      generationParams: body.generationParams,
    });

    return res.status(200).json({
      jobId: response.jobId,
      status: response.status,
      createdAt: new Date(),
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

/**
 * Handle status check request
 * @private
 */
async function handleStatus(jobId, res) {
  const { GaudeClient } = await import('gaud-e-sdk');

  try {
    const client = new GaudeClient(
      process.env.GAUD_E_API_KEY,
      process.env.GAUD_E_API_URL || 'https://api.gaude.ai/v1'
    );

    const status = await client.getGenerationStatus(jobId);

    return res.status(200).json(status);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

// ============================================================================
// COMPONENTS/GAUD-E-NEXTJS.JSX - Frontend Component
// ============================================================================

/**
 * Next.js-specific GAUD-E integration component
 * Communicates with backend API instead of directly calling GAUD-E
 */
import React, { useState, useCallback } from 'react';
import { GaudePromptInput, GaudeBIMViewer, GaudeGenerationStatus } from 'gaud-e-sdk';

/**
 * useGaudeBackend Hook
 * Custom hook for server-side API communication
 * @param {string} backendUrl - Backend API URL
 * @returns {object} Generation methods and state
 */
function useGaudeBackend(backendUrl = '/api/gaud-e') {
  const [generating, setGenerating] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [error, setError] = useState(null);

  const generateBIM = useCallback(
    async (params) => {
      setGenerating(true);
      setError(null);

      try {
        const response = await fetch(backendUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'generate',
            prompt: params.prompt,
            negativePrompt: params.negativePrompt,
            polygon: params.polygon,
            conceptStyle: params.conceptStyle,
            generationParams: params.generationParams,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Generation failed');
        }

        const data = await response.json();
        setJobId(data.jobId);

        return data.jobId;
      } catch (err) {
        setError(err.message);
        setGenerating(false);
        throw err;
      }
    },
    [backendUrl]
  );

  const getStatus = useCallback(
    async (currentJobId) => {
      try {
        const response = await fetch(
          `${backendUrl}?jobId=${encodeURIComponent(currentJobId)}`
        );

        if (!response.ok) {
          throw new Error('Failed to get status');
        }

        const data = await response.json();
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [backendUrl]
  );

  return {
    generateBIM,
    getStatus,
    generating,
    jobId,
    error,
    setJobId,
    setGenerating,
  };
}

/**
 * NextJS GAUD-E Component
 * Main component for Next.js integration
 */
export function GaudeNextJSIntegration() {
  const [currentStep, setCurrentStep] = useState('prompt');
  const [generatedModel, setGeneratedModel] = useState(null);
  const [terrain, setTerrain] = useState(null);

  const { generateBIM, getStatus, generating, jobId, error } = useGaudeBackend('/api/gaud-e');

  /**
   * Handle prompt submission
   */
  const handlePromptSubmit = useCallback(
    async (promptData) => {
      try {
        const newJobId = await generateBIM({
          prompt: promptData.prompt,
          negativePrompt: promptData.negativePrompt,
          polygon: terrain,
          conceptStyle: promptData.conceptStyle,
          generationParams: {
            detailLevel: promptData.detailLevel,
          },
        });

        setCurrentStep('generating');
      } catch (err) {
        console.error('Generation failed:', err);
      }
    },
    [generateBIM, terrain]
  );

  /**
   * Handle generation completion
   */
  const handleGenerationComplete = useCallback(
    (status) => {
      // In a real app, you'd fetch the model from your backend
      // This is just a placeholder showing the architecture
      console.log('Generation complete:', status);
      setCurrentStep('preview');
    },
    []
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          GAUD-E BIM Generator (Next.js)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Controls */}
          <div className="lg:col-span-1">
            {currentStep === 'prompt' && (
              <GaudePromptInput
                onSubmit={handlePromptSubmit}
                loading={generating}
                showNegativePrompt={true}
              />
            )}

            {currentStep === 'generating' && (
              <GaudeGenerationStatus
                jobId={jobId}
                apiKey={null} // Not used in server-side mode
                onComplete={handleGenerationComplete}
              />
            )}

            {currentStep === 'preview' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg mb-4">Export Options</h3>
                <button
                  onClick={() => {
                    // Call backend export endpoint
                    window.location.href = `/api/gaud-e/export?format=ifc&jobId=${jobId}`;
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Export IFC
                </button>
              </div>
            )}
          </div>

          {/* Right: Preview */}
          <div className="lg:col-span-2">
            {currentStep === 'preview' && generatedModel && (
              <GaudeBIMViewer model={generatedModel} />
            )}

            {currentStep !== 'preview' && (
              <div className="bg-white rounded-lg shadow h-96 flex items-center justify-center">
                <p className="text-gray-500">Preview will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Architecture Overview */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Next.js Integration Architecture
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold text-gray-900">Frontend (Browser):</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>User enters BIM prompt in React component</li>
                <li>Sends request to backend API route</li>
                <li>Frontend NEVER directly accesses API key</li>
                <li>Uses session/authentication for requests</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-gray-900">Backend API Route (/api/gaud-e):</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Receives generation request from frontend</li>
                <li>Authenticates the user (optional middleware)</li>
                <li>Uses GAUD-E API key from environment variable</li>
                <li>Makes authenticated calls to api.gaude.ai</li>
                <li>Returns response to frontend (no key exposed)</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-gray-900">GAUD-E Platform (api.gaude.ai):</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Receives request with server API key</li>
                <li>Authenticates based on API key</li>
                <li>Runs 4-agent BIM generation pipeline</li>
                <li>Returns model data to backend</li>
              </ul>
            </div>

            <div className="border-t pt-4">
              <p className="font-semibold text-gray-900">Security Benefits:</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>API key never exposed to client/browser</li>
                <li>Backend controls all API communication</li>
                <li>User authentication can be enforced at backend</li>
                <li>Can implement rate limiting and usage tracking</li>
                <li>Sensitive data stays server-side</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GaudeNextJSIntegration;
