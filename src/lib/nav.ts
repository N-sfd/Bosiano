import type { NavItem } from "./types";

export const megaNav: NavItem[] = [
  {
    label: "Bosiano",
    href: "/shop?collection=house&brand=bosiano",
    columns: [
      {
        heading: "Bosiano Collection",
        links: [
          { label: "Shop the House", href: "/shop?collection=house&brand=bosiano" },
          { label: "Leather Bags", href: "/shop?brand=bosiano&category=bags" },
          { label: "Clothing", href: "/shop?brand=bosiano&category=clothing" },
          { label: "Small Leather Goods", href: "/shop?brand=bosiano&category=bags&sub=Small%20Leather%20Goods" },
          { label: "Belts", href: "/shop?brand=bosiano&category=accessories&sub=Belts" },
          { label: "Fragrance", href: "/shop?brand=bosiano&category=fragrance" },
          { label: "Gifts", href: "/shop?brand=bosiano&category=gifts" },
          { label: "Italian Heritage", href: "/brand" },
        ],
      },
      {
        heading: "Signature hardware",
        links: [
          { label: "Crest clasp bags", href: "/product/bosiano-crest-leather-handbag" },
          { label: "Cognac flap bag", href: "/product/bosiano-cognac-flap-bag" },
          { label: "B monogram belt", href: "/product/bosiano-b-leather-belt" },
          { label: "Zip wallet", href: "/product/bosiano-crest-zip-wallet" },
        ],
      },
    ],
    featured: [
      {
        title: "House of Bosiano",
        image: "bosiano-hero",
        href: "/shop?collection=house&brand=bosiano",
        caption: "Crest hardware · leather emboss · quiet embroidery",
      },
    ],
  },
  {
    label: "New In",
    href: "/shop?sort=new",
    columns: [
      {
        heading: "Just Arrived",
        links: [
          { label: "New This Week", href: "/shop?sort=new" },
          { label: "Back in Stock", href: "/shop" },
          { label: "Trending Now", href: "/shop?sort=popular" },
          { label: "The Edit: Autumn", href: "/journal" },
        ],
      },
      {
        heading: "By Category",
        links: [
          { label: "New Womenswear", href: "/shop?category=women&sort=new" },
          { label: "New Menswear", href: "/shop?category=men&sort=new" },
          { label: "New Bags", href: "/shop?category=bags&sort=new" },
          { label: "New Shoes", href: "/shop?category=shoes&sort=new" },
        ],
      },
    ],
    featured: [
      {
        title: "The Autumn Arrivals",
        image: "nav-new-1",
        href: "/shop?sort=new",
        caption: "Discover the season's first drop",
      },
    ],
  },
  {
    label: "Women",
    href: "/shop?category=women",
    columns: [
      {
        heading: "Clothing",
        links: [
          { label: "Tailoring", href: "/shop?category=women&sub=Tailoring" },
          { label: "Dresses", href: "/shop?category=women&sub=Dresses" },
          { label: "Knitwear", href: "/shop?category=women&sub=Knitwear" },
          { label: "Shirts", href: "/shop?category=women&sub=Shirts" },
          { label: "Skirts", href: "/shop?category=women&sub=Skirts" },
          { label: "Outerwear", href: "/shop?category=women&sub=Outerwear" },
        ],
      },
      {
        heading: "Accessories",
        links: [
          { label: "Bags", href: "/shop?category=bags" },
          { label: "Shoes", href: "/shop?category=shoes" },
          { label: "Jewelry", href: "/shop?category=jewelry" },
          { label: "Scarves & Wraps", href: "/shop?category=women&sub=Accessories" },
        ],
      },
      {
        heading: "Featured Designers",
        links: [
          { label: "Maison Vérane", href: "/designers/maison-verane" },
          { label: "Belrose", href: "/designers/belrose" },
          { label: "SÀNSO", href: "/designers/sanso" },
          { label: "All Designers", href: "/designers" },
        ],
      },
    ],
    featured: [
      {
        title: "The Tailoring Edit",
        image: "nav-women-1",
        href: "/shop?category=women&sub=Tailoring",
        caption: "Sculpted silhouettes for the season",
      },
    ],
  },
  {
    label: "Men",
    href: "/shop?category=men",
    columns: [
      {
        heading: "Clothing",
        links: [
          { label: "New In", href: "/shop?category=men&sort=new" },
          { label: "Outerwear", href: "/shop?category=men&sub=Outerwear" },
          { label: "Knitwear", href: "/shop?category=men&sub=Knitwear" },
          { label: "Shirts", href: "/shop?category=men&sub=Shirts" },
          /* Category label is always plural Trousers — never Pant / Pants / Trouser */
          { label: "Trousers", href: "/shop?category=men&sub=Trousers" },
          { label: "Denim", href: "/shop?category=men&sub=Denim" },
          { label: "Shoes", href: "/shop?category=shoes" },
          { label: "Watches", href: "/shop?category=men&sub=Watches" },
        ],
      },
      {
        heading: "Featured Designers",
        links: [
          { label: "Kestrel & Co.", href: "/designers/kestrel" },
          { label: "Atelier Nordé", href: "/designers/atelier-norde" },
          { label: "Hana Mori", href: "/designers/hana-mori" },
          { label: "All Designers", href: "/designers" },
        ],
      },
    ],
    featured: [
      {
        title: "Modern Workwear",
        image: "nav-men-1",
        href: "/shop?category=men",
        caption: "Utility, elevated for the city",
      },
    ],
  },
  {
    label: "Bags & Accessories",
    href: "/shop?category=bags",
    columns: [
      {
        heading: "Bags",
        links: [
          { label: "Totes", href: "/shop?category=bags&sub=Totes" },
          { label: "Shoulder Bags", href: "/shop?category=bags&sub=Shoulder Bags" },
          { label: "Clutches", href: "/shop?category=bags&sub=Clutches" },
        ],
      },
      {
        heading: "Accessories",
        links: [
          { label: "Jewelry", href: "/shop?category=jewelry" },
          { label: "Belts", href: "/shop?category=accessories&sub=Belts" },
          { label: "Scarves & Wraps", href: "/shop?category=women&sub=Accessories" },
          { label: "Shoes", href: "/shop?category=shoes" },
        ],
      },
    ],
    featured: [
      {
        title: "Investment Bags",
        image: "nav-bags-1",
        href: "/shop?category=bags",
        caption: "Pieces to keep for a lifetime",
      },
    ],
  },
  {
    label: "Designers",
    href: "/shop?collection=marketplace",
    columns: [
      {
        heading: "Designer Marketplace",
        links: [
          { label: "All Designers", href: "/designers" },
          { label: "Shop Marketplace", href: "/shop?collection=marketplace" },
          { label: "Maison Vérane", href: "/designers/maison-verane" },
          { label: "Atelier Nordé", href: "/designers/atelier-norde" },
        ],
      },
      {
        heading: "More Houses",
        links: [
          { label: "SÀNSO", href: "/designers/sanso" },
          { label: "Okoro", href: "/designers/okoro" },
          { label: "Hana Mori", href: "/designers/hana-mori" },
          { label: "Belrose", href: "/designers/belrose" },
          { label: "Kestrel & Co.", href: "/designers/kestrel" },
          { label: "Solène", href: "/designers/solene" },
        ],
      },
    ],
    featured: [
      {
        title: "Designer Storefronts",
        image: "nav-designers-1",
        href: "/shop?collection=marketplace",
        caption: "Authentic designer pieces — original branding intact",
      },
    ],
  },
  {
    label: "The Journal",
    href: "/journal",
    columns: [
      {
        heading: "Editorial",
        links: [
          { label: "Designer Interviews", href: "/journal" },
          { label: "Italian Craftsmanship", href: "/journal" },
          { label: "Seasonal Trends", href: "/journal" },
          { label: "Style Guides", href: "/journal" },
          { label: "Travel & Fashion", href: "/journal" },
        ],
      },
      {
        heading: "More stories",
        links: [
          { label: "Sustainability", href: "/journal" },
          { label: "Runway Coverage", href: "/journal" },
          { label: "Celebrity Styling", href: "/journal" },
          { label: "Product Care", href: "/journal" },
          { label: "Live Shopping", href: "/live" },
        ],
      },
      {
        heading: "Services",
        links: [
          { label: "Lookbook", href: "/lookbook" },
          { label: "AI Personal Stylist", href: "/stylist" },
          { label: "Book a stylist", href: "/account/appointments" },
          { label: "Concierge support", href: "/support" },
          { label: "Alterations & care", href: "/care" },
          { label: "Community looks", href: "/community" },
          { label: "Outfit boards", href: "/boards" },
          { label: "Mobile app", href: "/app" },
        ],
      },
    ],
    featured: [
      {
        title: "The Bosiano Journal",
        image: "nav-journal-1",
        href: "/journal",
        caption: "Shoppable stories from the world of design",
      },
    ],
  },
  {
    label: "Sale",
    href: "/shop?sale=true",
  },
];

/** Secondary destinations — shown under Explore in the header */
export const exploreNav: { label: string; href: string }[] = [
  { label: "Bosiano Collection", href: "/shop?collection=house&brand=bosiano" },
  { label: "Designer Marketplace", href: "/shop?collection=marketplace" },
  { label: "Italian Heritage", href: "/brand" },
  { label: "Live Shopping", href: "/live" },
  { label: "Community", href: "/community" },
  { label: "Stores", href: "/stores" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "AI Stylist", href: "/stylist" },
  { label: "Outfit Boards", href: "/boards" },
];

/** Top-level shop / brand navigation (excludes explore destinations) */
export const primaryNav = megaNav;
