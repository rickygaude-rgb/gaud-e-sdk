# GAUD-E Skills Ecosystem

> GAUD-E is packaged as a collection of **specialized Claude skills** that ship inside the desktop installer. Each skill encodes domain expertise (urbanism, structures, MEP, paisajismo, normativa) so the 7-agent pipeline never reasons from a blank slate.

## Skill catalogue (47 skills)

The desktop installer (`gaud-e-desktop-*.zip`) auto-registers the following skills in Claude Code / Claude Desktop on install. They are also published to the [Anthropic Skills](https://docs.claude.com) registry.

### Core architectural reasoning (`gaud-e-*`)

| Skill | Purpose |
|---|---|
| `gaud-e-architecture-engine` | AI Architect: parametric design, SVG renders, image prompts, plantas/cortes/elevaciones |
| `gaud-e-realworld-geometry` | Statistical patterns of how real buildings are organized (room adjacency, facade ratios, parking layouts) |
| `gaud-e-structural-engineer` | NCh 433, ACI 318, AISC 360, Eurocodigos: beam/column/foundation sizing |
| `gaud-e-mep-structures` | Plumbing, electrical, HVAC, gas, fire: sized and traced |
| `gaud-e-budget-estimator` | Cubicacion, APU, BOQ, S-curve, CAPEX |
| `gaud-e-landscaping-expert` | Vegetation, hardscape, irrigation, native species |
| `gaud-e-urban-planner` | Masterplans, smart cities, 15-min cities, mobility |
| `gaud-e-normas-urbanismo` | OGUC, planos reguladores, rasantes, CUS/COS (global) |
| `gaud-e-energy-environment` | LEED, BREEAM, Passivhaus, CES Chile, EUI, LCA |
| `gaud-e-metric-validator` | Post-generation dimensional sanity check |
| `gaud-e-cad-bim-expert` | Revit / ArchiCAD / Rhino / AutoCAD / SketchUp drafting |
| `gaud-e-bim-connector` | MCP bridges to professional CAD/BIM software |
| `gaud-e-design-studio` | 2D/3D technical drafting + MCP connector authoring |
| `gaud-e-visual-render-quality` | Three.js / R3F PBR materials, lighting, HDRI, post-FX |
| `gaud-e-3d-universe` | Access to Objaverse-XL, ShapeNet, 3D-FRONT, etc. |
| `gaud-e-3d-reference-library` | Master reference library for BIM modeling patterns |
| `gaud-e-datasets-3d` | Tagged 3D datasets for furniture, MEP, vegetation |
| `gaud-e-model-library` | Project templates for Revit/ArchiCAD/Rhino/SKP/DWG |
| `gaud-e-ifc-codegen-patterns` | JSON BIM to Three.js R3F + IFC Python proven patterns |
| `gaud-e-agent-training-protocol` | 4-agent calibration protocol (Enhancer to Architect to Programmer to Reviewer) |

### Geospatial site toolkit (`geosite-toolkit:*`)

| Skill | Purpose |
|---|---|
| `geosite-toolkit:site-analysis` | Solar, wind, topography, urban context, privacy |
| `geosite-toolkit:earth-engine-analyst` | Google Earth Engine, NDVI, DEM, Landsat/Sentinel |
| `geosite-toolkit:google-maps-expert` | Street View, Places, Geocoding, neighborhood analysis |
| `geosite-toolkit:context-to-bim` | Bring real terrain + neighbours into Revit/ArchiCAD/Rhino |

### Architecture & BIM toolkit (`arq-bim-toolkit:*`)

| Skill | Purpose |
|---|---|
| `arq-bim-toolkit:architecture-engine` | Design engine (toolkit version) |
| `arq-bim-toolkit:structural-engineer` | Structural calculations |
| `arq-bim-toolkit:mep-structures` | MEP systems |
| `arq-bim-toolkit:budget-estimator` | Budget & quantities |
| `arq-bim-toolkit:cad-bim-expert` | CAD/BIM drafting |
| `arq-bim-toolkit:3d-modeling-library` | 3D object libraries, render-ready assets, PBR |

### BIM developer toolkit (`bim-dev-toolkit:*`)

| Skill | Purpose |
|---|---|
| `bim-dev-toolkit:ifc-programming` | IfcOpenShell, web-ifc, validation |
| `bim-dev-toolkit:3d-web-dev` | Three.js, R3F, Babylon.js, viewers |
| `bim-dev-toolkit:rhino-grasshopper-dev` | RhinoCommon, GH SDK, Hops, Rhino.Compute |
| `bim-dev-toolkit:revit-api-expert` | pyRevit, Dynamo, C# add-ins, Forge APS |
| `bim-dev-toolkit:archicad-api-expert` | ArchiCAD JSON API, GDL, Grasshopper Live |
| `bim-dev-toolkit:mcp-bim-bridge` | Build MCP servers for any CAD/BIM software |

### Productivity & output (Anthropic core)

| Skill | Purpose |
|---|---|
| `pdf` | Read, write, fill, merge, split PDFs |
| `docx` | Word docs with TOC, headings, page numbers |
| `xlsx` | Spreadsheets with formulas, charts, formats |
| `pptx` | Pitch decks, slide presentations |
| `canvas-design` | Posters, designs, .png/.pdf static visuals |
| `algorithmic-art` | p5.js generative art |
| `mcp-builder` | Build new MCP servers |
| `skill-creator` | Author new skills |
| `web-artifacts-builder` | Multi-component React artifacts with shadcn/ui |
| `internal-comms` | Status reports, leadership updates |
| `doc-coauthoring` | Structured documentation workflow |
| `brand-guidelines` | Apply consistent visual identity |
| `theme-factory` | Pre-set themes for slides/docs/landing pages |

## How skills are invoked

The 7-agent pipeline routes prompts through the relevant skill set on every phase:

| Phase | Primary skills consulted |
|---|---|
| 1: Enhancer | `gaud-e-realworld-geometry`, `gaud-e-normas-urbanismo`, `geosite-toolkit:site-analysis` |
| 1: Architect | `gaud-e-architecture-engine`, `gaud-e-3d-universe`, `gaud-e-cad-bim-expert` |
| 2: Structural | `gaud-e-structural-engineer`, `arq-bim-toolkit:structural-engineer` |
| 2: MEP | `gaud-e-mep-structures`, `arq-bim-toolkit:mep-structures` |
| 2: Landscape | `gaud-e-landscaping-expert`, `geosite-toolkit:earth-engine-analyst` |
| 3: Programmer | `gaud-e-ifc-codegen-patterns`, `bim-dev-toolkit:ifc-programming` |
| 4: Reviewer | `gaud-e-metric-validator`, `gaud-e-budget-estimator` |

## Authoring custom skills

Any organization can author additional skills and drop them into `~/.claude/skills/` (or `%APPDATA%/Claude/skills/`). The desktop installer scans both locations on launch and merges them with the bundled GAUD-E skills.

```bash
# Example: install a custom skill
cp -r ./my-firm-skills/custom-residential-rules ~/.claude/skills/
```

The skill `metadata.yaml` follows the [Anthropic Skill spec](https://docs.claude.com/en/agents/skills) so anything authored for the GAUD-E desktop also works in Claude Code and Claude Desktop.

## Contact

- Email: **contacto@gaud-e.ai**
- Web: https://www.gps-2-bim.app
