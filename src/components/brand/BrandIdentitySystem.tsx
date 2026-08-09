import Image from "next/image";
import { brand } from "@/config/brand";
import { BosianoBrand } from "@/components/brand/BosianoBrand";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    key: "shield" as const,
    variant: "crest-simple" as const,
    image: brand.assets.applications.hardware,
  },
  {
    key: "monogram" as const,
    variant: "monogram" as const,
    image: null,
  },
  {
    key: "wordmark" as const,
    variant: "wordmark" as const,
    image: null,
  },
  {
    key: "fullLockup" as const,
    variant: "crest-full" as const,
    image: brand.assets.digitalLockup,
  },
];

function cellLabel(value: string) {
  if (value === "yes") return "●";
  if (value === "no") return "—";
  return value;
}

export function BrandIdentitySystem({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-16", className)}>
      {/* Four tiers */}
      <div>
        <p className="eyebrow">Brand recognition</p>
        <h2 className="mt-2 max-w-2xl font-serif text-3xl text-ink sm:text-4xl">
          Four marks. One master identity.
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-ink-soft">
          Customers recognise Bosiano through its design language — shield hardware, the B at small
          scale, an elegant wordmark, and the full lockup only for flagship moments.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((tier) => {
            const meta = brand.identity[tier.key];
            return (
              <article
                key={tier.key}
                className="flex flex-col overflow-hidden rounded-2xl border border-line bg-canvas-card"
              >
                <div className="relative flex aspect-[4/3] items-center justify-center bg-canvas-sunk p-6">
                  {tier.image ? (
                    <Image
                      src={tier.image}
                      alt=""
                      fill
                      className="object-contain p-6"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  ) : (
                    <BosianoBrand variant={tier.variant} theme="dark" size="lg" decorative />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <p className="text-[0.6rem] uppercase tracking-luxe text-ink-muted">
                    {tier.key === "shield"
                      ? "Primary"
                      : tier.key === "monogram"
                        ? "Secondary"
                        : tier.key === "wordmark"
                          ? "Typography"
                          : "Flagship"}
                  </p>
                  <h3 className="font-serif text-xl text-ink">{meta.name}</h3>
                  <p className="text-sm leading-relaxed text-ink-soft">{meta.role}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-line bg-canvas-raised p-5 sm:p-6">
          <p className="text-[0.65rem] uppercase tracking-luxe text-ink-muted">Hardware finishes</p>
          <p className="mt-2 text-sm text-ink">
            {brand.hardwareFinishes.preferred.map((f) => f.replace(/-/g, " ")).join(" · ")}
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            Avoid {brand.hardwareFinishes.avoid.map((f) => f.replace(/-/g, " ")).join(", ")} on
            everyday products.
          </p>
        </div>
      </div>

      {/* Matrix */}
      <div>
        <p className="eyebrow">Product branding matrix</p>
        <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Right mark. Right scale.</h2>
        <p className="mt-3 max-w-2xl text-sm text-ink-soft">
          Never stamp the same logo on everything. Shield for leather hardware, B for tiny details,
          wordmark for labels and scent, full lockup for packaging and brand experiences.
        </p>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-canvas-raised">
                <th className="px-4 py-3 font-medium text-ink">Product</th>
                <th className="px-4 py-3 font-medium text-ink">Shield</th>
                <th className="px-4 py-3 font-medium text-ink">B</th>
                <th className="px-4 py-3 font-medium text-ink">Wordmark</th>
                <th className="px-4 py-3 font-medium text-ink">Full</th>
              </tr>
            </thead>
            <tbody>
              {brand.matrix.map((row) => (
                <tr key={row.product} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{row.product}</td>
                  <td className="px-4 py-3 text-ink-soft">{cellLabel(row.shield)}</td>
                  <td className="px-4 py-3 text-ink-soft">{cellLabel(row.monogram)}</td>
                  <td className="px-4 py-3 text-ink-soft">{cellLabel(row.wordmark)}</td>
                  <td className="px-4 py-3 text-ink-soft">{cellLabel(row.full)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
