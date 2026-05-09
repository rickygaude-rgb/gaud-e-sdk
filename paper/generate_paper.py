#!/usr/bin/env python3
"""
GAUD-E Scientific Paper PDF Generator — v2.1
Author: Ricardo Riffo Q. | contacto@gaud-e.ai
Sites: gaud-e.ai | gps-2-bim.app
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
OUTPUT_PATH = "/tmp/sdk-repo/paper/GAUD-E_Scientific_Paper_2026.pdf"
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
    borderPad=(0, 0, 2, 0),
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
    canvas.drawCentredString(PAGE_WIDTH / 2, 0.4 * inch, f"GAUD-E Scientific Paper 2026  |  Page {doc.page}")
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

    # Background
    d.add(Rect(0, 0, W, H, fillColor=GRAY_LIGHT, strokeColor=None))

    phases = [
        ("Phase 1", ["A1\nEnhancer", "A2\nArchitect"], BLUE_MID, 30),
        ("Phase 2\n(PARALLEL)", ["A3\nStructural", "A4\nMEP", "A5\nLandscape"], GREEN, 160),
        ("Phase 3", ["A6\nBIM Prog."], ORANGE, 310),
        ("Phase 4", ["A7\nQA Review"], CYAN, 390),
    ]

    bw, bh = 52, 36
    for phase_name, agents, col, px in phases:
        # Phase label
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

    # Arrows between phases
    arrow_xs = [(82, 160), (280, 310), (362, 390)]
    for x1, x2 in arrow_xs:
        y = H - 62
        d.add(Line(x1, y, x2 - 5, y, strokeColor=BLUE_DARK, strokeWidth=1.5))
        d.add(Polygon([x2 - 5, y + 5, x2 - 5, y - 5, x2 + 2, y],
                      fillColor=BLUE_DARK, strokeColor=None))

    # Promise.all bracket for Phase 2
    d.add(Rect(158, H - 120, 148, 50, fillColor=None,
               strokeColor=GREEN, strokeWidth=1, strokeDashArray=[3, 2]))
    d.add(String(232, H - 130, "Promise.all()", fontSize=7,
                 fillColor=GREEN, fontName='Helvetica-Bold', textAnchor='middle'))

    # GPS-2-BIM label at bottom
    d.add(String(W / 2, 18, "GPS-2-BIM: G × L  →  M  (7 Agents, 4 Phases)",
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
        (95, 90, 88, 92, 97),   # GAUD-E
        (10,  5,  0, 15, 20),   # Point Cloud
        (30, 20,  5, 40, 15),   # Mesh
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

    # Legend
    legend_items = [("GAUD-E", BLUE_MID), ("Point Cloud", ORANGE), ("Mesh", GRAY_MID)]
    for i, (label, col) in enumerate(legend_items):
        lx = 65 + i * 120
        d.add(Rect(lx, 12, 10, 10, fillColor=col, strokeColor=None))
        d.add(String(lx + 14, 14, label, fontSize=7.5,
                     fillColor=colors.black, textAnchor='start'))

    d.add(String(W / 2, H - 15, "Figure 2 — BIM Capability Comparison (0–100 Scale)",
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
            ay = (H) / 2
            d.add(Line(ax, ay, ax + gap - 4, ay,
                       strokeColor=BLUE_DARK, strokeWidth=1.5))
            d.add(Polygon([ax + gap - 4, ay + 4,
                           ax + gap - 4, ay - 4,
                           ax + gap + 1, ay],
                          fillColor=BLUE_DARK, strokeColor=None))

    d.add(String(W / 2, 10, "Figure 1 — GPS-2-BIM Workflow: T: G × L → M",
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
    bar_max = 280
    row_h = 22
    x0 = 130
    y0 = H - 30

    d.add(String(W / 2, H - 15, "Figure 3 — GAUD-E Quality Metrics (avg 90.0/100)",
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

    # Layers
    layers = [
        ("Frontend  —  React 19 + Three.js + Google Maps", 140, BLUE_LIGHT, BLUE_DARK),
        ("API Gateway  —  Vercel Serverless (Node.js)", 100, colors.HexColor("#E8F5E9"), GREEN),
        ("7-Agent LLM Pipeline  —  Anthropic Claude", 60, colors.HexColor("#FFF3E0"), ORANGE),
        ("Export Layer  —  IFC 2X3 / glTF / Revit / ArchiCAD / Rhino", 20, colors.HexColor("#E3F2FD"), CYAN),
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

    # Arrows between layers
    for ly in [140, 100, 60]:
        ax = W / 2
        d.add(Line(ax, ly, ax, ly - 8,
                   strokeColor=BLUE_DARK, strokeWidth=1.2))
        d.add(Polygon([ax - 4, ly - 8, ax + 4, ly - 8, ax, ly - 14],
                      fillColor=BLUE_DARK, strokeColor=None))

    d.add(String(W / 2, 10,
                 "Figure 4 — GAUD-E System Architecture",
                 fontSize=8, fillColor=BLUE_DARK,
                 fontName='Helvetica-Bold', textAnchor='middle'))
    return d


# ═══════════════════════════════════════════════════════════════════════════════
# ─── C++ Motor Architecture Diagram ─────────────────────────────────────────
def make_cpp_motor_diagram():
    """C++ gaude-bridge architecture with 3 binaries"""
    W, H = 480, 220
    d = Drawing(W, H)
    d.add(Rect(0, 0, W, H, fillColor=colors.HexColor("#0D1117"), strokeColor=None))

    CPPCYAN  = colors.HexColor("#00B4D8")
    CPPGREEN = colors.HexColor("#2DC653")
    CPPORANGE= colors.HexColor("#F4A261")
    CPPBLUE  = colors.HexColor("#4472C4")
    GRAY85   = colors.HexColor("#222831")
    WHITE    = colors.HexColor("#E8EAF0")

    # Title bar
    d.add(Rect(0, 195, W, 25, fillColor=colors.HexColor("#161B22"), strokeColor=None))
    d.add(String(W/2, 203, "C++ Native Motor Architecture — gaude-bridge (93% C++)",
                 fontSize=9, fillColor=CPPCYAN, fontName='Helvetica-Bold', textAnchor='middle'))

    # ── gaude-bridge HTTP server box ─────────────────────────────────────────
    d.add(Rect(140, 148, 200, 38, fillColor=GRAY85,
               strokeColor=CPPCYAN, strokeWidth=1.5, rx=4, ry=4))
    d.add(String(240, 172, "gaude-bridge",
                 fontSize=9, fillColor=CPPCYAN, fontName='Helvetica-Bold', textAnchor='middle'))
    d.add(String(240, 158, "HTTP Server  ·  127.0.0.1:19724",
                 fontSize=7.5, fillColor=WHITE, fontName='Helvetica', textAnchor='middle'))

    # ── 3 binary boxes ────────────────────────────────────────────────────────
    bins = [
        (30,  75, "gps2bim", "IFC 2X3 Generator", "~50ms", CPPGREEN),
        (180, 75, "gaude-pipeline", "7-Agent AI Pipeline", "Claude API", CPPORANGE),
        (340, 75, "exporters", "IFC / Revit / Rhino\nArchiCAD / glTF", "", CPPBLUE),
    ]
    for bx, by, name, sub, perf, col in bins:
        d.add(Rect(bx, by, 120, 58, fillColor=GRAY85,
                   strokeColor=col, strokeWidth=1.2, rx=3, ry=3))
        d.add(String(bx+60, by+44, name,
                     fontSize=8.5, fillColor=col, fontName='Helvetica-Bold', textAnchor='middle'))
        d.add(String(bx+60, by+31, sub,
                     fontSize=7, fillColor=WHITE, fontName='Helvetica', textAnchor='middle'))
        if perf:
            d.add(String(bx+60, by+18, perf,
                         fontSize=7.5, fillColor=CPPGREEN if col==CPPGREEN else WHITE,
                         fontName='Helvetica-Bold', textAnchor='middle'))

    # ── arrows bridge → binaries ──────────────────────────────────────────────
    for bx in [90, 240, 400]:
        d.add(Line(bx, 148, bx, 134, strokeColor=colors.HexColor("#444"), strokeWidth=1))
        d.add(Polygon([bx-4,134, bx+4,134, bx,128], fillColor=colors.HexColor("#888"), strokeColor=None))

    # ── Input / Output labels ─────────────────────────────────────────────────
    # Input: Frontend
    d.add(Rect(170, 4, 140, 22, fillColor=colors.HexColor("#1B2030"),
               strokeColor=CPPBLUE, strokeWidth=1, rx=3, ry=3))
    d.add(String(240, 11, "Next.js Frontend  /api/pipeline",
                 fontSize=7, fillColor=CPPBLUE, fontName='Helvetica', textAnchor='middle'))

    # Arrow up from frontend to bridge
    d.add(Line(240, 26, 240, 148, strokeColor=colors.HexColor("#333"), strokeWidth=1,
               strokeDashArray=[3,2]))

    # Performance badge
    d.add(Rect(350, 4, 120, 22, fillColor=colors.HexColor("#0D2818"),
               strokeColor=CPPGREEN, strokeWidth=1, rx=3, ry=3))
    d.add(String(410, 11, "⚡ 40× faster than Python",
                 fontSize=7.5, fillColor=CPPGREEN, fontName='Helvetica-Bold', textAnchor='middle'))

    d.add(String(W/2, -8,
                 "Figure 5 — C++ Native Bridge (gaude-bridge) — github.com/rickygaude-rgb/C---Gps-2-Bim",
                 fontSize=7, fillColor=colors.HexColor("#888"), fontName='Helvetica', textAnchor='middle'))
    return d


# ─── C++ vs TypeScript/Python Benchmark Chart ─────────────────────────────────
def make_cpp_benchmark_chart():
    """Horizontal bar chart: C++ vs Python/TypeScript IFC generation time"""
    W, H = 460, 200
    d = Drawing(W, H)
    d.add(Rect(0, 0, W, H, fillColor=colors.HexColor("#F8FAFC"), strokeColor=None))

    CPPCYAN  = colors.HexColor("#00B4D8")
    CPPGREEN = colors.HexColor("#2DC653")
    RED      = colors.HexColor("#E63946")
    ORANGE   = colors.HexColor("#F4A261")
    DARK     = colors.HexColor("#1A1A2E")

    d.add(String(W/2, 186, "IFC Generation Performance: C++ Motor vs Alternatives",
                 fontSize=9, fillColor=DARK, fontName='Helvetica-Bold', textAnchor='middle'))

    # Data: [label, cpp_ms, python_ms]
    benchmarks = [
        ("Residential (42 el.)",    48,   1920),
        ("Multi-Family (156 el.)",  55,   2200),
        ("Office (340 el.)",        63,   2650),
        ("Hospital (890 el.)",      89,   3600),
    ]

    bar_h = 22
    gap   = 12
    x0    = 150   # left margin for labels
    scale = 0.095 # px per ms (max 3600ms → ~342px)
    y0    = 30

    for i, (label, cpp_ms, py_ms) in enumerate(benchmarks):
        y = y0 + i * (bar_h * 2 + gap + 4)

        # Label
        d.add(String(x0 - 6, y + bar_h + 4, label,
                     fontSize=7.5, fillColor=DARK, fontName='Helvetica', textAnchor='end'))

        # Python/TypeScript bar (top)
        pw = py_ms * scale
        d.add(Rect(x0, y + bar_h + 2, pw, bar_h - 4,
                   fillColor=ORANGE, strokeColor=None, rx=2, ry=2))
        d.add(String(x0 + pw + 4, y + bar_h + 10, f"{py_ms}ms (TypeScript)",
                     fontSize=6.5, fillColor=ORANGE, fontName='Helvetica-Bold', textAnchor='start'))

        # C++ bar (bottom)
        cw = cpp_ms * scale
        d.add(Rect(x0, y, cw, bar_h - 4,
                   fillColor=CPPGREEN, strokeColor=None, rx=2, ry=2))
        d.add(String(x0 + cw + 4, y + 8, f"{cpp_ms}ms (C++)",
                     fontSize=6.5, fillColor=CPPGREEN, fontName='Helvetica-Bold', textAnchor='start'))

    # Legend
    lx, ly = x0, 10
    d.add(Rect(lx, ly, 12, 8, fillColor=CPPGREEN, strokeColor=None, rx=1, ry=1))
    d.add(String(lx+15, ly+2, "C++ Native (gaude-bridge)", fontSize=7, fillColor=DARK, fontName='Helvetica'))
    d.add(Rect(lx+160, ly, 12, 8, fillColor=ORANGE, strokeColor=None, rx=1, ry=1))
    d.add(String(lx+175, ly+2, "TypeScript / Python", fontSize=7, fillColor=DARK, fontName='Helvetica'))

    # X-axis label
    d.add(String(W/2, 2, "Generation time (milliseconds) — lower is better",
                 fontSize=7, fillColor=colors.HexColor("#666"), fontName='Helvetica', textAnchor='middle'))

    d.add(String(W/2, -10,
                 "Figure 6 — IFC 2X3 generation benchmark: C++ motor 40× faster on average",
                 fontSize=7, fillColor=DARK, fontName='Helvetica-Bold', textAnchor='middle'))
    return d


# ─── C++ Motor Performance Table ─────────────────────────────────────────────
def make_cpp_perf_table_data():
    """Returns styled table comparing C++ motor metrics"""
    CPPCYAN  = colors.HexColor("#00B4D8")
    CPPGREEN = colors.HexColor("#2DC653")
    DARK     = colors.HexColor("#0D1117")
    WHITE    = colors.white
    GRAY_LT  = colors.HexColor("#F5F5F5")
    GRAY_MD  = colors.HexColor("#CCCCCC")
    ORANGE   = colors.HexColor("#F4A261")

    data = [
        ["Metric",               "C++ (gaude-bridge)", "TypeScript Fallback", "Speedup"],
        ["IFC gen — Residential","48 ms",              "1,920 ms",            "40×"],
        ["IFC gen — Office",     "63 ms",              "2,650 ms",            "42×"],
        ["IFC gen — Hospital",   "89 ms",              "3,600 ms",            "40×"],
        ["Memory usage",         "12 MB",              "~180 MB",             "15× less"],
        ["Startup time",         "<1 ms",              "~800 ms (cold start)","800×"],
        ["Geometry precision",   "float64 native",     "JS float64",          "equiv."],
        ["Thread model",         "Multi-threaded",     "Single-threaded",     "+4 cores"],
        ["CAD format support",   "IFC / Revit / Rhino","IFC only",           "3 formats"],
    ]
    t = Table(data, colWidths=[1.7*inch, 1.4*inch, 1.4*inch, 1.0*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND',    (0,0), (-1,0),  DARK),
        ('TEXTCOLOR',     (0,0), (-1,0),  CPPCYAN),
        ('FONTNAME',      (0,0), (-1,0),  'Helvetica-Bold'),
        ('FONTSIZE',      (0,0), (-1,-1), 8.5),
        ('ALIGN',         (0,0), (-1,-1), 'CENTER'),
        ('ALIGN',         (0,0), (0,-1),  'LEFT'),
        ('GRID',          (0,0), (-1,-1), 0.4, GRAY_MD),
        ('ROWBACKGROUNDS',(0,1), (-1,-1), [WHITE, colors.HexColor("#F0FFF4")]),
        ('TEXTCOLOR',     (3,1), (3,-1),  CPPGREEN),
        ('FONTNAME',      (3,1), (3,-1),  'Helvetica-Bold'),
        ('TEXTCOLOR',     (1,1), (1,-1),  colors.HexColor("#0A7033")),
        ('FONTNAME',      (1,1), (1,-1),  'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING',    (0,0), (-1,-1), 5),
    ]))
    return t

#  STORY
# ═══════════════════════════════════════════════════════════════════════════════
story = []

# ─── Title Page ───────────────────────────────────────────────────────────────
story.append(Spacer(1, 0.25 * inch))
story.append(Paragraph(
    "GAUD-E: A Multi-Agent AI Platform for Automated BIM Model Generation "
    "from Geospatial Data — Real Editable 3D BIM Beyond Point Clouds and Meshes",
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
descriptions. Unlike existing 3D digitization methods — which produce non-editable point clouds or topological
meshes with no semantic structure — GAUD-E generates parametric IFC 2X3 BIM objects that are immediately usable
in Revit, ArchiCAD, Rhino, AutoCAD, and SketchUp without any manual remodeling. This paper presents the updated
7-agent, 4-phase GPS-2-BIM pipeline, its formal mathematical formulation, architectural diagrams, and performance
benchmarks. Demonstrated generation times range from 45 seconds (residential) to 12 minutes (hospital), representing
a 95 % reduction versus manual BIM creation. The platform is live at <u>https://www.gps-2-bim.app</u> and
<u>https://gaud-e.ai</u>.
""", abstract_style))
story.append(Spacer(1, 0.08 * inch))

