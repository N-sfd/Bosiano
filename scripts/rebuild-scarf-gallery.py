"""Rebuild Bosiano scarf gallery views from one master image per colorway."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont

ROOT = Path(__file__).resolve().parents[1] / "public" / "products" / "bosiano-silk-twill-scarf"


def save(im: Image.Image, name: str) -> None:
    path = ROOT / name
    im.convert("RGB").save(path, "PNG", optimize=True)
    print(f"wrote {name} {im.size}")


def center_crop(im: Image.Image, frac: float = 0.86) -> Image.Image:
    w, h = im.size
    cw, ch = int(w * frac), int(h * frac)
    left = (w - cw) // 2
    top = (h - ch) // 2
    return im.crop((left, top, left + cw, top + ch)).resize((w, h), Image.Resampling.LANCZOS)


def make_folded(im: Image.Image) -> Image.Image:
    """Compose a folded square from overlapping crops of the SAME scarf pixels."""
    w, h = im.size
    out = Image.new("RGB", (w, h), (236, 230, 220))
    regions = [
        im.crop((0, 0, w // 2, h // 2)),
        im.crop((w // 2, 0, w, h // 2)),
        im.crop((0, h // 2, w // 2, h)),
        im.crop((w // 2, h // 2, w, h)),
    ]
    base = int(min(w, h) * 0.72)
    x0 = (w - base) // 2
    y0 = (h - base) // 2
    for i, reg in enumerate(regions):
        layer = reg.resize((base, base), Image.Resampling.LANCZOS)
        if i % 2:
            layer = ImageEnhance.Brightness(layer).enhance(0.92)
        out.paste(layer, (x0 + i * 6, y0 + i * 5))
    return out


def make_draped(im: Image.Image) -> Image.Image:
    w, h = im.size
    crop = im.crop((int(w * 0.08), int(h * 0.18), int(w * 0.92), int(h * 0.88)))
    draped = crop.resize((w, h), Image.Resampling.LANCZOS)
    draped = ImageEnhance.Contrast(draped).enhance(1.05)
    return ImageEnhance.Color(draped).enhance(1.02)


def make_edge(im: Image.Image) -> Image.Image:
    w, h = im.size
    side = int(min(w, h) * 0.48)
    left = int(w * 0.05)
    top = int(h * 0.08)
    crop = im.crop((left, top, left + side, top + side))
    return crop.resize((w, h), Image.Resampling.LANCZOS)


def make_label(im: Image.Image) -> Image.Image:
    """Border/field crop + woven BOSIANO label on the same fabric pixels."""
    w, h = im.size
    side = int(min(w, h) * 0.55)
    crop = im.crop(
        (
            w - side - int(w * 0.06),
            h - side - int(h * 0.08),
            w - int(w * 0.06),
            h - int(h * 0.08),
        )
    )
    out = crop.resize((w, h), Image.Resampling.LANCZOS)
    draw = ImageDraw.Draw(out)
    lw, lh = int(w * 0.12), int(h * 0.28)
    lx, ly = int(w * 0.72), int(h * 0.36)
    draw.rounded_rectangle(
        [lx, ly, lx + lw, ly + lh],
        radius=4,
        fill=(244, 238, 226),
        outline=(120, 90, 60),
        width=2,
    )
    try:
        font = ImageFont.truetype("arial.ttf", max(18, lw // 5))
    except OSError:
        font = ImageFont.load_default()
    ty = ly + 16
    for ch in "BOSIANO":
        bbox = draw.textbbox((0, 0), ch, font=font)
        tw = bbox[2] - bbox[0]
        draw.text((lx + (lw - tw) // 2, ty), ch, fill=(40, 28, 18), font=font)
        ty += (bbox[3] - bbox[1]) + 6
    return out


def main() -> None:
    champ = Image.open(ROOT / "champagne-01-flat.png").convert("RGB")
    # Keep hero as the untouched master
    save(champ, "champagne-01-flat.png")
    # Flat twin (slightly tighter crop of same scarf)
    save(center_crop(champ, 0.88), "champagne-01b-flat.png")
    save(make_folded(champ), "champagne-02-folded.png")
    save(make_draped(champ), "champagne-03-draped.png")
    save(make_edge(champ), "champagne-05-edge.png")
    save(make_label(champ), "champagne-06-label.png")

    cognac = Image.open(ROOT / "cognac-01-flat.png").convert("RGB")
    save(cognac, "cognac-01-flat.png")
    save(make_folded(cognac), "cognac-02-folded.png")
    save(make_edge(cognac), "cognac-05-edge.png")
    save(make_label(cognac), "cognac-06-label.png")
    print("done")


if __name__ == "__main__":
    main()
