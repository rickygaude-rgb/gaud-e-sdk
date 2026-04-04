/**
 * GaudeGenerationStatus Component
 * Shows real-time generation progress through the 4-agent pipeline
 * Agents: Enhancer → Architect → Programmer → Reviewer
 */

import React, { useEffect, useState, useCallback } from 'react';
import { GaudeClient } from '../utils/gaude-client';

/**
 * Agent in the generation pipeline
 */
export const AGENTS = [
  {
    id: 'enhancer',
    name: 'Enhancer',
    description: 'Refining your prompt for optimal results',
    icon: '✨',
  },
  {
    id: 'architect',
    name: 'Architect',
    description: 'Designing the building structure',
    icon: '🏗️',
  },
  {
    id: 'programmer',
    name: 'Programmer',
    description: 'Generating BIM code and geometry',
    icon: '💻',
  },
  {
    id: 'reviewer',
    name: 'Reviewer',
    description: 'Validating design and output',
    icon: '✓',
  },
];

/**
 * Status badge colors
 */
const STATUS_COLORS = {
  pending: 'bg-gray-200',
  running: 'bg-blue-200 animate-pulse',
  completed: 'bg-green-200',
  failed: 'bg-red-200',
};

const STATUS_TEXT_COLORS = {
  pending: 'text-gray-600',
  running: 'text-blue-600',
  completed: 'text-green-600',
  failed: 'text-red-600',
};

/**
 * GaudeGenerationStatus Component
 * Shows progress through the 4-agent BIM generation pipeline
 *
 * @component
 * @param {string} props.jobId - Job ID to monitor
 * @param {string} props.apiKey - GAUD-E API key
 * @param {function} props.onComplete - Callback when generation completes
 * @param {number} props.pollInterval - Status polling interval in ms (default: 2000)
 * @returns {React.ReactElement} Generation status display
 *
 * @example
 * <GaudeGenerationStatus
 *   jobId="job_123"
 *   apiKey={apiKey}
 *   onComplete={() => console.log('Done!')}
 * />
 */