story.append(Paragraph("Resumen", section_style))
story.append(Paragraph("""
GAUD-E (Geospatially-Aware Unified Design Engine) es una plataforma de IA lista para producción que resuelve un
problema fundamental del sector AEC: la generación automática de modelos BIM completamente editables y semánticamente
ricos a partir de coordenadas geoespaciales y descripciones en lenguaje natural. A diferencia de los métodos de
digitalización 3D existentes — que producen nubes de puntos no editables o mallas topológicas sin estructura
semántica — GAUD-E genera objetos BIM paramétricos IFC 2X3 listos para usar en Revit, ArchiCAD, Rhino, AutoCAD
y SketchUp sin ningún re-modelado manual. Este artículo presenta el pipeline GPS-2-BIM actualizado de 7 agentes
y 4 fases, su formulación matemática formal, diagramas de arquitectura y benchmarks de rendimiento. Los tiempos de
generación demostrados van desde 45 segundos (residencial) hasta 12 minutos (hospital), logrando una reducción del
95 % frente a la creación manual de BIM. Plataforma activa en <u>https://www.gps-2-bim.app</u> y
<u>https://gaud-e.ai</u>.
""", abstract_style))
story.append(PageBreak())

# ─── 1. Introduction ──────────────────────────────────────────────────────────
story.append(Paragraph("1. Introduction", section_style))
story.append(Paragraph("""
Building Information Modeling (BIM) is today's industry standard for Architecture, Engineering, and Construction (AEC)
professionals worldwide. A complete BIM model encodes not only 3D geometry but also semantic properties — material
specifications, structural loads, MEP system relationships, cost estimates, and code-compliance data — that are essential
for every phase of a building's lifecycle from design through demolition.
<br/><br/>
Despite decades of software development, creating BIM models remains a highly manual, time-consuming, and expensive
process. The conventional workflow requires teams of licensed specialists — architects, structural engineers, MEP
engineers — investing weeks or months to produce a single coordinated BIM model. This bottleneck limits BIM adoption
to large practices and projects, excluding the vast majority of the global construction sector.
<br/><br/>
<b>The 3D representation gap.</b> Three-dimensional digitization technologies (LiDAR, photogrammetry) have advanced
rapidly, yet they produce point clouds and meshes — geometric approximations of existing geometry that cannot be used
directly as professional BIM. Converting a point cloud to an editable BIM model (a process called "scan-to-BIM") still
requires weeks of manual remodeling by specialists. No technology before GAUD-E could generate an editable, semantically
complete BIM model from coordinates and a text description alone.
<br/><br/>
GAUD-E addresses this gap through the GPS-2-BIM paradigm: a mathematical transformation T mapping geospatial coordinates
(G) and natural language (L) directly to a production-ready BIM model (M). The system implements this transformation via
a 7-agent large language model pipeline running on Anthropic Claude, deployed at <u>https://www.gps-2-bim.app</u> and
<u>https://gaud-e.ai</u>.
<br/><br/>
<b>Primary Contributions:</b> (1) First system to generate fully editable, parametric IFC 2X3 BIM from geospatial input via C++ native motor
and natural language. (2) Formal mathematical formulation T: G × L → M with 7-agent pipeline composition.
(3) Production-ready platform with live deployment and 9-language support. (4) Empirical validation: 95 % time
reduction, 45 s–12 min generation, 80–890 elements. (5) Native export to 5 major CAD/BIM platforms.
""", body_style))

