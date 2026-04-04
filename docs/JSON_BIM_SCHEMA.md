# GAUD-E JSON BIM Schema Specification

Complete specification of the GAUD-E BIM JSON format for building information modeling.

## Overview

GAUD-E uses a hierarchical JSON structure to represent building information models. This allows seamless integration with CAD/BIM software (Revit, ArchiCAD, Rhino) and enables programmatic model manipulation.

## Schema Structure

```
BIM Model
├── metadata (project information)
└── building
    ├── Basic information (name, type, dimensions)
    └── storeys (array of floors/levels)
        ├── Level information
        ├── elements (array of BIM objects)
        │   ├── Geometry (location, dimensions, rotation)
        │   ├── Material properties
        │   └── Custom properties
        └── spaces (rooms, areas)
```

## Complete Schema

### Root Level

```json
{
  "metadata": { ... },
  "building": { ... }
}
```

### metadata Object

Project-level metadata and configuration.

```json
{
  "metadata": {
    "name": "Office Tower",
    "description": "Modern 15-story office building",
    "version": "1.0.0",
    "created": "2026-04-03T10:00:00Z",
    "modified": "2026-04-03T10:30:00Z",
    "author": "GAUD-E SDK",
    "units": "meters",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "elevation": 10.5,
      "address": "123 Main Street, New York, NY 10001"
    }
  }
}
```

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Project name (1-255 characters) |
| description | string | No | Project description |
| version | string | Yes | Schema version (semver format: X.Y.Z) |
| created | ISO 8601 | Yes | Creation timestamp |
| modified | ISO 8601 | No | Last modification timestamp |
| author | string | No | Creator/author name |
| units | string | No | Measurement units: meters \| feet \| millimeters (default: meters) |
| location | object | No | Geographic location and address |

### building Object

Main building information and element container.

```json
{
  "building": {
    "name": "Tower A",
    "type": "commercial",
    "footprintArea": 2500,
    "totalArea": 37500,
    "height": 60.5,
    "baseElevation": 0,
    "storeys": [ ... ]
  }
}
```

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Building identifier |
| type | string | No | Building classification: residential \| commercial \| industrial \| institutional \| mixed-use \| other |
| footprintArea | number | No | Ground floor area in square units |
| totalArea | number | No | Total built-up area |
| height | number | No | Total height above base elevation |
| baseElevation | number | No | Ground level elevation (default: 0) |
| storeys | array | Yes | Array of storey objects (minimum 1) |

### storey Object

Represents a single floor/level in the building.

```json
{
  "storeys": [
    {
      "id": "L01",
      "name": "Ground Floor",
      "level": 0,
      "height": 4.5,
      "area": 2500,
      "elements": [ ... ],
      "spaces": [ ... ]
    }
  ]
}
```

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique storey identifier |
| name | string | Yes | Storey name (Ground, Level 1, etc.) |
| level | number | Yes | Elevation level from base |
| height | number | Yes | Storey-to-storey height (must be > 0) |
| area | number | No | Total floor area |
| elements | array | No | BIM elements on this storey |
| spaces | array | No | Rooms and areas on this storey |

### element Object

Individual BIM element (wall, column, window, etc.).

```json
{
  "elements": [
    {
      "id": "W001",
      "type": "wall",
      "name": "Exterior Wall",
      "location": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "dimensions": {
        "width": 10,
        "height": 4,
        "depth": 0.3,
        "length": 10,
        "thickness": 0.3,
        "diameter": null
      },
      "material": {
        "name": "Concrete",
        "type": "concrete",
        "color": "#a0a0a0",
        "roughness": 0.85,
        "metalness": 0,
        "opacity": 1
      },
      "properties": {
        "fireRating": "A1",
        "soundTransmissionClass": 50,
        "thermalConductivity": 1.4
      },
      "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "storey": "L01"
    }
  ]
}
```

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique element identifier |
| type | string | Yes | Element type (see Element Types below) |
| name | string | No | Element name/label |
| location | object | Yes | 3D position {x, y, z} |
| dimensions | object | No | Size parameters |
| material | object | No | Material properties |
| properties | object | No | Custom element properties |
| rotation | object | No | Rotation in degrees {x, y, z} |
| storey | string | No | Reference to parent storey ID |

### space Object

Represents enclosed spaces (rooms, courtyards).

```json
{
  "spaces": [
    {
      "id": "R001",
      "name": "Conference Room",
      "type": "room",
      "area": 50,
      "volume": 200,
      "level": 0,
      "height": 4
    }
  ]
}
```

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique space identifier |
| name | string | Space name |
| type | string | room \| corridor \| stairwell \| elevator \| mechanical \| storage \| outdoor |
| area | number | Floor area |
| volume | number | Total volume |
| level | number | Elevation level |
| height | number | Height from floor |

## Element Types

Supported BIM element types:

```
Structural: column, beam, slab, foundation, wall
Architectural: door, window, roof, partition, stair, ramp, handrail
MEP: pipe, conduit, fixture, equipment
Landscape: (any custom type)
```

## Material Types

Supported material classifications:

```
concrete | brick | glass | wood | steel | aluminum | copper | pvc |
stone | ceramic | plastic | fabric
```

## Complete Example

