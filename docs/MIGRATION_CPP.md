# Migración Python → Motor C++ Nativo

## ¿Por qué C++?

| Feature | Python (anterior) | C++ (actual) |
|---------|------------------|--------------|
| IFC generation speed | ~2s | ~50ms (40× faster) |
| Memory (large models) | GC pauses | Direct alloc, no pauses |
| ArchiCAD connection | subprocess/requests | Native POSIX sockets |
| Deployment | Python + packages | Single binary, zero deps |
| 3D geometry kernel | IfcOpenShell | Pure C++17 extensible to OCCT |

## Arquitectura C++ (v2.1.0+)

```
gaud-e-sdk (npm)
    └── GaudeClient → POST http://127.0.0.1:19724/generate
                          ↓
                   gaude-bridge (C++ HTTP server)
                          ↓
              ┌───────────┴───────────┐
         gps2bim                gaude-pipeline
      (IFC2X3 gen)           (7 agentes Claude API)
              └───────────┬───────────┘
                    ArchiCAD JSON API
                      (port 19723)
```

## Uso en @gaude/sdk v2.1.0

```js
import { GaudeClient } from '@gaude/sdk'

const client = new GaudeClient({
  bridgeUrl: 'http://127.0.0.1:19724', // C++ bridge local
  apiKey: process.env.ANTHROPIC_API_KEY
})

const result = await client.generate({ brief: 'Casa de 120m², 3 dormitorios' })
// result.ifc → IFC2X3 nativo generado en ~50ms
```

## Instalación del bridge C++

```bash
# Descargar binario desde:
# github.com/rickygaude-rgb/C---Gps-2-Bim/releases

# Windows
./gaude-bridge.exe

# Linux/Mac
./gaude-bridge
```

## Soporte

- 📧 contacto@gaud-e.ai
- 🐙 github.com/rickygaude-rgb/C---Gps-2-Bim
