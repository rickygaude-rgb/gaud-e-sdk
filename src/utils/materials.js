/**
 * Three.js Material Library for BIM Visualization
 * Pre-configured materials for common building materials and surfaces
 */

/**
 * BIM Materials Library
 * Each material includes color, roughness, metalness, and opacity
 * Optimized for realistic architectural visualization
 */
export const BIM_MATERIALS = {
  concrete: {
    name: 'Concrete',
    color: '#a0a0a0',
    roughness: 0.85,
    metalness: 0,
    opacity: 1,
    type: 'standard',
    normalScale: { x: 1, y: 1 },
  },
  brick: {
    name: 'Brick',
    color: '#c86c3c',
    roughness: 0.9,
    metalness: 0,
    opacity: 1,
    type: 'standard',
    normalScale: { x: 1.2, y: 1.2 },
  },
  glass: {
    name: 'Glass',
    color: '#e8f4f8',
    roughness: 0.1,
    metalness: 0,
    opacity: 0.6,
    type: 'physical',
    transmission: 0.95,
    ior: 1.5,
  },
  wood: {
    name: 'Wood',
    color: '#8b6914',
    roughness: 0.6,
    metalness: 0,
    opacity: 1,
    type: 'standard',
    normalScale: { x: 0.8, y: 0.8 },
  },
  steel: {
    name: 'Steel',
    color: '#5a5a5a',
    roughness: 0.3,
    metalness: 0.95,
    opacity: 1,
    type: 'physical',
  },
  aluminum: {
    name: 'Aluminum',
    color: '#d0d0d0',
    roughness: 0.25,
    metalness: 0.9,
    opacity: 1,
    type: 'physical',
  },
  copper: {
    name: 'Copper',
    color: '#b87333',
    roughness: 0.4,
    metalness: 1,
    opacity: 1,
    type: 'physical',
  },
  pvc: {
    name: 'PVC',
    color: '#f5f5f5',
    roughness: 0.7,
    metalness: 0,
    opacity: 1,
    type: 'standard',
  },
  terrain: {
    name: 'Terrain/Earth',
    color: '#6b5644',
    roughness: 0.95,
    metalness: 0,
    opacity: 1,
    type: 'standard',
    normalScale: { x: 0.5, y: 0.5 },
  },
  grass: {
    name: 'Grass',
    color: '#3d7c2a',
    roughness: 0.95,
    metalness: 0,
    opacity: 1,
    type: 'standard',
  },
  stone: {
    name: 'Stone',
    color: '#7a7a7a',
    roughness: 0.8,
    metalness: 0,
    opacity: 1,
    type: 'standard',
    normalScale: { x: 1, y: 1 },
  },
  ceramic: {
    name: 'Ceramic',
    color: '#f0ebe0',
    roughness: 0.5,
    metalness: 0,
    opacity: 1,
    type: 'standard',
  },
  plastic: {
    name: 'Plastic',
    color: '#cccccc',
    roughness: 0.4,
    metalness: 0,
    opacity: 1,
    type: 'standard',
  },
  fabric: {
    name: 'Fabric',
    color: '#888888',
    roughness: 0.8,
    metalness: 0,
    opacity: 1,
    type: 'standard',
  },
  drywall: {
    name: 'Drywall',
    color: '#efefef',
    roughness: 0.9,
    metalness: 0,
    opacity: 1,
    type: 'standard',
  },
  stainless: {
    name: 'Stainless Steel',
    color: '#c0c0c0',
    roughness: 0.2,
    metalness: 0.98,
    opacity: 1,
    type: 'physical',
  },
  paint: {
    name: 'Paint',
    color: '#ffffff',
    roughness: 0.75,
    metalness: 0,
    opacity: 1,
    type: 'standard',
  },
};

/**
 * Get material properties for an element type
 * Maps BIM element types to appropriate materials
 * @param {string} elementType - BIM element type (wall, column, window, etc.)
 * @returns {object} Material properties object
 */
export function getMaterialForElement(elementType) {
  const elementMaterialMap = {
    wall: BIM_MATERIALS.drywall,
    column: BIM_MATERIALS.concrete,
    slab: BIM_MATERIALS.concrete,
    floor: BIM_MATERIALS.concrete,
    door: BIM_MATERIALS.wood,
    window: BIM_MATERIALS.glass,
    beam: BIM_MATERIALS.steel,
    pipe: BIM_MATERIALS.pvc,
    conduit: BIM_MATERIALS.pvc,
    fixture: BIM_MATERIALS.stainless,
    stair: BIM_MATERIALS.concrete,
    roof: BIM_MATERIALS.concrete,
    foundation: BIM_MATERIALS.concrete,
    ramp: BIM_MATERIALS.concrete,
    handrail: BIM_MATERIALS.steel,
    partition: BIM_MATERIALS.drywall,
    equipment: BIM_MATERIALS.aluminum,
  };

  return elementMaterialMap[elementType] || BIM_MATERIALS.concrete;
}

