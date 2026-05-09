#!/usr/bin/env python3
"""
DEPRECATED — Replaced by C++ native ArchiCAD bridge

This Python ArchiCAD connector has been superseded by the native C++ implementation:
  - Binary: gaude-bridge → POST /send/archicad (port 19724)
  - Uses native POSIX sockets to ArchiCAD JSON API (port 19723)
  - Source: github.com/rickygaude-rgb/C---Gps-2-Bim
  - Contact: contacto@gaud-e.ai
"""

raise DeprecationWarning(
    "gaude_archicad_node.py is deprecated. Use the C++ bridge at port 19724."
    "\nEndpoint: POST http://127.0.0.1:19724/send/archicad"
    "\nContact: contacto@gaud-e.ai"
)
