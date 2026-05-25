# GAUD-E SDK — Multi-Language Stack

> The GAUD-E platform is intentionally **polyglot**. Each professional CAD/BIM ecosystem speaks its own language; GAUD-E speaks them all and routes every script through a single `UnifiedBimModel`.

| Layer | Language | Why | Runs on |
|---|---|---|---|
| Native motor (`gaude-bridge`) | **C++17** (93%) | ~50 ms IFC 2X3 generation, 40x faster than Python; required for ArchiCAD MDID add-ons | local binary, port 19724 |
| Revit add-in | **C# / .NET 4.8** | RevitAPI.dll only loads managed assemblies | Revit 2024+ |
| ArchiCAD add-on | **C++ (DevKit v29.3100)** | Graphisoft validates MDID-signed binary add-ons only | ArchiCAD 27+ |
| ArchiCAD geometry | **GDL** | Library Part scripting (2D + 3D + Parameters) | ArchiCAD |
| Rhino / Grasshopper | **Python (rhinoscriptsyntax)** + **C# (Grasshopper SDK)** | Rhino accepts both; Hops/Compute prefers Python | Rhino 7/8 |
| AutoCAD | **AutoLISP** + **ObjectARX (C++)** | LISP for quick scripts, C++ for full 3D | AutoCAD 2024+ |
| SketchUp | **Ruby** | Native plugin language | SketchUp Pro |
| Web SDK | **JavaScript / TypeScript + JSX** | React 19, Three.js, Vite | Browser / Node 18+ |
| IFC tooling | **Python (IfcOpenShell)** | Schema introspection, validation, repair | Optional |
| Glue / installers | **PowerShell + Bash** | Windows + macOS / Linux | Cross-platform |
| Backend pipeline | **C++** (`gaude-pipeline`) calling **Anthropic Claude API** | Single binary, no Python runtime needed | local or cloud |

## Language to ecosystem mapping

```
                +------------------------------+
                |  GAUD-E UnifiedBimModel      |
                |  (single JSON-LD source)     |
                +--------------+---------------+
                               |
   +------------+--------------+----------------+------------+
   v            v              v                v            v
 C# .addin   C++ MDID         GDL + IFC      Python + C#    JS / GLB
 (Revit)     (ArchiCAD)       (ArchiCAD)     (Rhino/Gh)     (Web viewer)
```

## Why C++ is non-negotiable

Some CAD platforms only accept compiled C++ for full 3D scripting:

- **ArchiCAD add-ons** require an MDID-signed C++ binary (`Developer ID = 944139566`, `Local ID = 2142198165`, registered by `rickygaude@gmail.com` on the Graphisoft portal).
- **AutoCAD ObjectARX** is C++-only for full 3D access.
- **Performance**: the `gps2bim` binary writes IFC 2X3 in ~50 ms vs ~2 000 ms for the Python reference path (40x faster, no GC pauses).

Python is excellent for scripting and validation (IfcOpenShell, blenderbim), but is **limited to 2D** in ArchiCAD GDL and cannot drive Revit at all. That is why the GAUD-E motor is C++ and the connectors are language-matched to each host.

## Calling any language from the SDK

The Web SDK doesn't expose these languages directly. It talks to the local C++ bridge over HTTP (port 19724), and the bridge generates the language-specific artifact for each target software:

```js
import { GaudeClient } from '@rickygaude-rgb/gaud-e-sdk'

const client = new GaudeClient({ bridgeUrl: 'http://127.0.0.1:19724' })

// One JSON BIM model, every authoring environment, in its native language
await client.exportTo('revit')        // generates .cs + .addin (C#)
await client.exportTo('archicad')     // generates GDL + IFC + sends to add-on (C++)
await client.exportTo('rhino')        // generates .py (rhinoscriptsyntax)
await client.exportTo('grasshopper')  // generates .ghx + C# component
await client.exportTo('autocad')      // generates LISP + DWG
await client.exportTo('sketchup')     // generates Ruby plugin payload
```

## Support

- Email: **contacto@gaud-e.ai**
- Motor repo: https://github.com/rickygaude-rgb/C---Gps-2-Bim
- Web platform: https://www.gps-2-bim.app
