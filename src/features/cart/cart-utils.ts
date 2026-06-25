import type { CartItem } from "./types";

export function toCurrency(value: number | string) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return String(value);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function getCartItemSubtotal(item: CartItem) {
  const price = Number(item.price);

  return Number.isFinite(price) ? price * item.quantity : 0;
}