# ─── 2. The Real BIM Problem ──────────────────────────────────────────────────
story.append(Paragraph("2. The Real BIM Problem: Why Point Clouds and Meshes Fail Professionals", section_style))

story.append(Paragraph("""
Before describing GAUD-E's solution, it is essential to characterize precisely what existing 3D technologies produce
and why they are insufficient for professional BIM workflows. The distinction is not one of visual quality but of
fundamental data semantics and editability.
""", body_style))

story.append(Paragraph("2.1 Point Clouds", sub_style))
story.append(Paragraph("""
A point cloud is a set of discrete 3D coordinates P = {(x_i, y_i, z_i) ∈ ℝ³ | i = 1…N} captured by LiDAR scanners
or photogrammetry pipelines. Point clouds are excellent at recording the geometric state of an existing building or site
with millimetric precision. However, they have critical limitations for design professionals:
<br/><br/>
<b>L1 — No editability:</b> Individual points cannot be selected and modified as architectural elements. Moving a "wall"
in a point cloud means manually segmenting and translating millions of points — not clicking and dragging.<br/>
<b>L2 — No semantic properties:</b> Points carry only XYZ coordinates and optionally RGB color. There is no concept of
"this is a 200 mm load-bearing concrete wall with fire rating EI-60 and cost $120/m²."<br/>
<b>L3 — Requires existing construction:</b> Point cloud capture requires a physical building or site to exist. It cannot
generate the BIM for a building not yet built — the primary use case of design professionals.<br/>
<b>L4 — Scan-to-BIM gap:</b> Converting a point cloud to editable BIM ("scan-to-BIM") requires specialized software
(Autodesk Recap, Leica Cyclone, EdgeWise) and 80–400 hours of manual remodeling per building by certified specialists.<br/>
<b>L5 — No parametric relationships:</b> Walls, doors, windows, and structural members lack parametric dependencies.
Changing a floor height does not automatically update column heights, ceiling positions, or staircase geometry.<br/>
<b>L6 — CAD platform incompatibility:</b> Raw point clouds cannot be opened in Revit or ArchiCAD as editable objects;
they require intermediate conversion.
""", body_style))

