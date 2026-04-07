/**
 * GAUD-E SDK Main Entry Point
 * Export all public APIs for integration into React applications
 */

// Core API Client
export { GaudeClient, GaudeAPIError } from './utils/gaude-client';

// BIM Schema and Utilities
export {
  validateBIMModel,
  createEmptyModel,
  getElementTypes,
  getBIMSchema,
  createElement,
  calculateTotalArea,
  getElementCounts,
  ELEMENT_TYPES,
} from './utils/bim-schema';

// Materials Library
export {
  BIM_MATERIALS,
  getMaterialForElement,
  getMaterialByName,
  createCustomMaterial,
  hexToRGB,
  rgbToHex,
  createTransparentMaterial,
  getAllMaterialNames,
  recolorMaterial,
  adjustRoughness,
  adjustMetalness,
  getMaterialsByCategory,
} from './utils/materials';

// React Hooks
export { useGaude } from './hooks/useGaude';
export {
  useBIMViewer,
  RENDER_MODES,
  LAYER_CATEGORIES,
} from './hooks/useBIMViewer';

// React Components
export { GaudeBIMViewer } from './components/GaudeBIMViewer';
export { GaudeMapSelector } from './components/GaudeMapSelector';
export { GaudePromptInput, CONCEPT_STYLES } from './components/GaudePromptInput';
export { GaudeGenerationStatus, AGENTS, PHASES } from './components/GaudeGenerationStatus';

/**
 * SDK Version
 */
export const SDK_VERSION = '2.0.0';

/**
 * Get SDK information
 */
export function getSDKInfo() {
  return {
    name: '@gaude/sdk',
    version: SDK_VERSION,
    description: 'GAUD-E Developer SDK — 7-Agent AI Pipeline for BIM generation (GPS-to-BIM)',
    pipeline: '7 agents across 4 phases: Enhancer → Architect → [Structural ∥ MEP ∥ Landscape] → Programmer → Reviewer',
    platform: 'https://www.gps-2-bim.app',
    author: 'GAUD-E Architect AI',
    license: 'MIT',
    repository: 'https://github.com/rickygaude-rgb/gaud-e-sdk',
    documentation: 'https://docs.gaude.ai/sdk',
  };
}

/**
 * Initialize SDK with configuration
 * @param {object} config - Configuration object
 * @returns {object} Initialized SDK configuration
 */
export function initializeGaudeSDK(config = {}) {
  return {
    apiKey: config.apiKey || process.env.VITE_GAUDE_API_KEY,
    apiUrl: config.apiUrl || process.env.VITE_GAUDE_API_URL || 'https://api.gaude.ai/v1',
    googleMapsKey: config.googleMapsKey || process.env.VITE_GOOGLE_MAPS_KEY,
    debugMode: config.debugMode || process.env.VITE_DEBUG_MODE === 'true',
    logLevel: config.logLevel || process.env.VITE_LOG_LEVEL || 'info',
  };
}
