"""
Rebuild Mocha / White / Black heroes for ribbed-tank-bodysuit from ONE master photo.

Uses a solid tank silhouette polygon (not luminance speckles) so the WHOLE garment
recolors while pants/skin/background stay unchanged.
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "products" / "ribbed-tank-bodysuit"
ASSETS = Path(r"C:\Users\nazia\.cursor\projects\e-projects-AI-Projects-Bosianos\assets")

MASTER_CANDIDATES = [
    ASSETS / "ribbed-tank-bodysuit-white-ref.png",
    OUT / "_orig" / "white-01-hero.png",
]

TARGETS = {
    "white": np.array([245.0, 242.0, 234.0]),
    "mocha": np.array([139.0, 98.0, 74.0]),
    "black": np.array([23.0, 23.0, 23.0]),
}


def load_master() -> Image.Image:
    for path in MASTER_CANDIDATES:
        if path.exists():
            print(f"master: {path}")
            return Image.open(path).convert("RGB")
    raise SystemExit("No master image found")


def solid_tank_mask(h: int, w: int) -> np.ndarray:
    img = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(img)
    # Solid scoop-neck tank — cover straps + full chest, stay inside body
    poly = [
        (int(w * 0.325), int(h * 0.008)),  # left strap outer top
        (int(w * 0.415), int(h * 0.008)),  # left strap inner top
        (int(w * 0.435), int(h * 0.055)),
        (int(w * 0.46), int(h * 0.085)),
        (int(w * 0.50), int(h * 0.098)),  # scoop bottom
        (int(w * 0.54), int(h * 0.085)),
        (int(w * 0.565), int(h * 0.055)),
        (int(w * 0.585), int(h * 0.008)),  # right strap inner top
        (int(w * 0.675), int(h * 0.008)),  # right strap outer top
        (int(w * 0.695), int(h * 0.06)),
        (int(w * 0.70), int(h * 0.13)),
        (int(w * 0.68), int(h * 0.22)),
        (int(w * 0.63), int(h * 0.315)),  # right waist (tighter)
        (int(w * 0.37), int(h * 0.315)),  # left waist
        (int(w * 0.32), int(h * 0.22)),
        (int(w * 0.30), int(h * 0.13)),
        (int(w * 0.305), int(h * 0.06)),
    ]
    draw.polygon(poly, fill=255)
    # Fill entire chest under scoop including near-neck fabric
    draw.polygon(
        [
            (int(w * 0.415), int(h * 0.02)),
            (int(w * 0.50), int(h * 0.10)),
            (int(w * 0.585), int(h * 0.02)),
            (int(w * 0.60), int(h * 0.20)),
            (int(w * 0.40), int(h * 0.20)),
        ],
        fill=255,
    )
    # Strap fills (ensure white strap remnants are covered)
    draw.polygon(
        [
            (int(w * 0.325), int(h * 0.008)),
            (int(w * 0.415), int(h * 0.008)),
            (int(w * 0.40), int(h * 0.09)),
            (int(w * 0.34), int(h * 0.09)),
        ],
        fill=255,
    )
    draw.polygon(
        [
            (int(w * 0.585), int(h * 0.008)),
            (int(w * 0.675), int(h * 0.008)),
            (int(w * 0.66), int(h * 0.09)),
            (int(w * 0.60), int(h * 0.09)),
        ],
        fill=255,
    )
    # Soft edge only — keep interior fully opaque
    soft = img.filter(ImageFilter.GaussianBlur(radius=3))
    hard = np.asarray(img).astype(np.float32) / 255.0
    soft_a = np.asarray(soft).astype(np.float32) / 255.0
    return np.maximum(hard, soft_a * 0.85)


def build_mask(arr: np.ndarray) -> np.ndarray:
    h, w = arr.shape[:2]
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    sat = np.zeros_like(lum)
    np.divide(mx - mn, np.maximum(mx, 1.0), out=sat)

    y = np.arange(h)[:, None]
    x = np.arange(w)[None, :]
    roi = solid_tank_mask(h, w)

    # Only carve skin + pants + side backdrop — NEVER treat bright fabric as bg
    skin = (r > g + 15) & (r > b + 20) & (sat > 0.16) & (lum > 100) & (lum < 220)
    pants = (y > int(h * 0.30)) & (r > 150) & ((r - g) > 4) & (sat > 0.06)
    # Side columns only (outside the body) — light backdrop spill
    side = (np.abs(x - w / 2.0) > w * 0.27) & (y < int(h * 0.30))
    # Never keep mask outside a tighter torso column
    outside_body = np.abs(x - w / 2.0) > w * 0.275

    mask = roi.copy()
    mask[skin | pants | side | outside_body] = 0.0
    return np.clip(mask, 0.0, 1.0)


def recolor(arr: np.ndarray, mask: np.ndarray, target: np.ndarray) -> np.ndarray:
    lum = 0.2126 * arr[:, :, 0] + 0.7152 * arr[:, :, 1] + 0.0722 * arr[:, :, 2]
    mbin = mask > 0.5
    src_mid = float(np.median(lum[mbin])) if mbin.any() else 190.0
    src_mid = max(src_mid, 1.0)
    tgt_lum = float(0.2126 * target[0] + 0.7152 * target[1] + 0.0722 * target[2])

    lum_img = Image.fromarray(np.clip(lum, 0, 255).astype(np.uint8), mode="L")
    local = np.asarray(lum_img.filter(ImageFilter.BoxBlur(5))).astype(np.float32)
    detail = lum - local

    rel = lum / src_mid
    if tgt_lum < 80:
        base = np.clip(0.28 + rel * 0.82, 0.14, 1.65)
        detail_gain = 0.55
    elif tgt_lum > 200:
        base = np.clip(0.92 + rel * 0.22, 0.8, 1.15)
        detail_gain = 0.35
    else:
        base = np.clip(0.38 + rel * 0.78, 0.22, 1.55)
        detail_gain = 0.65

    new_lum = np.clip(tgt_lum * base + detail * detail_gain, 5, 255)
    chroma = target / max(float(target.sum()), 1.0)
    tint = np.clip(
        np.stack(
            [
                chroma[0] * new_lum * 3.0,
                chroma[1] * new_lum * 3.0,
                chroma[2] * new_lum * 3.0,
            ],
            axis=-1,
        ),
        0,
        255,
    )
    m = mask[..., None]
    out = arr * (1.0 - m) + tint * m

    h, w = arr.shape[:2]
    y = np.arange(h)[:, None]
    x = np.arange(w)[None, :]
    mx = np.maximum(np.maximum(arr[:, :, 0], arr[:, :, 1]), arr[:, :, 2])
    mn = np.minimum(np.minimum(arr[:, :, 0], arr[:, :, 1]), arr[:, :, 2])
    sat = np.zeros_like(lum)
    np.divide(mx - mn, np.maximum(mx, 1.0), out=sat)

    # 1) Restore backdrop ghosts — any side/upper pixel that was originally bright bg
    orig_bg = (lum > 200) & (sat < 0.12)
    outside = (np.abs(x - w / 2.0) > w * 0.20) & (y < int(h * 0.36))
    changed = np.abs(out.mean(axis=-1) - arr.mean(axis=-1)) > 12
    ghost = orig_bg & outside & changed
    # Also restore any hard polygon spill that darkened/coloured the backdrop
    spill = outside & (lum > 190) & changed
    out = np.where((ghost | spill)[..., None], arr, out)

    # 2) For coloured variants, recolor leftover bright fabric inside torso ellipse
    if tgt_lum < 200:
        cy, cx = int(h * 0.16), int(w * 0.50)
        ry, rx = int(h * 0.16), int(w * 0.17)
        yy = (y - cy) / max(ry, 1)
        xx = (x - cx) / max(rx, 1)
        ellipse = (yy * yy + xx * xx) <= 1.0
        leftover = ellipse & (out.mean(axis=-1) > 200) & (y < int(h * 0.30))
        out = np.where(leftover[..., None], tint, out)

    return np.clip(out, 0, 255).astype(np.uint8)


def main() -> None:
    master = load_master().resize((1400, 2100), Image.Resampling.LANCZOS)
    arr = np.asarray(master).astype(np.float32)
    mask = build_mask(arr)
    Image.fromarray((mask * 255).astype(np.uint8)).save(OUT / "_mask-debug.png")
    print(f"mask coverage={mask.mean()*100:.2f}%  opaque={(mask>0.5).mean()*100:.2f}%")

    for color, target in TARGETS.items():
        out = recolor(arr, mask, target)
        path = OUT / f"{color}-01-hero.png"
        Image.fromarray(out).save(path, optimize=True)
        mbin = mask > 0.5
        mean = out[mbin].mean(axis=0).round(1) if mbin.any() else None
        print(f"wrote {path.name} masked mean RGB={mean}")

    (OUT / "_colors.json").write_text(
        '{\n  "black": ["/products/ribbed-tank-bodysuit/black-01-hero.png"],\n'
        '  "white": ["/products/ribbed-tank-bodysuit/white-01-hero.png"],\n'
        '  "mocha": ["/products/ribbed-tank-bodysuit/mocha-01-hero.png"]\n}\n',
        encoding="utf-8",
    )
    print("done")


if __name__ == "__main__":
    main()
