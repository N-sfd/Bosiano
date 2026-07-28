import type { CommunityUser, UgcPost, OutfitBoard } from "./types";

export const communityUsers: CommunityUser[] = [
  {
    id: "user-amelia",
    handle: "amelia.r",
    name: "Amelia Rousseau",
    avatar: "cat-women",
    bio: "Quiet luxury · London",
  },
  {
    id: "user-sofia",
    handle: "sofia.m",
    name: "Sofia Moretti",
    avatar: "look-romantic-evening",
    bio: "Evening edits · Milan",
  },
  {
    id: "user-james",
    handle: "james.k",
    name: "James Kerr",
    avatar: "cat-men",
    bio: "Tailoring & travel",
  },
  {
    id: "user-priya",
    handle: "priya.n",
    name: "Priya Nair",
    avatar: "look-riviera",
    bio: "Resort capsules",
  },
];

export const seedUgcPosts: UgcPost[] = [
  {
    id: "ugc-1",
    userId: "user-sofia",
    photo: "look-romantic-evening",
    caption: "Slip + sculptural mule for a gallery opening",
    tip: "Belt the wrap loosely so the bias still moves.",
    fitNote: "True to size · height 172cm",
    productIds: ["fluid-silk-slip-dress", "sculptural-heeled-mule", "twisted-hoop-earrings"],
    likes: 248,
    approved: true,
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: "ugc-2",
    userId: "user-james",
    photo: "look-quiet-luxury",
    caption: "Boardroom soft tailoring",
    tip: "Leave the blazer unlined look with a fine merino underneath.",
    fitNote: "Sized up one for layering",
    productIds: ["sculpted-wool-blazer", "pleated-wide-leg-trouser", "minimalist-leather-sneaker"],
    likes: 186,
    approved: true,
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: "ugc-3",
    userId: "user-priya",
    photo: "look-riviera",
    caption: "Riviera linen uniform",
    tip: "Crumple is a feature — pack it at the top of your bag.",
    fitNote: "Relaxed fit as intended",
    productIds: ["riviera-linen-shirt", "silk-twill-scarf", "minimalist-leather-sneaker"],
    likes: 312,
    approved: true,
    createdAt: Date.now() - 86400000 * 6,
  },
  {
    id: "ugc-4",
    userId: "user-sofia",
    photo: "look-artisan",
    caption: "Heritage weave for evening",
    tip: "Pair handwoven texture with a clean silhouette.",
    fitNote: "One size clutch",
    productIds: ["adire-wrap-midi-skirt", "handwoven-aso-oke-clutch"],
    likes: 141,
    approved: true,
    createdAt: Date.now() - 86400000 * 8,
  },
  {
    id: "ugc-5",
    userId: "user-james",
    photo: "look-modern-utility",
    caption: "Utility elevated",
    tip: "Keep footwear minimal so the jacket leads.",
    fitNote: "TTS on jacket",
    productIds: ["boro-patchwork-jacket", "field-utility-overshirt", "suede-chelsea-boot"],
    likes: 97,
    approved: true,
    createdAt: Date.now() - 86400000 * 10,
  },
];

export const defaultOutfitBoards = (): OutfitBoard[] => [
  {
    id: "board-pinterest-1",
    title: "Autumn quiet luxury",
    visibility: "public",
    productIds: ["sculpted-wool-blazer", "structured-leather-tote", "architectural-trench-coat"],
    postIds: ["ugc-2"],
    shareToken: "ob_autumn",
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: "board-pinterest-2",
    title: "Evening guest",
    visibility: "private",
    productIds: ["fluid-silk-slip-dress", "sculptural-heeled-mule", "crescent-shoulder-bag"],
    postIds: ["ugc-1"],
    createdAt: Date.now() - 86400000,
  },
];

export function getCommunityUser(id: string) {
  return communityUsers.find((u) => u.id === id);
}

export function postsForProduct(posts: UgcPost[], productId: string) {
  return posts.filter((p) => p.approved && !p.reported && p.productIds.includes(productId));
}

export function shareUrl(path: string) {
  if (typeof window !== "undefined") return `${window.location.origin}${path}`;
  return `https://bosiano.com${path}`;
}
