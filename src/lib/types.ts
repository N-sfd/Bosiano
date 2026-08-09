import type { ProductBranding } from "./branding";

export type { ProductBranding };

export type Currency = "USD";

export interface ProductColor {
  id: string;
  label: string;
  swatch: string;
}

export type ProductImageRole =
  | "hero"
  | "front"
  | "angle"
  | "side"
  | "back"
  | "detail"
  | "hardware"
  | "leather"
  | "interior"
  | "lifestyle"
  | "view";

export type ProductImageView =
  | "hero"
  | "folded"
  | "draped"
  | "worn"
  | "edge"
  | "label"
  | "packaging"
  | "angle"
  | "detail"
  | "front"
  | "side"
  | "back"
  | "interior"
  | "hardware";

export interface ProductImage {
  src: string;
  alt: string;
  role: ProductImageRole;
  /** Internal view label for metadata / a11y — not rendered on the PDP gallery */
  label?: string;
  /** Optional structured view tag (e.g. scarf: folded | draped | label) */
  view?: ProductImageView;
  /** Optional hi-res twin — must depict the exact same shot as src */
  zoomSrc?: string;
  /** Must match product.styleId for every colour variant frame */
  styleId: string;
  /** Physical design id shared by all colour variants (e.g. BCFB-01) */
  designId: string;
  /** Signature hardware id — must be stable within one SKU */
  hardwareId?: string;
  /** Owning product slug — must match the SKU these frames belong to */
  productSlug?: string;
  /** Colour / finish variant id (imagesByColor key) */
  variant?: string;
  /** Print / pattern identity — must be stable within one SKU */
  patternId?: string;
  /** Border construction identity — must be stable within one SKU */
  borderStyleId?: string;
}

export interface ProductVariant {
  id: string;
  /** Normalized colour id — matches imagesByColor keys (e.g. "optic-white") */
  colorId: string;
  /** Display label (e.g. "Optic White") */
  color: string;
  hex: string;
  images: string[];
  /** per-size live inventory */
  inventory: Record<string, number>;
}

export interface StoreLocation {
  id: string;
  name: string;
  city: string;
  stock: "in-stock" | "low" | "out";
}

export interface ModelMeasurements {
  height: string;
  bust: string;
  waist: string;
  hips: string;
  sizeWorn: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brandId: string;
  category: string;
  subcategory: string;
  /** Fine-grained type for gallery integrity checks (e.g. heeled-mule, ring) */
  productType: string;
  /** Stable design/model id — all colour variants of this SKU must share it */
  styleId: string;
  gender: "women" | "men" | "unisex";
  price: number;
  compareAtPrice?: number;
  currency: Currency;
  description: string;
  details: string[];
  materials: string;
  /** Structured material facets for filters / NL search */
  materialTags: string[];
  care: string;
  sizes: string[];
  /** Normalised colour list — id is the single key used for swatches + galleries */
  colors: ProductColor[];
  /** Default colour id — drives card + initial PDP gallery */
  defaultColor: string;
  /** Default-colour gallery (same as imagesByColor[defaultColor]) */
  images: ProductImage[];
  /** Per-colour galleries — PDP must use imagesByColor[selectedColor] only */
  imagesByColor: Record<string, ProductImage[]>;
  variants: ProductVariant[];
  /** Primary shop-card image — defaultColor hero / first variant gallery[0] */
  cardImage: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  /** semantic keywords powering AI search + "shop the look" */
  vibe: string[];
  occasions: string[];
  countryOfOrigin: string;
  barcode: string;
  modelMeasurements?: ModelMeasurements;
  stores: StoreLocation[];
  /** Quiet-luxury branding metadata — never drives flat PNG overlays on cards */
  branding: ProductBranding;
  isNew?: boolean;
  isExclusive?: boolean;
  isSustainable?: boolean;
  isPreorder?: boolean;
  sameDayEligible?: boolean;
  /** 360 spin frames (falls back to variant images) */
  spin?: string[];
  video?: string;
}

export interface ProductQuestion {
  id: string;
  productId: string;
  author: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  date: string;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  origin: string;
  since: number;
  hero: string;
  logotype: string;
  bio: string;
  featured?: boolean;
  collections?: string[];
  sustainability?: string;
  videoSeed?: string;
  relatedBrandIds?: string[];
}

export interface JournalArticle {
  slug: string;
  title: string;
  dek: string;
  category: string;
  author: string;
  readTime: number;
  date: string;
  hero: string;
  body: string[];
  featured?: boolean;
  productIds: string[];
  brandId?: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  fit: "small" | "true" | "large";
  verified: boolean;
}

export interface NavColumn {
  heading: string;
  links: { label: string; href: string }[];
}

export interface NavItem {
  label: string;
  href: string;
  columns?: NavColumn[];
  featured?: { title: string; image: string; href: string; caption: string }[];
}

export interface CartLine {
  productId: string;
  variantId: string;
  size: string;
  quantity: number;
}

