"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CartLine,
  SavedCart,
  StyleProfile,
  SavedLookState,
  WishlistList,
  BodyProfile,
  NotificationPrefs,
  WardrobeItem,
  PointsLedgerEntry,
  ReferralRecord,
  MembershipSubscription,
  SavedAddress,
  SavedPayment,
  ReturnRequest,
  Appointment,
  CareBooking,
  StoreReservation,
  FittingBooking,
  SupportTicket,
  MobilePrefs,
  UgcPost,
  OutfitBoard,
  CuratedCollection,
  MerchCampaign,
  AdminPromotion,
  LandingPageDraft,
  RecommendationConfig,
  GiftCardRecord,
  AdminNotification,
  AdminCategory,
  AdminLookbookEdit,
  MerchBadgeId,
  Order,
  VendorProductDraft,
  VendorOrderLine,
  VendorReturn,
  VendorCampaignSubmission,
  VendorPayment,
  VendorSupportMessage,
  AnalyticsEvent,
} from "@/lib/types";
import {
  defaultStyleProfile,
  defaultBodyProfile,
  defaultNotificationPrefs,
  defaultWishlistLists,
} from "@/lib/stylist";
import { getProduct } from "@/lib/products";
import { REFERRAL_REWARD } from "@/lib/club";
import { seedUgcPosts, defaultOutfitBoards } from "@/lib/community";
import {
  defaultCampaigns,
  defaultCategories,
  defaultCollections,
  defaultGiftCards,
  defaultLandingPages,
  defaultLookbookEdits,
  defaultLowStockThresholds,
  defaultNotifications,
  defaultPinnedIds,
  defaultPromotions,
  defaultRecommendationConfig,
  defaultRestockDates,
} from "@/lib/admin";
import { orders as seedOrders } from "@/lib/orders";
import {
  defaultVendorBrandId,
  defaultVendorCampaigns,
  defaultVendorOrders,
  defaultVendorPayments,
  defaultVendorProducts,
  defaultVendorReturns,
} from "@/lib/vendor";
import { seedAnalyticsEvents } from "@/lib/analytics";

function syncFavorites(wishlists: WishlistList[], legacyIds?: string[]): { wishlists: WishlistList[]; wishlist: string[] } {
  let lists = wishlists.length ? wishlists : defaultWishlistLists();
  if (legacyIds?.length) {
    lists = lists.map((l) =>
      l.id === "favorites"
        ? {
            ...l,
            productIds: [...new Set([...legacyIds, ...l.productIds])],
            priceAtSave: {
              ...l.priceAtSave,
              ...Object.fromEntries(
                legacyIds.map((id) => [id, l.priceAtSave[id] ?? getProduct(id)?.price ?? 0])
              ),
            },
          }
        : l
    );
  }
  const favorites = lists.find((l) => l.id === "favorites") ?? lists[0];
  return { wishlists: lists, wishlist: favorites?.productIds ?? [] };
}

interface StoreState {
  cart: CartLine[];
  /** Flat Favorites ids — kept in sync for existing hearts / rails */
  wishlist: string[];
  wishlists: WishlistList[];
  compare: string[];
  recentlyViewed: string[];
  recentSearches: string[];
  notifyList: string[];
  savedLooks: SavedLookState[];
  styleProfile: StyleProfile;
  bodyProfile: BodyProfile;
  notificationPrefs: NotificationPrefs;
  wardrobe: WardrobeItem[];
  savedCarts: SavedCart[];
  savedForLater: CartLine[];
  loyaltyPoints: number;
  pointsHistory: PointsLedgerEntry[];
  referralCode: string;
  referrals: ReferralRecord[];
  memberships: MembershipSubscription[];
  giftCardBalance: number;
  storeCredit: number;
  savedAddresses: SavedAddress[];
  savedPayments: SavedPayment[];
  checkoutGiftWrap: boolean;
  checkoutGiftMessage: string;
  followedDesigners: string[];
  designerAlerts: boolean;
  savedLiveEvents: string[];
  returns: ReturnRequest[];
  appointments: Appointment[];
  sharedBoards: { id: string; title: string; productIds: string[]; appointmentId?: string }[];
  supportTickets: SupportTicket[];
  careBookings: CareBooking[];
  storeReservations: StoreReservation[];
  fittingBookings: FittingBooking[];
  mobilePrefs: MobilePrefs;
  appOffersSeen: string[];
  ugcPosts: UgcPost[];
  followedUsers: string[];
  likedPosts: string[];
  savedUgc: string[];
  outfitBoards: OutfitBoard[];

  /** Admin / merchandising */
  pinnedProductIds: string[];
  productBadges: Record<string, MerchBadgeId[]>;
  curatedCollections: CuratedCollection[];
  campaigns: MerchCampaign[];
  promotions: AdminPromotion[];
  landingPages: LandingPageDraft[];
  recommendationConfig: RecommendationConfig;
  restockDates: Record<string, string>;
  lowStockThresholds: Record<string, number>;
  giftCardsAdmin: GiftCardRecord[];
  adminNotifications: AdminNotification[];
  adminCategories: AdminCategory[];
  adminLookbooks: AdminLookbookEdit[];
  adminOrders: Order[];
  editorialPublished: Record<string, boolean>;
  designerPublished: Record<string, boolean>;
  storePublished: Record<string, boolean>;
  stylistActive: Record<string, boolean>;
  reviewModeration: Record<string, "approved" | "hidden" | "flagged">;
  loyaltyMultiplierOverride: number;

  /** Vendor portal */
  vendorBrandId: string;
  vendorProducts: VendorProductDraft[];
  vendorInventory: Record<string, number>;
  vendorOrders: VendorOrderLine[];
  vendorReturns: VendorReturn[];
  vendorCampaigns: VendorCampaignSubmission[];
  vendorPayments: VendorPayment[];
  vendorSupport: VendorSupportMessage[];

  /** Analytics events */
  analyticsEvents: AnalyticsEvent[];

