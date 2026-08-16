from pathlib import Path

root = Path("src")
subs = [
    ("bg-ink/90", "bg-void/90"),
    ("bg-ink/70", "bg-void/70"),
    ("bg-ink/60", "bg-void/60"),
    ("bg-ink/50", "bg-void/50"),
    ("bg-ink/40", "bg-void/60"),
    ("bg-ink/35", "bg-void/35"),
    ("bg-ink/25", "bg-void/25"),
    ("bg-ink/20", "bg-void/20"),
    ("rounded-full bg-ink ", "rounded-full bg-void "),
    ("rounded-2xl bg-ink", "rounded-2xl bg-void"),
    ("overflow-hidden bg-ink", "overflow-hidden bg-void"),
    ("relative bg-ink", "relative bg-void"),
    ("bg-ink px-4 py-3", "bg-void px-4 py-3"),
    ("bg-ink text-xs", "bg-void text-xs"),
    ("bg-ink sm:", "bg-void sm:"),
    ("overflow-hidden bg-ink ", "overflow-hidden bg-void "),
    ("rounded-full bg-ink text-xs text-ink", "rounded-full bg-gold text-xs text-void"),
    ("rounded-full bg-void text-xs text-ink", "rounded-full bg-gold text-xs text-void"),
]

n = 0
for p in root.rglob("*.tsx"):
    t = p.read_text(encoding="utf-8")
    n2 = t
    for a, b in subs:
        n2 = n2.replace(a, b)
    if n2 != t:
        p.write_text(n2, encoding="utf-8")
        n += 1
        print(p.as_posix())
print("updated", n)
