"""Paints the ink-and-wash landscape used in the hero and the footer.

Writes public/wash/{landscape,horizon}-{day,night}.svg.
The day palette is the zen game's forest (RFC 0026): a coloured distance, a
pale misted middle, deep teal near hills, ink trees, and a gold path for the
light. The night is the rockets film's rule: the washes sit just above a
near-black ground. Run: python3 scripts/paint-landscape.py
"""

import math
import random
from pathlib import Path

W, H = 1600, 360
OUT = Path(__file__).resolve().parent.parent / "public" / "wash"

PALETTES = {
    "day": {
        "mountains": "#6fb0c6",
        "far": "#b4d8de",
        "mid": "#8fbfa0",
        "near": "#2f6f8a",
        "trees": "#04304a",
        "path": "#f0b92a",
        "sun": "#f0b92a",
        "sun_opacity": "0.75",
    },
    "night": {
        "mountains": "#2e4363",
        "far": "#263249",
        "mid": "#24403d",
        "near": "#1b2433",
        "trees": "#0b0e14",
        "path": "#d9ab33",
        "sun": "#f3ead2",
        "sun_opacity": "0.9",
    },
}


def ridge(rng, base, amp, waves, top_floor=None):
    """A ridge line across the width as smooth points."""
    phases = [rng.uniform(0, math.tau) for _ in waves]
    pts = []
    for i in range(0, 33):
        x = i * W / 32
        y = base
        for (freq, weight), ph in zip(waves, phases):
            y -= amp * weight * math.sin(x / W * math.tau * freq + ph)
        if top_floor is not None:
            y = max(y, top_floor)
        pts.append((x, y))
    return pts


def smooth_path(pts, bottom):
    """Closed path: a Catmull-Rom curve through the ridge, down to `bottom`."""
    d = [f"M{-40},{bottom} L{-40},{pts[0][1]:.1f} L{pts[0][0]:.1f},{pts[0][1]:.1f}"]
    for i in range(len(pts) - 1):
        p0 = pts[max(i - 1, 0)]
        p1, p2 = pts[i], pts[i + 1]
        p3 = pts[min(i + 2, len(pts) - 1)]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d.append(
            f"C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}"
        )
    d.append(f"L{W + 40},{pts[-1][1]:.1f} L{W + 40},{bottom} Z")
    return " ".join(d)


def height_at(pts, x):
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        if x0 <= x <= x1:
            t = (x - x0) / (x1 - x0)
            return y0 + (y1 - y0) * t
    return pts[-1][1]


def pine(x, ground, h):
    """A spruce in three stacked tiers, drawn as one ink silhouette."""
    w = h * 0.42
    tiers = []
    for k, (top, half) in enumerate([(0.0, 0.42), (0.28, 0.7), (0.52, 1.0)]):
        ty = ground - h + top * h
        by =ground - (1 - top) * h * 0.38 if k < 2 else ground - h * 0.06
        tiers.append(
            f"M{x:.1f},{ty:.1f} L{x - w * half:.1f},{by:.1f} L{x + w * half:.1f},{by:.1f} Z"
        )
    trunk = f"M{x - 1.6:.1f},{ground - h * 0.1:.1f} h3.2 v{h * 0.1 + 4:.1f} h-3.2 Z"
    return " ".join(tiers) + " " + trunk


def wash_filter(fid, seed, warp, scale, rim):
    """Ragged edges, mottled pigment and a darker dried rim."""
    return f"""
  <filter id="{fid}" x="-5%" y="-30%" width="110%" height="160%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="{warp}" numOctaves="2" seed="{seed}" result="warp"/>
    <feDisplacementMap in="SourceGraphic" in2="warp" scale="{scale}" xChannelSelector="R" yChannelSelector="G" result="shape"/>
    <feMorphology in="shape" operator="erode" radius="{rim}" result="inner"/>
    <feComposite in="shape" in2="inner" operator="out" result="rimRaw"/>
    <feColorMatrix in="rimRaw" type="matrix" values="0.78 0 0 0 0  0 0.8 0 0 0  0 0 0.84 0 0  0 0 0 0.9 0" result="rimDark"/>
    <feGaussianBlur in="rimDark" stdDeviation="0.7" result="edge"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.004 0.012" numOctaves="2" seed="{seed + 7}" result="bloom"/>
    <feColorMatrix in="bloom" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.8 0 0 0 0.42" result="mottle"/>
    <feComposite in="inner" in2="mottle" operator="in" result="body"/>
    <feMerge><feMergeNode in="body"/><feMergeNode in="edge"/></feMerge>
  </filter>"""


