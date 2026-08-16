from pathlib import Path

# These blocks sit on dark media / void panels — light cream text required
targets = {
    "src/components/home/Hero.tsx": True,
    "src/app/page.tsx": True,
    "src/app/account/page.tsx": True,
    "src/app/account/club/page.tsx": True,
    "src/app/designers/[slug]/page.tsx": True,
    "src/app/stores/[slug]/page.tsx": True,
    "src/app/rewards/page.tsx": True,
    "src/app/about/page.tsx": True,
    "src/app/designers/page.tsx": True,
    "src/app/live/[slug]/page.tsx": True,
    "src/components/layout/Header.tsx": True,
    "src/components/designers/FollowDesignerButton.tsx": True,
}

subs = [
    ("text-ink/90", "text-canvas/90"),
    ("text-ink/85", "text-canvas/85"),
    ("text-ink/80", "text-canvas/80"),
    ("text-ink/70", "text-canvas/70"),
    ("text-ink/60", "text-canvas/60"),
    ("!text-ink/70", "!text-canvas/70"),
    ("!text-ink/80", "!text-canvas/80"),
    ("!text-ink/85", "!text-canvas/85"),
    # solid light text on dark photo overlays
    ("leading-tight text-ink drop-shadow", "leading-tight text-canvas drop-shadow"),
    ("text-balance sm:text-6xl", "text-balance text-canvas sm:text-6xl"),  # careful
]

# Hero h1 - needs text-canvas
hero_extra = [
    (
        'className="mt-4 font-serif text-5xl leading-[0.98] text-balance sm:text-6xl lg:text-7xl"',
        'className="mt-4 font-serif text-5xl leading-[0.98] text-balance text-canvas sm:text-6xl lg:text-7xl"',
    ),
    (
        'className="eyebrow !text-ink/85"',
        'className="eyebrow !text-canvas/85"',
    ),
]

n = 0
for rel in targets:
    p = Path(rel)
    if not p.exists():
        continue
    t = p.read_text(encoding="utf-8")
    n2 = t
    for a, b in subs:
        n2 = n2.replace(a, b)
    if rel.endswith("Hero.tsx"):
        for a, b in hero_extra:
            n2 = n2.replace(a, b)
    if n2 != t:
        p.write_text(n2, encoding="utf-8")
        n += 1
        print(rel)
print("updated", n)
