from pathlib import Path

root = Path("src")
replacements = [
    ("bg-ink text-canvas", "bg-void text-ink"),
    ("bg-ink/90 text-canvas", "bg-void/90 text-ink"),
    ("bg-gold text-canvas", "bg-gold text-void"),
    ("text-canvas/90", "text-ink/90"),
    ("text-canvas/80", "text-ink/80"),
    ("text-canvas/75", "text-ink/75"),
    ("text-canvas/70", "text-ink/70"),
    ("text-canvas/60", "text-ink/60"),
    ("text-canvas/50", "text-ink/50"),
    ("hover:text-canvas", "hover:text-ink"),
    ("!text-canvas", "!text-ink"),
    ("text-canvas", "text-ink"),
]

count = 0
for path in list(root.rglob("*.tsx")) + list(root.rglob("*.ts")):
    text = path.read_text(encoding="utf-8")
    new = text
    for a, b in replacements:
        new = new.replace(a, b)
    if new != text:
        path.write_text(new, encoding="utf-8")
        count += 1
        print(path.as_posix())

print("files", count)
