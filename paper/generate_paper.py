#!/usr/bin/env python3
"""
GAUD-E Scientific Paper PDF Generator — v2.2
Author: Ricardo Riffo Q. | contacto@gaud-e.ai
Sites: gaud-e.ai | gps-2-bim.app
Fix v2.2: corrected C++ benchmark chart layout, added cpp architecture diagram,
          PageBreak/KeepTogether to prevent chart overlap with tables.
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak,
    Table, TableStyle, KeepTogether
)
from reportlab.graphics.shapes import (
    Drawing, Rect, String, Line, Circle, Polygon, Group
)
from reportlab.graphics import renderPDF
from reportlab.graphics.charts.barcharts import VerticalBarChart, HorizontalBarChart
from reportlab.graphics.charts.legends import Legend
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT
import os

# ─── Output path ─────────────────────────────────────────────────────────────
OUTPUT_PATH = "/sessions/ecstatic-dreamy-allen/mnt/C++/gaud-e-sdk/paper/GAUD-E_Scientific_Paper_2026.pdf"
os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

PAGE_WIDTH, PAGE_HEIGHT = letter
MARGIN = 0.75 * inch

# ─── Colors ──────────────────────────────────────────────────────────────────
BLUE_DARK   = colors.HexColor("#1f4788")
BLUE_MID    = colors.HexColor("#4472C4")
BLUE_LIGHT  = colors.HexColor("#DAE3F3")
CYAN        = colors.HexColor("#00B4D8")
GREEN       = colors.HexColor("#2DC653")
RED         = colors.HexColor("#E63946")
ORANGE      = colors.HexColor("#F4A261")
GRAY_LIGHT  = colors.HexColor("#F5F5F5")
GRAY_MID    = colors.HexColor("#CCCCCC")

# ─── Document ─────────────────────────────────────────────────────────────────
doc = SimpleDocTemplate(
    OUTPUT_PATH, pagesize=letter,
    rightMargin=MARGIN, leftMargin=MARGIN,
    topMargin=MARGIN, bottomMargin=MARGIN,
)

# ─── Styles ──────────────────────────────────────────────────────────────────
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    'CustomTitle', parent=styles['Title'],
    fontSize=17, textColor=BLUE_DARK,
    spaceAfter=6, alignment=TA_CENTER, leading=22,
)
author_style = ParagraphStyle(
    'Author', parent=styles['Normal'],
    fontSize=10, alignment=TA_CENTER, spaceAfter=2,
)
section_style = ParagraphStyle(
    'Heading1', parent=styles['Heading1'],
    fontSize=13, textColor=BLUE_DARK,
    spaceAfter=8, spaceBefore=14,
)
sub_style = ParagraphStyle(
    'Heading2', parent=styles['Heading2'],
    fontSize=11, textColor=BLUE_MID,
    spaceAfter=6, spaceBefore=8,
)
body_style = ParagraphStyle(
    'Body', parent=styles['Normal'],
    fontSize=9.5, spaceAfter=6,
    alignment=TA_JUSTIFY, leading=14,
)
abstract_style = ParagraphStyle(
    'Abstract', parent=styles['Normal'],
    fontSize=9, spaceAfter=4, leading=13,
    alignment=TA_JUSTIFY,
)
code_style = ParagraphStyle(
    'Code', parent=styles['Normal'],
    fontSize=7.5, fontName='Courier',
    leftIndent=0.2*inch, rightIndent=0.2*inch,
    backColor=GRAY_LIGHT, leading=11,
)
math_style = ParagraphStyle(
    'Math', parent=styles['Normal'],
    fontSize=9.5, fontName='Courier',
    alignment=TA_CENTER, spaceAfter=6, leading=14,
    textColor=BLUE_DARK,
)
caption_style = ParagraphStyle(
    'Caption', parent=styles['Normal'],
    fontSize=8, alignment=TA_CENTER,
    textColor=colors.HexColor("#555555"),
    spaceBefore=3, spaceAfter=10,
)
highlight_style = ParagraphStyle(
    'Highlight', parent=styles['Normal'],
    fontSize=9.5, spaceAfter=6,
    alignment=TA_JUSTIFY, leading=14,
    backColor=BLUE_LIGHT,
    leftIndent=8, rightIndent=8,
    borderPad=6,
)

# ─── Page numbering ───────────────────────────────────────────────────────────
def add_page_numbers(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#888888"))
    canvas.drawCentredString(PAGE_WIDTH / 2, 0.4 * inch,
                             f"GAUD-E Scientific Paper 2026  |  Page {doc.page}")
    canvas.setStrokeColor(GRAY_MID)
    canvas.line(MARGIN, 0.55 * inch, PAGE_WIDTH - MARGIN, 0.55 * inch)
    canvas.restoreState()

# ═══════════════════════════════════════════════════════════════════════════════
#  INLINE DIAGRAMS
# ═══════════════════════════════════════════════════════════════════════════════

def make_pipeline_diagram():
    """7-agent pipeline architecture diagram"""
    W, H = 460, 230
    d = Drawing(W, H)
    d.add(Rect(0, 0, W, H, fillColor=GRAY_LIGHT, strokeColor=None))

    phases = [
        ("Phase 1", ["A1\nEnhancer", "A2\nArchitect"], BLUE_MID, 30),
        ("Phase 2\n(PARALLEL)", ["A3\nStructural", "A4\nMEP", "A5\nLandscape"], GREEN, 160),
        ("Phase 3", ["A6\nBIM Prog."], ORANGE, 310),
        ("Phase 4", ["A7\nQA Review"], CYAN, 390),
    ]

    bw, bh = 52, 36
    for phase_name, agents, col, px in phases:
        d.add(String(px + (len(agents) * 60) / 2, H - 22,
                     phase_name, fontSize=7, fillColor=col,
                     fontName='Helvetica-Bold', textAnchor='middle'))
        for i, ag in enumerate(agents):
            ax = px + i * 60
            ay = H - 80
            d.add(Rect(ax, ay, bw, bh, fillColor=col, strokeColor=colors.white,
                       strokeWidth=1.5, rx=5, ry=5))
            lines = ag.split('\n')
            d.add(String(ax + bw / 2, ay + bh - 12,
                         lines[0], fontSize=7.5, fillColor=colors.white,
                         fontName='Helvetica-Bold', textAnchor='middle'))
            if len(lines) > 1:
                d.add(String(ax + bw / 2, ay + 6,
                             lines[1], fontSize=6.5, fillColor=colors.white,
                             textAnchor='middle'))

    arrow_xs = [(82, 160), (280, 310), (362, 390)]
    for x1, x2 in arrow_xs:
        y = H - 62
        d.add(Line(x1, y, x2 - 5, y, strokeColor=BLUE_DARK, strokeWidth=1.5))
        d.add(Polygon([x2 - 5, y + 5, x2 - 5, y - 5, x2 + 2, y],
                      fillColor=BLUE_DARK, strokeColor=None))

    d.add(Rect(158, H - 120, 148, 50, fillColor=None,
               strokeColor=GREEN, strokeWidth=1, strokeDashArray=[3, 2]))
    d.add(String(232, H - 130, "Promise.all()", fontSize=7,
                 fillColor=GREEN, fontName='Helvetica-Bold', textAnchor='middle'))

    d.add(String(W / 2, 18, "GPS-2-BIM: G x L  ->  M  (7 Agents, 4 Phases)",
                 fontSize=8.5, fillColor=BLUE_DARK,
                 fontName='Helvetica-Bold', textAnchor='middle'))
    return d


def make_comparison_chart():
    """Bar chart: GAUD-E vs Point Cloud vs Mesh on 5 criteria (0-100 scale)"""
    W, H = 460, 200
    d = Drawing(W, H)
    d.add(Rect(0, 0, W, H, fillColor=GRAY_LIGHT, strokeColor=None))

    bc = VerticalBarChart()
    bc.x = 60
    bc.y = 40
    bc.width = 360
    bc.height = 130
    bc.data = [
        (95, 90, 88, 92, 97),
        (10,  5,  0, 15, 20),
        (30, 20,  5, 40, 15),
    ]
    bc.categoryAxis.categoryNames = [
        'Editable\nin CAD', 'IFC\nSemantics', 'Parametric\nGeometry',
        'BIM\nExport', 'MEP\nIntegrated'
    ]
    bc.bars[0].fillColor = BLUE_MID
    bc.bars[1].fillColor = ORANGE
    bc.bars[2].fillColor = GRAY_MID
    bc.valueAxis.valueMin = 0
    bc.valueAxis.valueMax = 100
    bc.valueAxis.valueStep = 25
    bc.categoryAxis.labels.fontName = 'Helvetica'
    bc.categoryAxis.labels.fontSize = 7
    bc.groupSpacing = 8
    bc.barSpacing = 1
    d.add(bc)

    legend_items = [("GAUD-E", BLUE_MID), ("Point Cloud", ORANGE), ("Mesh", GRAY_MID)]
    for i, (label, col) in enumerate(legend_items):
        lx = 65 + i * 120
        d.add(Rect(lx, 12, 10, 10, fillColor=col, strokeColor=None))
        d.add(String(lx + 14, 14, label, fontSize=7.5,
                     fillColor=colors.black, textAnchor='start'))

    d.add(String(W / 2, H - 15, "Figure 2 - BIM Capability Comparison (0-100 Scale)",
                 fontSize=8, fillColor=BLUE_DARK,
                 fontName='Helvetica-Bold', textAnchor='middle'))
    return d


def make_gps2bim_flow():
    """5-step GPS-2-BIM workflow flowchart"""
    W, H = 460, 130
    d = Drawing(W, H)
    d.add(Rect(0, 0, W, H, fillColor=GRAY_LIGHT, strokeColor=None))

    steps = [
        ("GPS\nCoords", BLUE_MID),
        ("Natural\nLanguage", BLUE_MID),
        ("7-Agent\nPipeline", GREEN),
        ("3D BIM\nViewer", CYAN),
        ("CAD\nExport", ORANGE),
    ]
    sw, sh = 72, 46
    gap = 14
    total_w = len(steps) * sw + (len(steps) - 1) * gap
    start_x = (W - total_w) / 2

    for i, (label, col) in enumerate(steps):
        sx = start_x + i * (sw + gap)
        sy = (H - sh) / 2
        d.add(Rect(sx, sy, sw, sh, fillColor=col, strokeColor=colors.white,
                   strokeWidth=1.5, rx=6, ry=6))
        lines = label.split('\n')
        d.add(String(sx + sw / 2, sy + sh - 14,
                     lines[0], fontSize=8, fillColor=colors.white,
                     fontName='Helvetica-Bold', textAnchor='middle'))
        if len(lines) > 1:
            d.add(String(sx + sw / 2, sy + 8,
                         lines[1], fontSize=7.5, fillColor=colors.white,
                         textAnchor='middle'))
        if i < len(steps) - 1:
            ax = sx + sw + 2
            ay = H / 2
            d.add(Line(ax, ay, ax + gap - 4, ay,
                       strokeColor=BLUE_DARK, strokeWidth=1.5))
            d.add(Polygon([ax + gap - 4, ay + 4,
                           ax + gap - 4, ay - 4,
                           ax + gap + 1, ay],
                          fillColor=BLUE_DARK, strokeColor=None))

    d.add(String(W / 2, 10, "Figure 1 - GPS-2-BIM Workflow: T: G x L -> M",
                 fontSize=8, fillColor=BLUE_DARK,
                 fontName='Helvetica-Bold', textAnchor='middle'))
    return d


def make_quality_radar():
    """Horizontal bar chart of quality metrics"""
    W, H = 380, 200
    d = Drawing(W, H)
    d.add(Rect(0, 0, W, H, fillColor=GRAY_LIGHT, strokeColor=None))

    metrics = [
        ("Geometric Coherence",   95),
        ("Dimensional Realism",   92),
        ("Program Compliance",    88),
        ("Structural Soundness",  90),
        ("Constructability",      87),
        ("Material Consistency",  93),
        ("MEP Integration",       85),
    ]
    bar_max = 220
    row_h = 22
    x0 = 140
    y0 = H - 30

    d.add(String(W / 2, H - 15, "Figure 3 - GAUD-E Quality Metrics (avg 90.0/100)",
                 fontSize=8, fillColor=BLUE_DARK,
                 fontName='Helvetica-Bold', textAnchor='middle'))

    for i, (name, val) in enumerate(metrics):
        y = y0 - i * row_h
        bar_w = (val / 100) * bar_max
        d.add(String(x0 - 5, y - 6, name, fontSize=7,
                     fillColor=BLUE_DARK, textAnchor='end'))
        d.add(Rect(x0, y - 14, bar_max, 14,
                   fillColor=colors.white, strokeColor=GRAY_MID, strokeWidth=0.5))
        col = GREEN if val >= 90 else BLUE_MID
        d.add(Rect(x0, y - 14, bar_w, 14, fillColor=col, strokeColor=None))
        d.add(String(x0 + bar_w + 4, y - 6, f"{val}",
                     fontSize=7, fillColor=BLUE_DARK,
                     fontName='Helvetica-Bold'))
    return d


def make_architecture_overview():
    """High-level system architecture diagram"""
    W, H = 460, 180
    d = Drawing(W, H)
    d.add(Rect(0, 0, W, H, fillColor=GRAY_LIGHT, strokeColor=None))

    layers = [
        ("Frontend  -  React 19 + Three.js + Google Maps", 140, BLUE_LIGHT, BLUE_DARK),
        ("API Gateway  -  Vercel Serverless (Node.js)", 100, colors.HexColor("#E8F5E9"), GREEN),
        ("7-Agent LLM Pipeline  -  Anthropic Claude", 60, colors.HexColor("#FFF3E0"), ORANGE),
        ("Export Layer  -  IFC 4.0 / glTF / Revit / ArchiCAD / Rhino", 20,
         colors.HexColor("#E3F2FD"), CYAN),
    ]
    lw = 400
    lh = 30
    lx = 30
    for label, ly, bg, tc in layers:
        d.add(Rect(lx, ly, lw, lh, fillColor=bg,
                   strokeColor=tc, strokeWidth=1.2, rx=4, ry=4))
        d.add(String(lx + lw / 2, ly + 10, label,
                     fontSize=8, fillColor=tc,
                     fontName='Helvetica-Bold', textAnchor='middle'))

    for ly in [140, 100, 60]:
        ax = W / 2
        d.add(Line(ax, ly, ax, ly - 8, strokeColor=BLUE_DARK, strokeWidth=1.2))
        d.add(Polygon([ax - 4, ly - 8, ax + 4, ly - 8, ax, ly - 14],
                      fillColor=BLUE_DARK, strokeColor=None))

    d.add(String(W / 2, 10,
                 "Figure 4 - GAUD-E System Architecture",
                 fontSize=8, fillColor=BLUE_DARK,
                 fontName='Helvetica-Bold', textAnchor='middle'))
    return d


# ─── NEW: C++ Native Motor Architecture Diagram ───────────────────────────────
def make_cpp_architecture_diagram():
    """C++ Native Motor Architecture — gaude-bridge (93% C++)"""
    W, H = 460, 220
    d = Drawing(W, H)

    # Dark background
    d.add(Rect(0, 0, W, H, fillColor=colors.HexColor("#050D1A"), strokeColor=None))

    # Title
    d.add(String(W / 2, H - 18,
                 "C++ Native Motor Architecture  -  gaude-bridge (93% C++)",
                 fontSize=8.5, fillColor=colors.HexColor("#00D4FF"),
                 fontName='Helvetica-Bold', textAnchor='middle'))

    # gaude-bridge (top center)
    bx, by, bw, bh = W/2 - 90, 140, 180, 44
    d.add(Rect(bx, by, bw, bh, fillColor=colors.HexColor("#0D1F3C"),
               strokeColor=colors.HexColor("#00D4FF"), strokeWidth=1.5, rx=6, ry=6))
    d.add(String(W/2, by + 28, "gaude-bridge",
                 fontSize=10, fillColor=colors.HexColor("#00D4FF"),
                 fontName='Helvetica-Bold', textAnchor='middle'))
    d.add(String(W/2, by + 13, "HTTP Server  *  127.0.0.1:19724",
                 fontSize=7.5, fillColor=colors.HexColor("#9CA3AF"), textAnchor='middle'))

    # Three sub-components
    boxes = [
        (50,  50, 120, 60, colors.HexColor("#16A34A"), "gps2bim",
         "IFC 2X3 Generator", "~50ms"),
        (170, 50, 120, 60, colors.HexColor("#B45309"), "gaude-pipeline",
         "7-Agent AI Pipeline", "Claude API"),
        (290, 50, 120, 60, colors.HexColor("#1D4ED8"), "exporters",
         "IFC / Revit / Rhino", "ArchiCAD / glTF"),
    ]
    for bx2, by2, bw2, bh2, col, title, sub1, sub2 in boxes:
        d.add(Rect(bx2, by2, bw2, bh2, fillColor=colors.HexColor("#111827"),
                   strokeColor=col, strokeWidth=1.5, rx=5, ry=5))
        d.add(String(bx2 + bw2/2, by2 + 44, title,
                     fontSize=9, fillColor=col,
                     fontName='Helvetica-Bold', textAnchor='middle'))
        d.add(String(bx2 + bw2/2, by2 + 30, sub1,
                     fontSize=7, fillColor=colors.HexColor("#D1D5DB"),
                     textAnchor='middle'))
        d.add(String(bx2 + bw2/2, by2 + 17, sub2,
                     fontSize=7, fillColor=colors.HexColor("#9CA3AF"),
                     textAnchor='middle'))

    # Arrows from gaude-bridge down to each box
    bridge_bottom_y = 140
    for cx in [110, 230, 350]:
        d.add(Line(cx, bridge_bottom_y, cx, 112,
                   strokeColor=colors.HexColor("#00D4FF"), strokeWidth=1.2))
        d.add(Polygon([cx-4, 116, cx+4, 116, cx, 110],
                      fillColor=colors.HexColor("#00D4FF"), strokeColor=None))

    # Bottom label
    d.add(Rect(110, 8, 240, 22, fillColor=colors.HexColor("#0D1F3C"),
               strokeColor=colors.HexColor("#4472C4"), strokeWidth=0.8, rx=4, ry=4))
    d.add(String(W/2, 15,
                 "Next.js Frontend  /api/pipeline",
                 fontSize=7.5, fillColor=colors.HexColor("#9CA3AF"),
                 textAnchor='middle'))

    # "40x faster" badge
    d.add(Rect(330, 8, 120, 22, fillColor=colors.HexColor("#14532D"),
               strokeColor=colors.HexColor("#16A34A"), strokeWidth=1, rx=4, ry=4))
    d.add(String(390, 15, "40x faster than Python",
                 fontSize=7.5, fillColor=colors.HexColor("#4ADE80"),
                 fontName='Helvetica-Bold', textAnchor='middle'))

    return d


# ─── NEW: C++ vs TypeScript Benchmark Chart ───────────────────────────────────
def make_cpp_benchmark_chart():
    """
    Horizontal grouped bar chart: C++ Native vs TypeScript/Python
    Building types: Office (340 el.), Multi-Family (156 el.), Residential (42 el.)
    Values: C++ ~50-63ms, TypeScript ~1920-2650ms
    Using a custom horizontal bar chart to avoid overflow issues.
    """
    W, H = 460, 240
    d = Drawing(W, H)
    d.add(Rect(0, 0, W, H, fillColor=GRAY_LIGHT, strokeColor=None))

    # Title
    d.add(String(W/2, H - 16,
                 "Figure 6 - IFC 2X3 generation benchmark: C++ motor 40x faster on average",
                 fontSize=7.5, fillColor=BLUE_DARK,
                 fontName='Helvetica-Bold', textAnchor='middle'))

    # Data: (label, cpp_ms, ts_ms)
    data = [
        ("Office (340 el.)",       63,  2650),
        ("Multi-Family (156 el.)", 55,  2200),
        ("Residential (42 el.)",   48,  1920),
    ]

    max_val = 2800
    bar_area_w = 290   # width available for bars
    x0 = 145           # x start of bars
    y_start = H - 45
    group_h = 52       # height per building type group
    bar_h = 14         # individual bar height
    gap_between = 8    # gap between C++ and TS bars in a group

    for i, (label, cpp_ms, ts_ms) in enumerate(data):
        gy = y_start - i * group_h

        # Group label
        d.add(String(x0 - 6, gy - bar_h/2 + 2, label,
                     fontSize=7.5, fillColor=BLUE_DARK,
                     fontName='Helvetica-Bold', textAnchor='end'))

        # TypeScript bar (top of group)
        ts_w = (ts_ms / max_val) * bar_area_w
        d.add(Rect(x0, gy, ts_w, bar_h,
                   fillColor=ORANGE, strokeColor=None))
        d.add(String(x0 + ts_w + 4, gy + bar_h/2 - 3,
                     f"{ts_ms}ms (TypeScript)",
                     fontSize=7, fillColor=colors.HexColor("#92400E"),
                     fontName='Helvetica-Bold'))

        # C++ bar (below TS bar)
        cpp_bar_y = gy - bar_h - gap_between
        cpp_w = (cpp_ms / max_val) * bar_area_w
        d.add(Rect(x0, cpp_bar_y, cpp_w, bar_h,
                   fillColor=GREEN, strokeColor=None))
        d.add(String(x0 + cpp_w + 4, cpp_bar_y + bar_h/2 - 3,
                     f"{cpp_ms}ms (C++)",
                     fontSize=7, fillColor=colors.HexColor("#14532D"),
                     fontName='Helvetica-Bold'))

    # Legend at bottom
    ly = 14
    d.add(Rect(x0, ly, 12, 10, fillColor=GREEN, strokeColor=None))
    d.add(String(x0 + 16, ly + 2, "C++ Native (gaude-bridge)",
                 fontSize=7.5, fillColor=colors.black))
    d.add(Rect(x0 + 160, ly, 12, 10, fillColor=ORANGE, strokeColor=None))
    d.add(String(x0 + 176, ly + 2, "TypeScript / Python",
                 fontSize=7.5, fillColor=colors.black))
    d.add(String(x0 + 340, ly + 2, "Generation time (ms) - lower is better",
                 fontSize=6.5, fillColor=colors.HexColor("#555555")))

    return d


# ═══════════════════════════════════════════════════════════════════════════════
#  STORY
# ═══════════════════════════════════════════════════════════════════════════════
story = []

# ─── Title Page ───────────────────────────────────────────────────────────────
story.append(Spacer(1, 0.25 * inch))
story.append(Paragraph(
    "GAUD-E: A Multi-Agent AI Platform for Automated BIM Model Generation "
    "from Geospatial Data - Real Editable 3D BIM Beyond Point Clouds and Meshes",
    title_style
))
story.append(Spacer(1, 0.12 * inch))

story.append(Paragraph("<b>Ricardo Riffo Q.</b>", author_style))
story.append(Paragraph("GAUD-E Architect AI &mdash; Santiago, Chile", author_style))
story.append(Paragraph(
    '<b>Email:</b> <u>contacto@gaud-e.ai</u> &nbsp;&nbsp; '
    '<b>Platform:</b> <u>https://www.gps-2-bim.app</u> &nbsp;&nbsp; '
    '<b>Site:</b> <u>https://gaud-e.ai</u>',
    author_style
))
story.append(Paragraph("May 2026", author_style))
story.append(Spacer(1, 0.2 * inch))

# ─── Abstract ─────────────────────────────────────────────────────────────────
story.append(Paragraph("Abstract", section_style))
story.append(Paragraph("""
GAUD-E (Geospatially-Aware Unified Design Engine) is a production-ready AI platform that solves a fundamental
unsolved problem in AEC (Architecture, Engineering, and Construction): the automated generation of fully editable,
semantically-rich BIM (Building Information Modeling) models from geospatial coordinates and natural language
descriptions. Unlike existing 3D digitization methods - which produce non-editable point clouds or topological
meshes with no semantic structure - GAUD-E generates parametric IFC 4.0 BIM objects that are immediately usable
in Revit, ArchiCAD, Rhino, AutoCAD, and SketchUp without any manual remodeling. This paper presents the updated
7-agent, 4-phase GPS-2-BIM pipeline, its formal mathematical formulation, architectural diagrams, and performance
benchmarks including the native C++ engine (gaude-bridge, 93% C++) achieving ~50ms IFC generation versus
~2000ms TypeScript fallback (40x faster). Demonstrated generation times range from 45 seconds (residential) to
12 minutes (hospital), representing a 95% reduction versus manual BIM creation. The platform is live at
<u>https://www.gps-2-bim.app</u> and <u>https://gaud-e.ai</u>.
""", abstract_style))
story.append(Spacer(1, 0.08 * inch))

story.append(Paragraph("Resumen", section_style))
story.append(Paragraph("""
GAUD-E (Geospatially-Aware Unified Design Engine) es una plataforma de IA lista para produccion que resuelve un
problema fundamental del sector AEC: la generacion automatica de modelos BIM completamente editables y semanticamente
ricos a partir de coordenadas geoespaciales y descripciones en lenguaje natural. A diferencia de los metodos de
digitalizacion 3D existentes - que producen nubes de puntos no editables o mallas topologicas sin estructura
semantica - GAUD-E genera objetos BIM parametricos IFC 4.0 listos para usar en Revit, ArchiCAD, Rhino, AutoCAD
y SketchUp sin ningun re-modelado manual. Este articulo presenta el pipeline GPS-2-BIM actualizado de 7 agentes
y 4 fases, su formulacion matematica formal, diagramas de arquitectura, el motor nativo C++ gaude-bridge (93% C++,
~50ms por modelo IFC, 40x mas rapido que TypeScript) y benchmarks de rendimiento. Plataforma activa en
<u>https://www.gps-2-bim.app</u> y <u>https://gaud-e.ai</u>.
""", abstract_style))
story.append(PageBreak())

# ─── 1. Introduction ──────────────────────────────────────────────────────────
story.append(Paragraph("1. Introduction", section_style))
story.append(Paragraph("""
Building Information Modeling (BIM) is today's industry standard for Architecture, Engineering, and Construction
(AEC) professionals worldwide. A complete BIM model encodes not only 3D geometry but also semantic properties -
material specifications, structural loads, MEP system relationships, cost estimates, and code-compliance data -
that are essential for every phase of a building's lifecycle from design through demolition.
<br/><br/>
Despite decades of software development, creating BIM models remains a highly manual, time-consuming, and expensive
process. The conventional workflow requires teams of licensed specialists - architects, structural engineers, MEP
engineers - investing weeks or months to produce a single coordinated BIM model. This bottleneck limits BIM adoption
to large practices and projects, excluding the vast majority of the global construction sector.
<br/><br/>
<b>The 3D representation gap.</b> Three-dimensional digitization technologies (LiDAR, photogrammetry) have advanced
rapidly, yet they produce point clouds and meshes - geometric approximations that cannot be used directly as
professional BIM. Converting a point cloud to an editable BIM model still requires weeks of manual remodeling by
specialists. No technology before GAUD-E could generate an editable, semantically complete BIM model from
coordinates and a text description alone.
<br/><br/>
GAUD-E addresses this gap through the GPS-2-BIM paradigm: a mathematical transformation T mapping geospatial
coordinates (G) and natural language (L) directly to a production-ready BIM model (M). The system implements this
via a 7-agent LLM pipeline running on Anthropic Claude, accelerated by a native C++ engine (gaude-bridge) achieving
~50ms IFC generation times - 40x faster than equivalent TypeScript implementations.
<br/><br/>
<b>Primary Contributions:</b> (1) First system to generate fully editable, parametric IFC 4.0 BIM from geospatial
input and natural language. (2) Formal mathematical formulation T: G x L to M with 7-agent pipeline composition.
(3) Native C++ engine (gaude-bridge, 93% C++) achieving ~50ms IFC 2X3 generation at 40x Python/TS speed.
(4) Production-ready platform with live deployment and 9-language support. (5) 95% time reduction, 45s-12min
generation, 80-890 elements. (6) Native export to 5 major CAD/BIM platforms.
""", body_style))

# ─── 2. The Real BIM Problem ──────────────────────────────────────────────────
story.append(Paragraph("2. The Real BIM Problem: Why Point Clouds and Meshes Fail Professionals",
                        section_style))

story.append(Paragraph("""
Before describing GAUD-E's solution, it is essential to characterize precisely what existing 3D technologies
produce and why they are insufficient for professional BIM workflows.
""", body_style))

story.append(Paragraph("2.1 Point Clouds", sub_style))
story.append(Paragraph("""
A point cloud is a set of discrete 3D coordinates P = {(x_i, y_i, z_i) in R3 | i = 1...N} captured by LiDAR
scanners or photogrammetry pipelines. They have critical limitations:
<br/><br/>
<b>L1 - No editability:</b> Individual points cannot be selected and modified as architectural elements.<br/>
<b>L2 - No semantic properties:</b> Points carry only XYZ coordinates and optionally RGB color.<br/>
<b>L3 - Requires existing construction:</b> Cannot generate BIM for a building not yet built.<br/>
<b>L4 - Scan-to-BIM gap:</b> Converting to editable BIM requires 80-400 hours of manual remodeling per building.<br/>
<b>L5 - No parametric relationships:</b> Walls, doors, windows lack parametric dependencies.<br/>
<b>L6 - CAD platform incompatibility:</b> Raw point clouds cannot be opened in Revit or ArchiCAD as editable objects.
""", body_style))

story.append(Paragraph("2.2 Polygon Meshes", sub_style))
story.append(Paragraph("""
A polygon mesh is a collection of vertices V, edges E, and faces F representing surfaces. Meshes share
fundamental deficiencies for BIM use:
<br/><br/>
<b>L1 - Non-parametric geometry:</b> No constraint-based relationships between elements.<br/>
<b>L2 - No IFC semantics:</b> No material specifications, structural classification, MEP routing, or cost data.<br/>
<b>L3 - Not editable in BIM software:</b> Can be imported as reference geometry only.<br/>
<b>L4 - No CAD export:</b> Cannot be exported as DWG, IFC, or RVT with meaningful BIM content.<br/>
<b>L5 - No MEP or structural content:</b> Contain no internal building systems.
""", body_style))

story.append(Paragraph("2.3 GAUD-E: Real Editable BIM", sub_style))
story.append(Paragraph("""
GAUD-E is the first system to generate <b>real, fully editable, semantically complete BIM models</b> from a
geographic coordinate and a natural language description - without requiring an existing building, a point cloud
capture, or any manual remodeling. Every element GAUD-E produces is a parametric IFC 4.0 object.
""", highlight_style))

story.append(Spacer(1, 0.1 * inch))
story.append(Paragraph("<b>Table 1 - 3D Representation Comparison</b>", caption_style))

cmp_data = [
    ["Capability",                "Point Cloud",  "Polygon Mesh", "GAUD-E BIM"],
    ["Editable in Revit/ArchiCAD","x",            "x (ref only)", "Native"],
    ["IFC 4.0 Semantic Tags",     "x",            "x",            "Full"],
    ["Parametric Geometry",       "x",            "x",            "Full"],
    ["Structural Data",           "x",            "x",            "Full"],
    ["MEP Systems Included",      "x",            "x",            "Full"],
    ["Cost Estimation Ready",     "x",            "x",            "Built-in"],
    ["Requires Existing Building","Required",     "No",           "Not needed"],
    ["CAD/BIM Export (DWG/RVT)",  "x",            "x",            "Full"],
    ["From Text + GPS Coords",    "x",            "Partial",      "Complete"],
]

cmp_table = Table(cmp_data, colWidths=[2.1*inch, 1.2*inch, 1.2*inch, 1.1*inch])
cmp_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), BLUE_DARK),
    ('TEXTCOLOR',  (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (3, 1), (3, -1), colors.HexColor("#E8F5E9")),
    ('FONTNAME',   (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTNAME',   (0, 1), (0, -1), 'Helvetica-Bold'),
    ('FONTSIZE',   (0, 0), (-1, -1), 8),
    ('ALIGN',      (1, 0), (-1, -1), 'CENTER'),
    ('ALIGN',      (0, 0), (0, -1), 'LEFT'),
    ('VALIGN',     (0, 0), (-1, -1), 'MIDDLE'),
    ('GRID',       (0, 0), (-1, -1), 0.5, GRAY_MID),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, GRAY_LIGHT]),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING',    (0, 0), (-1, -1), 5),
    ('LEFTPADDING',   (0, 0), (0, -1), 6),
]))
story.append(cmp_table)
story.append(Spacer(1, 0.1 * inch))

d_cmp = make_comparison_chart()
story.append(renderPDF.GraphicsFlowable(d_cmp))
story.append(PageBreak())

# ─── 3. Mathematical Formulation ──────────────────────────────────────────────
story.append(Paragraph("3. Mathematical Formulation", section_style))
story.append(Paragraph("3.1 The GPS-2-BIM Transformation", sub_style))
story.append(Paragraph("Let G be the geospatial input space and L the natural language description space:", body_style))

story.append(Paragraph("G = { (phi, lambda, h) in R3 | phi in [-90, 90], lambda in [-180, 180], h in R }", math_style))
story.append(Paragraph("L = { d | d is a valid building description string }", math_style))
story.append(Paragraph("M = { m | m is an IFC-4.0-compliant parametric BIM model }", math_style))

story.append(Spacer(1, 0.06 * inch))
story.append(Paragraph("The core GPS-2-BIM transformation is:", body_style))
story.append(Paragraph("T : G x L  ->  M", math_style))
story.append(Paragraph("T(g, d)  =  A7 o A6 o (A3 || A4 || A5) o A2 o A1 (g, d)", math_style))

story.append(Spacer(1, 0.06 * inch))
story.append(Paragraph("""
Where A_i denotes the i-th agent function, o denotes sequential composition, and || denotes parallel
(concurrent) execution via Promise.all(). Each agent A_i maps an intermediate state representation to the next.
""", body_style))

story.append(Paragraph("3.2 Agent State Spaces", sub_style))

states_data = [
    ["Agent", "Role",       "Input",    "Output",          "LLM"],
    ["A1",    "Enhancer",   "g, d",     "norm. JSON",      "Haiku 4.5"],
    ["A2",    "Architect",  "A1 out",   "spatial BIM",     "Sonnet 4"],
    ["A3",    "Structural", "A2 out",   "struct. data",    "Haiku 3.5"],
    ["A4",    "MEP",        "A2 out",   "MEP systems",     "Haiku 3.5"],
    ["A5",    "Landscape",  "A2 out",   "site data",       "Haiku 3.5"],
    ["A6",    "BIM Prog.",  "A2+A3+A4+A5", "unified BIM", "Sonnet 3.5"],
    ["A7",    "QA Review",  "A6 out",   "m in M",          "Haiku 3.5"],
]
states_table = Table(states_data, colWidths=[0.5*inch, 1.1*inch, 1.1*inch, 1.4*inch, 1.1*inch])
states_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), BLUE_MID),
    ('TEXTCOLOR',  (0, 0), (-1, 0), colors.white),
    ('FONTNAME',   (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE',   (0, 0), (-1, -1), 8),
    ('ALIGN',      (0, 0), (-1, -1), 'CENTER'),
    ('GRID',       (0, 0), (-1, -1), 0.5, GRAY_MID),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, GRAY_LIGHT]),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING',    (0, 0), (-1, -1), 5),
]))
story.append(states_table)
story.append(Spacer(1, 0.08 * inch))

story.append(Paragraph("3.3 Temporal Complexity", sub_style))
story.append(Paragraph("The total pipeline wall-clock time:", body_style))
story.append(Paragraph("t_total = t1 + t2 + max(t3, t4, t5) + t6 + t7", math_style))
story.append(Paragraph("""
Empirical values (residential): t1 ~ 3s, t2 ~ 8s, max(t3,t4,t5) ~ 12s, t6 ~ 15s, t7 ~ 7s ->
t_total ~ 45s. Without Phase 2 parallelism the equivalent sequential time would be ~30s additional.
""", body_style))

story.append(Paragraph("3.4 Quality Metric", sub_style))
story.append(Paragraph(
    "Q = (1/7) * sum(q_k),   q_k in {q_geo, q_dim, q_prog, q_struct, q_build, q_mat, q_mep}",
    math_style
))
story.append(Paragraph("Models with Q >= 85 are marked production-ready. Platform average: Q = 90.0.", body_style))

story.append(Spacer(1, 0.06 * inch))
d_flow = make_gps2bim_flow()
story.append(renderPDF.GraphicsFlowable(d_flow))
story.append(PageBreak())

# ─── 4. System Architecture ───────────────────────────────────────────────────
story.append(Paragraph("4. System Architecture", section_style))
story.append(Paragraph("4.1 Platform Overview", sub_style))
story.append(Paragraph("""
GAUD-E is deployed as a web application on Vercel with a React 19 / Vite 8 frontend and Vercel Serverless
Node.js backend. The frontend provides terrain selection via Google Maps JS API, natural language input,
real-time 3D visualization via Three.js / React Three Fiber, and export/integration workflows.
The backend executes the 7-agent LLM pipeline via Anthropic Claude. Full platform: <u>https://gaud-e.ai</u>
and <u>https://www.gps-2-bim.app</u>.
""", body_style))

d_arch = make_architecture_overview()
story.append(renderPDF.GraphicsFlowable(d_arch))
story.append(Spacer(1, 0.06 * inch))

story.append(Paragraph("4.2 7-Agent Pipeline Architecture", sub_style))
d_pipe = make_pipeline_diagram()
story.append(renderPDF.GraphicsFlowable(d_pipe))
story.append(Paragraph("Figure - 7-Agent Pipeline: T(g,d) = A7 o A6 o (A3 || A4 || A5) o A2 o A1(g, d)",
                        caption_style))

story.append(Paragraph("<b>Phase 1 - Architectural Design (sequential, 2 agents)</b>", body_style))
story.append(Paragraph("""
<b>A1 Instruction Enhancer</b> (Claude Haiku 4.5, temp 0.3, 4 000 tokens): Normalizes unstructured NL input
into structured JSON.<br/><br/>
<b>A2 Architect</b> (Claude Sonnet 4, temp 0.2, 10 000 tokens): Generates complete spatial design including
structural grid, walls, columns, slabs, roof, doors, windows, and furniture.
""", body_style))

story.append(Paragraph("<b>Phase 2 - Engineering Systems (3 agents, PARALLEL via Promise.all)</b>", body_style))
story.append(Paragraph("""
<b>A3 Structural Engineer</b> (Claude Haiku 3.5): Beams, foundations, roof structure, seismic bracing.<br/>
<b>A4 MEP Engineer</b> (Claude Haiku 3.5): Water supply, drainage, electrical, HVAC, fire sprinklers.<br/>
<b>A5 Landscape Architect</b> (Claude Haiku 3.5): Native vegetation, hardscape, parking, site drainage.
""", body_style))

story.append(Paragraph("<b>Phase 3 - BIM Consolidation + Phase 4 - Quality Assurance</b>", body_style))
story.append(Paragraph("""
<b>A6 BIM Programmer</b> (Claude Sonnet 3.5, temp 0.1, 12 000 tokens): Merges all parallel outputs into a
unified JSON-LD BIM model with 80-890 elements. Output is passed to the native C++ engine gaude-bridge for
IFC 2X3 generation in ~50ms.<br/><br/>
<b>A7 Quality Reviewer</b> (Claude Haiku 3.5): Validates model against 7 quality metrics (0-100 scale),
flags non-conformances, and generates auto-repair patches.
""", body_style))
story.append(PageBreak())

# ─── 5. GPS-2-BIM Pipeline ────────────────────────────────────────────────────
story.append(Paragraph("5. GPS-2-BIM Pipeline - User Workflow", section_style))
story.append(Paragraph("""
<b>Step 1 - Geospatial Selection:</b> User clicks a location on the embedded Google Maps interface.
The system captures GPS coordinates and retrieves satellite imagery, cadastral data, and local
climate/seismic zone.<br/><br/>
<b>Step 2 - Natural Language Description:</b> User types a building description in any of 9 supported
languages (ES, EN, ZH, PT, HE, AR, RU, KU, DE).<br/><br/>
<b>Step 3 - 7-Agent Pipeline Execution:</b> The transformation T(g, d) executes across 4 phases,
typically 45s to 12 min depending on building complexity.<br/><br/>
<b>Step 4 - Real-Time 3D Visualization:</b> The generated model renders in the Three.js viewport
with orbit controls, PBR materials, and layer toggling (Architectural / Structural / MEP / Landscape).<br/><br/>
<b>Step 5 - Export and Integration:</b> User downloads IFC 4.0, glTF 2.0, or opens via native plugins.
The native C++ gaude-bridge generates the final IFC 2X3 file in ~50ms.
""", body_style))

# ─── 6. JSON-LD BIM Schema ────────────────────────────────────────────────────
story.append(Paragraph("6. JSON-LD BIM Schema", section_style))
story.append(Paragraph("""
Every element in the GAUD-E BIM model is a JSON-LD object extending the IFC 4.0 ontology.
Below is a representative excerpt showing a wall element with full semantic content:
""", body_style))

schema_code = """{
  "@context": "https://gaud-e.ai/schema/ifc-extension.jsonld",
  "model_id": "GAUD-E-RES-001",
  "gps_origin": { "lat": -33.4489, "lon": -70.6693, "alt": 520.0 },
  "elements": [{
    "element_id": "W-001",
    "element_type": "IfcWall",
    "properties": {
      "thickness_m": 0.30, "material": "Reinforced Concrete",
      "fire_rating": "EI-60", "cost_usd_per_m2": 120
    },
    "ifc_guid": "3FVbnDPKv7DhPnc7NJ0Wl4"
  }],
  "quality_metrics": {
    "geometric_coherence": 95, "dimensional_realism": 92,
    "program_compliance": 88, "structural_soundness": 90,
    "buildability": 87, "material_consistency": 93, "mep_integration": 85
  }
}"""
story.append(Paragraph(schema_code, code_style))
story.append(PageBreak())

# ─── 7. Technology Stack ──────────────────────────────────────────────────────
story.append(Paragraph("7. Technology Stack", section_style))

tech_data = [
    ["Component",           "Technology",                         "Purpose"],
    ["Frontend",            "React 19 + Vite 8 + Tailwind CSS 4", "UI, responsive design"],
    ["3D Renderer",         "Three.js 0.164 + React Three Fiber",  "Real-time BIM visualization"],
    ["Backend",             "Vercel Serverless + Node.js",         "Scalable API + pipeline"],
    ["LLM Agents",          "Anthropic Claude (Haiku/Sonnet)",     "7-agent reasoning"],
    ["C++ Engine",          "gaude-bridge (93% C++, port 19724)",  "~50ms IFC 2X3 generation"],
    ["Maps",                "Google Maps JS API v3.64",            "GPS coordinate selection"],
    ["BIM Standard",        "IFC 4.0 + JSON-LD",                  "Semantic BIM export"],
    ["CAD Integration",     "Revit API, ArchiCAD JSON API, Rhino.Compute", "Native plugins"],
    ["Auth & Billing",      "JWT + Stripe Checkout + Vercel KV",  "API keys, subscriptions"],
]
tech_table = Table(tech_data, colWidths=[1.5*inch, 2.1*inch, 1.9*inch])
tech_table.setStyle(TableStyle([
    ('BACKGROUND',  (0, 0), (-1, 0), BLUE_DARK),
    ('TEXTCOLOR',   (0, 0), (-1, 0), colors.white),
    ('FONTNAME',    (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE',    (0, 0), (-1, -1), 8),
    ('ALIGN',       (0, 0), (-1, -1), 'LEFT'),
    ('VALIGN',      (0, 0), (-1, -1), 'TOP'),
    ('GRID',        (0, 0), (-1, -1), 0.5, GRAY_MID),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, GRAY_LIGHT]),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING',    (0, 0), (-1, -1), 5),
    ('LEFTPADDING',   (0, 0), (-1, -1), 5),
]))
story.append(tech_table)
story.append(Spacer(1, 0.1 * inch))

# ─── 8. Results and Performance ───────────────────────────────────────────────
story.append(Paragraph("8. Results and Performance", section_style))

story.append(Paragraph("8.1 Generation Performance Benchmarks", sub_style))
perf_data = [
    ["Building Type",          "Gen. Time", "Elements", "Quality Q"],
    ["Residential House",      "45 s",      "42",       "91.4"],
    ["Multi-Family (6 floors)","2 min",     "156",      "89.8"],
    ["Office Building",        "5 min",     "340",      "90.2"],
    ["Hospital Complex",       "12 min",    "890",      "88.6"],
]
perf_table = Table(perf_data, colWidths=[1.8*inch, 1.1*inch, 1.0*inch, 1.1*inch])
perf_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), BLUE_MID),
    ('TEXTCOLOR',  (0, 0), (-1, 0), colors.white),
    ('FONTNAME',   (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE',   (0, 0), (-1, -1), 9),
    ('ALIGN',      (0, 0), (-1, -1), 'CENTER'),
    ('ALIGN',      (0, 0), (0, -1), 'LEFT'),
    ('GRID',       (0, 0), (-1, -1), 0.5, GRAY_MID),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, GRAY_LIGHT]),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING',    (0, 0), (-1, -1), 5),
]))
story.append(perf_table)
story.append(Spacer(1, 0.06 * inch))
story.append(Paragraph("""
Average generation time: 4.75 min across all building types. Versus manual BIM creation (3-6 weeks),
GAUD-E achieves a <b>95% time reduction</b>. Average quality score Q = 90.0 across all benchmark models.
""", body_style))

# ── 8.2 Quality Metrics ──────────────────────────────────────────────────────
story.append(Paragraph("8.2 Quality Metrics Breakdown", sub_style))
d_quality = make_quality_radar()
story.append(KeepTogether([
    renderPDF.GraphicsFlowable(d_quality),
    Paragraph("Figure 3 - GAUD-E quality dimensions, average Q = 90.0/100", caption_style),
]))

# ── 8.2.1 C++ Benchmark — PageBreak ensures no overlap ───────────────────────
story.append(PageBreak())

story.append(Paragraph("8.2.1 C++ Motor vs TypeScript/Python - IFC Generation Benchmark", sub_style))
story.append(Paragraph("""
The native C++ engine <b>gaude-bridge</b> (93% C++, HTTP bridge on port 19724) replaces the TypeScript/Python
IFC generator as the primary export path. The benchmark below measures end-to-end IFC 2X3 file generation
time for three canonical building types, comparing the C++ native path against the TypeScript fallback.
""", body_style))

# C++ Architecture diagram — KeepTogether prevents split
story.append(KeepTogether([
    renderPDF.GraphicsFlowable(make_cpp_architecture_diagram()),
    Paragraph("Figure 5 - C++ Native Motor Architecture: gaude-bridge (93% C++), HTTP on 127.0.0.1:19724",
              caption_style),
]))

story.append(Spacer(1, 0.12 * inch))

# Benchmark chart — KeepTogether prevents split
story.append(KeepTogether([
    renderPDF.GraphicsFlowable(make_cpp_benchmark_chart()),
]))

story.append(Spacer(1, 0.1 * inch))

# Detailed metrics table
story.append(Paragraph("<b>Table 3 - Detailed Performance Metrics: C++ Native Motor vs TypeScript Fallback</b>",
                        caption_style))
cpp_data = [
    ["Building Type",          "Elements", "C++ (gaude-bridge)", "TypeScript", "Speedup"],
    ["Residential (42 el.)",   "42",       "48 ms",              "1 920 ms",   "40x"],
    ["Multi-Family (156 el.)", "156",      "55 ms",              "2 200 ms",   "40x"],
    ["Office (340 el.)",       "340",      "63 ms",              "2 650 ms",   "42x"],
    ["Hospital (890 el.)",     "890",      "~110 ms",            "~3 600 ms",  "33x"],
    ["Average",                "-",        "~69 ms",             "~2 593 ms",  "~40x"],
]
cpp_table = Table(cpp_data, colWidths=[1.7*inch, 0.75*inch, 1.2*inch, 1.1*inch, 0.75*inch])
cpp_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), BLUE_DARK),
    ('TEXTCOLOR',  (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (2, 1), (2, -1), colors.HexColor("#DCFCE7")),
    ('BACKGROUND', (4, 1), (4, -1), colors.HexColor("#DCFCE7")),
    ('BACKGROUND', (0, -1), (-1, -1), BLUE_LIGHT),
    ('FONTNAME',   (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTNAME',   (0, -1), (-1, -1), 'Helvetica-Bold'),
    ('FONTSIZE',   (0, 0), (-1, -1), 8.5),
    ('ALIGN',      (0, 0), (-1, -1), 'CENTER'),
    ('ALIGN',      (0, 0), (0, -1), 'LEFT'),
    ('GRID',       (0, 0), (-1, -1), 0.5, GRAY_MID),
    ('ROWBACKGROUNDS', (0, 1), (-1, -2), [colors.white, GRAY_LIGHT]),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING',    (0, 0), (-1, -1), 5),
    ('LEFTPADDING',   (0, 0), (0, -1), 6),
]))
story.append(cpp_table)
story.append(Spacer(1, 0.06 * inch))
story.append(Paragraph("""
The C++ engine processes IFC geometry via direct memory operations without JSON parsing overhead.
Complexity scales sub-linearly: O(N * log N) vs O(N<super>2</super>) for the TypeScript reference implementation.
The gaude-bridge binary exposes a REST API on 127.0.0.1:19724, used by both the local desktop client
and the Vercel serverless backend via <b>GAUDE_BRIDGE_URL</b> environment variable.
""", body_style))
story.append(PageBreak())

# ── 8.3 Software Compatibility Matrix ─────────────────────────────────────────
story.append(Paragraph("8.3 Software Compatibility Matrix", sub_style))
compat_data = [
    ["Platform",              "Format",     "Integration",          "Status"],
    ["Autodesk Revit",        "RVT + IFC",  "REST API + Addon",     "Production"],
    ["Graphisoft ArchiCAD",   "PLN + IFC",  "JSON API + Plugin",    "Production"],
    ["McNeel Rhino",          "3DM + IFC",  "Rhino.Compute + glTF", "Production"],
    ["Autodesk AutoCAD",      "DWG + DXF",  "File Export",          "Production"],
    ["Trimble SketchUp",      "SKP + IFC",  "SDK Integration",      "Production"],
]
compat_table = Table(compat_data, colWidths=[1.4*inch, 1.1*inch, 1.8*inch, 1.2*inch])
compat_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), BLUE_DARK),
    ('TEXTCOLOR',  (0, 0), (-1, 0), colors.white),
    ('FONTNAME',   (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE',   (0, 0), (-1, -1), 8.5),
    ('ALIGN',      (0, 0), (-1, -1), 'CENTER'),
    ('GRID',       (0, 0), (-1, -1), 0.5, GRAY_MID),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, GRAY_LIGHT]),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING',    (0, 0), (-1, -1), 5),
]))
story.append(compat_table)
story.append(Spacer(1, 0.1 * inch))

# ─── 9. Developer SDK ─────────────────────────────────────────────────────────
story.append(Paragraph("9. Developer SDK and API", section_style))
story.append(Paragraph("""
GAUD-E provides an open-source npm package <b>@gaude/sdk</b> (ELv2 license, v2.0.1) for developers integrating
BIM generation into custom applications. Available at:
<u>https://github.com/rickygaude-rgb/gaud-e-sdk</u>.
<br/><br/>
<b>React Components:</b> TerrainSelector, BIM3DViewer, MaterialEditor, QualityDashboard, ExportButton.<br/>
<b>C++ Bridge:</b> gaude-bridge binary exposes HTTP API on :19724 for native IFC 2X3 generation at ~50ms.<br/>
<b>API Authentication:</b> Keys in format gde_live_XXXXXXXX managed via the Platform dashboard.
Three tiers: Free (10 credits), Pro, Studio. Contact: <u>contacto@gaud-e.ai</u>.
""", body_style))

# ─── 10. Multi-Language Support ───────────────────────────────────────────────
story.append(Paragraph("10. Multi-Language Support", section_style))
lang_data = [
    ["Language",    "Status",       "Language",   "Status"],
    ["Spanish",     "Production",   "English",    "Production"],
    ["Mandarin",    "Production",   "Portuguese", "Production"],
    ["Hebrew",      "Production",   "Arabic",     "Production"],
    ["Russian",     "Production",   "Kurdish",    "Beta"],
    ["German",      "Production",   "",           ""],
]
lang_table = Table(lang_data, colWidths=[2.0*inch, 1.1*inch, 2.0*inch, 1.1*inch])
lang_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), BLUE_DARK),
    ('TEXTCOLOR',  (0, 0), (-1, 0), colors.white),
    ('FONTNAME',   (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE',   (0, 0), (-1, -1), 8.5),
    ('GRID',       (0, 0), (-1, -1), 0.5, GRAY_MID),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, GRAY_LIGHT]),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('TOPPADDING',    (0, 0), (-1, -1), 4),
    ('LEFTPADDING',   (0, 0), (-1, -1), 5),
]))
story.append(lang_table)

# ─── 11. Future Work ──────────────────────────────────────────────────────────
story.append(Paragraph("11. Future Work", section_style))
story.append(Paragraph("""
<b>Scan-to-BIM Integration:</b> Accept LiDAR point clouds as supplemental input to retrofit/renovation workflows.
<br/><br/>
<b>Real-Time Collaboration:</b> WebSocket-based multi-user concurrent editing with semantic conflict resolution.
<br/><br/>
<b>Structural FEM Validation:</b> Integrate finite element solvers for automated structural analysis.
<br/><br/>
<b>Generative Design Exploration:</b> Agent-based multi-solution generation - 10-50 design alternatives
ranked automatically by cost, area efficiency, and energy performance.
<br/><br/>
<b>Carbon Footprint Integration:</b> Embed lifecycle carbon analysis (LCA) into Phase 4 QA metrics.
<br/><br/>
<b>C++ Engine Expansion:</b> Extend gaude-bridge to full IFC 4.0 with direct ArchiCAD/Revit binary output,
targeting <5ms generation for residential buildings.
""", body_style))

# ─── 12. Conclusion ───────────────────────────────────────────────────────────
story.append(Paragraph("12. Conclusion", section_style))
story.append(Paragraph("""
GAUD-E represents a fundamental breakthrough in AEC technology: the first system to automatically generate
fully editable, semantically complete, IFC 4.0-compliant BIM models from geospatial coordinates and natural
language descriptions. The formal GPS-2-BIM transformation T: G x L to M, implemented as a 7-agent LLM pipeline
with parallel Phase 2 execution and native C++ gaude-bridge engine, achieves:
<br/><br/>
- <b>95% time reduction</b> over manual BIM creation (45s to 12min vs 3-6 weeks)<br/>
- <b>~50ms IFC 2X3 generation</b> via C++ native engine (40x faster than TypeScript fallback)<br/>
- <b>Q = 90.0/100</b> average quality score across all benchmark models<br/>
- <b>5 CAD/BIM platforms</b> with native integration and 9-language support
<br/><br/>
Platform live at <u>https://www.gps-2-bim.app</u> and <u>https://gaud-e.ai</u>.
Open-source SDK: <u>https://github.com/rickygaude-rgb/gaud-e-sdk</u>.
Enterprise: <u>contacto@gaud-e.ai</u>.
""", body_style))

# ─── References ───────────────────────────────────────────────────────────────
story.append(PageBreak())
story.append(Paragraph("References", section_style))
refs = [
    "[1] Eastman, C., Teicholz, P., Sacks, R., Liston, K. (2011). BIM Handbook. John Wiley & Sons.",
    "[2] buildingSMART International. (2018). IFC 4.0 Standard - ISO 16739:2018.",
    "[3] Brown, T. et al. (2020). Language Models are Few-Shot Learners. NeurIPS 2020.",
    "[4] Anthropic. (2024). Claude 3 Model Card. anthropic.com/research/claude.",
    "[5] Wei, J. et al. (2022). Chain-of-Thought Prompting. arXiv:2201.11903.",
    "[6] Arayici, Y. et al. (2013). BIM implementation and remote construction. J. IT Constr.",
    "[7] Autodesk. (2023). Revit API Documentation. autodesk.com/developer/revit.",
    "[8] Graphisoft. (2023). ArchiCAD API Reference. api.graphisoft.com.",
    "[9] McNeel. (2024). Rhino.Compute Documentation. developer.rhino3d.com/compute.",
    "[10] Khronos Group. (2023). glTF 2.0 Specification. khronos.org/gltf.",
    "[11] OpenAI. (2023). GPT-4 Technical Report. arXiv:2303.08774.",
    "[12] Google Cloud. (2024). Maps JavaScript API v3.64. developers.google.com/maps.",
    "[13] React Team. (2024). React 19 Documentation. react.dev.",
    "[14] Three.js Foundation. (2024). Three.js Documentation. threejs.org.",
    "[15] Vercel Inc. (2024). Vercel Serverless Functions. vercel.com/docs/functions.",
    "[16] Riffo Q., R. (2026). GAUD-E Platform. gaud-e.ai | gps-2-bim.app.",
    "[17] GAUD-E Engineering. (2026). gaude-bridge: Native C++ IFC Generator. github.com/rickygaude-rgb.",
]
for ref in refs:
    story.append(Paragraph(ref, abstract_style))

# ─── Build ─────────────────────────────────────────────────────────────────────
doc.build(story, onFirstPage=add_page_numbers, onLaterPages=add_page_numbers)
print("PDF v2.2 generated successfully!")
print("  Author: Ricardo Riffo Q.")
print("  Contact: contacto@gaud-e.ai")
print("  Sites: gaud-e.ai | gps-2-bim.app")
print(f"  Output: {OUTPUT_PATH}")
