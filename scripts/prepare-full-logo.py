"""Build clean transparent bosiano-full-logo from primary lockup (no baked checkerboard)."""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "public" / "brand"


def is_black_plate(px: tuple[int, int, int, int]) -> bool:
    r, g, b, a = px
    if a < 12:
        return True
    mx, mn = max(r, g, b), min(r, g, b)
    # Neutral near-black only (shield brown has warmer channels / higher chroma)
    return mx <= 35 and mx - mn <= 10


def flood_clear(im: Image.Image, predicate) -> Image.Image:
    rgba = im.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()
    seen = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    def try_push(x: int, y: int) -> None:
        if x < 0 or y < 0 or x >= w or y >= h or seen[y][x]:
            return
        if not predicate(px[x, y]):
            return
        seen[y][x] = True
        q.append((x, y))

    for x in range(w):
        try_push(x, 0)
        try_push(x, h - 1)
    for y in range(h):
        try_push(0, y)
        try_push(w - 1, y)

    while q:
        x, y = q.popleft()
        r, g, b, _ = px[x, y]
        px[x, y] = (r, g, b, 0)
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            try_push(nx, ny)
    return rgba


def trim(im: Image.Image, pad: int = 8) -> Image.Image:
    rgba = im.convert("RGBA")
    bbox = rgba.split()[-1].getbbox()
    if not bbox:
        return rgba
    l, t, r, b = bbox
    return rgba.crop(
        (
            max(0, l - pad),
            max(0, t - pad),
            min(rgba.width, r + pad),
            min(rgba.height, b + pad),
        )
    )


def report(path: Path) -> None:
    im = Image.open(path).convert("RGBA")
    a = im.split()[-1]
    # sample a few interior points that should be transparent (letter counters) vs gold
    print(
        f"{path.name}: size={im.size} alpha={a.getextrema()} bbox={a.getbbox()} "
        f"corner={im.getpixel((0,0))} ratio={im.width / im.height:.4f}"
    )


def clear_enclosed_black(im: Image.Image) -> Image.Image:
    """Also clear near-black pixels that are fully enclosed (letter counters on black plate).
    Keep brown shield fill: require very low chroma + low luminance.
    """
    rgba = im.convert("RGBA")
    px = rgba.load()
    w, h = rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 8:
                continue
            mx, mn = max(r, g, b), min(r, g, b)
            if mx <= 30 and mx - mn <= 8:
                px[x, y] = (r, g, b, 0)
    return rgba


def main() -> None:
    # Prefer primary / heritage (true metallic on black, no baked checkerboard in counters)
    candidates = [
        BRAND / "logo-lockup-current.png",
        BRAND / "logo-primary-lockup.png",
        BRAND / "logo-heritage-lockup.png",
    ]
    # Restore digital from bak if available and still good
    bak = BRAND / "logo-digital-lockup.opaque-bak.png"

    src = next((p for p in candidates if p.exists()), None)
    if src is None:
        raise SystemExit("No primary lockup found")

    print(f"Source: {src.name}")
    im = Image.open(src).convert("RGBA")
    print("source corner", im.getpixel((0, 0)), "size", im.size)

    cleaned = flood_clear(im, is_black_plate)
    cleaned = clear_enclosed_black(cleaned)
    cleaned = trim(cleaned, pad=6)

    out = BRAND / "bosiano-full-logo.png"
    cleaned.save(out, "PNG", optimize=True)
    report(out)

    cleaned.save(BRAND / "logo-digital-lockup-clear.png", "PNG", optimize=True)
    report(BRAND / "logo-digital-lockup-clear.png")

    # Crest from upper portion
    w, h = cleaned.size
    crest = trim(cleaned.crop((0, 0, w, int(h * 0.58))), pad=4)
    crest_path = BRAND / "bosiano-crest-transparent.png"
    crest.save(crest_path, "PNG", optimize=True)
    report(crest_path)

    # Keep crest-shield as fallback — also ensure digital crest points to transparent crest
    print("done")


if __name__ == "__main__":
    main()
