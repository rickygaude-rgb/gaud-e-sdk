/**
 * React Hook: useBIMViewer
 * Manages 3D BIM model visualization state and controls
 */

import { useState, useCallback, useMemo } from 'react';

/**
 * Render modes for BIM visualization
 */
export const RENDER_MODES = {
  REALISTIC: 'realistic',
  WIREFRAME: 'wireframe',
  XRAY: 'xray',
  OUTLINE: 'outline',
  FLAT: 'flat',
};

/**
 * Layer categories for BIM visualization
 */
export const LAYER_CATEGORIES = {
  STRUCTURE: 'structure',
  ARCHITECTURE: 'architecture',
  MEP: 'mep',
  LANDSCAPE: 'landscape',
};

/**
 * useBIMViewer Hook
 * Manages state for 3D BIM model visualization
 * Handles layer visibility, render modes, selection, and camera controls
 *
 * @param {object} bimModel - BIM model JSON object from GAUD-E
 * @param {object} options - Hook options
 * @param {boolean} options.autoLoadModel - Auto-load model on mount (default: true)
 * @returns {object} Hook state and control methods
 *
 * @example
 * const {
 *   elements,
 *   layers,
 *   toggleLayer,
 *   setRenderMode,
 *   renderMode,
 *   selectedElement,
 *   selectElement,
 *   getElementsByType,
 *   getStats
 * } = useBIMViewer(bimModel);
 */
