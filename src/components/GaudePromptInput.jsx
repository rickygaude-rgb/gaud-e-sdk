/**
 * GaudePromptInput Component
 * Natural language prompt input for BIM generation
 * Includes concept style selector and advanced options
 */

import React, { useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Concept styles for BIM generation
 */
export const CONCEPT_STYLES = [
  { id: 'minimalist', label: 'Minimalist', description: 'Clean, simple forms' },
  { id: 'bioclimatic', label: 'Bioclimatic', description: 'Climate-responsive design' },
  { id: 'industrial', label: 'Industrial', description: 'Raw, functional aesthetics' },
  { id: 'parametric', label: 'Parametric', description: 'Rule-based geometry' },
  { id: 'neoclassic', label: 'Neoclassic', description: 'Classical proportions' },
  { id: 'sustainable', label: 'Sustainable', description: 'Eco-friendly features' },
  { id: 'futuristic', label: 'Futuristic', description: 'Cutting-edge modern' },
  { id: 'vernacular', label: 'Vernacular', description: 'Local architectural traditions' },
];

/**
 * GaudePromptInput Component
 * Interface for entering BIM generation prompts
 *
 * @component
 * @param {object} props - Component props
 * @param {function} props.onSubmit - Callback when prompt is submitted
 * @param {boolean} props.loading - Loading state
 * @param {string} props.placeholder - Input placeholder text
 * @param {boolean} props.showNegativePrompt - Show negative prompt toggle
 * @returns {React.ReactElement} Prompt input component
 *
 * @example
 * <GaudePromptInput
 *   onSubmit={(prompt) => generateBIM(prompt)}
 *   loading={isGenerating}
 *   showNegativePrompt={true}
 * />
 */
export function GaudePromptInput({
  onSubmit,
  loading = false,
  placeholder = 'Describe your building...',
  showNegativePrompt = true,
}) {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showNegative, setShowNegative] = useState(false);
  const [conceptStyle, setConceptStyle] = useState('minimalist');
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [detailLevel, setDetailLevel] = useState('standard');
  const [error, setError] = useState('');

  /**
   * Handle prompt submission
   */
  const handleSubmit = useCallback(
    (e) => {
      e?.preventDefault?.();
      setError('');

      if (!prompt.trim()) {
        setError('Please enter a description of the building');
        return;
      }

      if (prompt.trim().length < 10) {
        setError('Description must be at least 10 characters');
        return;
      }

      onSubmit({
        prompt: prompt.trim(),
        negativePrompt: negativePrompt.trim(),
        conceptStyle,
        detailLevel,
      });
    },
    [prompt, negativePrompt, conceptStyle, detailLevel, onSubmit]
  );

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = useCallback(
    (e) => {
      // Ctrl+Enter or Cmd+Enter to submit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const selectedStyle = CONCEPT_STYLES.find((s) => s.id === conceptStyle);

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Generate BIM Model</h2>
        <p className="text-sm text-gray-600">Describe your building design in natural language</p>
      </div>

      {/* Main Prompt Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Building Description
          </label>
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setError('');
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={loading}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500">{prompt.length} characters</p>
            <p className="text-xs text-gray-500">Ctrl+Enter to submit</p>
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{error}</div>}

        {/* Concept Style Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Concept Style</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowStyleDropdown(!showStyleDropdown)}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between disabled:bg-gray-100 disabled:cursor-not-allowed bg-white"
            >
              <div>
                <div className="text-left font-medium text-gray-800">{selectedStyle?.label}</div>
                <div className="text-left text-xs text-gray-500">{selectedStyle?.description}</div>
              </div>
              <ChevronDown
                size={16}
                className={`transition-transform ${showStyleDropdown ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu */}
            {showStyleDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {CONCEPT_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => {
                      setConceptStyle(style.id);
                      setShowStyleDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 ${
                      conceptStyle === style.id ? 'bg-blue-100' : ''
                    }`}
                  >
                    <div className="font-medium text-gray-800">{style.label}</div>
                    <div className="text-xs text-gray-500">{style.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Negative Prompt (Collapsible) */}
        {showNegativePrompt && (
          <div>
            <button
              type="button"
              onClick={() => setShowNegative(!showNegative)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {showNegative ? '▼' : '▶'} Negative Prompt (What to avoid)
            </button>

            {showNegative && (
              <textarea
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="Describe elements you want to avoid (optional)"
                disabled={loading}
                rows={2}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm disabled:bg-gray-100"
              />
            )}
          </div>
        )}

        {/* Advanced Options */}
        <div className="pt-2 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            {advancedOpen ? '▼' : '▶'} Advanced Options
          </button>

          {advancedOpen && (
            <div className="mt-3 p-3 bg-gray-50 rounded space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Detail Level
                </label>
                <select
                  value={detailLevel}
                  onChange={(e) => setDetailLevel(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="quick">Quick (Lower detail, faster)</option>
                  <option value="standard">Standard (Balanced)</option>
                  <option value="detailed">Detailed (Higher quality, slower)</option>
                </select>
              </div>

              <p className="text-xs text-gray-500">
                More options and parameters available in generationParams when using API directly
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
            loading || !prompt.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Generating...
            </span>
          ) : (
            'Generate BIM Model'
          )}
        </button>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-gray-700">
          <p className="font-semibold text-blue-900 mb-1">Prompt Tips:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Include number of floors/levels</li>
            <li>Specify building purpose (office, residential, etc.)</li>
            <li>Mention key features (courtyards, atriums, etc.)</li>
            <li>Describe sustainability features if needed</li>
          </ul>
        </div>
      </form>
    </div>
  );
}

export default GaudePromptInput;
