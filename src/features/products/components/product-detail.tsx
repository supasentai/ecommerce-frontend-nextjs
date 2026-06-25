"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/hooks/use-cart";
import { useProductDetail } from "@/hooks/use-products";
import { useAuthStore } from "@/store/auth-store";
import {
  formatProductPrice,
  getProductCategoryLabel,
  isProductAvailable,
} from "../product-utils";

type ProductDetailProps = {
  slugOrId: string;
};

export function ProductDetail({ slugOrId }: ProductDetailProps) {
  const router = useRouter();
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const addToCartMutation = useAddToCart();
  const productQuery = useProductDetail(slugOrId);
  const product = productQuery.data;

  if (productQuery.isLoading) {
    return (
      <section className="container py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="aspect-square rounded-lg bg-muted" />
          <div className="space-y-5">
            <div className="h-8 w-3/4 rounded bg-muted" />
            <div className="h-6 w-32 rounded bg-muted" />
            <div className="h-24 rounded bg-muted" />
          </div>
        </div>
      </section>
    );
  }

  if (productQuery.isError || !product) {
    return (
      <section className="container py-10">
        <div className="rounded-lg border border-destructive/30 bg-card p-8 text-card-foreground">
          <h1 className="text-2xl font-semibold">Unable to load product</h1>
          <p className="mt-2 text-muted-foreground">
            Check that the backend API is running and the product slug or ID exists.
          </p>
          <Button className="mt-5" onClick={() => productQuery.refetch()}>
            Try again
          </Button>
        </div>
      </section>
    );
  }

  const available = isProductAvailable(product);
  const addToCartError =
    addToCartMutation.isError && axios.isAxiosError<{ message?: string }>(addToCartMutation.error)
      ? (addToCartMutation.error.response?.data?.message ?? "Unable to add item to cart.")
      : addToCartMutation.isError
        ? "Unable to add item to cart."
        : null;

  return (
    <section className="container py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <div className="flex aspect-square items-center justify-center rounded-lg border bg-muted text-muted-foreground">
          Product image
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              {getProductCategoryLabel(product)}
            </p>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-2xl font-semibold">{formatProductPrice(product.price)}</p>
          </div>

          <div className="rounded-lg border bg-card p-5 text-card-foreground">
            <h2 className="font-semibold">Description</h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              {product.description || "No description available."}
            </p>
          </div>

          <dl className="grid gap-3 rounded-lg border bg-card p-5 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Category</dt>
              <dd className="font-medium">{getProductCategoryLabel(product)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Stock</dt>
              <dd className="font-medium">
                {product.stock === undefined ? "Not provided" : product.stock}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Status</dt>
              <dd
                className={
                  available
                    ? "rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                    : "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                }
              >
                {available ? "Active" : "Unavailable"}
              </dd>
            </div>
          </dl>

          <Button
            size="lg"
            className="w-full"
            disabled={!available || addToCartMutation.isPending}
            onClick={() => {
              if (!accessToken) {
                router.push("/login");
                return;
              }

              addToCartMutation.mutate(
                { productId: product.id, quantity: 1 },
                {
                  onSuccess: () => setCartMessage("Added to cart."),
                  onError: (error) => {
                    if (axios.isAxiosError(error) && error.response?.status === 401) {
                      router.push("/login");
                    }
                  },
                },
              );
            }}
          >
            {addToCartMutation.isPending ? "Adding..." : "Add to cart"}
          </Button>
          {cartMessage ? <p className="text-sm text-primary">{cartMessage}</p> : null}
          {addToCartError ? (
            <p className="text-sm text-destructive">{addToCartError}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
