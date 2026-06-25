"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useProductDetail } from "@/hooks/use-products";
import {
  formatProductPrice,
  getProductCategoryLabel,
  isProductAvailable,
} from "../product-utils";

type ProductDetailProps = {
  slugOrId: string;
};

export function ProductDetail({ slugOrId }: ProductDetailProps) {
  const [showPlaceholder, setShowPlaceholder] = useState(false);
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
            disabled={!available}
            onClick={() => setShowPlaceholder(true)}
          >
            Add to cart
          </Button>
          {showPlaceholder ? (
            <p className="text-sm text-muted-foreground">
              Cart API integration is intentionally out of scope for Sprint 1.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
