#!/usr/bin/env python3
"""
DEPRECATED — Replaced by C++ native bridge

This Python IFC writer has been superseded by the native C++ implementation:
  - Binary: gaude-bridge (HTTP server on 127.0.0.1:19724)
  - Source: github.com/rickygaude-rgb/C---Gps-2-Bim
  - Performance: ~50ms vs ~2s (40× faster)
  - Contact: contacto@gaud-e.ai

The C++ bridge exposes the same JSON API:
  POST http://127.0.0.1:19724/generate  { brief: string }
  POST http://127.0.0.1:19724/export    { target: string, bim: object }

For migration guide see: docs/MIGRATION_CPP.md
"""

raise DeprecationWarning(
    "gaude_ifc_writer.py is deprecated. Use the C++ native bridge at port 19724."
    "\nSee: github.com/rickygaude-rgb/C---Gps-2-Bim"
    "\nContact: contacto@gaud-e.ai"
)