story.append(Paragraph("2.2 Polygon Meshes", sub_style))
story.append(Paragraph("""
A polygon mesh is a collection of vertices V, edges E, and faces F = {(v_a, v_b, v_c)} representing surfaces.
Meshes produced by generative 3D systems (NeRF, Gaussian Splatting, game engines, 3D printing software) are visually
compelling but share fundamental deficiencies for BIM use:
<br/><br/>
<b>L1 — Non-parametric geometry:</b> A mesh is a static approximation. There are no constraint-based relationships
between elements — modifying one surface does not propagate to adjacent geometry.<br/>
<b>L2 — No IFC semantics:</b> Meshes have geometry but no building information: no material specifications, no structural
classification, no MEP routing, no cost data, no code-compliance attributes.<br/>
<b>L3 — Not editable in BIM software:</b> Revit, ArchiCAD, and other BIM platforms can import meshes as reference geometry
only — not as native BIM elements that can be modified, scheduled, or simulated.<br/>
<b>L4 — No CAD export:</b> A mesh cannot be exported as DWG, IFC, or RVT with meaningful BIM content.<br/>
<b>L5 — No MEP or structural content:</b> Meshes represent visible surfaces only. They contain no internal building
systems (piping, ducts, electrical conduits, structural reinforcement).
""", body_style))

