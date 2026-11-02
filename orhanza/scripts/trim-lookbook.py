#!/usr/bin/env python3
"""Trim transparent padding from the lookbook cut-outs and write WebP + a bbox manifest.

usage: python3 scripts/trim-lookbook.py <source-dir-with-N.png-and-N.1.png>
Writes public/lookbook/N.webp, N.1.webp and lib/lookbook-trim.json.
Fractions are relative to the ORIGINAL canvas so the layout can keep the spec's
"height of the whole image" numbers while figures align on their bounding boxes.
"""
import json, sys, os
from PIL import Image

src = sys.argv[1] if len(sys.argv) > 1 else "assets-src"
out = "public/lookbook"
os.makedirs(out, exist_ok=True)
manifest = {}
for n in range(1, 16):
    for kind, name in (("model", f"{n}"), ("product", f"{n}.1")):
        im = Image.open(os.path.join(src, f"{name}.png")).convert("RGBA")
        W, H = im.size
        l, t, r, b = im.split()[-1].point(lambda v: 255 if v > 8 else 0).getbbox()
        im.crop((l, t, r, b)).save(os.path.join(out, f"{name}.webp"), "WEBP", quality=86, method=6)
        manifest.setdefault(str(n), {})[kind] = {
            "w": r - l, "h": b - t,
            "top": round(t / H, 5), "hFrac": round((b - t) / H, 5),
        }
json.dump(manifest, open("lib/lookbook-trim.json", "w"), indent=1)
print("ok", len(manifest), "looks")