def paint(name, pal, scene, seed):
    rng = random.Random(seed)
    # The footer's horizon is a lower, wider view: shorter mountains, and the
    # picture is cropped to the bottom 220 units.
    top = 0 if scene == "landscape" else 140
    if scene == "landscape":
        mountains = ridge(rng, 130, 78, [(1.3, 1.0), (3.1, 0.5), (7.0, 0.2)])
    else:
        mountains = ridge(rng, 200, 34, [(1.3, 1.0), (3.1, 0.5), (7.0, 0.2)])
    far = ridge(rng, 200, 30, [(1.7, 1.0), (4.2, 0.4)])
    mid = ridge(rng, 238, 24, [(2.2, 1.0), (5.0, 0.35)])
    near = ridge(rng, 286, 22, [(1.1, 1.0), (2.9, 0.5)])

    # Stands of spruce on the middle hill, a few big ones up front.
    trees = []
    for cx, n in [(150, 6), (520, 3), (1010, 4), (1250, 7), (1470, 3)]:
        for _ in range(n):
            x = cx + rng.uniform(-60, 60)
            ground = height_at(mid, x) + rng.uniform(4, 14)
            trees.append(pine(x, ground, rng.uniform(26, 54)))
    front = []
    for x in [40, 92, 1505, 1548, 1590]:
        ground = height_at(near, x) + 26
        front.append(pine(x, ground, rng.uniform(78, 118)))

    # The path: a gold band winding along the near hill, the light in the picture.
    gold = " ".join(
        f"{'M' if i == 0 else 'L'}{x:.1f},{height_at(near, x) + 20 + 7 * math.sin(x / 130):.1f}"
        for i, x in enumerate(range(-20, W + 40, 20))
    )
    if scene == "landscape":
        sun = (1060, 92, 46) if name == "day" else (560, 84, 30)
    else:
        sun = (300, 186, 26) if name == "day" else (1260, 180, 18)

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 {top} {W} {H - top}" preserveAspectRatio="xMidYMax slice">
  <!-- Generated by scripts/paint-landscape.py ({scene}, {name}). -->
  <defs>{wash_filter("m", 3, 0.006, 30, 2.6)}{wash_filter("h", 11, 0.009, 22, 2.2)}{wash_filter("n", 19, 0.008, 26, 3)}
  <filter id="ink" x="-5%" y="-30%" width="110%" height="160%">
    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="5" result="warp"/>
    <feDisplacementMap in="SourceGraphic" in2="warp" scale="5" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <filter id="light" x="-5%" y="-100%" width="110%" height="300%">
    <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="8" result="warp"/>
    <feDisplacementMap in="SourceGraphic" in2="warp" scale="10" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  </defs>
  <circle cx="{sun[0]}" cy="{sun[1]}" r="{sun[2]}" fill="{pal['sun']}" opacity="{pal['sun_opacity']}" filter="url(#h)"/>
  <path d="{smooth_path(mountains, 300)}" fill="{pal['mountains']}" opacity="0.8" filter="url(#m)"/>
  <path d="{smooth_path(far, 320)}" fill="{pal['far']}" opacity="0.75" filter="url(#h)"/>
  <path d="{smooth_path(mid, 338)}" fill="{pal['mid']}" opacity="0.85" filter="url(#h)"/>
  <path d="{' '.join(trees)}" fill="{pal['trees']}" opacity="0.7" filter="url(#ink)"/>
  <path d="{smooth_path(near, 348)}" fill="{pal['near']}" opacity="0.92" filter="url(#n)"/>
  <path d="{gold}" fill="none" stroke="{pal['path']}" stroke-width="8" stroke-linecap="round" filter="url(#light)"/>
  <path d="{' '.join(front)}" fill="{pal['trees']}" filter="url(#ink)"/>
</svg>
"""
    (OUT / f"{scene}-{name}.svg").write_text(svg)


# The hero's landscape, and a second view of the same valley for the footer.
for scene, seed in [("landscape", 26), ("horizon", 41)]:
    for name, pal in PALETTES.items():
        paint(name, pal, scene, seed)
print("painted landscape and horizon, day and night")
