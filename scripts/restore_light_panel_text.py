from pathlib import Path

root = Path("src")
subs = [
    # Dark panels: light text on void/black
    ("bg-void text-ink", "bg-void text-canvas"),
    ("bg-void/90 text-ink", "bg-void/90 text-canvas"),
    ("bg-void/70 text-ink", "bg-void/70 text-canvas"),
    ("bg-void/60 text-ink", "bg-void/60 text-canvas"),
    ("bg-void/50 text-ink", "bg-void/50 text-canvas"),
    # Opacity light text that was remapped to ink on dark surfaces
    ("text-ink/90", "text-canvas/90"),  # risky globally - only if on dark?
]

# Safer: only replace void+ink combos and common dark-panel opacity patterns
# Revert the aggressive text-ink/90 change - do targeted only

subs = [
    ("bg-void text-ink", "bg-void text-canvas"),
    ("bg-void/90 text-ink", "bg-void/90 text-canvas"),
    ("bg-void/70 px-4 py-2 text-[0.65rem] uppercase tracking-luxe text-ink",
     "bg-void/70 px-4 py-2 text-[0.65rem] uppercase tracking-luxe text-canvas"),
    ("bg-void/70 px-3 py-1 text-[0.65rem] uppercase tracking-luxe text-ink",
     "bg-void/70 px-3 py-1 text-[0.65rem] uppercase tracking-luxe text-canvas"),
    ("bg-void/70 px-3 py-1.5 text-[0.65rem] uppercase tracking-luxe text-ink",
     "bg-void/70 px-3 py-1.5 text-[0.65rem] uppercase tracking-luxe text-canvas"),
    ("bg-void/70 px-2.5 py-1 text-[0.6rem] uppercase tracking-luxe text-ink",
     "bg-void/70 px-2.5 py-1 text-[0.6rem] uppercase tracking-luxe text-canvas"),
    ("tracking-luxe text-ink group-hover:block", "tracking-luxe text-canvas group-hover:block"),
    ("bg-void px-3 py-1.5 text-[0.65rem] uppercase tracking-luxe text-ink",
     "bg-void px-3 py-1.5 text-[0.65rem] uppercase tracking-luxe text-canvas"),
    ("bg-void px-3 py-1 text-[0.65rem] uppercase tracking-luxe text-ink",
     "bg-void px-3 py-1 text-[0.65rem] uppercase tracking-luxe text-canvas"),
]

n = 0
for p in list(root.rglob("*.tsx")) + list(root.rglob("*.ts")):
    t = p.read_text(encoding="utf-8")
    n2 = t
    for a, b in subs:
        n2 = n2.replace(a, b)
    if n2 != t:
        p.write_text(n2, encoding="utf-8")
        n += 1
        print(p.as_posix())
print("updated", n)
