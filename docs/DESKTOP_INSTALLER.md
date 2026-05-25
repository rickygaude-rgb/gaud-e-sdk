# GAUD-E Desktop: Downloadable Version

> One installer that wires GAUD-E into every professional CAD/BIM tool on your machine **automatically**. No manual plugin copying, no IDs to enter, no Python venvs to build.

## What you get

A single download (`gaud-e-desktop-<version>-<os>.zip`) that contains:

1. **`gaude-bridge`**: the native C++ HTTP server (port 19724)
2. **`gps2bim`**: IFC 2X3 generator (~50 ms)
3. **`gaude-pipeline`**: 7-agent Claude pipeline runtime
4. **47 Claude skills** auto-registered into Claude Desktop / Claude Code
5. **Connector add-ons** for every major CAD/BIM suite (pre-signed, pre-registered)
6. **One-click installer** (`install.ps1` on Windows, `install.sh` on macOS/Linux)
7. **Auto-discovery service** that finds installed CAD/BIM software and wires connectors automatically

## Supported platforms

| OS | Installer | Tested on |
|---|---|---|
| **Windows 10 / 11** (x64) | `install.ps1` | 10 22H2, 11 23H2 |
| **macOS 13+** (Apple Silicon + Intel) | `install.sh` | Ventura, Sonoma, Sequoia |
| **Ubuntu 22.04 / 24.04** | `install.sh` | LTS |
| **Fedora 39 / 40** | `install.sh` | latest |

## Auto-connect to professional apps

On install, the bundled `gaude-detect` utility scans for installed software and registers the matching connector **without user action**:

