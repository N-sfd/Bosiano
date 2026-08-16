import type { AtelierLook, AtelierProduct } from "@/types/atelier";

const STORAGE_KEY = "bosiano-atelier-look";

export function getAtelierLook(): AtelierLook {
  if (typeof window === "undefined") {
    return { products: [] };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { products: [] };
    const parsed = JSON.parse(raw);
    return { products: Array.isArray(parsed?.products) ? parsed.products : [] };
  } catch {
    return { products: [] };
  }
}

export function saveAtelierLook(products: AtelierProduct[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ products }));
}

export function addProductToAtelier(product: AtelierProduct) {
  const current = getAtelierLook();
  const withoutExisting = current.products.filter((item) => item.id !== product.id);
  saveAtelierLook([...withoutExisting, product]);
}

export function removeProductFromAtelier(productId: string) {
  const current = getAtelierLook();
  saveAtelierLook(current.products.filter((item) => item.id !== productId));
}

export function clearAtelierLook() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