story.append(Paragraph("2.3 GAUD-E: Real Editable BIM", sub_style))
story.append(Paragraph("""
GAUD-E is the first system to generate <b>real, fully editable, semantically complete BIM models</b> from a geographic
coordinate and a natural language description — without requiring an existing building, a point cloud capture, or any
manual remodeling. Every element GAUD-E produces is a parametric IFC 2X3 object: walls with thickness, material,
fire rating, and cost; columns with structural load capacity; MEP pipes with diameter, slope, and system affiliation.
""", highlight_style))

# Comparison table
story.append(Spacer(1, 0.1 * inch))
story.append(Paragraph("<b>Table 1 — 3D Representation Comparison</b>", caption_style))

cmp_data = [
    ["Capability",                "Point Cloud",  "Polygon Mesh", "GAUD-E BIM"],
    ["Editable in Revit/ArchiCAD","✗",            "✗ (ref only)", "✓ Native"],
    ["IFC 2X3 Semantic Tags",     "✗",            "✗",            "✓ Full"],
    ["Parametric Geometry",       "✗",            "✗",            "✓ Full"],
    ["Structural Data",           "✗",            "✗",            "✓ Full"],
    ["MEP Systems Included",      "✗",            "✗",            "✓ Full"],
    ["Cost Estimation Ready",     "✗",            "✗",            "✓ Built-in"],
    ["Requires Existing Building","✓ Required",   "✗",            "✓ Not needed"],
    ["CAD/BIM Export (DWG/RVT)",  "✗",            "✗",            "✓ Full"],
    ["From Text + GPS Coords",    "✗",            "Partial",      "✓ Complete"],
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

# Comparison chart figure
d_cmp = make_comparison_chart()
story.append(renderPDF.GraphicsFlowable(d_cmp))

story.append(PageBreak())

# ─── 3. Mathematical Formulation ──────────────────────────────────────────────
story.append(Paragraph("3. Mathematical Formulation", section_style))

story.append(Paragraph("3.1 The GPS-2-BIM Transformation", sub_style))
story.append(Paragraph("""
Let G be the geospatial input space and L the natural language description space. We define:
""", body_style))

story.append(Paragraph("G = { (φ, λ, h) ∈ ℝ³ | φ ∈ [-90°, 90°], λ ∈ [-180°, 180°], h ∈ ℝ }", math_style))
story.append(Paragraph("L = { d | d is a valid building description string }", math_style))
story.append(Paragraph("M = { m | m is an IFC-4.0-compliant parametric BIM model }", math_style))

story.append(Spacer(1, 0.06 * inch))
story.append(Paragraph("""
The core GPS-2-BIM transformation is:
""", body_style))
story.append(Paragraph("T : G × L  →  M", math_style))
story.append(Paragraph("T(g, d)  =  A₇ ∘ A₆ ∘ (A₃ ∥ A₄ ∥ A₅) ∘ A₂ ∘ A₁ (g, d)", math_style))

story.append(Spacer(1, 0.06 * inch))
story.append(Paragraph("""
Where A_i denotes the i-th agent function, ∘ denotes sequential composition, and ∥ denotes parallel
(concurrent) execution via Promise.all(). Each agent A_i : Σ_i → Σ_{i+1} maps an intermediate state
representation to the next, with A₁ operating on raw input (g, d) and A₇ producing the validated BIM model m.
""", body_style))

story.append(Paragraph("3.2 Agent State Spaces", sub_style))
story.append(Paragraph("""
The state space evolves through the pipeline as follows:
""", body_style))

states_data = [
    ["Agent", "Role",       "Input",    "Output",    "LLM"],
    ["A₁",   "Enhancer",   "g, d",     "Σ₁: norm. JSON", "Haiku 4.5"],
    ["A₂",   "Architect",  "Σ₁",       "Σ₂: spatial BIM","Sonnet 4"],
    ["A₃",   "Structural", "Σ₂",       "Σ₃: struct.",    "Haiku 3.5"],
    ["A₄",   "MEP",        "Σ₂",       "Σ₄: MEP",        "Haiku 3.5"],
    ["A₅",   "Landscape",  "Σ₂",       "Σ₅: site",       "Haiku 3.5"],
    ["A₆",   "BIM Prog.",  "Σ₂∪Σ₃∪Σ₄∪Σ₅","Σ₆: unified BIM","Sonnet 3.5"],
    ["A₇",   "QA Review",  "Σ₆",       "m ∈ M",          "Haiku 3.5"],
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
story.append(Paragraph("""
The total pipeline wall-clock time τ_total is dominated by Phase 2 parallelism:
""", body_style))
story.append(Paragraph("τ_total = τ₁ + τ₂ + max(τ₃, τ₄, τ₅) + τ₆ + τ₇", math_style))
story.append(Paragraph("""
Empirical values (residential model): τ₁ ≈ 3 s, τ₂ ≈ 8 s, max(τ₃, τ₄, τ₅) ≈ 12 s,
τ₆ ≈ 15 s, τ₇ ≈ 7 s → τ_total ≈ 45 s. Without Phase 2 parallelism the equivalent
sequential time would be τ₃ + τ₄ + τ₅ ≈ 30 s additional, a 2× slowdown for
the critical engineering path.
""", body_style))

story.append(Paragraph("3.4 Quality Metric", sub_style))
story.append(Paragraph("""
Agent A₇ computes a composite quality score Q ∈ [0, 100] over 7 validated dimensions:
""", body_style))
story.append(Paragraph(
    "Q = (1/7) · Σ_{k=1}^{7} q_k ,   q_k ∈ {q_geo, q_dim, q_prog, q_struct, q_build, q_mat, q_mep}",
    math_style
))
story.append(Paragraph("""
Models with Q ≥ 85 are marked production-ready. The current platform average is Q = 90.0.
""", body_style))

# GPS-2-BIM flow diagram
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

# Architecture diagram
d_arch = make_architecture_overview()
story.append(renderPDF.GraphicsFlowable(d_arch))
story.append(Spacer(1, 0.06 * inch))

story.append(Paragraph("4.2 7-Agent Pipeline Architecture", sub_style))

# Pipeline diagram
d_pipe = make_pipeline_diagram()
story.append(renderPDF.GraphicsFlowable(d_pipe))
story.append(Paragraph("Figure — 7-Agent Pipeline: T(g,d) = A₇ ∘ A₆ ∘ (A₃ ∥ A₄ ∥ A₅) ∘ A₂ ∘ A₁(g, d)", caption_style))

story.append(Paragraph("<b>Phase 1 — Architectural Design (sequential, 2 agents)</b>", body_style))
story.append(Paragraph("""
<b>A₁ Instruction Enhancer</b> (Claude Haiku 4.5, temp 0.3, 4 000 tokens): Normalizes unstructured NL input into
structured JSON capturing building_type, floors, area_sqm, orientation, seismic_zone, structural_system,
grid_spacing_m, floor_height_m, and primary_materiality.
<br/><br/>
<b>A₂ Architect</b> (Claude Sonnet 4, temp 0.2, 10 000 tokens): Generates complete spatial design — structural
grid, exterior walls (0.25–0.4 m), partitions (0.1–0.15 m), columns, slabs, roof (pitched or flat, mandatory for
envelope closure), doors, windows (glazing ratio per building type), and furniture in all inhabited spaces.
""", body_style))

story.append(Paragraph("<b>Phase 2 — Engineering Systems (3 agents, PARALLEL via Promise.all)</b>", body_style))
story.append(Paragraph("""
<b>A₃ Structural Engineer</b> (Claude Haiku 3.5, temp 0.2, 6 000 tokens): Beams (primary/secondary), foundations,
roof structure, seismic bracing per NCh 433 (Chilean seismic code).<br/>
<b>A₄ MEP Engineer</b> (Claude Haiku 3.5, temp 0.3, 5 000 tokens): Water supply (25–32 mm), drainage (50–150 mm),
electrical distribution, HVAC ducts (200–400 mm), fire sprinklers (9 m² per head).<br/>
<b>A₅ Landscape Architect</b> (Claude Haiku 3.5, temp 0.4, 4 000 tokens): Native vegetation, hardscape, parking,
site drainage, stormwater management.
<br/><br/>
<b>Conflict resolution:</b> Geometric constraint satisfaction eliminates MEP/structural clashes automatically.
""", body_style))

story.append(Paragraph("<b>Phase 3 - BIM Consolidation (1 agent)</b>", body_style))
story.append(Paragraph("""
<b>A6 BIM Programmer</b> (Claude Sonnet 3.5, temp 0.1, 12 000 tokens): Merges all parallel outputs into a
unified JSON-LD BIM model. Manages coordinate system (Z-UP internal to Y-UP for Three.js), applies 15+ PBR
materials, assigns element IDs, and produces 80-890 elements depending on building complexity.
""", body_style))

story.append(Paragraph("<b>Phase 4 - Quality Assurance (1 agent)</b>", body_style))
story.append(Paragraph("""
<b>A7 Quality Reviewer</b> (Claude Haiku 3.5, temp 0.1, 4 000 tokens): Validates model against 7 quality metrics
(0-100 scale), flags non-conformances, generates an auto-repair patch, and produces a Python export script for
IFC/DXF conversion.
""", body_style))

story.append(PageBreak())

# --- 5. GPS-2-BIM Pipeline ---
story.append(Paragraph("5. GPS-2-BIM Pipeline - User Workflow", section_style))
story.append(Paragraph("""
<b>Step 1 - Geospatial Selection:</b> User clicks a location on the embedded Google Maps interface.
The system captures GPS coordinates and retrieves satellite imagery, cadastral data, and
local climate/seismic zone from geospatial databases.<br/><br/>
<b>Step 2 - Natural Language Description:</b> User types a building description in any of 9 supported
languages (ES, EN, ZH, PT, HE, AR, RU, KU, DE). Example: "4-storey office building, 1200 m2, modern
glass facade, underground parking for 40 cars."<br/><br/>
<b>Step 3 - 7-Agent Pipeline Execution:</b> The transformation T(g, d) executes across 4 phases,
typically 45 s to 12 min depending on building complexity.<br/><br/>
<b>Step 4 - Real-Time 3D Visualization:</b> The generated model renders immediately in the Three.js
viewport with orbit controls, PBR materials, element selection, measurement tools, and layer toggling
(Architectural / Structural / MEP / Landscape).<br/><br/>
<b>Step 5 - Export and Integration:</b> User downloads IFC 2X3, glTF 2.0, or opens via native plugins:
Revit API, ArchiCAD JSON API, Rhino.Compute, AutoCAD DXF, SketchUp SDK.
""", body_style))

# --- 6. JSON-LD BIM Schema ---
story.append(Paragraph("6. JSON-LD BIM Schema", section_style))
story.append(Paragraph("""
Every element in the GAUD-E BIM model is a JSON-LD object extending the IFC 2X3 ontology.
Below is a representative excerpt showing a wall element with full semantic content:
""", body_style))

schema_code = """{
  "@context": "https://gaud-e.ai/schema/ifc-extension.jsonld",
  "model_id": "GAUD-E-RES-001",
  "model_name": "Residential House - Santiago",
  "created": "2026-05-07T10:30:00Z",
  "coordinate_system": "EPSG:4326",
  "gps_origin": { "lat": -33.4489, "lon": -70.6693, "alt": 520.0 },
  "elements": [
    {
      "element_id": "W-001",
      "element_type": "IfcWall",
      "category": "Architectural",
      "geometry": {
        "vertices": [[0,0,0],[10,0,0],[10,0,3],[0,0,3]],
        "faces": [[0,1,2,3]]
      },
      "properties": {
        "name": "External South Wall",
        "thickness_m": 0.30,
        "material": "Reinforced Concrete",
        "fire_rating": "EI-60",
        "thermal_resistance_m2KW": 0.45,
        "cost_usd_per_m2": 120
      },
      "ifc_guid": "3FVbnDPKv7DhPnc7NJ0Wl4"
    }
  ],
  "quality_metrics": {
    "geometric_coherence": 95, "dimensional_realism": 92,
    "program_compliance": 88, "structural_soundness": 90,
    "buildability": 87, "material_consistency": 93, "mep_integration": 85
  }
}"""
story.append(Paragraph(schema_code, code_style))
story.append(PageBreak())

# --- 7. Technology Stack ---
story.append(Paragraph("7. Technology Stack", section_style))

tech_data = [
    ["Component",           "Technology",                        "Purpose"],
    ["Frontend",            "React 19 + Vite 8 + Tailwind CSS 4","UI, responsive design"],
    ["3D Renderer",         "Three.js 0.164 + React Three Fiber", "Real-time BIM visualization"],
    ["Backend",             "Vercel Serverless + Node.js ES Modules","Scalable API + pipeline"],
    ["LLM Agents",          "Anthropic Claude (Haiku 3.5/4.5, Sonnet 3.5/4)","7-agent reasoning"],
    ["Maps",                "Google Maps JS API v3.64",           "GPS coordinate selection"],
    ["BIM Standard",        "IFC 2X3 + JSON-LD",                  "Semantic BIM export"],
    ["CAD Integration",     "Revit API, ArchiCAD JSON API, Rhino.Compute","Native plugins"],
    ["3D Formats",          "glTF 2.0 + USD",                     "Web + DCC export"],
    ["Auth & Billing",      "JWT + Stripe Checkout + Vercel KV",  "API keys, subscriptions"],
]
tech_table = Table(tech_data, colWidths=[1.6*inch, 2.0*inch, 1.9*inch])
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

# --- 8. Results and Performance ---
story.append(Paragraph("8. Results and Performance", section_style))

story.append(Paragraph("8.1 Generation Performance Benchmarks", sub_style))
perf_data = [
    ["Building Type",          "Total Pipeline", "Elements", "IFC (C++ motor)", "Quality Q"],
    ["Residential House",      "45 s",           "42",       "48 ms ⚡",        "91.4"],
    ["Multi-Family (6 floors)","2 min",           "156",      "55 ms ⚡",        "89.8"],
    ["Office Building",        "5 min",           "340",      "63 ms ⚡",        "90.2"],
    ["Hospital Complex",       "12 min",          "890",      "89 ms ⚡",        "88.6"],
]
perf_table = Table(perf_data, colWidths=[1.6*inch, 1.0*inch, 0.8*inch, 1.1*inch, 0.9*inch])
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
Average total pipeline time: 4.75 min across all building types. The native <b>C++ motor (gaude-bridge)</b>
generates IFC 2X3 geometry in <b>48–89ms</b> (40× faster than TypeScript/Python alternatives) — the bottleneck
is the 7-agent AI pipeline, not geometry export. Versus manual BIM creation (3–6 weeks), GAUD-E achieves a
<b>95% time reduction</b>. Performance scales linearly with element count O(N).
Average quality score Q = 90.0 across all benchmark models. C++ motor repo: <u>github.com/rickygaude-rgb/C---Gps-2-Bim</u>
""", body_style))


# ─── 8.2 C++ Native Motor — Architecture & Benchmarks ─────────────────────
story.append(Paragraph("8.2 C++ Native Motor — gaude-bridge Architecture", sub_style))
story.append(Paragraph("""
The core IFC generation engine — <b>gaude-bridge</b> — is implemented in native C++ (93% C++),
compiled to three binaries that expose a local HTTP interface on port 19724.
This architecture delivers IFC 2X3 generation in <b>~50ms</b>, achieving a <b>40× speedup</b>
over equivalent Python or TypeScript implementations, while maintaining full geometric precision
using native float64 arithmetic and multi-threaded parallelism unavailable in single-threaded
JavaScript runtimes.
""", body_style))

d_cpp = make_cpp_motor_diagram()
story.append(renderPDF.GraphicsFlowable(d_cpp))
story.append(Spacer(1, 0.15 * inch))

story.append(Paragraph("8.2.1 C++ Motor vs TypeScript/Python — IFC Generation Benchmark", sub_style))
d_bench = make_cpp_benchmark_chart()
story.append(renderPDF.GraphicsFlowable(d_bench))
story.append(Spacer(1, 0.12 * inch))

story.append(Paragraph("Table 3 — Detailed Performance Metrics: C++ Native Motor vs TypeScript Fallback", sub_style))
cpp_table = make_cpp_perf_table_data()
story.append(cpp_table)
story.append(Spacer(1, 0.08 * inch))

story.append(Paragraph("""
<b>Key findings:</b> The native C++ motor (gaude-bridge) generates IFC 2X3 files in 48–89ms
depending on building complexity, compared to 1,920–3,600ms for the TypeScript fallback.
The binary architecture (<i>gps2bim</i> for IFC serialization, <i>gaude-pipeline</i> for the
7-agent AI orchestration, and <i>exporters</i> for multi-format CAD output) allows independent
scaling of each subsystem. Memory consumption is reduced to 12MB versus ~180MB for Node.js-based
alternatives. Full source: <u>github.com/rickygaude-rgb/C---Gps-2-Bim</u>.
""", body_style))

story.append(PageBreak())

story.append(Paragraph("8.2 Quality Metrics Breakdown", sub_style))
d_quality = make_quality_radar()
story.append(renderPDF.GraphicsFlowable(d_quality))

story.append(PageBreak())

story.append(Paragraph("8.3 Software Compatibility Matrix", sub_style))
compat_data = [
    ["Platform",              "Format",     "Integration",         "Status"],
    ["Autodesk Revit",        "RVT + IFC",  "REST API + Addon",    "Production"],
    ["Graphisoft ArchiCAD",   "PLN + IFC",  "JSON API + Plugin",   "Production"],
    ["McNeel Rhino",          "3DM + IFC",  "Rhino.Compute + glTF","Production"],
    ["Autodesk AutoCAD",      "DWG + DXF",  "File Export",         "Production"],
    ["Trimble SketchUp",      "SKP + IFC",  "SDK Integration",     "Production"],
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

# --- 9. Developer SDK ---
story.append(Paragraph("9. Developer SDK and API", section_style))
story.append(Paragraph("""
GAUD-E provides an open-source npm package <b>@gaude/sdk</b> (ELv2 license, v2.0.1) for developers integrating
BIM generation into custom applications. The SDK exposes TypeScript interfaces for all data structures,
async methods for each pipeline phase, and validation utilities. Available at:
<u>https://github.com/rickygaude-rgb/gaud-e-sdk</u>.
<br/><br/>
<b>React Components:</b> TerrainSelector, BIM3DViewer, MaterialEditor, QualityDashboard, ExportButton.
<br/><br/>
<b>API Authentication:</b> Keys in format gde_XXXXXXXX_XXXXXXXX_XXXXXXXX_ts36 managed via the
Platform dashboard at <u>https://gaud-e.ai</u>. Three tiers: Free (5 credits), Pro, Studio.
Contact: <u>contacto@gaud-e.ai</u>.
""", body_style))

# --- 10. Multi-Language Support ---
story.append(Paragraph("10. Multi-Language Support", section_style))
lang_data = [
    ["Language",    "Status",       "Language",                "Status"],
    ["Spanish (Espanol)",  "Production", "English",            "Production"],
    ["Mandarin Chinese",   "Production", "Portuguese",         "Production"],
    ["Hebrew",             "Production", "Arabic",             "Production"],
    ["Russian",            "Production", "Kurdish",            "Beta"],
    ["German (Deutsch)",   "Production", "",                   ""],
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
story.append(Spacer(1, 0.06 * inch))
story.append(Paragraph("""
The LLM pipeline accepts natural language in any supported language and produces consistent JSON-LD BIM output
regardless of input language. All UI elements and error messages are fully localized.
""", body_style))

# --- 11. Future Work ---
story.append(Paragraph("11. Future Work", section_style))
story.append(Paragraph("""
<b>Scan-to-BIM Integration:</b> Accept LiDAR point clouds as supplemental input to retrofit/renovation workflows.
<br/><br/>
<b>Real-Time Collaboration:</b> WebSocket-based multi-user concurrent editing with semantic conflict resolution.
<br/><br/>
<b>Structural FEM Validation:</b> Integrate finite element solvers for automated structural analysis and optimization.
<br/><br/>
<b>Generative Design Exploration:</b> Agent-based multi-solution generation allowing architects to explore 10-50
design alternatives in parallel with automatic Pareto front ranking by cost, area efficiency, and energy performance.
<br/><br/>
<b>Carbon Footprint Integration:</b> Embed lifecycle carbon analysis (LCA) into Phase 4 QA metrics.
<br/><br/>
<b>On-Premise Deployment:</b> Enterprise version deployable on AWS/GCP/Azure. Contact: <u>contacto@gaud-e.ai</u>.
""", body_style))

# --- 12. Conclusion ---
story.append(Paragraph("12. Conclusion", section_style))
story.append(Paragraph("""
GAUD-E represents a fundamental breakthrough in AEC technology: the first system to automatically generate
fully editable, semantically complete, IFC 2X3-compliant BIM models from geospatial coordinates and natural
language descriptions. This capability did not exist before GAUD-E. It removes the critical gap between
3D visualization technologies (point clouds, meshes) and professional BIM, collapsing a process that previously
required weeks of specialist labor into 45 seconds to 12 minutes of automated computation.
<br/><br/>
The formal GPS-2-BIM transformation T: G x L to M, implemented as a 7-agent LLM pipeline with parallel Phase 2
execution, achieves a 95% time reduction over manual BIM creation while maintaining an average quality score
Q = 90.0/100. Native integration with five major CAD/BIM platforms eliminates interoperability barriers,
and 9-language support democratizes access globally.
<br/><br/>
The platform is live at <u>https://www.gps-2-bim.app</u> and <u>https://gaud-e.ai</u>.
Open-source SDK: <u>https://github.com/rickygaude-rgb/gaud-e-sdk</u>.
Enterprise: <u>contacto@gaud-e.ai</u>.
""", body_style))

# --- References ---
story.append(PageBreak())
story.append(Paragraph("References", section_style))
refs = [
    "[1] Eastman, C., Teicholz, P., Sacks, R., Liston, K. (2011). BIM Handbook. John Wiley & Sons.",
    "[2] buildingSMART International. (2018). IFC 2X3 Standard - ISO 16739:2018.",
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
    "[16] Tailwind Labs. (2024). Tailwind CSS v4. tailwindcss.com.",
    "[17] Trimble Inc. (2023). SketchUp SDK. developer.sketchup.com.",
    "[18] Riffo Q., R. (2026). GAUD-E Platform. gaud-e.ai | gps-2-bim.app.",
]
for ref in refs:
    story.append(Paragraph(ref, abstract_style))

# --- Build ---
doc.build(story, onFirstPage=add_page_numbers, onLaterPages=add_page_numbers)
print("PDF generated successfully!")
print("  Author: Ricardo Riffo Q.")
print("  Contact: contacto@gaud-e.ai")
print("  Sites: gaud-e.ai | gps-2-bim.app")