/**
 * Get a material by name
 * @param {string} materialName - Material name (key in BIM_MATERIALS)
 * @returns {object} Material properties or null if not found
 */
export function getMaterialByName(materialName) {
  return BIM_MATERIALS[materialName] || null;
}

/**
 * Create a custom material configuration
 * @param {string} name - Material name
 * @param {object} config - Material properties
 * @returns {object} Complete material configuration
 */
export function createCustomMaterial(
  name,
  config = {}
) {
  return {
    name: name || 'Custom Material',
    color: config.color || '#888888',
    roughness: Math.max(0, Math.min(1, config.roughness || 0.5)),
    metalness: Math.max(0, Math.min(1, config.metalness || 0)),
    opacity: Math.max(0, Math.min(1, config.opacity || 1)),
    type: config.type || 'standard',
    normalScale: config.normalScale || { x: 1, y: 1 },
    ...config,
  };
}

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color code (#RRGGBB)
 * @returns {object} RGB object {r, g, b} with values 0-1
 */
export function hexToRGB(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return { r: 0.5, g: 0.5, b: 0.5 };
  }
  return {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  };
}

/**
 * Convert RGB to hex color
 * @param {object} rgb - RGB object with r, g, b (0-1 or 0-255)
 * @returns {string} Hex color code
 */
export function rgbToHex(rgb) {
  const toHex = (val) => {
    const num = Math.round(val > 1 ? val : val * 255);
    return num.toString(16).padStart(2, '0');
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Create a semi-transparent material for visualization
 * @param {string} materialName - Base material to modify
 * @param {number} opacity - Opacity value (0-1)
 * @returns {object} Transparent material
 */
export function createTransparentMaterial(materialName, opacity = 0.5) {
  const baseMaterial = getMaterialByName(materialName) || BIM_MATERIALS.concrete;
  return {
    ...baseMaterial,
    name: `${baseMaterial.name} (Transparent)`,
    opacity: Math.max(0, Math.min(1, opacity)),
  };
}

/**
 * Get all available material names
 * @returns {array} Array of material name keys
 */
export function getAllMaterialNames() {
  return Object.keys(BIM_MATERIALS);
}

/**
 * Create a material with modified color
 * @param {string} materialName - Base material
 * @param {string} hexColor - New hex color
 * @returns {object} Modified material
 */
export function recolorMaterial(materialName, hexColor) {
  const baseMaterial = getMaterialByName(materialName) || BIM_MATERIALS.concrete;
  return {
    ...baseMaterial,
    color: hexColor,
    name: `${baseMaterial.name} (${hexColor})`,
  };
}

/**
 * Adjust material roughness
 * @param {string} materialName - Base material
 * @param {number} roughness - Roughness value (0-1)
 * @returns {object} Modified material
 */
export function adjustRoughness(materialName, roughness) {
  const baseMaterial = getMaterialByName(materialName) || BIM_MATERIALS.concrete;
  const clampedRoughness = Math.max(0, Math.min(1, roughness));
  return {
    ...baseMaterial,
    roughness: clampedRoughness,
    name: `${baseMaterial.name} (Roughness: ${(clampedRoughness * 100).toFixed(0)}%)`,
  };
}

/**
 * Adjust material metalness
 * @param {string} materialName - Base material
 * @param {number} metalness - Metalness value (0-1)
 * @returns {object} Modified material
 */
export function adjustMetalness(materialName, metalness) {
  const baseMaterial = getMaterialByName(materialName) || BIM_MATERIALS.concrete;
  const clampedMetalness = Math.max(0, Math.min(1, metalness));
  return {
    ...baseMaterial,
    metalness: clampedMetalness,
    name: `${baseMaterial.name} (Metalness: ${(clampedMetalness * 100).toFixed(0)}%)`,
  };
}

/**
 * Get materials grouped by category
 * @returns {object} Materials grouped by type (structural, finishes, openings, etc.)
 */
export function getMaterialsByCategory() {
  return {
    structural: ['concrete', 'steel', 'wood', 'brick'],
    finishes: ['paint', 'drywall', 'ceramic', 'fabric'],
    openings: ['glass', 'wood', 'aluminum'],
    mep: ['pvc', 'copper', 'stainless', 'aluminum'],
    landscape: ['terrain', 'grass', 'stone'],
    metals: ['steel', 'aluminum', 'copper', 'stainless'],
    transparent: ['glass', 'plastic'],
  };
}
