"""
DEPRECATED — do NOT generate ecommerce colour variants by tinting.

Fake colourization (Pillow tint / CSS filters / blend modes) is forbidden.
Each colour swatch must use a real photograph of the same design in that colour.

This script now refuses to write tinted assets.
"""
from __future__ import annotations

import sys


def main() -> None:
    print(
        "REFUSED: generate-color-heroes.py must not tint product images.\n"
        "Add real per-colour assets under public/products/<slug>/<colorId>-*.png\n"
        "and map them in src/lib/images.ts → productImagesByColor.",
        file=sys.stderr,
    )
    sys.exit(1)


if __name__ == "__main__":
    main()
