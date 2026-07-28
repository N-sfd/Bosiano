# Bosianos

**The Curated Luxury Marketplace** — a premium, multi-brand fashion e-commerce experience built with Next.js 14, TypeScript, and Tailwind CSS.

Bosianos blends the navigation and merchandising rigor of Nordstrom, the editorial luxury of Neiman Marcus and NET-A-PORTER, the clean typography of Massimo Dutti, the minimalism of SSENSE, the lifestyle storytelling of Banana Republic, the spatial calm and motion of Apple, and the multi-brand marketplace model of FARFETCH.

## Features

- **AI-powered semantic search** — natural-language queries ("something for a summer wedding") with synonym/concept expansion.
- **Visual "Shop the Look"** — mood-based visual search that assembles complete, shoppable looks.
- **Rotating editorial hero** with video-style slides, autoplay controls, and progress indicators.
- **Sticky mega menu** with featured collections and a full-screen mobile drawer.
- **Product detail** with draggable 360° spin view, product film, virtual try-on, and an AI size advisor.
- **Live inventory & delivery estimates**, low-stock signals, and per-variant stock.
- **Wishlist, compare (up to 4), and saved carts.**
- **One-page express checkout** with Apple Pay / Google Pay / PayPal / Klarna, promo codes, and order confirmation.
- **Account dashboard** — loyalty tiers, recent orders, saved bags, recently viewed.
- **Advanced order tracking** with live timelines and a guided **returns portal**.
- **Bosianos Club** premium loyalty & rewards program.
- **Personalized homepage** that adapts to browsing behavior.
- **Dedicated designer storefronts** and curated brand pages.
- **The Bosianos Journal** — a rich editorial magazine.
- **Fully responsive** with a mobile bottom navigation and filter drawer.
- **Accessibility** — skip links, focus rings, ARIA labeling, keyboard navigation, and reduced-motion support.

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router)
- TypeScript
- Tailwind CSS
- [Zustand](https://github.com/pmndrs/zustand) for persisted client state (cart, wishlist, compare, loyalty)
- [Framer Motion](https://www.framer.com/motion/) for animation
- [lucide-react](https://lucide.dev/) icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the project |

## Design system

All imagery is rendered through a curated **Unsplash photography library** (`src/lib/images.ts`) mapped to products, designers, campaigns, and editorial — in the visual language of Nordstrom, Neiman Marcus, SSENSE, NET-A-PORTER, Massimo Dutti / COS, and Banana Republic lifestyle campaigns. The `Media` component resolves any seed to a real photo via `next/image`.

## Project structure

```
src/
├── app/                # App Router routes (home, shop, product, checkout, account, designers, journal, rewards, about)
├── components/         # UI, layout, product, cart, search, checkout, account, home components
├── lib/                # Data (products, brands, journal, orders), search engine, types, utils
└── store/              # Zustand stores (persisted commerce state + ephemeral UI state)
```

## Note

This is a front-end reference experience with realistic mock data. Payments, authentication, and AI/ML features (virtual try-on rendering, semantic embeddings) are simulated to demonstrate the intended UX.
