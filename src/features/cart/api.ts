import axios from "axios";
import { apiClient } from "@/lib/api-client";
import type {
  AddCartItemPayload,
  Cart,
  CartBackendItem,
  CartBackendResponse,
  UpdateCartItemPayload,
} from "./types";

function shouldTryFallback(error: unknown) {
  return axios.isAxiosError(error) && [404, 405].includes(error.response?.status ?? 0);
}

function toNumber(value: unknown, fallback = 0) {
  const amount = Number(value);

  return Number.isFinite(amount) ? amount : fallback;
}

function normalizeCartItem(item: CartBackendItem): Cart["items"][number] {
  const product = item.product ?? undefined;
  const productId = item.productId ?? item.product_id ?? product?.id ?? item.id ?? "";
  const price = item.price ?? item.unitPrice ?? product?.price ?? 0;

  return {
    id: item.id ?? productId,
    productId,
    product: product?.id
      ? {
          id: product.id,
          slug: product.slug,
          name: product.name ?? item.name ?? "Product",
          price: product.price ?? price,
          imageUrl: product.imageUrl,
        }
      : undefined,
    name: item.name ?? product?.name ?? "Product",
    price,
    quantity: toNumber(item.quantity, 1),
  };
}

function extractItems(payload: CartBackendResponse): CartBackendItem[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (payload.data && !Array.isArray(payload.data)) {
    if (Array.isArray(payload.data.items)) {
      return payload.data.items;
    }

    if (payload.data.cart) {
      return extractItems(payload.data.cart);
    }
  }

  if (payload.cart) {
    return extractItems(payload.cart);
  }

  return payload.items ?? [];
}

function extractCartId(payload: CartBackendResponse) {
  if (Array.isArray(payload)) {
    return undefined;
  }

  if (payload.id) {
    return payload.id;
  }

  if (payload.data && !Array.isArray(payload.data) && payload.data.id) {
    return payload.data.id;
  }

  return undefined;
}

function normalizeCartResponse(payload: CartBackendResponse): Cart {
  const items = extractItems(payload).map(normalizeCartItem);
  const calculatedTotalItems = items.reduce((total, item) => total + item.quantity, 0);
  const calculatedTotalAmount = items.reduce(
    (total, item) => total + toNumber(item.price) * item.quantity,
    0,
  );

  if (Array.isArray(payload)) {
    return {
      items,
      totalItems: calculatedTotalItems,
      totalAmount: calculatedTotalAmount,
    };
  }

  return {
    id: extractCartId(payload),
    items,
    totalItems: toNumber(payload.totalItems ?? payload.totalQuantity, calculatedTotalItems),
    totalAmount: toNumber(payload.totalAmount ?? payload.total, calculatedTotalAmount),
  };
}

export async function getCurrentCart() {
  const response = await apiClient.get<CartBackendResponse>("/cart");

  return normalizeCartResponse(response.data);
}

export async function addItemToCart(payload: AddCartItemPayload) {
  const body = {
    productId: payload.productId,
    quantity: payload.quantity ?? 1,
  };

  try {
    const response = await apiClient.post<CartBackendResponse>("/cart/items", body);

    return normalizeCartResponse(response.data);
  } catch (error) {
    if (!shouldTryFallback(error)) {
      throw error;
    }

    const response = await apiClient.post<CartBackendResponse>("/cart", body);

    return normalizeCartResponse(response.data);
  }
}

export async function updateCartItemQuantity(payload: UpdateCartItemPayload) {
  const body = { quantity: payload.quantity };

  try {
    const response = await apiClient.patch<CartBackendResponse>(
      `/cart/items/${encodeURIComponent(payload.itemId)}`,
      body,
    );

    return normalizeCartResponse(response.data);
  } catch (error) {
    if (!shouldTryFallback(error)) {
      throw error;
    }

    const response = await apiClient.patch<CartBackendResponse>(
      `/cart/${encodeURIComponent(payload.itemId)}`,
      body,
    );

    return normalizeCartResponse(response.data);
  }
}

export async function removeCartItem(itemId: string) {
  try {
    const response = await apiClient.delete<CartBackendResponse>(
      `/cart/items/${encodeURIComponent(itemId)}`,
    );

    return normalizeCartResponse(response.data);
  } catch (error) {
    if (!shouldTryFallback(error)) {
      throw error;
    }

    const response = await apiClient.delete<CartBackendResponse>(`/cart/${encodeURIComponent(itemId)}`);

    return normalizeCartResponse(response.data);
  }
}

export async function clearCart() {
  try {
    const response = await apiClient.delete<CartBackendResponse>("/cart");

    return normalizeCartResponse(response.data);
  } catch (error) {
    if (!shouldTryFallback(error)) {
      throw error;
    }

    const response = await apiClient.post<CartBackendResponse>("/cart/clear");

    return normalizeCartResponse(response.data);
  }
}
