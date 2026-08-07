from pathlib import Path
from rembg import remove
from PIL import Image

brand = Path(r"e:\projects\AI Projects\Bosianos\public\brand")
files = [
    "crest-primary.png",
    "logo-lockup.png",
    "wordmark-heritage.png",
    "crest-emboss.png",
]

for name in files:
    src = brand / name
    if not src.exists():
        print(f"skip missing {name}")
        continue
    bak = brand / f"{src.stem}.original{src.suffix}"
    if not bak.exists():
        bak.write_bytes(src.read_bytes())
        print(f"backed up {bak.name}")
    img = Image.open(src).convert("RGBA")
    out = remove(img)
    bbox = out.getbbox()
    if bbox:
        pad = 4
        x0, y0, x1, y1 = bbox
        x0 = max(0, x0 - pad)
        y0 = max(0, y0 - pad)
        x1 = min(out.width, x1 + pad)
        y1 = min(out.height, y1 + pad)
        out = out.crop((x0, y0, x1, y1))
    out.save(src, optimize=True)
    print(f"cleared {name} -> {out.size}")

print("done")
