/**
 * GaudeMapSelector Component
 * Google Maps-based terrain and location selector for BIM generation
 * Allows users to draw a polygon on a map and get coordinates for BIM area
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Polygon, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.006,
};

/**
 * GaudeMapSelector Component
 * Interactive map for selecting terrain/location for BIM generation
 *
 * @component
 * @param {object} props - Component props
 * @param {function} props.onPolygonComplete - Callback when polygon is drawn
 * @param {object} props.center - Default map center {lat, lng}
 * @param {string} props.apiKey - Google Maps API key
 * @param {number} props.zoom - Initial zoom level (default: 14)
 * @returns {React.ReactElement} Map component
 *
 * @example
 * <GaudeMapSelector
 *   onPolygonComplete={(coords) => console.log(coords)}
 *   center={{ lat: 40.7128, lng: -74.006 }}
 *   apiKey={googleMapsKey}
 * />
 */
export function GaudeMapSelector({
  onPolygonComplete,
  center = defaultCenter,
  apiKey,
  zoom = 14,
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ['places', 'drawing'],
  });

  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);
  const drawingManagerRef = useRef(null);
  const [polygonPath, setPolygonPath] = useState([]);
  const [area, setArea] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [markers, setMarkers] = useState([]);

  // Initialize drawing manager
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google) {
      return;
    }

    // Create drawing manager
    const drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        fillColor: '#4285F4',
        strokeColor: '#1a73e8',
        fillOpacity: 0.3,
        strokeWeight: 2,
        editable: true,
        draggable: true,
      },
    });

    drawingManager.setMap(mapRef.current);
    drawingManagerRef.current = drawingManager;

    // Handle polygon complete
    window.google.maps.event.addListener(
      drawingManager,
      'polygoncomplete',
      (polygon) => {
        const path = polygon.getPath();
        const coords = [];

        path.forEach((latLng) => {
          coords.push([latLng.lat(), latLng.lng()]);
        });

        setPolygonPath(coords);
        calculateArea(coords);

        // Disable drawing mode
        drawingManager.setDrawingMode(null);

        // Call callback
        if (onPolygonComplete) {
          onPolygonComplete(coords);
        }

        // Make polygon editable
        polygon.setEditable(true);

        // Update when polygon changes
        polygon.getPath().addListener('set_at', () => {
          const updatedPath = [];
          polygon.getPath().forEach((latLng) => {
            updatedPath.push([latLng.lat(), latLng.lng()]);
          });
          setPolygonPath(updatedPath);
          calculateArea(updatedPath);
          if (onPolygonComplete) {
            onPolygonComplete(updatedPath);
          }
        });

        polygon.getPath().addListener('insert_at', () => {
          const updatedPath = [];
          polygon.getPath().forEach((latLng) => {
            updatedPath.push([latLng.lat(), latLng.lng()]);
          });
          setPolygonPath(updatedPath);
          calculateArea(updatedPath);
          if (onPolygonComplete) {
            onPolygonComplete(updatedPath);
          }
        });
      }
    );
  }, [isLoaded, onPolygonComplete]);

  /**
   * Calculate polygon area in square meters
   * Uses Haversine formula for geographic coordinates
   * @private
   */
  const calculateArea = useCallback((coords) => {
    if (!coords || coords.length < 3) {
      setArea(0);
      return;
    }

    // Simple approximation: convert to local coordinates and calculate
    // For accurate area, use proper geodesic calculations
    const R = 6371000; // Earth radius in meters

    let totalArea = 0;
    const n = coords.length;

    for (let i = 0; i < n; i++) {
      const [lat1, lng1] = coords[i];
      const [lat2, lng2] = coords[(i + 1) % n];

      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLng = ((lng2 - lng1) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      // Shoelace formula for area
      totalArea +=
        ((lat1 * (lng2 - lng1)) / 180) * Math.PI * R * R;
    }

    setArea(Math.abs(totalArea));
  }, []);

  /**
   * Search for address and move map there
   */
  const handleAddressSearch = useCallback(
    (addressInput) => {
      if (!isLoaded || !mapRef.current || !window.google) {
        return;
      }

      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ address: addressInput }, (results, status) => {
        if (
          status === window.google.maps.GeocoderStatus.OK &&
          results &&
          results.length > 0
        ) {
          const location = results[0].geometry.location;
          const bounds = results[0].geometry.bounds;

          setSelectedAddress(results[0].formatted_address);

          // Center map on result
          mapRef.current.setCenter({
            lat: location.lat(),
            lng: location.lng(),
          });

          // Fit bounds if available
          if (bounds) {
            mapRef.current.fitBounds(bounds);
          } else {
            mapRef.current.setZoom(zoom + 3);
          }

          // Add marker
          const marker = new window.google.maps.Marker({
            position: location,
            map: mapRef.current,
            title: results[0].formatted_address,
          });

          setMarkers([marker]);
        } else {
          alert('Address not found');
        }
      });
    },
    [isLoaded, zoom]
  );

  /**
   * Clear drawn polygon
   */
  const handleClearPolygon = useCallback(() => {
    setPolygonPath([]);
    setArea(0);
    setSelectedAddress('');
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(
        window.google.maps.drawing.OverlayType.POLYGON
      );
    }
  }, []);

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Map Load Error</p>
          <p className="text-sm text-red-500">{loadError.message}</p>
          <p className="text-xs text-red-400 mt-2">
            Check that your Google Maps API key is valid
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom} ref={mapRef} />

      {/* Search Bar */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg z-10">
        <input
          ref={searchBoxRef}
          type="text"
          placeholder="Search address..."
          className="px-4 py-2 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddressSearch(e.target.value);
            }
          }}
        />
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
        <div className="font-bold mb-2">Draw polygon on map</div>

        {polygonPath.length > 0 && (
          <>
            <div className="text-sm text-gray-600 mb-2">
              <p>
                Area: <span className="font-semibold">{(area / 10000).toFixed(2)} hectares</span>
              </p>
              <p>
                Points: <span className="font-semibold">{polygonPath.length}</span>
              </p>
            </div>

            <div className="text-xs bg-gray-100 p-2 rounded mb-3 max-h-20 overflow-y-auto">
              <p className="font-semibold mb-1">Coordinates:</p>
              {polygonPath.map((coord, idx) => (
                <p key={idx}>
                  {idx + 1}: {coord[0].toFixed(6)}, {coord[1].toFixed(6)}
                </p>
              ))}
            </div>

            <button
              onClick={handleClearPolygon}
              className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-medium"
            >
              Clear Polygon
            </button>
          </>
        )}

        {selectedAddress && (
          <div className="text-xs text-blue-600 mt-2 p-2 bg-blue-50 rounded">
            {selectedAddress}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded-lg text-sm max-w-xs">
        <p className="font-bold mb-1">Instructions:</p>
        <ol className="text-xs space-y-1">
          <li>1. Search for an address (optional)</li>
          <li>2. Click the drawing tool</li>
          <li>3. Draw a polygon on the map</li>
          <li>4. Click to add points, double-click to finish</li>
        </ol>
      </div>
    </div>
  );
}

export default GaudeMapSelector;
