import Image from "next/image";
import Link from "next/link";
import { brand } from "@/config/brand";
import { BosianoBrand } from "@/components/brand/BosianoBrand";
import { ProductBrandPlacement } from "@/components/brand/ProductBrandPlacement";
import { cn } from "@/lib/utils";

type AppCard = {
  id: string;
  title: string;
  tier: "Shield" | "B" | "Wordmark" | "Full" | "None";
  rule: string;
  image: string | null;
  mockup?: {
    productType: keyof typeof brand.placement;
    placement: "left-chest" | "front" | "dial" | "gusset" | "center-chest";
    variant: "wordmark" | "lockup" | "crest-simple" | "crest-full" | "monogram";
    finish: "embroidery" | "foil" | "blind" | "engraving";
    tone: "ink" | "ivory" | "gold";
    size?: "xs" | "sm" | "md";
  };
};

const APPLICATIONS: AppCard[] = [
  {
    id: "hardware",
    title: "Shield crest hardware",
    tier: "Shield",
    rule: "Defining mark for handbags, totes, wallets, locks, and leather tags — satin / brushed / antique / matte champagne gold. Never mirror-polished for everyday.",
    image: brand.assets.applications.hardware,
  },
  {
    id: "handbag",
    title: "Luxury handbag",
    tier: "Shield",
    rule: "Shield on clasp hardware · optional B inside · wordmark interior stamp · never full logo on exterior.",
    image: brand.assets.applications.handbag,
  },
  {
    id: "wallet",
    title: "Wallet",
    tier: "Shield",
    rule: "Shield blind emboss · optional B on zipper · wordmark interior.",
    image: brand.assets.applications.wallet,
  },
  {
    id: "belt",
    title: "Belt",
    tier: "B",
    rule: "B monogram buckle as the everyday signature · optional shield · wordmark interior.",
    image: brand.assets.applications.hardware,
  },
  {
    id: "monogram",
    title: "B monogram details",
    tier: "B",
    rule: "Buttons, snaps, rivets, crown, small zipper pulls, jewelry clasps — never the full crest at these sizes.",
    image: null,
    mockup: {
      productType: "jewelry",
      placement: "front",
      variant: "monogram",
      finish: "engraving",
      tone: "gold",
      size: "sm",
    },
  },
  {
    id: "watch",
    title: "Watch",
    tier: "Shield",
    rule: "Shield at 12 · B on crown · wordmark on caseback / clasp · no full logo on the dial.",
    image: null,
    mockup: {
      productType: "watch",
      placement: "dial",
      variant: "crest-simple",
      finish: "engraving",
      tone: "gold",
      size: "xs",
    },
  },
  {
    id: "perfume",
    title: "Perfume",
    tier: "Wordmark",
    rule: "BOSIANO wordmark on bottle front · small shield on cap · full lockup on gift box only.",
    image: brand.assets.applications.perfume,
  },
  {
    id: "shoe",
    title: "Shoes",
    tier: "Shield",
    rule: "Heel-tab shield · B on eyelets · wordmark on insole.",
    image: brand.assets.applications.sneaker,
  },
  {
    id: "clothing",
    title: "Clothing",
    tier: "Shield",
    rule: "Small chest shield embroidery · B on buttons · wordmark neck label. Tailoring stays clean.",
    image: brand.assets.applications.tee,
  },
  {
    id: "jewelry",
    title: "Jewelry",
    tier: "B",
    rule: "B pendant or clasp · optional shield on clasp · wordmark packaging · crest inside the box.",
    image: brand.assets.applications.jewelryBox,
  },
  {
    id: "packaging",
    title: "Gift box & shopping bag",
    tier: "Full",
    rule: "Where the full identity shines — gold foil wordmark, small embossed crest, optional full lockup.",
    image: brand.assets.applications.ringBox,
  },
  {
    id: "header",
    title: "Website header",
    tier: "Full",
    rule: "Full crest + wordmark lockup (transparent). Mobile may use shield-only.",
    image: brand.assets.digitalLockup,
  },
  {
    id: "footer",
    title: "Website footer",
    tier: "Wordmark",
    rule: "Wordmark + ITALIAN HERITAGE. Optional tiny shield. Never a large repeated crest.",
    image: null,
  },
  {
    id: "tailoring",
    title: "Dresses · blazers",
    tier: "None",
    rule: "No exterior logo. Neck wordmark, B on buttons, crest only on interior hardware if needed.",
    image: null,
  },
];

export function BrandApplications({ className }: { className?: string }) {
  return (
    <section className={cn("space-y-8", className)} aria-labelledby="brand-applications-heading">
      <div className="max-w-2xl">
        <p className="eyebrow">Applications</p>
        <h2 id="brand-applications-heading" className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
          Craftsmanship over oversized branding
        </h2>
        <p className="mt-3 text-sm text-ink-soft">
          Blind emboss, small gold shield hardware, B monogram details, interior foil — never flat
          logo overlays on product cards.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {APPLICATIONS.map((card) => (
          <article key={card.id} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-canvas-card">
            <div className="relative aspect-[4/5] bg-canvas-sunk">
              {card.image ? (
                <Image
                  src={card.image}
                  alt=""
                  fill
                  className={cn(
                    card.id === "header" || card.id === "hardware"
                      ? "object-contain bg-transparent p-8"
                      : "object-cover"
                  )}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-canvas-raised to-canvas-sunk p-6">
                  {card.id === "footer" ? (
                    <div className="flex h-full w-full items-center justify-center rounded-sm bg-void p-8">
                      <BosianoBrand variant="lockup" theme="gold" size="sm" decorative />
                    </div>
                  ) : card.mockup ? (
                    <div className="relative h-full w-full max-w-[220px]">
                      <div className="absolute inset-[8%] rounded-sm border border-dashed border-line/80 bg-canvas/60" />
                      <ProductBrandPlacement
                        productType={card.mockup.productType}
                        placement={card.mockup.placement}
                        variant={card.mockup.variant}
                        finish={card.mockup.finish}
                        tone={card.mockup.tone}
                        size={card.mockup.size ?? "xs"}
                      />
                    </div>
                  ) : (
                    <p className="max-w-[14rem] text-center font-serif text-lg text-ink-soft">
                      No exterior mark
                    </p>
                  )}
                  <p className="mt-4 text-center text-[0.65rem] uppercase tracking-luxe text-ink-muted">
                    Placement guide
                  </p>
                </div>
              )}
              <span className="absolute left-3 top-3 rounded-full bg-canvas/90 px-2.5 py-1 text-[0.55rem] uppercase tracking-luxe text-ink">
                {card.tier}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
              <h3 className="font-serif text-xl text-ink">{card.title}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{card.rule}</p>
            </div>
          </article>
        ))}
      </div>

      <p className="text-center text-sm text-ink-muted">
        Explore the house edit ·{" "}
        <Link href="/shop?collection=house&brand=bosiano" className="link-underline text-ink">
          Shop Bosiano Collection
        </Link>
      </p>
    </section>
  );
}