  addToCart: (line: CartLine) => void;
  removeFromCart: (variantId: string, size: string) => void;
  setQuantity: (variantId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  saveForLater: (variantId: string, size: string) => void;
  moveSavedToCart: (variantId: string, size: string) => void;
  removeSavedForLater: (variantId: string, size: string) => void;

  toggleWishlist: (productId: string, listId?: string) => void;
  addToWishlistList: (productId: string, listId: string) => void;
  removeFromWishlistList: (productId: string, listId: string) => void;
  moveWishlistItem: (productId: string, fromListId: string, toListId: string) => void;
  setWishlistVisibility: (listId: string, visibility: "private" | "public") => void;
  setWishlistAlerts: (listId: string, alerts: Partial<WishlistList["alerts"]>) => void;
  shareWishlist: (listId: string) => string;
  moveWishlistListToCart: (listId: string) => void;

  toggleCompare: (productId: string) => void;
  clearCompare: () => void;

  viewProduct: (productId: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  toggleNotify: (productId: string) => void;

  saveLook: (lookId: string, replacements?: Record<string, string>) => void;
  unsaveLook: (lookId: string) => void;
  updateStyleProfile: (patch: Partial<StyleProfile>) => void;
  completeOnboarding: (profile: Partial<StyleProfile>) => void;
  updateBodyProfile: (patch: Partial<BodyProfile>) => void;
  setNotificationPrefs: (patch: Partial<NotificationPrefs>) => void;

  addToWardrobe: (
    productId: string,
    source?: WardrobeItem["source"],
    notes?: string,
    photoLabel?: string
  ) => void;
  removeFromWardrobe: (productId: string) => void;

  saveCart: (name: string) => void;
  restoreCart: (id: string) => void;
  deleteSavedCart: (id: string) => void;

  addPoints: (n: number, label?: string) => void;
  redeemPoints: (n: number, label?: string) => boolean;
  applyReferralPurchase: (friendName: string) => void;
  subscribeMembership: (planId: string) => void;
  cancelMembership: (planId: string) => void;
  setCheckoutGift: (wrap: boolean, message?: string) => void;
  applyGiftCard: (amount: number) => void;
  applyStoreCredit: (amount: number) => void;

  toggleFollowDesigner: (brandId: string) => void;
  setDesignerAlerts: (on: boolean) => void;
  toggleSaveLiveEvent: (eventId: string) => void;
  submitReturn: (payload: Omit<ReturnRequest, "id" | "createdAt" | "timeline" | "labelId" | "status">) => ReturnRequest;
  scheduleReturnPickup: (returnId: string, when: string) => void;
  bookAppointment: (appt: Omit<Appointment, "id" | "status">) => void;
  cancelAppointment: (id: string) => void;
  addToSharedBoard: (title: string, productId: string, appointmentId?: string) => void;

  openSupportTicket: (subject: string, channel: string, privateClient?: boolean) => void;
  bookCareService: (serviceId: string, pickupSlot: string, notes?: string) => void;
  reserveInStore: (storeId: string, productId: string, size: string) => void;
  bookFittingRoom: (storeId: string, slot: string) => void;
  setMobilePrefs: (patch: Partial<MobilePrefs>) => void;
  claimAppOffer: (offerId: string) => void;

  uploadUgc: (payload: {
    photo: string;
    caption: string;
    tip?: string;
    fitNote?: string;
    productIds: string[];
  }) => void;
  toggleFollowUser: (userId: string) => void;
  toggleLikePost: (postId: string) => void;
  toggleSaveUgc: (postId: string) => void;
  reportUgc: (postId: string) => void;
  createOutfitBoard: (title: string) => void;
  addToOutfitBoard: (boardId: string, productId?: string, postId?: string) => void;
  shareOutfitBoard: (boardId: string) => string;
  setBoardVisibility: (boardId: string, visibility: "private" | "public") => void;

  togglePinProduct: (productId: string) => void;
  setProductBadges: (productId: string, badges: MerchBadgeId[]) => void;
  createCollection: (title: string, description?: string) => void;
  updateCollection: (id: string, patch: Partial<CuratedCollection>) => void;
  toggleCollectionProduct: (collectionId: string, productId: string) => void;
  scheduleCampaign: (payload: Omit<MerchCampaign, "id" | "status"> & { status?: MerchCampaign["status"] }) => void;
  setCampaignStatus: (id: string, status: MerchCampaign["status"]) => void;
  upsertPromotion: (promo: Omit<AdminPromotion, "id"> & { id?: string }) => void;
  togglePromotion: (id: string) => void;
  createLandingPage: (title: string) => void;
  setLandingPublished: (id: string, published: boolean) => void;
  setRecommendationConfig: (patch: Partial<RecommendationConfig>) => void;
  setRestockDate: (productId: string, date: string) => void;
  setLowStockThreshold: (productId: string, threshold: number) => void;
  issueGiftCard: (issuedTo: string, balance: number) => void;
  setAdminNotificationStatus: (id: string, status: AdminNotification["status"]) => void;
  toggleCategoryVisible: (id: string) => void;
  setLookbookShoppable: (id: string, shoppable: boolean) => void;
  setLookbookPublished: (id: string, published: boolean) => void;
  setOrderStatus: (id: string, status: Order["status"]) => void;
  setEditorialPublished: (slug: string, published: boolean) => void;
  setDesignerPublished: (id: string, published: boolean) => void;
  setStorePublished: (id: string, published: boolean) => void;
  setStylistActive: (id: string, active: boolean) => void;
  setReviewModeration: (id: string, status: "approved" | "hidden" | "flagged") => void;
  setLoyaltyMultiplier: (n: number) => void;
  resolveSupportTicketAdmin: (id: string) => void;

  setVendorBrand: (brandId: string) => void;
  addVendorProduct: (payload: {
    name: string;
    category: string;
    price: number;
    stock: number;
  }) => void;
  setVendorProductStatus: (id: string, status: VendorProductDraft["status"]) => void;
  setVendorInventory: (productId: string, stock: number) => void;
  setVendorShipmentStatus: (id: string, status: VendorOrderLine["shipmentStatus"]) => void;
  setVendorReturnStatus: (id: string, status: VendorReturn["status"]) => void;
  submitVendorCampaign: (title: string, channel: string, assetsNote: string) => void;
  contactVendorSupport: (subject: string, body: string) => void;

  trackAnalytics: (type: AnalyticsEvent["type"], label: string, meta?: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      wishlists: defaultWishlistLists(),
      compare: [],
      recentlyViewed: [],
      recentSearches: [],
      notifyList: [],
      savedLooks: [],
      styleProfile: defaultStyleProfile,
      bodyProfile: defaultBodyProfile,
      notificationPrefs: defaultNotificationPrefs,
      wardrobe: [],
      savedCarts: [],
      savedForLater: [],
      loyaltyPoints: 2480,
      pointsHistory: [
        { id: "ph1", label: "Welcome reward", delta: 250, at: Date.now() - 86400000 * 40 },
        { id: "ph2", label: "Order #BSN-48291", delta: 890, at: Date.now() - 86400000 * 18 },
        { id: "ph3", label: "Birthday reward", delta: 200, at: Date.now() - 86400000 * 12, expiresAt: Date.now() + 86400000 * 50 },
        { id: "ph4", label: "Order #BSN-49102", delta: 1140, at: Date.now() - 86400000 * 4 },
      ],
      referralCode: "AMELIA25",
      referrals: [
        { id: "ref1", friendName: "Sofia M.", status: "rewarded", reward: 50, at: Date.now() - 86400000 * 21 },
        { id: "ref2", friendName: "James K.", status: "purchased", reward: 50, at: Date.now() - 86400000 * 6 },
        { id: "ref3", friendName: "Priya N.", status: "pending", reward: 50, at: Date.now() - 86400000 * 2 },
      ],
      memberships: [],
      giftCardBalance: 75,
      storeCredit: 40,
      savedAddresses: [
        {
          id: "addr1",
          label: "Home",
          line1: "14 Belgrave Place",
          city: "London",
          postcode: "SW1X 8AA",
          country: "United Kingdom",
          isDefault: true,
        },
      ],
      savedPayments: [
        { id: "pay1", brand: "Visa", last4: "4242", exp: "08/28", isDefault: true },
      ],
      checkoutGiftWrap: false,
      checkoutGiftMessage: "",
      followedDesigners: ["maison-verane", "sanso"],
      designerAlerts: true,
      savedLiveEvents: ["live-3"],
      returns: [],
      appointments: [
        {
          id: "appt-1",
          title: "Seasonal wardrobe consult",
          when: "Fri 7 Aug · 11:00",
          location: "Virtual",
          status: "upcoming",
          type: "wardrobe",
          stylistId: "stylist-sofie",
        },
      ],
      sharedBoards: [
        {
          id: "board-1",
          title: "Autumn work edit",
          productIds: ["sculpted-wool-blazer", "structured-leather-tote"],
          appointmentId: "appt-1",
        },
      ],
      supportTickets: [
        { id: "SUP-2041", subject: "Return label reprint", status: "pending", updatedAt: "Yesterday", channel: "chat" },
      ],
      careBookings: [],
      storeReservations: [],
      fittingBookings: [],
      mobilePrefs: {
        biometricLogin: true,
        pushEnabled: true,
        locationDelivery: true,
        offlineWishlist: true,
        walletPass: false,
      },
      appOffersSeen: [],
      ugcPosts: seedUgcPosts,
      followedUsers: ["user-sofia"],
      likedPosts: [],
      savedUgc: [],
      outfitBoards: defaultOutfitBoards(),

      pinnedProductIds: defaultPinnedIds(),
      productBadges: {},
      curatedCollections: defaultCollections(),
      campaigns: defaultCampaigns(),
      promotions: defaultPromotions(),
      landingPages: defaultLandingPages(),
      recommendationConfig: defaultRecommendationConfig(),
      restockDates: defaultRestockDates(),
      lowStockThresholds: defaultLowStockThresholds(),
      giftCardsAdmin: defaultGiftCards(),
      adminNotifications: defaultNotifications(),
      adminCategories: defaultCategories(),
      adminLookbooks: defaultLookbookEdits(),
      adminOrders: seedOrders,
      editorialPublished: {},
      designerPublished: {},
      storePublished: {},
      stylistActive: {},
      reviewModeration: {},
      loyaltyMultiplierOverride: 1,

      vendorBrandId: defaultVendorBrandId(),
      vendorProducts: defaultVendorProducts(),
      vendorInventory: {},
      vendorOrders: defaultVendorOrders(),
      vendorReturns: defaultVendorReturns(),
      vendorCampaigns: defaultVendorCampaigns(),
      vendorPayments: defaultVendorPayments(),
      vendorSupport: [],

      analyticsEvents: seedAnalyticsEvents(),

      addToCart: (line) =>
        set((s) => {
          const existing = s.cart.find((l) => l.variantId === line.variantId && l.size === line.size);
          const event: AnalyticsEvent = {
            id: `ae-${Date.now()}`,
            type: "cart-add",
            label: line.productId,
            at: Date.now(),
          };
          if (existing) {
            return {
              cart: s.cart.map((l) =>
                l.variantId === line.variantId && l.size === line.size
                  ? { ...l, quantity: l.quantity + line.quantity }
                  : l
              ),
              analyticsEvents: [event, ...s.analyticsEvents].slice(0, 200),
            };
          }
          return {
            cart: [...s.cart, line],
            analyticsEvents: [event, ...s.analyticsEvents].slice(0, 200),
          };
        }),

      removeFromCart: (variantId, size) =>
        set((s) => ({
          cart: s.cart.filter((l) => !(l.variantId === variantId && l.size === size)),
        })),

      setQuantity: (variantId, size, quantity) =>
        set((s) => ({
          cart: s.cart
            .map((l) => (l.variantId === variantId && l.size === size ? { ...l, quantity } : l))
            .filter((l) => l.quantity > 0),
        })),

      clearCart: () =>
        set((s) => ({
          cart: [],
          analyticsEvents:
            s.cart.length > 0
              ? [
                  {
                    id: `ae-${Date.now()}`,
                    type: "cart-abandon" as const,
                    label: `session-${Date.now().toString().slice(-4)}`,
                    meta: `${s.cart.length} items`,
                    at: Date.now(),
                  },
                  ...s.analyticsEvents,
                ].slice(0, 200)
              : s.analyticsEvents,
        })),

      saveForLater: (variantId, size) =>
        set((s) => {
          const line = s.cart.find((l) => l.variantId === variantId && l.size === size);
          if (!line) return s;
          return {
            cart: s.cart.filter((l) => !(l.variantId === variantId && l.size === size)),
            savedForLater: [line, ...s.savedForLater.filter((l) => !(l.variantId === variantId && l.size === size))],
          };
        }),

      moveSavedToCart: (variantId, size) =>
        set((s) => {
          const line = s.savedForLater.find((l) => l.variantId === variantId && l.size === size);
          if (!line) return s;
          const existing = s.cart.find((l) => l.variantId === variantId && l.size === size);
          return {
            savedForLater: s.savedForLater.filter((l) => !(l.variantId === variantId && l.size === size)),
            cart: existing
              ? s.cart.map((l) =>
                  l.variantId === variantId && l.size === size
                    ? { ...l, quantity: l.quantity + line.quantity }
                    : l
                )
              : [...s.cart, line],
          };
        }),

      removeSavedForLater: (variantId, size) =>
        set((s) => ({
          savedForLater: s.savedForLater.filter((l) => !(l.variantId === variantId && l.size === size)),
        })),

      toggleWishlist: (productId, listId = "favorites") =>
        set((s) => {
          const synced = syncFavorites(s.wishlists, s.wishlist);
          const target = synced.wishlists.find((l) => l.id === listId);
          const has = target?.productIds.includes(productId) ?? false;
          const lists = synced.wishlists.map((l) => {
            if (l.id !== listId) return l;
            if (has) {
              const { [productId]: _, ...priceAtSave } = l.priceAtSave;
              return { ...l, productIds: l.productIds.filter((id) => id !== productId), priceAtSave };
            }
            const price = getProduct(productId)?.price ?? 0;
            return {
              ...l,
              productIds: [productId, ...l.productIds],
              priceAtSave: { ...l.priceAtSave, [productId]: price },
            };
          });
          const next = syncFavorites(lists);
          return {
            ...next,
            analyticsEvents: [
              {
                id: `ae-${Date.now()}`,
                type: "wishlist" as const,
                label: `${has ? "remove" : "add"}:${productId}`,
                at: Date.now(),
              },
              ...s.analyticsEvents,
            ].slice(0, 200),
          };
        }),

      addToWishlistList: (productId, listId) =>
        set((s) => {
          const lists = s.wishlists.map((l) => {
            if (l.id !== listId || l.productIds.includes(productId)) return l;
            return {
              ...l,
              productIds: [productId, ...l.productIds],
              priceAtSave: { ...l.priceAtSave, [productId]: getProduct(productId)?.price ?? 0 },
            };
          });
          return syncFavorites(lists, s.wishlist);
        }),

      removeFromWishlistList: (productId, listId) =>
        set((s) => {
          const lists = s.wishlists.map((l) => {
            if (l.id !== listId) return l;
            const { [productId]: _, ...priceAtSave } = l.priceAtSave;
            return { ...l, productIds: l.productIds.filter((id) => id !== productId), priceAtSave };
          });
          return syncFavorites(lists);
        }),

      moveWishlistItem: (productId, fromListId, toListId) => {
        get().removeFromWishlistList(productId, fromListId);
        get().addToWishlistList(productId, toListId);
      },

      setWishlistVisibility: (listId, visibility) =>
        set((s) => ({
          wishlists: s.wishlists.map((l) => (l.id === listId ? { ...l, visibility } : l)),
        })),

      setWishlistAlerts: (listId, alerts) =>
        set((s) => ({
          wishlists: s.wishlists.map((l) =>
            l.id === listId ? { ...l, alerts: { ...l.alerts, ...alerts } } : l
          ),
        })),

      shareWishlist: (listId) => {
        const token = `wl_${listId}_${Math.random().toString(36).slice(2, 8)}`;
        set((s) => ({
          wishlists: s.wishlists.map((l) =>
            l.id === listId ? { ...l, shareToken: token, visibility: "public" as const } : l
          ),
        }));
        return token;
      },

      moveWishlistListToCart: (listId) => {
        const list = get().wishlists.find((l) => l.id === listId);
        if (!list) return;
        list.productIds.forEach((id) => {
          const p = getProduct(id);
          if (!p) return;
          const size =
            p.sizes.find((s) => s === get().styleProfile.sizes.tops || s === get().styleProfile.sizes.bottoms) ||
            p.sizes[0];
          if (!size) return;
          get().addToCart({
            productId: p.id,
            variantId: p.variants[0].id,
            size,
            quantity: 1,
          });
        });
      },

      toggleCompare: (productId) =>
        set((s) => {
          if (s.compare.includes(productId)) {
            return { compare: s.compare.filter((id) => id !== productId) };
          }
          if (s.compare.length >= 4) return s;
          return { compare: [...s.compare, productId] };
        }),

      clearCompare: () => set({ compare: [] }),

      viewProduct: (productId) =>
        set((s) => ({
          recentlyViewed: [productId, ...s.recentlyViewed.filter((id) => id !== productId)].slice(0, 12),
          analyticsEvents: [
            { id: `ae-${Date.now()}`, type: "product-view" as const, label: productId, at: Date.now() },
            ...s.analyticsEvents,
          ].slice(0, 200),
        })),

      addRecentSearch: (query) =>
        set((s) => {
          const q = query.trim();
          if (!q) return s;
          return {
            recentSearches: [q, ...s.recentSearches.filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 8),
            analyticsEvents: [
              { id: `ae-${Date.now()}`, type: "search" as const, label: q, at: Date.now() },
              ...s.analyticsEvents,
            ].slice(0, 200),
          };
        }),

      clearRecentSearches: () => set({ recentSearches: [] }),

      toggleNotify: (productId) =>
        set((s) => ({
          notifyList: s.notifyList.includes(productId)
            ? s.notifyList.filter((id) => id !== productId)
            : [productId, ...s.notifyList],
        })),

      saveLook: (lookId, replacements = {}) =>
        set((s) => {
          const next: SavedLookState = { lookId, replacements, savedAt: Date.now() };
          return {
            savedLooks: [next, ...s.savedLooks.filter((l) => l.lookId !== lookId)].slice(0, 24),
          };
        }),

      unsaveLook: (lookId) =>
        set((s) => ({ savedLooks: s.savedLooks.filter((l) => l.lookId !== lookId) })),

      updateStyleProfile: (patch) =>
        set((s) => ({
          styleProfile: {
            ...s.styleProfile,
            ...patch,
            sizes: { ...s.styleProfile.sizes, ...(patch.sizes ?? {}) },
          },
        })),

      completeOnboarding: (profile) =>
        set((s) => ({
          styleProfile: {
            ...s.styleProfile,
            ...profile,
            sizes: { ...s.styleProfile.sizes, ...(profile.sizes ?? {}) },
            onboardingComplete: true,
            quizCompletedAt: Date.now(),
          },
        })),

      updateBodyProfile: (patch) =>
        set((s) => ({ bodyProfile: { ...s.bodyProfile, ...patch } })),

      setNotificationPrefs: (patch) =>
        set((s) => ({ notificationPrefs: { ...s.notificationPrefs, ...patch } })),

      addToWardrobe: (productId, source = "manual", notes, photoLabel) =>
        set((s) => {
          if (s.wardrobe.some((w) => w.productId === productId)) return s;
          return {
            wardrobe: [{ productId, addedAt: Date.now(), source, notes, photoLabel }, ...s.wardrobe].slice(0, 64),
          };
        }),

      removeFromWardrobe: (productId) =>
        set((s) => ({ wardrobe: s.wardrobe.filter((w) => w.productId !== productId) })),

      saveCart: (name) =>
        set((s) => {
          if (s.cart.length === 0) return s;
          const saved: SavedCart = {
            id: `saved-${Date.now()}`,
            name,
            createdAt: Date.now(),
            lines: s.cart,
          };
          return { savedCarts: [saved, ...s.savedCarts], cart: [] };
        }),

      restoreCart: (id) =>
        set((s) => {
          const saved = s.savedCarts.find((c) => c.id === id);
          if (!saved) return s;
          const merged = [...s.cart];
          saved.lines.forEach((line) => {
            const existing = merged.find((l) => l.variantId === line.variantId && l.size === line.size);
            if (existing) existing.quantity += line.quantity;
            else merged.push({ ...line });
          });
          return {
            cart: merged,
            savedCarts: s.savedCarts.filter((c) => c.id !== id),
          };
        }),

      deleteSavedCart: (id) =>
        set((s) => ({ savedCarts: s.savedCarts.filter((c) => c.id !== id) })),

      addPoints: (n, label = "Purchase reward") =>
        set((s) => ({
          loyaltyPoints: s.loyaltyPoints + n,
          pointsHistory: [
            { id: `ph-${Date.now()}`, label, delta: n, at: Date.now(), expiresAt: Date.now() + 86400000 * 365 },
            ...s.pointsHistory,
          ].slice(0, 40),
        })),

      redeemPoints: (n, label = "Redeemed for credit") => {
        const s = get();
        if (n <= 0 || s.loyaltyPoints < n) return false;
        set({
          loyaltyPoints: s.loyaltyPoints - n,
          storeCredit: s.storeCredit + Math.round(n / 100),
          pointsHistory: [
            { id: `ph-${Date.now()}`, label, delta: -n, at: Date.now() },
            ...s.pointsHistory,
          ].slice(0, 40),
        });
        return true;
      },

      applyReferralPurchase: (friendName) =>
        set((s) => ({
          referrals: [
            {
              id: `ref-${Date.now()}`,
              friendName,
              status: "rewarded",
              reward: REFERRAL_REWARD,
              at: Date.now(),
            },
            ...s.referrals,
          ],
          loyaltyPoints: s.loyaltyPoints + REFERRAL_REWARD,
          pointsHistory: [
            {
              id: `ph-${Date.now()}`,
              label: `Referral — ${friendName}`,
              delta: REFERRAL_REWARD,
              at: Date.now(),
            },
            ...s.pointsHistory,
          ].slice(0, 40),
        })),

      subscribeMembership: (planId) =>
        set((s) => ({
          memberships: [
            { planId, startedAt: Date.now(), active: true },
            ...s.memberships.filter((m) => m.planId !== planId),
          ],
        })),

      cancelMembership: (planId) =>
        set((s) => ({
          memberships: s.memberships.map((m) =>
            m.planId === planId ? { ...m, active: false } : m
          ),
        })),

      setCheckoutGift: (wrap, message = "") =>
        set({ checkoutGiftWrap: wrap, checkoutGiftMessage: message }),

      applyGiftCard: (amount) =>
        set((s) => ({ giftCardBalance: Math.max(0, s.giftCardBalance - amount) })),

      applyStoreCredit: (amount) =>
        set((s) => ({ storeCredit: Math.max(0, s.storeCredit - amount) })),

      toggleFollowDesigner: (brandId) =>
        set((s) => ({
          followedDesigners: s.followedDesigners.includes(brandId)
            ? s.followedDesigners.filter((id) => id !== brandId)
            : [brandId, ...s.followedDesigners],
        })),

      setDesignerAlerts: (on) => set({ designerAlerts: on }),

      toggleSaveLiveEvent: (eventId) =>
        set((s) => ({
          savedLiveEvents: s.savedLiveEvents.includes(eventId)
            ? s.savedLiveEvents.filter((id) => id !== eventId)
            : [eventId, ...s.savedLiveEvents],
        })),

      submitReturn: (payload) => {
        const creditAmount =
          payload.resolution === "credit"
            ? Math.round(
                (payload.itemNames.length * 180 + (payload.refundMethod === "credit" ? 18 : 0))
              )
            : undefined;
        const ret: ReturnRequest = {
          ...payload,
          id: `RET-${Math.floor(10000 + Math.random() * 89999)}`,
          labelId: `LBL-${Math.floor(100000 + Math.random() * 899999)}`,
          status: payload.pickupScheduled ? "pickup-scheduled" : "label-ready",
          creditAmount,
          createdAt: Date.now(),
          timeline: [
            { label: "Return submitted", done: true, at: new Date().toLocaleString() },
            { label: "Label generated", done: true, at: new Date().toLocaleString() },
            { label: "Pickup / drop-off", done: Boolean(payload.pickupScheduled) },
            { label: "In transit", done: false },
            { label: "Received & inspected", done: false },
            {
              label:
                payload.resolution === "exchange"
                  ? "Exchange shipped"
                  : payload.resolution === "credit"
                    ? "Store credit issued"
                    : "Refund processed",
              done: false,
            },
          ],
        };
        set((s) => {
          const nextCredit =
            payload.resolution === "credit" && creditAmount
              ? s.storeCredit + creditAmount
              : s.storeCredit;
          return {
            returns: [ret, ...s.returns],
            storeCredit: nextCredit,
          };
        });
        return ret;
      },

      scheduleReturnPickup: (returnId, when) =>
        set((s) => ({
          returns: s.returns.map((r) =>
            r.id === returnId
              ? {
                  ...r,
                  pickupScheduled: when,
                  status: "pickup-scheduled",
                  timeline: r.timeline.map((t) =>
                    t.label.startsWith("Pickup") ? { ...t, done: true, at: when } : t
                  ),
                }
              : r
          ),
        })),

      bookAppointment: (appt) =>
        set((s) => ({
          appointments: [
            {
              ...appt,
              id: `appt-${Date.now()}`,
              status: "upcoming",
            },
            ...s.appointments,
          ],
        })),

      cancelAppointment: (id) =>
        set((s) => ({
          appointments: s.appointments.map((a) =>
            a.id === id ? { ...a, status: "cancelled" as const } : a
          ),
        })),

      addToSharedBoard: (title, productId, appointmentId) =>
        set((s) => {
          const existing = s.sharedBoards.find((b) => b.title === title);
          if (existing) {
            return {
              sharedBoards: s.sharedBoards.map((b) =>
                b.title === title
                  ? {
                      ...b,
                      productIds: b.productIds.includes(productId)
                        ? b.productIds
                        : [...b.productIds, productId],
                    }
                  : b
              ),
            };
          }
          return {
            sharedBoards: [
              {
                id: `board-${Date.now()}`,
                title,
                productIds: [productId],
                appointmentId,
              },
              ...s.sharedBoards,
            ],
          };
        }),

      openSupportTicket: (subject, channel, privateClient) =>
        set((s) => ({
          supportTickets: [
            {
              id: `SUP-${Math.floor(1000 + Math.random() * 9000)}`,
              subject,
              status: "open",
              updatedAt: "Just now",
              channel,
              privateClient,
            },
            ...s.supportTickets,
          ],
        })),

      bookCareService: (serviceId, pickupSlot, notes) =>
        set((s) => ({
          careBookings: [
            {
              id: `CARE-${Date.now().toString().slice(-6)}`,
              serviceId,
              pickupSlot,
              notes,
              status: "scheduled",
              createdAt: Date.now(),
            },
            ...s.careBookings,
          ],
        })),

      reserveInStore: (storeId, productId, size) =>
        set((s) => ({
          storeReservations: [
            {
              id: `RSV-${Date.now().toString().slice(-6)}`,
              storeId,
              productId,
              size,
              status: "reserved",
              createdAt: Date.now(),
            },
            ...s.storeReservations,
          ],
        })),

      bookFittingRoom: (storeId, slot) =>
        set((s) => ({
          fittingBookings: [
            { id: `FIT-${Date.now().toString().slice(-5)}`, storeId, slot, status: "booked" },
            ...s.fittingBookings,
          ],
        })),

      setMobilePrefs: (patch) =>
        set((s) => ({ mobilePrefs: { ...s.mobilePrefs, ...patch } })),

      claimAppOffer: (offerId) =>
        set((s) => ({
          appOffersSeen: s.appOffersSeen.includes(offerId)
            ? s.appOffersSeen
            : [...s.appOffersSeen, offerId],
        })),

      uploadUgc: (payload) =>
        set((s) => ({
          ugcPosts: [
            {
              id: `ugc-${Date.now()}`,
              userId: "user-amelia",
              photo: payload.photo,
              caption: payload.caption,
              tip: payload.tip,
              fitNote: payload.fitNote,
              productIds: payload.productIds,
              likes: 0,
              approved: true,
              createdAt: Date.now(),
            },
            ...s.ugcPosts,
          ].slice(0, 48),
        })),

      toggleFollowUser: (userId) =>
        set((s) => ({
          followedUsers: s.followedUsers.includes(userId)
            ? s.followedUsers.filter((id) => id !== userId)
            : [userId, ...s.followedUsers],
        })),

      toggleLikePost: (postId) =>
        set((s) => {
          const liked = s.likedPosts.includes(postId);
          return {
            likedPosts: liked
              ? s.likedPosts.filter((id) => id !== postId)
              : [postId, ...s.likedPosts],
            ugcPosts: s.ugcPosts.map((p) =>
              p.id === postId ? { ...p, likes: Math.max(0, p.likes + (liked ? -1 : 1)) } : p
            ),
          };
        }),

      toggleSaveUgc: (postId) =>
        set((s) => ({
          savedUgc: s.savedUgc.includes(postId)
            ? s.savedUgc.filter((id) => id !== postId)
            : [postId, ...s.savedUgc],
        })),

      reportUgc: (postId) =>
        set((s) => ({
          ugcPosts: s.ugcPosts.map((p) => (p.id === postId ? { ...p, reported: true, approved: false } : p)),
        })),

      createOutfitBoard: (title) =>
        set((s) => ({
          outfitBoards: [
            {
              id: `board-${Date.now()}`,
              title,
              visibility: "private",
              productIds: [],
              postIds: [],
              createdAt: Date.now(),
            },
            ...s.outfitBoards,
          ],
        })),

      addToOutfitBoard: (boardId, productId, postId) =>
        set((s) => ({
          outfitBoards: s.outfitBoards.map((b) => {
            if (b.id !== boardId) return b;
            return {
              ...b,
              productIds: productId && !b.productIds.includes(productId)
                ? [...b.productIds, productId]
                : b.productIds,
              postIds: postId && !b.postIds.includes(postId) ? [...b.postIds, postId] : b.postIds,
            };
          }),
        })),

      shareOutfitBoard: (boardId) => {
        const token = `ob_${boardId}_${Math.random().toString(36).slice(2, 7)}`;
        set((s) => ({
          outfitBoards: s.outfitBoards.map((b) =>
            b.id === boardId ? { ...b, shareToken: token, visibility: "public" as const } : b
          ),
        }));
        return token;
      },

      setBoardVisibility: (boardId, visibility) =>
        set((s) => ({
          outfitBoards: s.outfitBoards.map((b) => (b.id === boardId ? { ...b, visibility } : b)),
        })),

      togglePinProduct: (productId) =>
        set((s) => ({
          pinnedProductIds: s.pinnedProductIds.includes(productId)
            ? s.pinnedProductIds.filter((id) => id !== productId)
            : [productId, ...s.pinnedProductIds],
        })),

      setProductBadges: (productId, badges) =>
        set((s) => ({
          productBadges: { ...s.productBadges, [productId]: badges },
        })),

      createCollection: (title, description = "") =>
        set((s) => ({
          curatedCollections: [
            {
              id: `col-${Date.now()}`,
              title,
              slug: title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
              description,
              productIds: [],
              published: false,
              createdAt: Date.now(),
            },
            ...s.curatedCollections,
          ],
        })),

      updateCollection: (id, patch) =>
        set((s) => ({
          curatedCollections: s.curatedCollections.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),

      toggleCollectionProduct: (collectionId, productId) =>
        set((s) => ({
          curatedCollections: s.curatedCollections.map((c) => {
            if (c.id !== collectionId) return c;
            const has = c.productIds.includes(productId);
            return {
              ...c,
              productIds: has ? c.productIds.filter((id) => id !== productId) : [...c.productIds, productId],
            };
          }),
        })),

      scheduleCampaign: (payload) =>
        set((s) => ({
          campaigns: [
            {
              id: `camp-${Date.now()}`,
              status: payload.status ?? "scheduled",
              name: payload.name,
              channel: payload.channel,
              startsAt: payload.startsAt,
              endsAt: payload.endsAt,
              productIds: payload.productIds,
              note: payload.note,
            },
            ...s.campaigns,
          ],
        })),

      setCampaignStatus: (id, status) =>
        set((s) => ({
          campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, status } : c)),
        })),

      upsertPromotion: (promo) =>
        set((s) => {
          if (promo.id && s.promotions.some((p) => p.id === promo.id)) {
            return {
              promotions: s.promotions.map((p) =>
                p.id === promo.id
                  ? {
                      ...p,
                      code: promo.code,
                      label: promo.label,
                      type: promo.type,
                      value: promo.value,
                      active: promo.active,
                      regions: promo.regions,
                      minSpend: promo.minSpend,
                      endsAt: promo.endsAt,
                    }
                  : p
              ),
            };
          }
          return {
            promotions: [
              {
                id: promo.id ?? `promo-${Date.now()}`,
                code: promo.code,
                label: promo.label,
                type: promo.type,
                value: promo.value,
                active: promo.active,
                regions: promo.regions,
                minSpend: promo.minSpend,
                endsAt: promo.endsAt,
              },
              ...s.promotions,
            ],
          };
        }),

      togglePromotion: (id) =>
        set((s) => ({
          promotions: s.promotions.map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
        })),

      createLandingPage: (title) =>
        set((s) => ({
          landingPages: [
            {
              id: `lp-${Date.now()}`,
              title,
              slug: title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
              headline: title,
              cta: "Shop now",
              published: false,
            },
            ...s.landingPages,
          ],
        })),

      setLandingPublished: (id, published) =>
        set((s) => ({
          landingPages: s.landingPages.map((l) => (l.id === id ? { ...l, published } : l)),
        })),

      setRecommendationConfig: (patch) =>
        set((s) => ({
          recommendationConfig: { ...s.recommendationConfig, ...patch },
        })),

      setRestockDate: (productId, date) =>
        set((s) => ({
          restockDates: { ...s.restockDates, [productId]: date },
        })),

      setLowStockThreshold: (productId, threshold) =>
        set((s) => ({
          lowStockThresholds: { ...s.lowStockThresholds, [productId]: threshold },
        })),

      issueGiftCard: (issuedTo, balance) =>
        set((s) => ({
          giftCardsAdmin: [
            {
              id: `gc-${Date.now()}`,
              code: `GIFT-BOS-${Math.floor(1000 + Math.random() * 9000)}`,
              balance,
              status: "active",
              issuedTo,
              createdAt: new Date().toISOString().slice(0, 10),
            },
            ...s.giftCardsAdmin,
          ],
        })),

      setAdminNotificationStatus: (id, status) =>
        set((s) => ({
          adminNotifications: s.adminNotifications.map((n) => (n.id === id ? { ...n, status } : n)),
        })),

      toggleCategoryVisible: (id) =>
        set((s) => ({
          adminCategories: s.adminCategories.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)),
        })),

