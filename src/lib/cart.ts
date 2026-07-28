import { getProduct } from "./products";
import type { CartLine } from "./types";

export interface ResolvedLine {
  line: CartLine;
  product: NonNullable<ReturnType<typeof getProduct>>;
  variant: NonNullable<ReturnType<typeof getProduct>>["variants"][number];
  lineTotal: number;
}

export function resolveCart(cart: CartLine[]): ResolvedLine[] {
  return cart
    .map((line) => {
      const product = getProduct(line.productId);
      if (!product) return null;
      const variant = product.variants.find((v) => v.id === line.variantId) ?? product.variants[0];
      return { line, product, variant, lineTotal: product.price * line.quantity };
    })
    .filter((x): x is ResolvedLine => x !== null);
}

export function cartSubtotal(cart: CartLine[]) {
  return resolveCart(cart).reduce((sum, l) => sum + l.lineTotal, 0);
}

export const FREE_SHIP_THRESHOLD = 250;
