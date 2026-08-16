export interface AtelierProduct {
  id: string;
  variantId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  category?: string;
}

export interface AtelierLook {
  products: AtelierProduct[];
}

export interface AtelierPreviewResult {
  imageUrl: string;
}
