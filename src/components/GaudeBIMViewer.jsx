/**
 * GaudeBIMViewer Component
 * 3D BIM model viewer using Three.js and React Three Fiber
 * Renders GAUD-E generated building information models
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { BIM_MATERIALS, getMaterialForElement, hexToRGB } from '../utils/materials';

/**
 * BIM Element 3D Mesh
 * Renders a single BIM element as a Three.js mesh
 */
function BIMElement({ element, material, isSelected, isHighlighted, renderMode }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (meshRef.current) {
      // Update material based on selection/highlighting
      if (isSelected) {
        meshRef.current.material.color.setHex(0xffff00);
        meshRef.current.material.emissive.setHex(0xffff00);
        meshRef.current.material.emissiveIntensity = 0.3;
      } else if (isHighlighted) {
        meshRef.current.material.color.setHex(0x00ff00);
        meshRef.current.material.emissive.setHex(0x00ff00);
        meshRef.current.material.emissiveIntensity = 0.2;
      } else if (hovered) {
        meshRef.current.material.emissive.setHex(0xff6600);
        meshRef.current.material.emissiveIntensity = 0.1;
      } else {
        const rgb = hexToRGB(material.color);
        meshRef.current.material.color.setRGB(rgb.r, rgb.g, rgb.b);
        meshRef.current.material.emissive.setHex(0x000000);
        meshRef.current.material.emissiveIntensity = 0;
      }

      // Apply render mode
      if (renderMode === 'wireframe') {
        meshRef.current.material.wireframe = true;
      } else if (renderMode === 'xray') {
        meshRef.current.material.opacity = 0.3;
        meshRef.current.material.transparent = true;
      } else {
        meshRef.current.material.wireframe = false;
        meshRef.current.material.opacity = material.opacity || 1;
        meshRef.current.material.transparent = material.opacity < 1;
      }
    }
  }, [material, isSelected, isHighlighted, hovered, renderMode]);

  // Get dimensions with defaults
  const dims = element.dimensions || {};
  const width = dims.width || 1;
  const height = dims.height || 3;
  const depth = dims.depth || 1;

  // Get position
  const loc = element.location || { x: 0, y: 0, z: 0 };
  const x = loc.x || 0;
  const y = loc.z || 0; // Note: Z in BIM becomes Y in Three.js
  const z = loc.y || 0; // Note: Y in BIM becomes Z in Three.js

  // Create box geometry
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const materialConfig = material || BIM_MATERIALS.concrete;

  const threeMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(materialConfig.color),
    roughness: materialConfig.roughness || 0.7,
    metalness: materialConfig.metalness || 0,
    opacity: materialConfig.opacity || 1,
    transparent: materialConfig.opacity < 1,
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={threeMaterial}
      position={[x, y, z]}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      userData={{ elementId: element.id, elementType: element.type }}
    />
  );
}

/**
 * BIM Viewer Scene
 * Renders all BIM elements and provides camera controls
 */
function BIMViewerScene({
  elements,
  selectedElementId,
  highlightedElements,
  renderMode,
  onElementSelect,
  cameraPreset = 'iso',
}) {
  const cameraRef = useRef();

  // Set camera position based on preset
  useEffect(() => {
    if (!cameraRef.current) return;

    const presets = {
      iso: [15, 15, 15],
      plan: [0, 25, 0],
      front: [0, 10, 20],
      side: [20, 10, 0],
      top: [0, 50, 0],
    };

    const position = presets[cameraPreset] || presets.iso;
    cameraRef.current.position.set(...position);
    cameraRef.current.lookAt(0, 0, 0);
  }, [cameraPreset]);

  const highlightedIds = new Set(highlightedElements.map((e) => e.id));

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[15, 15, 15]}
        fov={50}
        near={0.1}
        far={1000}
      />

      <color attach="background" args={['#e8e8e8']} />

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} castShadow />
      <directionalLight position={[-10, 10, -10]} intensity={0.4} />

      {/* Grid helper */}
      <gridHelper args={[100, 10]} />

      {/* Axes helper */}
      <axesHelper args={[10]} />

      {/* BIM Elements */}
      {elements.map((element) => {
        const material = getMaterialForElement(element.type);
        const isSelected = element.id === selectedElementId;
        const isHighlighted = highlightedIds.has(element.id);

        return (
          <BIMElement
            key={element.id}
            element={element}
            material={material}
            isSelected={isSelected}
            isHighlighted={isHighlighted}
            renderMode={renderMode}
          />
        );
      })}

      {/* Controls */}
      <OrbitControls
        autoRotate={false}
        autoRotateSpeed={2}
        enableDamping
        dampingFactor={0.1}
        minDistance={5}
        maxDistance={500}
      />

      {/* Gizmo */}
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport axisColors={['#ff0000', '#00ff00', '#0000ff']} labelColor="black" />
      </GizmoHelper>
    </>
  );
}

