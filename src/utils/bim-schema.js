/**
 * BIM Schema Validator and Utilities
 * Defines and validates GAUD-E BIM JSON schema structure
 */

/**
 * Supported BIM element types
 */
export const ELEMENT_TYPES = [
  'wall',
  'column',
  'slab',
  'door',
  'window',
  'beam',
  'pipe',
  'conduit',
  'fixture',
  'stair',
  'roof',
  'foundation',
  'ramp',
  'handrail',
  'partition',
  'equipment',
];

/**
 * GAUD-E BIM JSON Schema definition
 * Complete specification for building information modeling
 */
const BIM_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'GAUD-E BIM Model',
  description: 'Building Information Model in JSON format for GAUD-E platform',
  type: 'object',
  required: ['metadata', 'building'],
  properties: {
    metadata: {
      type: 'object',
      required: ['name', 'version'],
      properties: {
        name: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
          description: 'Project name',
        },
        description: {
          type: 'string',
          maxLength: 1000,
          description: 'Project description',
        },
        version: {
          type: 'string',
          pattern: '^\\d+\\.\\d+\\.\\d+$',
          description: 'BIM schema version (semver)',
        },
        created: {
          type: 'string',
          format: 'date-time',
          description: 'Creation timestamp',
        },
        modified: {
          type: 'string',
          format: 'date-time',
          description: 'Last modification timestamp',
        },
        author: {
          type: 'string',
          maxLength: 255,
          description: 'Creator/author name',
        },
        units: {
          type: 'string',
          enum: ['meters', 'feet', 'millimeters'],
          default: 'meters',
          description: 'Linear measurement units',
        },
        location: {
          type: 'object',
          properties: {
            latitude: { type: 'number', minimum: -90, maximum: 90 },
            longitude: { type: 'number', minimum: -180, maximum: 180 },
            elevation: { type: 'number', description: 'Elevation in units' },
            address: { type: 'string', maxLength: 500 },
          },
        },
      },
    },
    building: {
      type: 'object',
      required: ['name', 'storeys'],
      properties: {
        name: {
          type: 'string',
          minLength: 1,
          description: 'Building name',
        },
        type: {
          type: 'string',
          enum: [
            'residential',
            'commercial',
            'industrial',
            'institutional',
            'mixed-use',
            'other',
          ],
          description: 'Building classification',
        },
        footprintArea: {
          type: 'number',
          minimum: 0,
          description: 'Total footprint area',
        },
        totalArea: {
          type: 'number',
          minimum: 0,
          description: 'Total built area',
        },
        height: {
          type: 'number',
          minimum: 0,
          description: 'Total height from ground',
        },
        baseElevation: {
          type: 'number',
          default: 0,
          description: 'Ground level elevation',
        },
        storeys: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            required: ['id', 'name', 'level', 'height'],
            properties: {
              id: {
                type: 'string',
                description: 'Unique storey identifier',
              },
              name: {
                type: 'string',
                minLength: 1,
                description: 'Storey name (Ground, Level 1, etc.)',
              },
              level: {
                type: 'number',
                description: 'Elevation level from base',
              },
              height: {
                type: 'number',
                minimum: 0,
                description: 'Storey height',
              },
              area: {
                type: 'number',
                minimum: 0,
                description: 'Usable area on this storey',
              },
              elements: {
                type: 'array',
                items: {
                  $ref: '#/definitions/element',
                },
              },
              spaces: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['id', 'name', 'type', 'area'],
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    type: {
                      type: 'string',
                      enum: [
                        'room',
                        'corridor',
                        'stairwell',
                        'elevator',
                        'mechanical',
                        'storage',
                        'outdoor',
                      ],
                    },
                    area: { type: 'number', minimum: 0 },
                    volume: { type: 'number', minimum: 0 },
                    level: { type: 'number' },
                    height: { type: 'number' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  definitions: {
    element: {
      type: 'object',
      required: ['id', 'type', 'location'],
      properties: {
        id: {
          type: 'string',
          description: 'Unique element identifier',
        },
        type: {
          type: 'string',
          enum: ELEMENT_TYPES,
          description: 'Element type classification',
        },
        name: {
          type: 'string',
          description: 'Element name/label',
        },
        location: {
          type: 'object',
          required: ['x', 'y', 'z'],
          properties: {
            x: { type: 'number', description: 'X coordinate' },
            y: { type: 'number', description: 'Y coordinate' },
            z: { type: 'number', description: 'Z coordinate (elevation)' },
          },
        },
        dimensions: {
          type: 'object',
          properties: {
            width: { type: 'number', minimum: 0 },
            height: { type: 'number', minimum: 0 },
            depth: { type: 'number', minimum: 0 },
            length: { type: 'number', minimum: 0 },
            thickness: { type: 'number', minimum: 0 },
            diameter: { type: 'number', minimum: 0 },
          },
        },
        material: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            type: {
              type: 'string',
              enum: [
                'concrete',
                'brick',
                'glass',
                'wood',
                'steel',
                'aluminum',
                'copper',
                'pvc',
                'stone',
                'ceramic',
                'plastic',
                'fabric',
              ],
            },
            color: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
            roughness: { type: 'number', minimum: 0, maximum: 1 },
            metalness: { type: 'number', minimum: 0, maximum: 1 },
            opacity: { type: 'number', minimum: 0, maximum: 1 },
          },
        },
        properties: {
          type: 'object',
          additionalProperties: true,
          description: 'Element-specific properties',
        },
        storey: {
          type: 'string',
          description: 'Reference to parent storey ID',
        },
        rotation: {
          type: 'object',
          description: 'Rotation in degrees',
          properties: {
            x: { type: 'number' },
            y: { type: 'number' },
            z: { type: 'number' },
          },
        },
      },
    },
  },
};

/**
 * Validate a BIM model JSON against schema
 * @param {object} bimModel - BIM model to validate
 * @returns {object} Validation result { valid: boolean, errors: array }
 */
export function validateBIMModel(bimModel) {
  const errors = [];

  if (!bimModel || typeof bimModel !== 'object') {
    return {
      valid: false,
      errors: ['Model must be a valid JSON object'],
    };
  }

  // Check required top-level fields
  if (!bimModel.metadata) {
    errors.push('Missing required field: metadata');
  }
  if (!bimModel.building) {
    errors.push('Missing required field: building');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Validate metadata
  const meta = bimModel.metadata;
  if (!meta.name || typeof meta.name !== 'string' || meta.name.length === 0) {
    errors.push('metadata.name must be a non-empty string');
  }
  if (!meta.version || typeof meta.version !== 'string') {
    errors.push('metadata.version must be a valid semver string (e.g., 1.0.0)');
  }
  if (
    meta.units &&
    !['meters', 'feet', 'millimeters'].includes(meta.units)
  ) {
    errors.push(
      'metadata.units must be one of: meters, feet, millimeters'
    );
  }

  // Validate building
  const building = bimModel.building;
  if (!building.name || typeof building.name !== 'string') {
    errors.push('building.name must be a non-empty string');
  }
  if (!Array.isArray(building.storeys) || building.storeys.length === 0) {
    errors.push('building.storeys must be a non-empty array');
  } else {
    building.storeys.forEach((storey, idx) => {
      if (!storey.id || typeof storey.id !== 'string') {
        errors.push(`building.storeys[${idx}].id must be a non-empty string`);
      }
      if (!storey.name || typeof storey.name !== 'string') {
        errors.push(`building.storeys[${idx}].name must be a non-empty string`);
      }
      if (typeof storey.level !== 'number') {
        errors.push(`building.storeys[${idx}].level must be a number`);
      }
      if (typeof storey.height !== 'number' || storey.height <= 0) {
        errors.push(`building.storeys[${idx}].height must be a positive number`);
      }

      // Validate elements
      if (Array.isArray(storey.elements)) {
        storey.elements.forEach((elem, elemIdx) => {
          if (!elem.id || typeof elem.id !== 'string') {
            errors.push(
              `building.storeys[${idx}].elements[${elemIdx}].id must be a non-empty string`
            );
          }
          if (!ELEMENT_TYPES.includes(elem.type)) {
            errors.push(
              `building.storeys[${idx}].elements[${elemIdx}].type must be one of: ${ELEMENT_TYPES.join(', ')}`
            );
          }
          if (!elem.location || typeof elem.location !== 'object') {
            errors.push(
              `building.storeys[${idx}].elements[${elemIdx}].location must be an object with x, y, z`
            );
          } else {
            const loc = elem.location;
            if (typeof loc.x !== 'number' || typeof loc.y !== 'number' || typeof loc.z !== 'number') {
              errors.push(
                `building.storeys[${idx}].elements[${elemIdx}].location must have numeric x, y, z coordinates`
              );
            }
          }
        });
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    schema: BIM_SCHEMA,
  };
}

/**
 * Get list of supported element types
 * @returns {array} Array of valid element type strings
 */
export function getElementTypes() {
  return [...ELEMENT_TYPES];
}

/**
 * Create an empty BIM model template
 * Useful for starting a new model or as a reference
 * @param {string} name - Project name
 * @param {object} options - Optional configuration
 * @returns {object} Empty BIM model template
 */
export function createEmptyModel(name = 'New Project', options = {}) {
  const now = new Date().toISOString();

  return {
    metadata: {
      name: name || 'New Project',
      description: options.description || '',
      version: '1.0.0',
      created: now,
      modified: now,
      author: options.author || 'GAUD-E SDK',
      units: options.units || 'meters',
      location: options.location || {
        latitude: 0,
        longitude: 0,
        elevation: 0,
        address: '',
      },
    },
    building: {
      name: options.buildingName || name,
      type: options.buildingType || 'residential',
      footprintArea: 0,
      totalArea: 0,
      height: 0,
      baseElevation: options.baseElevation || 0,
      storeys: [
        {
          id: 'ground-floor',
          name: 'Ground Floor',
          level: 0,
          height: options.defaultStoreyHeight || 3.5,
          area: 0,
          elements: [],
          spaces: [],
        },
      ],
    },
  };
}

/**
 * Get BIM schema definition
 * @returns {object} Complete JSON schema
 */
export function getBIMSchema() {
  return JSON.parse(JSON.stringify(BIM_SCHEMA));
}

/**
 * Create a BIM element object with default values
 * @param {string} type - Element type (must be in ELEMENT_TYPES)
 * @param {object} data - Element data
 * @returns {object} BIM element with defaults
 */
export function createElement(type, data = {}) {
  if (!ELEMENT_TYPES.includes(type)) {
    throw new Error(
      `Invalid element type. Must be one of: ${ELEMENT_TYPES.join(', ')}`
    );
  }

  const id = data.id || `${type}-${Date.now()}`;
  const location = data.location || { x: 0, y: 0, z: 0 };

  return {
    id,
    type,
    name: data.name || `${type.charAt(0).toUpperCase() + type.slice(1)}`,
    location,
    dimensions: data.dimensions || {
      width: 0,
      height: 0,
      depth: 0,
    },
    material: data.material || {
      type: 'concrete',
      name: 'Default Material',
      color: '#888888',
      roughness: 0.8,
      metalness: 0,
      opacity: 1,
    },
    properties: data.properties || {},
    rotation: data.rotation || { x: 0, y: 0, z: 0 },
    ...data,
  };
}

/**
 * Calculate total area of all storeys
 * @param {object} bimModel - BIM model
 * @returns {number} Total area
 */
export function calculateTotalArea(bimModel) {
  if (!bimModel?.building?.storeys) {
    return 0;
  }
  return bimModel.building.storeys.reduce((sum, storey) => sum + (storey.area || 0), 0);
}

/**
 * Get element count by type
 * @param {object} bimModel - BIM model
 * @returns {object} Count of each element type
 */
export function getElementCounts(bimModel) {
  const counts = {};
  ELEMENT_TYPES.forEach((type) => {
    counts[type] = 0;
  });

  if (bimModel?.building?.storeys) {
    bimModel.building.storeys.forEach((storey) => {
      if (Array.isArray(storey.elements)) {
        storey.elements.forEach((elem) => {
          if (elem.type && counts.hasOwnProperty(elem.type)) {
            counts[elem.type]++;
          }
        });
      }
    });
  }

  return counts;
}
