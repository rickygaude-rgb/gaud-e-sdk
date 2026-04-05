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