export function useBIMViewer(bimModel, options = {}) {
  const [renderMode, setRenderMode] = useState(RENDER_MODES.REALISTIC);
  const [selectedElement, setSelectedElement] = useState(null);
  const [visibleLayers, setVisibleLayers] = useState({
    [LAYER_CATEGORIES.STRUCTURE]: true,
    [LAYER_CATEGORIES.ARCHITECTURE]: true,
    [LAYER_CATEGORIES.MEP]: true,
    [LAYER_CATEGORIES.LANDSCAPE]: true,
  });
  const [highlightMode, setHighlightMode] = useState('none'); // 'byType', 'byMaterial', 'none'
  const [highlightFilter, setHighlightFilter] = useState(null);

  // Extract and organize elements from BIM model
  const elements = useMemo(() => {
    if (!bimModel?.building?.storeys) {
      return [];
    }

    const allElements = [];
    bimModel.building.storeys.forEach((storey) => {
      if (Array.isArray(storey.elements)) {
        storey.elements.forEach((element) => {
          allElements.push({
            ...element,
            storeyId: storey.id,
            storeyName: storey.name,
            storeyLevel: storey.level,
            layer: getElementLayer(element.type),
            visible:
              visibleLayers[getElementLayer(element.type)] !== false,
          });
        });
      }
    });
    return allElements;
  }, [bimModel, visibleLayers]);

  // Organize elements by layer
  const layers = useMemo(() => {
    const layerMap = {};
    Object.values(LAYER_CATEGORIES).forEach((layer) => {
      layerMap[layer] = elements.filter((e) => e.layer === layer);
    });
    return layerMap;
  }, [elements]);

  /**
   * Map element type to layer category
   * @private
   */
  function getElementLayer(elementType) {
    const layerMap = {
      // Structure
      column: LAYER_CATEGORIES.STRUCTURE,
      beam: LAYER_CATEGORIES.STRUCTURE,
      slab: LAYER_CATEGORIES.STRUCTURE,
      foundation: LAYER_CATEGORIES.STRUCTURE,
      wall: LAYER_CATEGORIES.STRUCTURE,

      // Architecture
      door: LAYER_CATEGORIES.ARCHITECTURE,
      window: LAYER_CATEGORIES.ARCHITECTURE,
      roof: LAYER_CATEGORIES.ARCHITECTURE,
      partition: LAYER_CATEGORIES.ARCHITECTURE,
      stair: LAYER_CATEGORIES.ARCHITECTURE,
      ramp: LAYER_CATEGORIES.ARCHITECTURE,
      handrail: LAYER_CATEGORIES.ARCHITECTURE,

      // MEP (Mechanical, Electrical, Plumbing)
      pipe: LAYER_CATEGORIES.MEP,
      conduit: LAYER_CATEGORIES.MEP,
      fixture: LAYER_CATEGORIES.MEP,
      equipment: LAYER_CATEGORIES.MEP,

      // Landscape
    };

    return layerMap[elementType] || LAYER_CATEGORIES.LANDSCAPE;
  }

  /**
   * Toggle visibility of a layer
   * @param {string} layerName - Layer to toggle
   */
  const toggleLayer = useCallback((layerName) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layerName]: !prev[layerName],
    }));
  }, []);

  /**
   * Set visibility for multiple layers
   * @param {object} layerVisibility - Map of layer names to boolean visibility
   */
  const setLayerVisibility = useCallback((layerVisibility) => {
    setVisibleLayers(layerVisibility);
  }, []);

  /**
   * Toggle all layers on/off
   * @param {boolean} visible - Visibility state
   */
  const toggleAllLayers = useCallback((visible) => {
    const newVisibility = {};
    Object.keys(visibleLayers).forEach((layer) => {
      newVisibility[layer] = visible;
    });
    setVisibleLayers(newVisibility);
  }, [visibleLayers]);

  /**
   * Select an element
   * @param {object} element - Element to select
   */
  const selectElement = useCallback((element) => {
    setSelectedElement(element || null);
  }, []);

  /**
   * Deselect current element
   */
  const deselectElement = useCallback(() => {
    setSelectedElement(null);
  }, []);

  /**
   * Get elements by type
   * @param {string} type - Element type to filter by
   * @returns {array} Matching elements
   */
  const getElementsByType = useCallback(
    (type) => {
      return elements.filter((e) => e.type === type);
    },
    [elements]
  );

  /**
   * Get elements by material
   * @param {string} materialName - Material name to filter by
   * @returns {array} Matching elements
   */
  const getElementsByMaterial = useCallback(
    (materialName) => {
      return elements.filter((e) => e.material?.type === materialName);
    },
    [elements]
  );

  /**
   * Get elements by storey
   * @param {string} storeyId - Storey ID to filter by
   * @returns {array} Elements on that storey
   */
  const getElementsByStorey = useCallback(
    (storeyId) => {
      return elements.filter((e) => e.storeyId === storeyId);
    },
    [elements]
  );

  /**
   * Highlight elements by type
   * @param {string} type - Element type to highlight
   */
  const highlightByType = useCallback((type) => {
    if (highlightMode === 'byType' && highlightFilter === type) {
      setHighlightMode('none');
      setHighlightFilter(null);
    } else {
      setHighlightMode('byType');
      setHighlightFilter(type);
    }
  }, [highlightMode, highlightFilter]);

  /**
   * Highlight elements by material
   * @param {string} material - Material to highlight
   */
  const highlightByMaterial = useCallback((material) => {
    if (highlightMode === 'byMaterial' && highlightFilter === material) {
      setHighlightMode('none');
      setHighlightFilter(null);
    } else {
      setHighlightMode('byMaterial');
      setHighlightFilter(material);
    }
  }, [highlightMode, highlightFilter]);

  /**
   * Clear all highlighting
   */
  const clearHighlight = useCallback(() => {
    setHighlightMode('none');
    setHighlightFilter(null);
  }, []);

  /**
   * Get model statistics
   * @returns {object} Stats including element counts, areas, etc.
   */
  const getStats = useCallback(() => {
    const stats = {
      totalElements: elements.length,
      totalStoreys: bimModel?.building?.storeys?.length || 0,
      totalArea: bimModel?.building?.totalArea || 0,
      elementsByType: {},
      elementsByLayer: {},
      visibleElements: elements.filter((e) => e.visible).length,
    };

    // Count by type
    elements.forEach((e) => {
      stats.elementsByType[e.type] = (stats.elementsByType[e.type] || 0) + 1;
    });

    // Count by layer
    Object.keys(layers).forEach((layer) => {
      stats.elementsByLayer[layer] = layers[layer].length;
    });

    return stats;
  }, [elements, bimModel, layers]);

  /**
   * Get highlighted elements
   * @returns {array} Elements matching current highlight filter
   */
  const getHighlightedElements = useCallback(() => {
    if (highlightMode === 'none') {
      return [];
    }

    if (highlightMode === 'byType') {
      return getElementsByType(highlightFilter);
    }

    if (highlightMode === 'byMaterial') {
      return getElementsByMaterial(highlightFilter);
    }

    return [];
  }, [highlightMode, highlightFilter, getElementsByType, getElementsByMaterial]);

  /**
   * Get visible elements
   * @returns {array} Elements currently visible based on layer settings
   */
  const getVisibleElements = useCallback(() => {
    return elements.filter((e) => e.visible);
  }, [elements]);

  /**
   * Zoom to element bounds
   * @param {object} element - Element to zoom to
   * @returns {object} Camera target {position, lookAt}
   */
  const zoomToElement = useCallback((element) => {
    if (!element?.location) {
      return null;
    }

    const loc = element.location;
    const dims = element.dimensions || {};

    return {
      position: [
        loc.x + (dims.width || 0) / 2,
        loc.z + (dims.height || 0) * 2,
        loc.y + (dims.depth || 0) * 1.5,
      ],
      lookAt: [loc.x, loc.z + (dims.height || 0) / 2, loc.y],
      zoomDistance: Math.max(
        dims.width || 10,
        dims.height || 10,
        dims.depth || 10
      ),
    };
  }, []);

  /**
   * Get model bounding box
   * @returns {object} Bounding box {min, max}
   */
  const getBoundingBox = useCallback(() => {
    if (elements.length === 0) {
      return {
        min: { x: 0, y: 0, z: 0 },
        max: { x: 0, y: 0, z: 0 },
      };
    }

    let minX = Infinity,
      minY = Infinity,
      minZ = Infinity;
    let maxX = -Infinity,
      maxY = -Infinity,
      maxZ = -Infinity;

    elements.forEach((e) => {
      if (e.location) {
        const x = e.location.x || 0;
        const y = e.location.y || 0;
        const z = e.location.z || 0;
        const w = (e.dimensions?.width || 0) / 2;
        const d = (e.dimensions?.depth || 0) / 2;
        const h = e.dimensions?.height || 0;

        minX = Math.min(minX, x - w);
        maxX = Math.max(maxX, x + w);
        minY = Math.min(minY, y - d);
        maxY = Math.max(maxY, y + d);
        minZ = Math.min(minZ, z);
        maxZ = Math.max(maxZ, z + h);
      }
    });

    return {
      min: {
        x: minX === Infinity ? 0 : minX,
        y: minY === Infinity ? 0 : minY,
        z: minZ === Infinity ? 0 : minZ,
      },
      max: {
        x: maxX === -Infinity ? 0 : maxX,
        y: maxY === -Infinity ? 0 : maxY,
        z: maxZ === -Infinity ? 0 : maxZ,
      },
    };
  }, [elements]);

  return {
    // State
    elements,
    layers,
    renderMode,
    selectedElement,
    visibleLayers,
    highlightMode,
    highlightFilter,

    // Layer controls
    toggleLayer,
    setLayerVisibility,
    toggleAllLayers,

    // Render controls
    setRenderMode,

    // Selection
    selectElement,
    deselectElement,

    // Queries
    getElementsByType,
    getElementsByMaterial,
    getElementsByStorey,
    getVisibleElements,
    getHighlightedElements,

    // Highlighting
    highlightByType,
    highlightByMaterial,
    clearHighlight,

    // Utilities
    getStats,
    zoomToElement,
    getBoundingBox,

    // Constants
    RENDER_MODES,
    LAYER_CATEGORIES,
  };
}

export default useBIMViewer;
