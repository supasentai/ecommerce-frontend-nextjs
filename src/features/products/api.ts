import { apiClient } from "@/lib/api-client";
import type {
  CategoriesBackendResponse,
  PaginationMeta,
  Product,
  ProductCategory,
  ProductDetailBackendResponse,
  ProductListParams,
  ProductListResult,
  ProductsBackendResponse,
} from "./types";

const DEFAULT_LIMIT = 12;

function compactParams(params: ProductListParams) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ""),
  );
}

function toPositiveNumber(value: unknown, fallback: number) {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : fallback;
}

function normalizeMeta(
  payload: ProductsBackendResponse,
  items: Product[],
  params: ProductListParams,
): PaginationMeta {
  const nestedData = !Array.isArray(payload) && payload.data && !Array.isArray(payload.data) ? payload.data : {};
  const meta = !Array.isArray(payload) ? (payload.meta ?? nestedData.meta ?? {}) : {};
  const page = toPositiveNumber(meta.page ?? (!Array.isArray(payload) ? payload.page : undefined), params.page ?? 1);
  const limit = toPositiveNumber(
    meta.limit ?? (!Array.isArray(payload) ? payload.limit : undefined),
    params.limit ?? DEFAULT_LIMIT,
  );
  const total = toPositiveNumber(
    meta.total ?? (!Array.isArray(payload) ? payload.total : undefined),
    items.length,
  );
  const totalPages = Math.max(
    1,
    toPositiveNumber(
      meta.totalPages ?? (!Array.isArray(payload) ? payload.totalPages : undefined),
      Math.ceil(total / limit),
    ),
  );

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

function normalizeProductsResponse(
  payload: ProductsBackendResponse,
  params: ProductListParams,
): ProductListResult {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      meta: normalizeMeta(payload, payload, params),
    };
  }

  const nestedData = payload.data && !Array.isArray(payload.data) ? payload.data : undefined;
  const items = Array.isArray(payload.data)
    ? payload.data
    : (payload.items ??
      payload.products ??
      nestedData?.items ??
      nestedData?.products ??
      (Array.isArray(nestedData?.data) ? nestedData.data : []));

  return {
    items,
    meta: normalizeMeta(payload, items, params),
  };
}

function normalizeProductDetail(payload: ProductDetailBackendResponse) {
  if ("data" in payload && payload.data) {
    return payload.data;
  }

  if ("product" in payload && payload.product) {
    return payload.product;
  }

  return payload as Product;
}

function normalizeCategoriesResponse(payload: CategoriesBackendResponse) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (payload.data && "categories" in payload.data && Array.isArray(payload.data.categories)) {
    return payload.data.categories;
  }

  return payload.categories ?? [];
}

export async function getProducts(params: ProductListParams = {}) {
  const response = await apiClient.get<ProductsBackendResponse>("/products", {
    params: compactParams({
      page: params.page ?? 1,
      limit: params.limit ?? DEFAULT_LIMIT,
      search: params.search,
      categoryId: params.categoryId,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    }),
  });

  return normalizeProductsResponse(response.data, params);
}

export async function getProductDetail(slugOrId: string) {
  const response = await apiClient.get<ProductDetailBackendResponse>(
    `/products/${encodeURIComponent(slugOrId)}`,
  );

  return normalizeProductDetail(response.data);
}

export async function getCategories(): Promise<ProductCategory[]> {
  try {
    const response = await apiClient.get<CategoriesBackendResponse>("/categories");

    return normalizeCategoriesResponse(response.data);
  } catch {
    const response = await apiClient.get<CategoriesBackendResponse>("/products/categories");

    return normalizeCategoriesResponse(response.data);
  }
}
