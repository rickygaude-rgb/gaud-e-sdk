# Changelog

All notable changes to the GAUD-E SDK are documented here.
This project follows [Semantic Versioning](https://semver.org/) and the
[Keep-a-Changelog](https://keepachangelog.com) format.

## [2.3.0] — 2026-05-25

### Added — Multi-language stack documentation
- `docs/LANGUAGES.md`: full polyglot stack (C++17 motor, C# Revit, GDL + C++ ArchiCAD,
  Python + C# for Rhino/Grasshopper, AutoLISP + ObjectARX, Ruby SketchUp, JS/TS web).
- Section explaining why **some CAD platforms only accept C++** (ArchiCAD MDID,
  AutoCAD ObjectARX) and how the SDK routes each export to its native language.

### Added — Skills ecosystem (47 skills)
- `docs/SKILLS.md`: catalogue of all 47 Claude skills bundled with the desktop installer:
  20 `gaud-e-*` core skills, 4 `geosite-toolkit:*`, 6 `arq-bim-toolkit:*`,
  6 `bim-dev-toolkit:*`, plus 11 Anthropic productivity skills.
- Mapping of which skills fire on each of the 7 pipeline phases.
- Instructions to author and drop custom skills into `~/.claude/skills/`.

### Added — External resources
- `docs/EXTERNAL_RESOURCES.md`: every dataset GAUD-E grounds against:
  Objaverse-XL (10 M+), ShapeNet (3 M+), 3D-FRONT (18 K rooms), Structured3D,
  FurniScene, ABC, ModelNet40, PartNet, BIMData, BIMNet, buildingSMART, OpenBIM,
  Archicad Sample Projects, Revit RST/RAC/RME.
- Geospatial sources: Google Maps / Street View / Earth Engine, Mapbox Terrain-DEM,
  OpenStreetMap, EPW weather files.
- Normative databases: OGUC, NCh 433/430/427, IBC, ASCE 7, ACI 318, AISC 360,
  Eurocódigos, NFPA 13/72, ASHRAE 90.1/62.1, NEC/IEC.

### Added — Desktop downloadable version
- `docs/DESKTOP_INSTALLER.md`: full one-click installer documentation.
- New release asset `gaud-e-desktop-2.3.0-<os>-<arch>.zip` containing:
  - `bin/gaude-bridge`, `bin/gps2bim`, `bin/gaude-pipeline`, `bin/gaude-detect`
  - `connectors/{revit,archicad,rhino,autocad,sketchup}` pre-signed
  - `skills/` (47 Claude skills)
  - `install.ps1` / `install.sh` with **automatic CAD/BIM auto-discovery**
- Auto-detection of installed Revit 2024+, ArchiCAD 27+, Rhino 7/8, AutoCAD 2024+,
  SketchUp Pro 2024+; copies the matching connector into the host's add-in folder
  without user action.
- Registers `gaude-bridge` as a system service (`launchd` / `systemd` /
  Windows Service) so port 19724 is always available.
- `gaude-bridge --self-update` for in-place upgrades.

### Updated — Scientific paper
- Paper kept at v2.2 content (sections 1-12 unchanged) and **complemented** with
  new appendices A-D covering multi-language stack, skills ecosystem, external
  resources, and the downloadable desktop version.
- All emails (`contacto@gaud-e.ai`, `rickygaude@gmail.com`) and URLs
  (`https://www.gps-2-bim.app`, `https://gaud-e.ai`,
  `https://github.com/rickygaude-rgb/gaud-e-sdk`,
  `https://github.com/rickygaude-rgb/C---Gps-2-Bim`) preserved exactly.

### Updated
- `package.json` bumped to `2.3.0`; `files` array includes new docs and `CHANGELOG.md`.
- `README.md` adds **"What's new in v2.3"** banner pointing at the four new docs.
- `MANIFEST.md` lists the new docs and the desktop installer bundle.

## [2.2.0] — 2026-05-07

### Changed
- License: Elastic 2.0 -> **GAUD-E Commercial v1.0** (proprietary, paid-only).
- Registry: NPM -> **GitHub Packages**.
- Paper v2.2 with C++ benchmark chart layout fixes.

## [2.1.0] — 2026-04-18

### Added
- Native C++ motor (`gaude-bridge`, 93% C++) on port 19724.
- IFC 2X3 generation in ~50 ms (40x faster than the TypeScript fallback).
- `docs/MIGRATION_CPP.md`.
- `examples/cpp-bridge-direct.js`.

## [2.0.0] — 2026-04-04

### Added
- React components: `GaudeBIMViewer`, `GaudeGenerationStatus`,
  `GaudePromptInput`, `GaudeMapSelector`.
- React hooks: `useGaude`, `useBIMViewer`.
- 7-agent pipeline (4 phases) wired to `api.gaude.ai/v1`.
- IFC / glTF / 3DM / JSON-BIM export.

## [1.0.0] — 2026-04-03

- Initial public release (MIT).