| Software | Connector type | Auto-action |
|---|---|---|
| **Autodesk Revit 2024+** | `.addin` (C# / .NET 4.8) | Copied to `%APPDATA%/Autodesk/Revit/Addins/2024/` |
| **Graphisoft ArchiCAD 27+** | Signed C++ add-on (MDID 944139566/2142198165) | Copied to `Add-Ons/Standard/` |
| **McNeel Rhino 7/8** | Python plugin + Grasshopper component (`.gha`) | Copied to `%APPDATA%/McNeel/Rhinoceros/8.0/Plug-ins/` |
| **Autodesk AutoCAD 2024+** | ObjectARX `.arx` + LISP loader | Registered via `appload` |
| **Trimble SketchUp Pro 2024+** | Ruby plugin (`.rbz`) | Auto-installed via Extension Manager |
| **Bentley MicroStation** | MDL DLL | Optional |
| **Vectorworks** | Plug-in folder install | Optional |

Once installed, every host application has a **"GAUD-E"** menu/ribbon with:

- **"Open GAUD-E"**: launches the web platform with the host's current view pre-loaded
- **"Send selection to GAUD-E"**: exports current model/selection to JSON BIM and round-trips through the agents
- **"Pull from GAUD-E"**: imports the last generated model natively (no IFC import dialog)

## One-click install

### Windows (PowerShell, elevated)

```powershell
# 1. Download
Invoke-WebRequest `
  -Uri https://github.com/rickygaude-rgb/gaud-e-sdk/releases/latest/download/gaud-e-desktop-windows-x64.zip `
  -OutFile $env:TEMP\gaude.zip

# 2. Unzip and install
Expand-Archive $env:TEMP\gaude.zip -DestinationPath $env:TEMP\gaude -Force
& "$env:TEMP\gaude\install.ps1"
```

### macOS / Linux

```bash
curl -L -o /tmp/gaude.zip \
  https://github.com/rickygaude-rgb/gaud-e-sdk/releases/latest/download/gaud-e-desktop-macos-arm64.zip
unzip /tmp/gaude.zip -d /tmp/gaude
cd /tmp/gaude && ./install.sh
```

The installer:

1. Verifies signatures.
2. Copies binaries to `~/.local/bin/` (or `C:\Program Files\GAUD-E\bin\` on Windows).
3. Registers `gaude-bridge` as a system service (`launchd` / `systemd` / Windows Service) so port **19724** is always available.
4. Detects installed CAD/BIM software and copies the matching connector files.
5. Installs Claude skills into `~/.claude/skills/`.
6. Opens a browser tab to https://www.gps-2-bim.app to sign in.

## Bundled architecture

```
gaud-e-desktop-2.3.0-windows-x64/
+- install.ps1                       <- one-click installer
+- install.sh                        <- Unix one-click installer
+- README-INSTALL.md
+- bin/
|  +- gaude-bridge.exe               <- HTTP bridge, port 19724
|  +- gps2bim.exe                    <- IFC 2X3 generator
|  +- gaude-pipeline.exe             <- 7-agent runtime
|  +- gaude-detect.exe               <- CAD auto-detection
+- connectors/
|  +- revit/
|  |  +- GAUDE.Revit.dll             <- C# add-in (signed)
|  |  +- GAUDE.Revit.addin           <- manifest
|  +- archicad/
|  |  +- GAUDE_ArchiCAD.apx          <- MDID 944139566 / 2142198165
|  +- rhino/
|  |  +- gaude_rhino.rhp             <- Rhino plugin
|  |  +- gaude_grasshopper.gha       <- GH component
|  +- autocad/
|  |  +- GAUDE.arx                   <- ObjectARX
|  |  +- gaude_loader.lsp
|  +- sketchup/
|     +- gaude-sketchup.rbz
+- skills/                           <- 47 Claude skills
|  +- gaud-e-architecture-engine/
|  +- gaud-e-structural-engineer/
|  +- ...
+- examples/
|  +- casa_iquique.json
|  +- hospital_demo.ifc
|  +- prompts.md
+- LICENSE
```

## Configuration

Optional environment overrides in `~/.gaude/config.env`:

```bash
# C++ bridge
GAUDE_BRIDGE_PORT=19724
GAUDE_BRIDGE_HOST=127.0.0.1
GAUDE_USE_LIBCURL=1

# Claude API
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx

# Optional: route through hosted platform instead of local pipeline
GAUDE_API_URL=https://api.gaude.ai/v1
GAUDE_API_KEY=gde_live_xxxxxxxx

# Connector auto-discovery
GAUDE_AUTODETECT_CAD=1
GAUDE_REVIT_VERSION=2024
GAUDE_ARCHICAD_VERSION=27
```

## Uninstall

```powershell
# Windows
& "C:\Program Files\GAUD-E\uninstall.ps1"
```

```bash
# macOS / Linux
~/.local/share/gaude/uninstall.sh
```

This removes binaries, connectors, service registrations, and (optionally) cached datasets, but leaves Claude skills in `~/.claude/skills/` intact unless `--purge` is passed.

## Verification after install

```bash
curl http://127.0.0.1:19724/health
# {"status":"ok","motor":"gaude-bridge","version":"2.3.0","language":"C++","connectors":["revit","archicad","rhino","autocad","sketchup"]}

gaude-detect list
# revit       2024.3   /Program Files/Autodesk/Revit 2024/   addin installed OK
# archicad    27.4001  /Program Files/GRAPHISOFT/...          addon installed OK
# rhino       8.5      /Program Files/Rhino 8/                plugin installed OK
```

## Updates

```bash
gaude-bridge --self-update
```

Auto-pulls the latest release from `github.com/rickygaude-rgb/gaud-e-sdk/releases/latest` and replaces all binaries in place (the running service is gracefully restarted).

## Support & commercial license

The desktop installer requires a **paid commercial license** (see [LICENSE](../LICENSE)).

- Email: **contacto@gaud-e.ai**
- Web: https://www.gps-2-bim.app
- Motor repo: https://github.com/rickygaude-rgb/C---Gps-2-Bim
- SDK repo: https://github.com/rickygaude-rgb/gaud-e-sdk
