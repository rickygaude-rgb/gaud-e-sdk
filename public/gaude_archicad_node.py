import json
import os
import rhinoscriptsyntax as rs
import Rhino.Geometry as rg

# GAUDE JSON Reader for Grasshopper (GhPython)
# 1. Right-click this component, set input "json_path" as string.
# 2. Right-click output "wall_crvs", "wall_heights", "wall_thicknesses".
# 3. Connect outputs to Archicad "Wall" node.

def parse_gaude_json(filepath):
    wall_crvs = []
    wall_heights = []
    wall_thicknesses = []
    
    slab_crvs = []
    slab_thicknesses = []

    if not os.path.exists(filepath):
        return wall_crvs, wall_heights, wall_thicknesses, slab_crvs, slab_thicknesses

    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
            
        entities = data.get("entities", [])
        for ent in entities:
            etype = ent.get("type", "").lower()
            loc = ent.get("location", {})
            metrics = ent.get("metrics", {})
            
            x = float(loc.get("x", 0))
            y = float(loc.get("y", 0))
            z = float(loc.get("z", 0))
            
            l = float(metrics.get("length", 1.0))
            w = float(metrics.get("width", 0.3))
            h = float(metrics.get("height", 3.0))
            
            if "wall" in etype or "muro" in etype:
                # Wall logic: Line starting at (x,y,z) with length (l)
                p1 = rg.Point3d(x, y, z)
                p2 = rg.Point3d(x + l, y, z) # Simplified direction (could be dynamic)
                line = rg.LineCurve(p1, p2)
                
                wall_crvs.append(line)
                wall_heights.append(h)
                wall_thicknesses.append(w)
                
            elif "slab" in etype or "losa" in etype:
                # Slab logic: Rectangle
                p1 = rg.Point3d(x, y, z)
                p2 = rg.Point3d(x+l, y, z)
                p3 = rg.Point3d(x+l, y+w, z)
                p4 = rg.Point3d(x, y+w, z)
                
                poly = rg.Polyline([p1, p2, p3, p4, p1])
                slab_crvs.append(poly.ToNurbsCurve())
                slab_thicknesses.append(h)
                
    except Exception as e:
        print(f"Error reading JSON: {e}")
        
    return wall_crvs, wall_heights, wall_thicknesses, slab_crvs, slab_thicknesses

try:
    if filepath and os.path.exists(filepath):
        wall_lines, wall_h, wall_w, slab_lines, slab_w = parse_gaude_json(filepath)
        
        # Output assignments to GhPython component
        a_wall_lines = wall_lines
        a_wall_heights = wall_h
        a_wall_thicknesses = wall_w
        
        a_slab_lines = slab_lines
        a_slab_thicknesses = slab_w
except Exception as e:
    pass
