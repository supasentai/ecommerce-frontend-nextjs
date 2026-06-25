import { useQuery } from "@tanstack/react-query";
import { getCategories, getProductDetail, getProducts } from "@/features/products/api";
import type { ProductListParams } from "@/features/products/types";

export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useProductDetail(slugOrId: string) {
  return useQuery({
    queryKey: ["products", "detail", slugOrId],
    queryFn: () => getProductDetail(slugOrId),
    enabled: Boolean(slugOrId),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    retry: 1,
  });
}
