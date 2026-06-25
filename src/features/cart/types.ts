import type { Product } from "@/features/products/types";

export type CartProduct = Pick<Product, "id" | "slug" | "name" | "price" | "imageUrl">;

export type CartItem = {
  id: string;
  productId: string;
  product?: CartProduct;
  name: string;
  price: number | string;
  quantity: number;
};

export type Cart = {
  id?: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
};

export type CartBackendItem = Partial<CartItem> & {
  product?: Partial<CartProduct> | null;
  product_id?: string;
  productId?: string;
  unitPrice?: number | string;
  subtotal?: number | string;
};

export type CartBackendResponse =
  | CartBackendItem[]
  | {
      id?: string;
      data?: CartBackendItem[] | { id?: string; items?: CartBackendItem[]; cart?: CartBackendResponse };
      cart?: CartBackendResponse;
      items?: CartBackendItem[];
      totalItems?: number;
      totalQuantity?: number;
      totalAmount?: number | string;
      total?: number | string;
    };

export type AddCartItemPayload = {
  productId: string;
  quantity?: number;
};

export type UpdateCartItemPayload = {
  itemId: string;
  quantity: number;
};
