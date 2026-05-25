# GAUD-E: External Resources & Datasets

> The GAUD-E platform does not reason from scratch. Every generation cycle is grounded against millions of real 3D models, IFC samples, and reference projects fetched on demand from curated open datasets.

## 3D model libraries (millions of real assets)

| Dataset | Count | License | What it brings |
|---|---|---|---|
| **Objaverse-XL** | 10 M+ | CC-BY / mixed | Furniture, props, mobiliario, exterior assets |
| **ShapeNet** | 3 M+ | research | Chairs, lamps, electronics, mechanical CAD |
| **3D-FRONT** | 18 K rooms | research | Fully furnished interior scenes |
| **Structured3D** | 3 500 houses | research | Annotated residential floor plans |
| **FurniScene** | 11 K rooms + 39 K furniture | research | Furniture-in-context placement |
| **ABC Dataset** | 1 M | MIT | Mechanical CAD reference |
| **ModelNet40** | 12 K | research | Canonical shape benchmark |
| **PartNet** | 26 K | research | Part-level segmentation for kit-of-parts |

These datasets feed the `gaud-e-3d-universe` and `gaud-e-datasets-3d` skills. The Architect agent (Phase 1) draws on them for **furniture placement, fixture libraries, vegetation, and facade vocabulary**: never inventing geometry when a vetted real-world object exists.

## BIM / IFC reference repositories

| Source | Content |
|---|---|
| **BIMData (open dataset)** | 100 real IFC models across building types |
| **BIMNet** | scan-to-BIM reference pairs (point cloud to IFC) |
| **buildingSMART sample files** | IFC 2X3 / IFC4 canonical examples |
| **OpenBIM** | Open-source IFC schemas, MVDs, certification samples |
| **Archicad Sample Projects** | Reference `.pln` files from Graphisoft |
| **Revit RST / RAC / RME** | Out-of-the-box Autodesk sample projects |
| **Rhino sample models** | `.3dm` references from McNeel |

These power the `gaud-e-3d-reference-library` and `gaud-e-model-library` skills.

## Geospatial data sources (live, fetched per project)

| Source | Use |
|---|---|
| **Google Maps JavaScript API** | Address geocoding, site polygon drawing |
| **Google Street View Static API** | Site photos, neighbour facades |
| **Google Earth Engine** | Sentinel-2, Landsat 8/9, MODIS, SRTM DEM |
| **Mapbox Terrain-DEM** | High-res elevation tiles |
| **OpenStreetMap** | Roads, plots, building footprints, POIs |
| **Cadastral / SII (CL)** | Plot boundaries, owner data, zoning |
| **EPW weather files** | Climate data for Ladybug / Honeybee energy analysis |

Pulled on demand by `geosite-toolkit:google-maps-expert`, `geosite-toolkit:earth-engine-analyst`, and `geosite-toolkit:site-analysis`.

## Normative & code databases

- **OGUC (Chile)**: Ordenanza General de Urbanismo y Construcciones
- **Planos Reguladores Comunales**: local zoning per commune
- **NCh 433 / 430 / 427**: Chilean structural seismic, concrete, steel
- **IBC, ASCE 7, ACI 318, AISC 360**: US codes
- **Eurocodigos 0, 1, 2, 3, 5, 8**: EU codes
- **NFPA 13 / 72**: fire protection
- **ASHRAE 90.1 / 62.1**: HVAC, ventilation
- **NEC / IEC**: electrical

Wrapped by `gaud-e-normas-urbanismo` and `gaud-e-structural-engineer`.

## AI services

| Service | Role |
|---|---|
| **Anthropic Claude (Haiku 4.5 + Sonnet 4)** | The 7 agents |
| **OpenAI / DALL-E** | Optional rendering prompts |
| **Stable Diffusion XL** | Local photoreal renders (optional) |
| **MCP registry** | Discoverable tools/connectors for Claude |

## How resources are routed

```
User prompt + GPS coords
        |
        v
+--------------------------+
|  Enhancer (Haiku 4.5)    |--> queries: maps, street view, climate, codes
+--------------+-----------+
               v
+--------------------------+
|  Architect (Sonnet 4)    |--> queries: Objaverse-XL, 3D-FRONT, BIMData
+--------------+-----------+
               v
   Phase 2  (3 agents, parallel)
               v
+--------------------------+
|  Programmer (Sonnet 3.5) |--> queries: buildingSMART IFC samples
+--------------+-----------+
               v
+--------------------------+
|  Reviewer (Haiku 3.5)    |--> queries: ACI 318, OGUC, NFPA 13
+--------------------------+
```

## Caching

The desktop installer downloads and caches the most-used reference subsets on first launch (~2 GB):

- 50 K curated Objaverse-XL furniture/fixture meshes
- 200 canonical IFC samples (one per major building type)
- Country-specific code packs (selected at install time)

Subsequent generations are **offline-capable** once the cache is warm.

## Contact

- Email: **contacto@gaud-e.ai**
- Web: https://www.gps-2-bim.app
