import Link from "next/link";
import { Instagram, Youtube, Twitter, Facebook } from "lucide-react";
import { BosianoBrand } from "@/components/brand/BosianoBrand";
import { brand } from "@/config/brand";

const columns = [
  {
    heading: "Shop",
    links: [
      { label: "New In", href: "/shop?sort=new" },
      { label: "Women", href: "/shop?category=women" },
      { label: "Men", href: "/shop?category=men" },
      { label: "Bags & Accessories", href: "/shop?category=bags" },
      { label: "Lookbook", href: "/lookbook" },
      { label: "Live Shopping", href: "/live" },
      { label: "Community", href: "/community" },
      { label: "Outfit Boards", href: "/boards" },
      { label: "Designers", href: "/designers" },
      { label: "Sale", href: "/shop?sale=true" },
    ],
  },
  {
    heading: "Client Care",
    links: [
      { label: "My Account", href: "/account" },
      { label: "Order Tracking", href: "/account/orders" },
      { label: "Returns & Exchanges", href: "/account/returns" },
      { label: "Styling Appointments", href: "/account/appointments" },
      { label: "Concierge Support", href: "/support" },
      { label: "Alterations & Care", href: "/care" },
      { label: "Contact Us", href: "/support" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Our Story", href: "/about" },
      { label: brand.journalName, href: "/journal" },
      { label: "Italian Heritage", href: "/brand" },
      { label: "AI Personal Stylist", href: "/stylist" },
      { label: "Book a Stylist", href: "/account/appointments" },
      { label: "Stores", href: "/stores" },
      { label: "Mobile App", href: "/app" },
      { label: "Bosiano Club", href: "/rewards" },
      { label: "Admin", href: "/admin" },
      { label: "Vendor portal", href: "/vendor" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-canvas-raised">
      {/* newsletter + club incentive */}
      <div className="border-b border-line">
        <div className="shell grid gap-6 py-14 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-serif text-3xl text-ink sm:text-4xl">Join the Bosiano world</h2>
            <p className="mt-2 max-w-md text-sm text-ink-soft">
              Be first to receive new arrivals, private designer previews, and stories from The Journal.
            </p>
            <Link
              href="/rewards"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-medium uppercase tracking-luxe text-gold transition-colors hover:bg-gold hover:text-void"
            >
              Join Bosiano Club &amp; get $25 off your first order
            </Link>
          </div>
          <form className="flex w-full max-w-md gap-3 lg:ml-auto" aria-label="Newsletter signup">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full border-b border-ink bg-transparent py-3 text-sm placeholder:text-ink-muted focus:outline-none"
              aria-label="Email address"
            />
            <button type="submit" className="btn-primary shrink-0">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Brand footer — same full lockup as header */}
      <div className="bg-void text-canvas">
        <div className="shell grid grid-cols-2 gap-8 py-14 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link
              href="/"
              aria-label={`${brand.displayName} home`}
              className="bosiano-logo-link inline-flex bg-transparent p-0 shadow-none"
            >
              <BosianoBrand variant="crest-full" size="xl" priority />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-canvas/70">
              Crafted in the spirit of Italian luxury.
            </p>
            <p className="mt-3 max-w-xs text-sm text-canvas/55">
              A curated marketplace uniting the world&apos;s most considered designers, delivered with
              uncompromising service.
            </p>
            <div className="mt-5 flex gap-4">
              {[Instagram, Youtube, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="text-canvas/50 transition-colors hover:text-gold"
                >
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="mb-4 text-[0.68rem] font-medium uppercase tracking-luxe text-gold">{col.heading}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-canvas/70 transition-colors hover:text-canvas">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10">
          <div className="shell flex flex-col items-center justify-between gap-3 py-6 text-xs text-canvas/50 sm:flex-row">
            <p>© {new Date().getFullYear()} Bosiano. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/about" className="hover:text-canvas">Privacy Policy</Link>
              <Link href="/about" className="hover:text-canvas">Terms of Service</Link>
              <Link href="/about" className="hover:text-canvas">Accessibility</Link>
              <span className="hidden sm:inline">·</span>
              <span>Shipping worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
