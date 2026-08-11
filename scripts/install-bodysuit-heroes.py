from pathlib import Path
import json
from PIL import Image

assets = Path(r"C:\Users\nazia\.cursor\projects\e-projects-AI-Projects-Bosianos\assets")
out = Path(r"e:\projects\AI Projects\Bosianos\public\products\ribbed-tank-bodysuit")
out.mkdir(parents=True, exist_ok=True)

mapping = {
    "white": assets / "ribbed-tank-bodysuit-white-ref.png",
    "black": assets / "ribbed-tank-bodysuit-black-gen.png",
    "mocha": assets / "ribbed-tank-bodysuit-mocha-gen.png",
}

for color, src in mapping.items():
    if not src.exists():
        raise SystemExit(f"missing {src}")
    im = Image.open(src).convert("RGB").resize((1400, 2100), Image.Resampling.LANCZOS)
    dest = out / f"{color}-01-hero.png"
    im.save(dest, optimize=True)
    print(f"wrote {dest.name} ({dest.stat().st_size} bytes) from {src.name}")

for p in out.glob("_crop-debug-*.png"):
    p.unlink()
    print(f"removed {p.name}")

(out / "_colors.json").write_text(
    json.dumps(
        {
            "black": ["/products/ribbed-tank-bodysuit/black-01-hero.png"],
            "white": ["/products/ribbed-tank-bodysuit/white-01-hero.png"],
            "mocha": ["/products/ribbed-tank-bodysuit/mocha-01-hero.png"],
        },
        indent=2,
    )
    + "\n",
    encoding="utf-8",
)
print("done")