/**
 * GaudeBIMViewer Component
 * Main 3D BIM visualization component
 *
 * @component
 * @param {object} props - Component props
 * @param {object} props.model - BIM model JSON from GAUD-E
 * @param {function} props.onElementSelect - Callback when element is selected
 * @param {string} props.renderMode - Render mode (realistic, wireframe, xray)
 * @param {string} props.apiKey - GAUD-E API key for export
 * @param {array} props.visibleLayers - Visible layer categories
 * @param {string} props.cameraPreset - Camera view preset (iso, plan, front, side, top)
 * @returns {React.ReactElement} 3D BIM viewer component
 *
 * @example
 * <GaudeBIMViewer
 *   model={bimModel}
 *   onElementSelect={(element) => console.log(element)}
 *   renderMode="realistic"
 *   apiKey={apiKey}
 *   visibleLayers={{ structure: true, architecture: true, mep: false }}
 * />
 */
export function GaudeBIMViewer({
  model,
  onElementSelect,
  renderMode = 'realistic',
  apiKey,
  visibleLayers = {},
  cameraPreset = 'iso',
}) {
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [stats, setStats] = useState({ totalElements: 0, totalStoreys: 0 });
  const [highlightedElements, setHighlightedElements] = useState([]);

  // Extract visible elements from model
  const visibleElements = React.useMemo(() => {
    if (!model?.building?.storeys) {
      return [];
    }

    const elements = [];
    model.building.storeys.forEach((storey) => {
      if (Array.isArray(storey.elements)) {
        storey.elements.forEach((element) => {
          const elementLayer = getElementLayer(element.type);
          const isVisible =
            visibleLayers[elementLayer] !== false;

          if (isVisible) {
            elements.push({
              ...element,
              storeyId: storey.id,
              storeyName: storey.name,
            });
          }
        });
      }
    });

    return elements;
  }, [model, visibleLayers]);

  // Update stats
  React.useEffect(() => {
    setStats({
      totalElements: visibleElements.length,
      totalStoreys: model?.building?.storeys?.length || 0,
      totalArea: model?.building?.totalArea || 0,
    });
  }, [visibleElements, model]);

  const handleElementSelect = useCallback(
    (elementId) => {
      setSelectedElementId(elementId);
      const selected = visibleElements.find((e) => e.id === elementId);
      if (selected && onElementSelect) {
        onElementSelect(selected);
      }
    },
    [visibleElements, onElementSelect]
  );

  const handleExportIFC = useCallback(async () => {
    if (!apiKey || !model?.metadata?.id) {
      alert('API key and model ID required for export');
      return;
    }

    try {
      // In a real app, this would call the export API
      const { GaudeClient } = await import('../utils/gaude-client');
      const client = new GaudeClient(apiKey);
      const blob = await client.exportIFC(model.metadata.id);

      // Download file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${model.metadata.name || 'model'}.ifc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed: ' + error.message);
    }
  }, [apiKey, model]);

  if (!model || !model.building) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">No BIM model loaded</p>
          <p className="text-sm text-gray-400">Generate or load a model to view</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-200 overflow-hidden rounded-lg">
      {/* 3D Canvas */}
      <Canvas shadows>
        <BIMViewerScene
          elements={visibleElements}
          selectedElementId={selectedElementId}
          highlightedElements={highlightedElements}
          renderMode={renderMode}
          onElementSelect={handleElementSelect}
          cameraPreset={cameraPreset}
        />
      </Canvas>

      {/* Stats Overlay */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg text-sm font-mono max-w-xs">
        <div className="font-bold mb-2">{model.metadata?.name || 'BIM Model'}</div>
        <div>Elements: {stats.totalElements}</div>
        <div>Storeys: {stats.totalStoreys}</div>
        <div>Area: {(stats.totalArea || 0).toFixed(2)} m²</div>
        {selectedElementId && (
          <div className="mt-2 pt-2 border-t border-gray-500">
            <div className="text-yellow-300">Selected</div>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 flex gap-2">
        <button
          onClick={handleExportIFC}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
          title="Export to IFC format"
        >
          Export IFC
        </button>
      </div>

      {/* Render Mode Indicator */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded text-sm">
        Mode: {renderMode}
      </div>
    </div>
  );
}

/**
 * Map element type to layer category
 * @private
 */
function getElementLayer(elementType) {
  const layerMap = {
    column: 'structure',
    beam: 'structure',
    slab: 'structure',
    wall: 'structure',
    door: 'architecture',
    window: 'architecture',
    roof: 'architecture',
    pipe: 'mep',
    conduit: 'mep',
    fixture: 'mep',
  };
  return layerMap[elementType] || 'landscape';
}

export default GaudeBIMViewer;