      setLookbookShoppable: (id, shoppable) =>
        set((s) => ({
          adminLookbooks: s.adminLookbooks.map((l) => (l.id === id ? { ...l, shoppable } : l)),
        })),

      setLookbookPublished: (id, published) =>
        set((s) => ({
          adminLookbooks: s.adminLookbooks.map((l) => (l.id === id ? { ...l, published } : l)),
        })),

      setOrderStatus: (id, status) =>
        set((s) => ({
          adminOrders: s.adminOrders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),

      setEditorialPublished: (slug, published) =>
        set((s) => ({
          editorialPublished: { ...s.editorialPublished, [slug]: published },
        })),

      setDesignerPublished: (id, published) =>
        set((s) => ({
          designerPublished: { ...s.designerPublished, [id]: published },
        })),

      setStorePublished: (id, published) =>
        set((s) => ({
          storePublished: { ...s.storePublished, [id]: published },
        })),

      setStylistActive: (id, active) =>
        set((s) => ({
          stylistActive: { ...s.stylistActive, [id]: active },
        })),

      setReviewModeration: (id, status) =>
        set((s) => ({
          reviewModeration: { ...s.reviewModeration, [id]: status },
        })),

      setLoyaltyMultiplier: (n) => set({ loyaltyMultiplierOverride: Math.max(0.5, Math.min(3, n)) }),

      resolveSupportTicketAdmin: (id) =>
        set((s) => ({
          supportTickets: s.supportTickets.map((t) =>
            t.id === id ? { ...t, status: "resolved" as const } : t
          ),
        })),

      setVendorBrand: (brandId) => set({ vendorBrandId: brandId }),

      addVendorProduct: ({ name, category, price, stock }) =>
        set((s) => ({
          vendorProducts: [
            {
              id: `vp-${Date.now()}`,
              brandId: s.vendorBrandId,
              name,
              category,
              price,
              stock,
              status: "pending",
              createdAt: Date.now(),
            },
            ...s.vendorProducts,
          ],
        })),

      setVendorProductStatus: (id, status) =>
        set((s) => ({
          vendorProducts: s.vendorProducts.map((p) => (p.id === id ? { ...p, status } : p)),
        })),

      setVendorInventory: (productId, stock) =>
        set((s) => ({
          vendorInventory: { ...s.vendorInventory, [productId]: stock },
          vendorProducts: s.vendorProducts.map((p) => (p.id === productId ? { ...p, stock } : p)),
        })),

      setVendorShipmentStatus: (id, status) =>
        set((s) => ({
          vendorOrders: s.vendorOrders.map((o) => (o.id === id ? { ...o, shipmentStatus: status } : o)),
        })),

      setVendorReturnStatus: (id, status) =>
        set((s) => ({
          vendorReturns: s.vendorReturns.map((r) => (r.id === id ? { ...r, status } : r)),
        })),

      submitVendorCampaign: (title, channel, assetsNote) =>
        set((s) => ({
          vendorCampaigns: [
            {
              id: `vcs-${Date.now()}`,
              brandId: s.vendorBrandId,
              title,
              channel,
              assetsNote,
              status: "submitted",
              submittedAt: new Date().toISOString().slice(0, 10),
            },
            ...s.vendorCampaigns,
          ],
        })),

      contactVendorSupport: (subject, body) =>
        set((s) => ({
          vendorSupport: [
            {
              id: `vs-${Date.now()}`,
              brandId: s.vendorBrandId,
              subject,
              body,
              status: "open",
              createdAt: Date.now(),
            },
            ...s.vendorSupport,
          ],
        })),

      trackAnalytics: (type, label, meta) =>
        set((s) => ({
          analyticsEvents: [
            { id: `ae-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, type, label, meta, at: Date.now() },
            ...s.analyticsEvents,
          ].slice(0, 200),
        })),
    }),
    {
      name: "bosianos-store",
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<StoreState>;
        const wishlists = p.wishlists?.length ? p.wishlists : defaultWishlistLists();
        const synced = syncFavorites(wishlists, p.wishlist ?? current.wishlist);
        return {
          ...current,
          ...p,
          ...synced,
          styleProfile: { ...defaultStyleProfile, ...(p.styleProfile ?? {}) },
          bodyProfile: { ...defaultBodyProfile, ...(p.bodyProfile ?? {}) },
          notificationPrefs: { ...defaultNotificationPrefs, ...(p.notificationPrefs ?? {}) },
          wardrobe: p.wardrobe ?? [],
          savedForLater: p.savedForLater ?? [],
          pointsHistory: p.pointsHistory ?? current.pointsHistory,
          referrals: p.referrals ?? current.referrals,
          memberships: p.memberships ?? [],
          savedAddresses: p.savedAddresses ?? current.savedAddresses,
          savedPayments: p.savedPayments ?? current.savedPayments,
          followedDesigners: p.followedDesigners ?? current.followedDesigners,
          savedLiveEvents: p.savedLiveEvents ?? current.savedLiveEvents,
          returns: p.returns ?? [],
          appointments: p.appointments ?? current.appointments,
          sharedBoards: p.sharedBoards ?? current.sharedBoards,
          supportTickets: p.supportTickets ?? current.supportTickets,
          careBookings: p.careBookings ?? [],
          storeReservations: p.storeReservations ?? [],
          fittingBookings: p.fittingBookings ?? [],
          mobilePrefs: { ...current.mobilePrefs, ...(p.mobilePrefs ?? {}) },
          appOffersSeen: p.appOffersSeen ?? [],
          ugcPosts: p.ugcPosts?.length ? p.ugcPosts : seedUgcPosts,
          followedUsers: p.followedUsers ?? current.followedUsers,
          likedPosts: p.likedPosts ?? [],
          savedUgc: p.savedUgc ?? [],
          outfitBoards: p.outfitBoards?.length ? p.outfitBoards : defaultOutfitBoards(),
          pinnedProductIds: p.pinnedProductIds?.length ? p.pinnedProductIds : defaultPinnedIds(),
          productBadges: p.productBadges ?? {},
          curatedCollections: p.curatedCollections?.length ? p.curatedCollections : defaultCollections(),
          campaigns: p.campaigns?.length ? p.campaigns : defaultCampaigns(),
          promotions: p.promotions?.length ? p.promotions : defaultPromotions(),
          landingPages: p.landingPages?.length ? p.landingPages : defaultLandingPages(),
          recommendationConfig: { ...defaultRecommendationConfig(), ...(p.recommendationConfig ?? {}) },
          restockDates: p.restockDates ?? defaultRestockDates(),
          lowStockThresholds: p.lowStockThresholds ?? defaultLowStockThresholds(),
          giftCardsAdmin: p.giftCardsAdmin?.length ? p.giftCardsAdmin : defaultGiftCards(),
          adminNotifications: p.adminNotifications?.length ? p.adminNotifications : defaultNotifications(),
          adminCategories: p.adminCategories?.length ? p.adminCategories : defaultCategories(),
          adminLookbooks: p.adminLookbooks?.length ? p.adminLookbooks : defaultLookbookEdits(),
          adminOrders: p.adminOrders?.length ? p.adminOrders : seedOrders,
          editorialPublished: p.editorialPublished ?? {},
          designerPublished: p.designerPublished ?? {},
          storePublished: p.storePublished ?? {},
          stylistActive: p.stylistActive ?? {},
          reviewModeration: p.reviewModeration ?? {},
          loyaltyMultiplierOverride: p.loyaltyMultiplierOverride ?? 1,
          vendorBrandId: p.vendorBrandId ?? defaultVendorBrandId(),
          vendorProducts: p.vendorProducts?.length ? p.vendorProducts : defaultVendorProducts(),
          vendorInventory: p.vendorInventory ?? {},
          vendorOrders: p.vendorOrders?.length ? p.vendorOrders : defaultVendorOrders(),
          vendorReturns: p.vendorReturns?.length ? p.vendorReturns : defaultVendorReturns(),
          vendorCampaigns: p.vendorCampaigns?.length ? p.vendorCampaigns : defaultVendorCampaigns(),
          vendorPayments: p.vendorPayments?.length ? p.vendorPayments : defaultVendorPayments(),
          vendorSupport: p.vendorSupport ?? [],
          analyticsEvents: p.analyticsEvents?.length ? p.analyticsEvents : seedAnalyticsEvents(),
        };
      },
    }
  )
);

export function cartCount(cart: CartLine[]) {
  return cart.reduce((sum, l) => sum + l.quantity, 0);
}