export type LookSource = "campaign" | "editorial" | "influencer" | "runway" | "customer";

export type LookCategory = "clothing" | "shoes" | "bags" | "accessories";

export interface LookHotspot {
  id: string;
  productId: string;
  label: string;
  category: LookCategory;
  /** percent positions on the look image */
  x: number;
  y: number;
}

export interface ShopLook {
  id: string;
  slug: string;
  title: string;
  dek: string;
  source: LookSource;
  sourceLabel: string;
  hero: string;
  swatches: string[];
  occasion: string[];
  climate?: string;
  tags: string[];
  hotspots: LookHotspot[];
  video?: boolean;
  featured?: boolean;
}

export interface StyleProfile {
  sizes: {
    tops: string;
    bottoms: string;
    shoes: string;
  };
  preferredDesigners: string[];
  favoriteColors: string[];
  budget: number;
  occasions: string[];
  climate: string;
  location: string;
  bodyNotes: string;
  styleTags: string[];
  preferredFits: ("snug" | "regular" | "relaxed")[];
  preferredCategories: string[];
  sustainabilityPreference: "any" | "prefer" | "require";
  quizCompletedAt?: number;
  onboardingComplete?: boolean;
}

export interface BodyProfile {
  heightCm: number;
  weightKg: number;
  bodyType: "Petite" | "Regular" | "Tall" | "Curvy" | "Athletic";
  bustCm?: number;
  waistCm?: number;
  hipsCm?: number;
  shoeEu?: string;
}

export interface WishlistList {
  id: string;
  name: string;
  visibility: "private" | "public";
  productIds: string[];
  /** snapshot prices when item was saved — for price-drop detection */
  priceAtSave: Record<string, number>;
  alerts: {
    priceDrop: boolean;
    lowStock: boolean;
    backInStock: boolean;
  };
  shareToken?: string;
  createdAt: number;
}

export interface NotificationPrefs {
  emailNewArrivals: boolean;
  emailWishlistPriceDrops: boolean;
  emailEditorsPicks: boolean;
  personalizeHomepage: boolean;
  smsDelivery: boolean;
  pushStyleSuggestions: boolean;
  pushLowStock: boolean;
  pushBackInStock: boolean;
}

export interface WardrobeItem {
  productId: string;
  addedAt: number;
  source: "purchase" | "try-on" | "manual" | "external" | "upload" | "combination";
  notes?: string;
  photoLabel?: string;
}

export interface PointsLedgerEntry {
  id: string;
  label: string;
  delta: number;
  at: number;
  expiresAt?: number;
}

export interface ReferralRecord {
  id: string;
  friendName: string;
  status: "pending" | "purchased" | "rewarded";
  reward: number;
  at: number;
}

export interface MembershipSubscription {
  planId: string;
  startedAt: number;
  active: boolean;
}

export interface SavedAddress {
  id: string;
  label: string;
  line1: string;
  city: string;
  postcode: string;
  country: string;
  isDefault?: boolean;
}

export interface SavedPayment {
  id: string;
  brand: string;
  last4: string;
  exp: string;
  isDefault?: boolean;
}

export interface Appointment {
  id: string;
  title: string;
  when: string;
  location: string;
  status: "upcoming" | "completed" | "cancelled";
  type: "virtual" | "in-store" | "occasion" | "wardrobe" | "gift";
  stylistId: string;
  notes?: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: "open" | "pending" | "resolved";
  updatedAt: string;
  channel?: string;
  privateClient?: boolean;
}

export interface CareBooking {
  id: string;
  serviceId: string;
  pickupSlot: string;
  notes?: string;
  status: "scheduled" | "in-progress" | "ready" | "delivered";
  createdAt: number;
}

export interface StoreReservation {
  id: string;
  storeId: string;
  productId: string;
  size: string;
  status: "reserved" | "picked-up" | "cancelled";
  createdAt: number;
}

export interface FittingBooking {
  id: string;
  storeId: string;
  slot: string;
  status: "booked" | "completed" | "cancelled";
}

export interface MobilePrefs {
  biometricLogin: boolean;
  pushEnabled: boolean;
  locationDelivery: boolean;
  offlineWishlist: boolean;
  walletPass: boolean;
}

export interface CommunityUser {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  bio: string;
}

export interface UgcPost {
  id: string;
  userId: string;
  photo: string;
  caption: string;
  tip?: string;
  fitNote?: string;
  productIds: string[];
  likes: number;
  approved: boolean;
  createdAt: number;
  reported?: boolean;
}

export interface OutfitBoard {
  id: string;
  title: string;
  visibility: "private" | "public";
  productIds: string[];
  postIds: string[];
  shareToken?: string;
  createdAt: number;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  itemNames: string[];
  reason: string;
  resolution: "refund" | "exchange" | "credit";
  exchangeSize?: string;
  exchangeColor?: string;
  photos: string[];
  refundMethod: "original" | "credit" | "gift-card";
  pickupScheduled?: string;
  labelId: string;
  status: "submitted" | "label-ready" | "pickup-scheduled" | "in-transit" | "received" | "refunded" | "exchanged";
  creditAmount?: number;
  createdAt: number;
  timeline: { label: string; done: boolean; at?: string }[];
}

