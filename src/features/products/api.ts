import { apiClient } from "@/lib/api-client";
import type { Product } from "./types";

export async function getProducts() {
  const response = await apiClient.get<Product[]>("/products");

  return response.data;
}