export function GaudeGenerationStatus({
  jobId,
  apiKey,
  onComplete,
  pollInterval = 2000,
}) {
  const [jobStatus, setJobStatus] = useState(null);
  const [agentProgress, setAgentProgress] = useState({
    enhancer: 'pending',
    architect: 'pending',
    programmer: 'pending',
    reviewer: 'pending',
  });
  const [overallProgress, setOverallProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(true);
  const clientRef = React.useRef(null);
  const pollIntervalRef = React.useRef(null);

  // Initialize client
  useEffect(() => {
    if (apiKey) {
      clientRef.current = new GaudeClient(apiKey);
    }
  }, [apiKey]);

  /**
   * Update agent progress based on job status
   * @private
   */
  const updateAgentProgress = useCallback((status) => {
    const progress = status.agentProgress || {};

    setAgentProgress({
      enhancer: progress.enhancer || 'pending',
      architect: progress.architect || 'pending',
      programmer: progress.programmer || 'pending',
      reviewer: progress.reviewer || 'pending',
    });

    setOverallProgress(status.progress || 0);
  }, []);

  /**
   * Poll job status
   */
  const pollStatus = useCallback(async () => {
    if (!clientRef.current || !jobId) {
      return;
    }

    try {
      const status = await clientRef.current.getGenerationStatus(jobId);
      setJobStatus(status);
      setError(null);

      // Update agent progress
      updateAgentProgress(status);

      // Check if complete
      if (status.status === 'completed') {
        setIsPolling(false);
        if (onComplete) {
          onComplete(status);
        }
      } else if (status.status === 'failed') {
        setError(status.errorMessage || 'Generation failed');
        setIsPolling(false);
      }
    } catch (err) {
      console.error('Error polling job status:', err);
      setError(err.message || 'Failed to get job status');
    }
  }, [jobId, updateAgentProgress, onComplete]);

  // Set up polling
  useEffect(() => {
    if (!isPolling) {
      return;
    }

    // Poll immediately
    pollStatus();

    // Set up interval
    pollIntervalRef.current = setInterval(pollStatus, pollInterval);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [isPolling, pollStatus, pollInterval]);

  if (!jobId) {
    return (
      <div className="w-full bg-gray-100 rounded-lg p-4 text-center text-gray-600">
        No job ID provided
      </div>
    );
  }

  const getAgentStatus = (agentId) => {
    return agentProgress[agentId] || 'pending';
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-800">BIM Generation Progress</h2>
        <p className="text-sm text-gray-600">Job ID: {jobId}</p>
      </div>

      {/* Overall Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Overall Progress</label>
          <span className="text-sm font-semibold text-gray-800">{overallProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Agent Pipeline */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-700">AI Agent Pipeline</p>

        <div className="space-y-3">
          {AGENTS.map((agent, idx) => {
            const status = getAgentStatus(agent.id);
            const isActive = status === 'running';
            const isCompleted = status === 'completed';
            const isFailed = status === 'failed';

            return (
              <div key={agent.id}>
                {/* Agent Card */}
                <div
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isActive
                      ? 'border-blue-400 bg-blue-50'
                      : isCompleted
                        ? 'border-green-300 bg-green-50'
                        : isFailed
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Status Indicator */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        STATUS_COLORS[status]
                      }`}
                    >
                      {status === 'completed' ? (
                        '✓'
                      ) : status === 'failed' ? (
                        '✕'
                      ) : status === 'running' ? (
                        <span className="animate-spin">◐</span>
                      ) : (
                        idx + 1
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{agent.icon}</span>
                        <h3 className="font-semibold text-gray-800">{agent.name}</h3>
                        <span
                          className={`text-xs font-semibold uppercase tracking-wide ${
                            STATUS_TEXT_COLORS[status]
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{agent.description}</p>
                    </div>
                  </div>
                </div>

                {/* Arrow between agents */}
                {idx < AGENTS.length - 1 && (
                  <div className="flex justify-center py-1">
                    <span className="text-gray-400">↓</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Details */}
      {jobStatus && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-gray-700">Status Details</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Status:</span>
              <p className="font-medium text-gray-800 capitalize">{jobStatus.status}</p>
            </div>
            <div>
              <span className="text-gray-600">Elapsed:</span>
              <p className="font-medium text-gray-800">{jobStatus.elapsedTime || '—'}</p>
            </div>
            {jobStatus.estimatedTimeRemaining && (
              <div>
                <span className="text-gray-600">Estimated Time Remaining:</span>
                <p className="font-medium text-gray-800">{jobStatus.estimatedTimeRemaining}</p>
              </div>
            )}
            {jobStatus.modelId && (
              <div>
                <span className="text-gray-600">Model ID:</span>
                <p className="font-mono text-xs text-gray-800">{jobStatus.modelId}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-red-800 mb-1">Error</p>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Completion Message */}
      {jobStatus?.status === 'completed' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-green-800 mb-1">✓ Generation Complete</p>
          <p className="text-sm text-green-700">
            Your BIM model is ready! Model ID: {jobStatus.modelId}
          </p>
        </div>
      )}

      {/* Notes */}
      <div className="text-xs text-gray-500 border-t border-gray-200 pt-4">
        <p className="font-semibold text-gray-600 mb-1">Pipeline Stages:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>
            <strong>Enhancer:</strong> Optimizes your prompt for better architecture generation
          </li>
          <li>
            <strong>Architect:</strong> Designs the building based on your specifications
          </li>
          <li>
            <strong>Programmer:</strong> Converts the design into BIM geometry and metadata
          </li>
          <li>
            <strong>Reviewer:</strong> Validates the model for consistency and correctness
          </li>
        </ul>
      </div>
    </div>
  );
}

export default GaudeGenerationStatus;
