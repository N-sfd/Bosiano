import type { NavItem } from "./types";

export const megaNav: NavItem[] = [
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
          { label: "Knitwear", href: "/shop?category=men&sub=Knitwear" },
          { label: "Shirts", href: "/shop?category=men&sub=Shirts" },
          { label: "Trousers", href: "/shop?category=men&sub=Trousers" },
          { label: "Denim", href: "/shop?category=men&sub=Denim" },
          { label: "Outerwear", href: "/shop?category=men&sub=Outerwear" },
        ],
      },
      {
        heading: "Accessories",
        links: [
          { label: "Bags", href: "/shop?category=bags" },
          { label: "Shoes", href: "/shop?category=shoes" },
          { label: "Jewelry", href: "/shop?category=jewelry" },
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
    href: "/designers",
    columns: [
      {
        heading: "Houses",
        links: [
          { label: "Maison Vérane", href: "/designers/maison-verane" },
          { label: "Atelier Nordé", href: "/designers/atelier-norde" },
          { label: "SÀNSO", href: "/designers/sanso" },
          { label: "Okoro", href: "/designers/okoro" },
        ],
      },
      {
        heading: "More Houses",
        links: [
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
        href: "/designers",
        caption: "Explore each house's world",
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
  { label: "Live Shopping", href: "/live" },
  { label: "Community", href: "/community" },
  { label: "Stores", href: "/stores" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "AI Stylist", href: "/stylist" },
  { label: "Outfit Boards", href: "/boards" },
];

/** Top-level shop / brand navigation (excludes explore destinations) */
export const primaryNav = megaNav;