export interface LiveEvent {
  id: string;
  slug: string;
  title: string;
  host: string;
  hostRole: string;
  status: "live" | "upcoming" | "replay";
  startsAt: string;
  durationMin: number;
  viewers?: number;
  hero: string;
  description: string;
  productIds: string[];
  designerId?: string;
}

export interface StylistProfile {
  id: string;
  name: string;
  title: string;
  bio: string;
  specialties: string[];
  languages: string[];
  avatar: string;
  rating: number;
  availableSlots: string[];
}

export interface SavedLookState {
  lookId: string;
  /** productId overrides keyed by hotspot id */
  replacements: Record<string, string>;
  savedAt: number;
}

export interface SavedCart {
  id: string;
  name: string;
  createdAt: number;
  lines: CartLine[];
}

export interface Order {
  id: string;
  date: string;
  status: "processing" | "shipped" | "out-for-delivery" | "delivered";
  total: number;
  items: { name: string; brand: string; image: string; price: number; qty: number; size: string }[];
  timeline: { label: string; date: string; done: boolean }[];
  tracking: string;
  eta: string;
  address: string;
}

/** Merchandising / admin overlays */
export type MerchBadgeId =
  | "sale"
  | "new"
  | "exclusive"
  | "conscious"
  | "limited"
  | "trending"
  | "editors-pick";

export interface CuratedCollection {
  id: string;
  title: string;
  slug: string;
  description: string;
  productIds: string[];
  published: boolean;
  createdAt: number;
}

export interface MerchCampaign {
  id: string;
  name: string;
  channel: "email" | "site" | "push" | "social";
  status: "draft" | "scheduled" | "live" | "ended";
  startsAt: string;
  endsAt: string;
  productIds: string[];
  note?: string;
}

export interface AdminPromotion {
  id: string;
  code: string;
  label: string;
  type: "percent" | "fixed" | "shipping";
  value: number;
  active: boolean;
  /** ISO region codes / city labels for geo promos */
  regions: string[];
  minSpend?: number;
  endsAt?: string;
}

export interface LandingPageDraft {
  id: string;
  title: string;
  slug: string;
  headline: string;
  cta: string;
  collectionId?: string;
  published: boolean;
}

export interface RecommendationConfig {
  similarWeight: number;
  trendingWeight: number;
  personalizedWeight: number;
  excludeOutOfStock: boolean;
}

export interface GiftCardRecord {
  id: string;
  code: string;
  balance: number;
  status: "active" | "redeemed" | "expired";
  issuedTo: string;
  createdAt: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  tier: string;
  orders: number;
  spend: number;
  joined: string;
  location: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  channel: "push" | "email" | "sms" | "in-app";
  audience: string;
  status: "draft" | "sent" | "scheduled";
  scheduledAt?: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  parent?: string;
  productCount: number;
  visible: boolean;
}

export interface AdminLookbookEdit {
  id: string;
  title: string;
  source: string;
  productCount: number;
  published: boolean;
  shoppable: boolean;
}

/** Designer / vendor portal */
export interface VendorProductDraft {
  id: string;
  brandId: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "draft" | "pending" | "live";
  createdAt: number;
}

export interface VendorOrderLine {
  id: string;
  brandId: string;
  orderId: string;
  productName: string;
  sku: string;
  qty: number;
  total: number;
  shipmentStatus: "unfulfilled" | "packed" | "shipped" | "delivered";
  date: string;
}

export interface VendorReturn {
  id: string;
  brandId: string;
  orderId: string;
  productName: string;
  reason: string;
  status: "open" | "approved" | "refunded" | "denied";
  createdAt: string;
}

export interface VendorCampaignSubmission {
  id: string;
  brandId: string;
  title: string;
  channel: string;
  assetsNote: string;
  status: "submitted" | "in-review" | "approved" | "rejected";
  submittedAt: string;
}

export interface VendorPayment {
  id: string;
  brandId: string;
  period: string;
  gross: number;
  fees: number;
  net: number;
  status: "pending" | "paid" | "on-hold";
  paidAt?: string;
}

export interface VendorSupportMessage {
  id: string;
  brandId: string;
  subject: string;
  body: string;
  status: "open" | "answered";
  createdAt: number;
}

/** Analytics event ledger (client-side demo) */
export interface AnalyticsEvent {
  id: string;
  type:
    | "search"
    | "zero-search"
    | "filter"
    | "wishlist"
    | "cart-add"
    | "cart-abandon"
    | "product-view"
    | "purchase"
    | "loyalty-join"
    | "return";
  label: string;
  meta?: string;
  at: number;
}
