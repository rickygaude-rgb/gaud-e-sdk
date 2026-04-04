/**
 * React Hook: useGaude
 * Main hook for interacting with GAUD-E generation services
 * Manages API client initialization, generation state, and polling
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { GaudeClient } from '../utils/gaude-client';

/**
 * useGaude Hook
 * Provides easy access to GAUD-E BIM generation functionality
 * Handles client initialization, generation polling, and state management
 *
 * @param {string} apiKey - GAUD-E API key
 * @param {object} options - Hook options
 * @param {string} options.baseUrl - Custom API base URL
 * @param {number} options.pollingInterval - Status polling interval in ms (default: 2000)
 * @returns {object} Hook state and methods
 *
 * @example
 * const { client, generateBIM, generating, progress, error, getModel } = useGaude(apiKey);
 *
 * // Generate a BIM model
 * const jobId = await generateBIM({
 *   prompt: "Modern office building with 5 floors",
 *   polygon: [[lat, lng], [lat2, lng2]],
 *   conceptStyle: "Minimalist"
 * });
 *
 * // Get the generated model when done
 * if (!generating && jobId) {
 *   const model = await getModel(jobId);
 * }
 */
export function useGaude(apiKey, options = {}) {
  const [client, setClient] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [generationResult, setGenerationResult] = useState(null);

  const pollingIntervalRef = useRef(null);
  const clientRef = useRef(null);
  const pollCountRef = useRef(0);
  const maxPollsRef = useRef(600); // Maximum 20 minutes at 2s intervals

  const pollingInterval = options.pollingInterval || 2000;

  // Initialize client on mount and when apiKey changes
  useEffect(() => {
    try {
      if (!apiKey) {
        setError('API key is required');
        return;
      }

      const newClient = new GaudeClient(
        apiKey,
        options.baseUrl || 'https://api.gaude.ai/v1'
      );

      clientRef.current = newClient;
      setClient(newClient);
      setError(null);
    } catch (err) {
      setError(err.message);
      setClient(null);
    }
  }, [apiKey, options.baseUrl]);

  // Polling function to check job status
  const pollJobStatus = useCallback(
    async (currentJobId) => {
      if (!clientRef.current || !currentJobId) {
        return;
      }

      try {
        const status = await clientRef.current.getGenerationStatus(currentJobId);

        // Update progress
        if (status.progress) {
          setProgress(status.progress);
        }

        // Job complete
        if (status.status === 'completed') {
          setGenerating(false);
          setProgress(100);

          // Fetch full model
          if (status.modelId) {
            const model = await clientRef.current.getModel(status.modelId);
            setGenerationResult({
              jobId: currentJobId,
              modelId: status.modelId,
              model,
              timestamp: new Date(),
            });
          }

          // Clear polling
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          return true;
        }

        // Job failed
        if (status.status === 'failed') {
          setGenerating(false);
          setError(status.errorMessage || 'Generation failed');

          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          return true;
        }

        // Check max polls to prevent infinite loops
        pollCountRef.current++;
        if (pollCountRef.current > maxPollsRef.current) {
          setGenerating(false);
          setError('Generation timeout - job is taking too long');

          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          return true;
        }

        return false;
      } catch (err) {
        setError(err.message || 'Error checking generation status');
        setGenerating(false);

        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        return true;
      }
    },
    []
  );

  /**
   * Generate a new BIM model
   * @param {object} params - Generation parameters
   * @param {string} params.prompt - Architecture description
   * @param {string} params.negativePrompt - What to avoid
   * @param {array} params.polygon - Terrain coordinates [[lat, lng], ...]
   * @param {string} params.conceptStyle - Design style
   * @returns {Promise<string>} Job ID for tracking generation progress
   */
  const generateBIM = useCallback(
    async (params) => {
      if (!clientRef.current) {
        throw new Error('Client not initialized. Check your API key.');
      }

      setError(null);
      setProgress(0);
      setGenerating(true);
      setGenerationResult(null);
      pollCountRef.current = 0;

      try {
        // Start generation
        const response = await clientRef.current.generateBIM(
          params.prompt,
          {
            negativePrompt: params.negativePrompt,
            polygon: params.polygon,
            conceptStyle: params.conceptStyle,
            generationParams: params.generationParams,
          }
        );

        const newJobId = response.jobId;
        setJobId(newJobId);
        setProgress(5); // Show we've started

        // Start polling for status
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }

        pollingIntervalRef.current = setInterval(() => {
          pollJobStatus(newJobId);
        }, pollingInterval);

        return newJobId;
      } catch (err) {
        setGenerating(false);
        setError(err.message || 'Failed to start BIM generation');
        throw err;
      }
    },
    [pollingJobStatus, pollingInterval]
  );

  /**
   * Get a generated model by ID
   * @param {string} modelId - Model ID to retrieve
   * @returns {Promise<object>} BIM model JSON
   */
  const getModel = useCallback(
    async (modelId) => {
      if (!clientRef.current) {
        throw new Error('Client not initialized');
      }

      try {
        return await clientRef.current.getModel(modelId);
      } catch (err) {
        setError(err.message || 'Failed to get model');
        throw err;
      }
    },
    []
  );

  /**
   * Cancel current generation
   * @returns {Promise<void>}
   */
  const cancelGeneration = useCallback(async () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    if (jobId && clientRef.current) {
      try {
        await clientRef.current.cancelGenerationJob(jobId);
      } catch (err) {
        console.error('Error canceling generation:', err);
      }
    }

    setGenerating(false);
    setProgress(0);
    setJobId(null);
  }, [jobId]);

  /**
   * Export generated model
   * @param {string} modelId - Model ID to export
   * @param {string} format - Export format ('ifc' or 'gltf')
   * @returns {Promise<Blob>} File content
   */
  const exportModel = useCallback(
    async (modelId, format = 'ifc') => {
      if (!clientRef.current) {
        throw new Error('Client not initialized');
      }

      try {
        if (format === 'ifc') {
          return await clientRef.current.exportIFC(modelId);
        } else if (format === 'gltf' || format === 'glb') {
          return await clientRef.current.exportGLTF(modelId, { format: 'glb' });
        } else {
          throw new Error('Unsupported export format');
        }
      } catch (err) {
        setError(err.message || 'Export failed');
        throw err;
      }
    },
    []
  );

  /**
   * Get account credits
   * @returns {Promise<object>} Credit information
   */
  const getCredits = useCallback(async () => {
    if (!clientRef.current) {
      throw new Error('Client not initialized');
    }
    return clientRef.current.getCredits();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  return {
    // State
    client,
    generating,
    progress,
    error,
    jobId,
    generationResult,

    // Methods
    generateBIM,
    getModel,
    cancelGeneration,
    exportModel,
    getCredits,
    pollJobStatus,

    // Utilities
    ready: !!client && !error,
  };
}

export default useGaude;
