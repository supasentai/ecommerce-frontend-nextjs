import type { Product } from "./types";

export function getProductSlug(product: Product) {
  return product.slug ?? product.id;
}

export function getProductCategoryLabel(product: Product) {
  if (typeof product.category === "string") {
    return product.category;
  }

  return product.category?.name ?? product.categoryName ?? "Uncategorized";
}

export function isProductAvailable(product: Product) {
  const inactiveStatuses = ["inactive", "unavailable", "draft", "archived"];
  const hasInactiveStatus = product.status
    ? inactiveStatuses.includes(product.status.toLowerCase())
    : false;

  if (product.isActive === false || product.active === false || hasInactiveStatus) {
    return false;
  }

  return product.stock === undefined || product.stock > 0;
}

export function formatProductPrice(price: Product["price"]) {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return String(price);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numericPrice);
}
