import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { ConciergeWidget } from "@/components/support/ConciergeWidget";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bosianos — Premium Fashion Marketplace",
    template: "%s · Bosianos",
  },
  description:
    "Bosianos is a curated luxury marketplace bringing together the world's most considered designers. Shop tailoring, dresses, bags, and more with AI-powered discovery.",
  keywords: ["luxury fashion", "designer", "marketplace", "Bosianos"],
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-xs focus:uppercase focus:tracking-luxe focus:text-canvas"
        >
          Skip to content
        </a>
        <AnnouncementBar />
        <Header />
        <main id="main" className="min-h-screen pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
          {children}
        </main>
        <div className="pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
          <Footer />
        </div>
        <MobileNav />
        <ConciergeWidget />
      </body>
    </html>
  );
}