```json
{
  "metadata": {
    "name": "Commercial Office Tower",
    "description": "15-story mixed-use development",
    "version": "1.0.0",
    "created": "2026-04-03T10:00:00Z",
    "author": "GAUD-E SDK",
    "units": "meters",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "elevation": 0,
      "address": "Manhattan, New York"
    }
  },
  "building": {
    "name": "Tower A",
    "type": "commercial",
    "footprintArea": 2500,
    "totalArea": 37500,
    "height": 67.5,
    "baseElevation": 0,
    "storeys": [
      {
        "id": "L00",
        "name": "Basement",
        "level": -3.5,
        "height": 3.5,
        "area": 2500,
        "elements": [
          {
            "id": "B001",
            "type": "slab",
            "name": "Basement Floor",
            "location": { "x": 25, "y": 25, "z": -3.5 },
            "dimensions": { "width": 50, "depth": 50, "thickness": 0.4 },
            "material": {
              "name": "Reinforced Concrete",
              "type": "concrete",
              "color": "#808080",
              "roughness": 0.9,
              "metalness": 0,
              "opacity": 1
            },
            "storey": "L00"
          }
        ],
        "spaces": [
          {
            "id": "S001",
            "name": "Parking Area",
            "type": "mechanical",
            "area": 2500,
            "volume": 8750,
            "level": -3.5,
            "height": 3.5
          }
        ]
      },
      {
        "id": "L01",
        "name": "Ground Floor",
        "level": 0,
        "height": 4.5,
        "area": 2500,
        "elements": [
          {
            "id": "C001",
            "type": "column",
            "name": "Structural Column",
            "location": { "x": 5, "y": 5, "z": 0 },
            "dimensions": {
              "width": 0.8,
              "depth": 0.8,
              "height": 4.5
            },
            "material": {
              "name": "Reinforced Concrete",
              "type": "concrete",
              "color": "#696969",
              "roughness": 0.8,
              "metalness": 0,
              "opacity": 1
            },
            "storey": "L01"
          },
          {
            "id": "W001",
            "type": "window",
            "name": "Exterior Window",
            "location": { "x": 2, "y": 0, "z": 1.5 },
            "dimensions": {
              "width": 2,
              "height": 2,
              "thickness": 0.15
            },
            "material": {
              "name": "Double Glazing",
              "type": "glass",
              "color": "#e8f4f8",
              "roughness": 0.1,
              "metalness": 0,
              "opacity": 0.6
            },
            "storey": "L01"
          }
        ],
        "spaces": [
          {
            "id": "R001",
            "name": "Lobby",
            "type": "room",
            "area": 300,
            "volume": 1200,
            "level": 0,
            "height": 4.5
          },
          {
            "id": "R002",
            "name": "Retail Space",
            "type": "room",
            "area": 1200,
            "volume": 4800,
            "level": 0,
            "height": 4.5
          }
        ]
      },
      {
        "id": "L02",
        "name": "Level 1",
        "level": 4.5,
        "height": 4,
        "area": 2500,
        "elements": [
          {
            "id": "SL001",
            "type": "slab",
            "name": "Floor Slab",
            "location": { "x": 25, "y": 25, "z": 4.5 },
            "dimensions": {
              "width": 50,
              "depth": 50,
              "thickness": 0.35
            },
            "material": {
              "name": "Post-tensioned Concrete",
              "type": "concrete",
              "color": "#a0a0a0",
              "roughness": 0.85,
              "metalness": 0,
              "opacity": 1
            },
            "storey": "L02"
          }
        ],
        "spaces": [
          {
            "id": "O001",
            "name": "Office Space A",
            "type": "room",
            "area": 1500,
            "volume": 6000,
            "level": 4.5,
            "height": 4
          },
          {
            "id": "O002",
            "name": "Office Space B",
            "type": "room",
            "area": 1000,
            "volume": 4000,
            "level": 4.5,
            "height": 4
          }
        ]
      }
    ]
  }
}
```

## Coordinate System

- **X-axis:** East-West (positive = East)
- **Y-axis:** North-South (positive = North)
- **Z-axis:** Vertical (positive = Up)

All coordinates relative to building base (z=0 at `baseElevation`).

## Material Properties

Standard physically-based rendering (PBR) material model:

| Property | Range | Description |
|----------|-------|-------------|
| color | hex #RRGGBB | Diffuse color |
| roughness | 0-1 | Surface roughness (0=smooth, 1=rough) |
| metalness | 0-1 | Metallic appearance (0=non-metal, 1=pure metal) |
| opacity | 0-1 | Transparency (0=transparent, 1=opaque) |

## Validation

Validate models using SDK:

```javascript
import { validateBIMModel } from '@gaude/sdk';

const result = validateBIMModel(bimModel);
if (!result.valid) {
  result.errors.forEach(err => console.error(err));
}
```

## Best Practices

1. **IDs:** Use unique, meaningful identifiers (e.g., "L01", "W001")
2. **Names:** Keep names descriptive but concise
3. **Units:** Be explicit about measurement units in metadata
4. **Coordinates:** Use absolute positioning from building base
5. **Materials:** Use appropriate material types for element classification
6. **Properties:** Store element-specific data in properties object

## Interoperability

Export/import with CAD software:

- **IFC (Industry Foundation Classes):** `exportIFC(modelId)`
- **glTF/GLB (Web 3D):** `exportGLTF(modelId)`
- **Revit:** Via Revit plugin/connector
- **ArchiCAD:** Via ArchiCAD connector
- **Rhino:** Via Grasshopper plugin

## References

- [IFC Specification](https://www.buildingsmart.org/standards/bsi-standards/)
- [glTF Specification](https://www.khronos.org/gltf/)
- [GAUD-E Documentation](https://docs.gaude.ai)
