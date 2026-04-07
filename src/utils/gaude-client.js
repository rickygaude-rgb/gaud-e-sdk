/**
 * GAUD-E Client
 * Main API client for interacting with GAUD-E Platform API
 * Routes all AI/generation services through api.gaude.ai
 * No proprietary generation code is exposed - SDK is a secure wrapper
 */

/**
 * Custom error class for GAUD-E API errors
 */
export class GaudeAPIError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {string} code - GAUD-E error code
   * @param {object} details - Additional error details
   */
  constructor(message, statusCode, code, details = {}) {
    super(message);
    this.name = 'GaudeAPIError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

/**
 * GAUD-E Client for BIM generation and model management
 * All generation happens server-side via GAUD-E Platform API
 */
export class GaudeClient {
  /**
   * Initialize GAUD-E Client
   * @param {string} apiKey - GAUD-E API key (format: gde_...)
   * @param {string} baseUrl - API base URL (default: https://api.gaude.ai/v1)
   * @throws {Error} If API key format is invalid
   */
  constructor(apiKey, baseUrl = 'https://api.gaude.ai/v1') {
    this.validateApiKey(apiKey);
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.requestCount = 0;
    this.rateLimitWindow = 60 * 1000; // 1 minute
    this.rateLimit = 100; // 100 requests per minute
    this.requestTimestamps = [];
    this.retryAttempts = 3;
    this.retryDelayMs = 1000;

    // Warn if API key appears to be exposed in client-side environment
    if (typeof window !== 'undefined') {
      console.warn(
        '[GAUD-E] Warning: API key detected in client-side code. ' +
          'For production apps, consider routing API calls through your backend.'
      );
    }
  }

  /**
   * Validate API key format
   * @private
   * @param {string} apiKey - API key to validate
   * @throws {Error} If API key doesn't match expected format
   */
  validateApiKey(apiKey) {
    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error('API key must be a non-empty string');
    }
    if (!apiKey.startsWith('gde_')) {
      throw new Error(
        'Invalid API key format. Keys must start with "gde_". ' +
          'Get a valid key from https://platform.gaude.ai/api-keys'
      );
    }
  }

  /**
   * Check rate limiting
   * @private
   * @throws {Error} If rate limit exceeded
   */
  checkRateLimit() {
    const now = Date.now();
    // Remove timestamps outside the current window
    this.requestTimestamps = this.requestTimestamps.filter(
      (ts) => now - ts < this.rateLimitWindow
    );

    if (this.requestTimestamps.length >= this.rateLimit) {
      throw new Error(
        `Rate limit exceeded. Maximum ${this.rateLimit} requests per minute.`
      );
    }
    this.requestTimestamps.push(now);
  }

  /**
   * Make HTTP request with retry logic and error handling
   * @private
   * @param {string} method - HTTP method
   * @param {string} endpoint - API endpoint path
   * @param {object} data - Request body data
   * @param {object} options - Request options
   * @returns {Promise<object>} API response
   */
  async request(method, endpoint, data = null, options = {}) {
    this.checkRateLimit();

    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
      'User-Agent': 'GAUD-E-SDK/2.0.0',
      ...options.headers,
    };

    const config = {
      method,
      headers,
      ...options,
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data);
    }

    let lastError;
    for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, config);

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({}));
          throw new GaudeAPIError(
            errorData.message || `HTTP ${response.status}`,
            response.status,
            errorData.code || 'UNKNOWN_ERROR',
            errorData
          );
        }

        return await response.json();
      } catch (error) {
        lastError = error;

        // Don't retry client errors (4xx)
        if (error instanceof GaudeAPIError && error.statusCode < 500) {
          throw error;
        }

        // Exponential backoff for retries
        if (attempt < this.retryAttempts - 1) {
          const delay = this.retryDelayMs * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  /**
   * Generate a BIM model from a natural language prompt
   * Server-side AI generates the architecture - SDK receives final JSON BIM
   * @param {string} prompt - Architecture description in natural language
   * @param {object} options - Generation options
   * @param {string} options.negativePrompt - What to avoid in generation
   * @param {array} options.polygon - [lat, lng] array for terrain location
   * @param {string} options.conceptStyle - Design style (Minimalist, Bioclimatic, etc.)
   * @param {object} options.generationParams - Advanced generation parameters
   * @returns {Promise<object>} Job info with jobId and status
   */
  async generateBIM(prompt, options = {}) {
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Prompt must be a non-empty string');
    }

    const payload = {
      prompt: prompt.trim(),
      negativePrompt: options.negativePrompt || '',
      polygon: options.polygon || null,
      conceptStyle: options.conceptStyle || 'Minimalist',
      generationParams: {
        detailLevel: options.generationParams?.detailLevel || 'standard',
        iterations: options.generationParams?.iterations || 1,
        seed: options.generationParams?.seed || null,
        ...options.generationParams,
      },
    };

    return this.request('POST', '/generate', payload);
  }

  /**
   * Get status of a generation job
   * @param {string} jobId - Job ID returned from generateBIM
   * @returns {Promise<object>} Job status, progress, and model data if complete
   */
  async getGenerationStatus(jobId) {
    if (!jobId || typeof jobId !== 'string') {
      throw new Error('Job ID must be a non-empty string');
    }
    return this.request('GET', `/jobs/${jobId}`);
  }

  /**
   * Retrieve a generated BIM model as JSON
   * @param {string} modelId - Model ID from completed generation job
   * @returns {Promise<object>} Complete BIM model in JSON format
   */
  async getModel(modelId) {
    if (!modelId || typeof modelId !== 'string') {
      throw new Error('Model ID must be a non-empty string');
    }
    return this.request('GET', `/models/${modelId}`);
  }

  /**
   * Export generated BIM model to IFC format
   * IFC export happens server-side with Python gaude_ifc_writer
   * @param {string} modelId - Model ID to export
   * @param {object} options - Export options
   * @param {boolean} options.includeMetadata - Include all metadata (default: true)
   * @returns {Promise<Blob>} IFC file content
   */
  async exportIFC(modelId, options = {}) {
    if (!modelId || typeof modelId !== 'string') {
      throw new Error('Model ID must be a non-empty string');
    }

    const params = new URLSearchParams({
      format: 'ifc',
      includeMetadata: options.includeMetadata !== false,
    });

    const url = `${this.baseUrl}/models/${modelId}/export?${params}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'User-Agent': 'GAUD-E-SDK/2.0.0',
      },
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({}));
      throw new GaudeAPIError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData.code || 'EXPORT_FAILED',
        errorData
      );
    }

    return response.blob();
  }

  /**
   * Export generated BIM model to glTF/GLB format for 3D visualization
   * @param {string} modelId - Model ID to export
   * @param {object} options - Export options
   * @param {string} options.format - 'gltf' or 'glb' (default: 'glb')
   * @returns {Promise<Blob>} glTF file content
   */
  async exportGLTF(modelId, options = {}) {
    if (!modelId || typeof modelId !== 'string') {
      throw new Error('Model ID must be a non-empty string');
    }

    const format = options.format === 'gltf' ? 'gltf' : 'glb';
    const params = new URLSearchParams({ format });

    const url = `${this.baseUrl}/models/${modelId}/export?${params}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'User-Agent': 'GAUD-E-SDK/2.0.0',
      },
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({}));
      throw new GaudeAPIError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData.code || 'EXPORT_FAILED',
        errorData
      );
    }

    return response.blob();
  }

  /**
   * Generate a concept image (rendering) of the BIM design
   * Server-side AI generates high-quality architectural renderings
   * @param {string} prompt - Scene description
   * @param {string} style - Rendering style (Photorealistic, Sketch, Wireframe, etc.)
   * @returns {Promise<object>} Image generation job info
   */
  async generateConceptImage(prompt, style = 'Photorealistic') {
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Prompt must be a non-empty string');
    }

    const validStyles = [
      'Photorealistic',
      'Sketch',
      'Wireframe',
      'Technical',
      'Artistic',
      'Minimalist',
    ];
    const normalizedStyle = validStyles.includes(style) ? style : 'Photorealistic';

    return this.request('POST', '/images/generate', {
      prompt: prompt.trim(),
      style: normalizedStyle,
    });
  }

  /**
   * Connect GAUD-E to external CAD/BIM software
   * Enables real-time sync with Revit, ArchiCAD, Rhino, etc. via MCP
   * @param {string} software - Target software (revit, archicad, rhino, sketchup, autocad)
   * @param {number} port - Local port for connector (default: varies by software)
   * @returns {Promise<object>} Connector status and connection details
   */
  async connectSoftware(software, port = null) {
    const validSoftware = [
      'revit',
      'archicad',
      'rhino',
      'sketchup',
      'autocad',
      'vectorworks',
    ];
    if (!validSoftware.includes(software?.toLowerCase())) {
      throw new Error(
        `Unsupported software. Must be one of: ${validSoftware.join(', ')}`
      );
    }

    return this.request('POST', `/connectors/${software.toLowerCase()}`, {
      port: port || null,
    });
  }

  /**
   * Get account credit usage and limits
   * @returns {Promise<object>} Credits remaining, usage stats, tier info
   */
  async getCredits() {
    return this.request('GET', '/account/credits');
  }

  /**
   * List all generated models in the account
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Results per page (default: 20, max: 100)
   * @returns {Promise<object>} Paginated list of models with metadata
   */
  async listModels(page = 1, limit = 20) {
    if (page < 1 || !Number.isInteger(page)) {
      throw new Error('Page must be a positive integer');
    }
    if (limit < 1 || limit > 100 || !Number.isInteger(limit)) {
      throw new Error('Limit must be an integer between 1 and 100');
    }

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return this.request('GET', `/models?${params}`);
  }

  /**
   * Get API usage statistics
   * @returns {Promise<object>} Usage data, rate limits, quota info
   */
  async getUsageStats() {
    return this.request('GET', '/account/usage');
  }

  /**
   * Validate a BIM JSON model structure
   * Server-side validation against GAUD-E BIM schema
   * @param {object} bimModel - BIM model JSON object
   * @returns {Promise<object>} Validation result with errors if any
   */
  async validateModel(bimModel) {
    if (!bimModel || typeof bimModel !== 'object') {
      throw new Error('Model must be a valid JSON object');
    }

    return this.request('POST', '/models/validate', bimModel);
  }

  /**
   * Get information about available generation capabilities
   * @returns {Promise<object>} Available styles, element types, parameters
   */
  async getCapabilities() {
    return this.request('GET', '/capabilities');
  }

  /**
   * Healthcheck endpoint to verify API connectivity
   * @returns {Promise<object>} API status and version info
   */
  async healthCheck() {
    return this.request('GET', '/health');
  }

  /**
   * Update generation parameters after creation but before processing
   * @param {string} jobId - Job ID to update
   * @param {object} updates - Fields to update
   * @returns {Promise<object>} Updated job info
   */
  async updateGenerationJob(jobId, updates = {}) {
    if (!jobId || typeof jobId !== 'string') {
      throw new Error('Job ID must be a non-empty string');
    }

    return this.request('PATCH', `/jobs/${jobId}`, updates);
  }

  /**
   * Cancel an in-progress generation job
   * @param {string} jobId - Job ID to cancel
   * @returns {Promise<object>} Cancellation confirmation
   */
  async cancelGenerationJob(jobId) {
    if (!jobId || typeof jobId !== 'string') {
      throw new Error('Job ID must be a non-empty string');
    }

    return this.request('POST', `/jobs/${jobId}/cancel`, {});
  }

  /**
   * Get detailed logs for a generation job (for debugging)
   * @param {string} jobId - Job ID to get logs for
   * @returns {Promise<object>} Detailed generation logs from all 7 agents (4 phases)
   */
  async getJobLogs(jobId) {
    if (!jobId || typeof jobId !== 'string') {
      throw new Error('Job ID must be a non-empty string');
    }

    return this.request('GET', `/jobs/${jobId}/logs`);
  }
}
