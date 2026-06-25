"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCategories, useProducts } from "@/hooks/use-products";
import type { ProductSort } from "../types";
import { ProductCard } from "./product-card";

const PAGE_SIZE = 12;

const sortOptions: Array<{ value: ProductSort; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
];

export function ProductCatalog() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<ProductSort>("newest");
  const deferredSearch = useDeferredValue(search);

  const queryParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: deferredSearch.trim() || undefined,
      category: category || undefined,
      sort,
    }),
    [category, deferredSearch, page, sort],
  );

  const productsQuery = useProducts(queryParams);
  const categoriesQuery = useCategories();
  const products = productsQuery.data?.items ?? [];
  const meta = productsQuery.data?.meta;

  function resetToFirstPage() {
    setPage(1);
  }

  return (
    <section className="container space-y-8 py-10">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">Products</p>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Product catalog</h1>
            <p className="max-w-2xl text-muted-foreground">
              Browse products from the backend API with search, filters, sorting, and pagination.
            </p>
          </div>
          {productsQuery.isFetching && !productsQuery.isLoading ? (
            <span className="text-sm text-muted-foreground">Refreshing...</span>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 rounded-lg border bg-card p-4 shadow-sm md:grid-cols-[1fr_220px_220px]">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            resetToFirstPage();
          }}
          placeholder="Search products"
          aria-label="Search products"
        />
        <Select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            resetToFirstPage();
          }}
          aria-label="Filter by category"
          disabled={categoriesQuery.isLoading}
        >
          <option value="">All categories</option>
          {categoriesQuery.data?.map((item) => (
            <option key={item.id} value={item.slug ?? item.id}>
              {item.name}
            </option>
          ))}
        </Select>
        <Select
          value={sort}
          onChange={(event) => {
            setSort(event.target.value as ProductSort);
            resetToFirstPage();
          }}
          aria-label="Sort products"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {categoriesQuery.isError ? (
        <p className="text-sm text-muted-foreground">
          Category filter is unavailable because categories could not be loaded.
        </p>
      ) : null}

      {productsQuery.isLoading ? <ProductGridSkeleton /> : null}

      {productsQuery.isError ? (
        <div className="rounded-lg border border-destructive/30 bg-card p-8 text-card-foreground">
          <h2 className="text-xl font-semibold">Unable to load products</h2>
          <p className="mt-2 text-muted-foreground">
            Check that the backend API is running and `NEXT_PUBLIC_API_URL` is configured.
          </p>
          <Button className="mt-5" onClick={() => productsQuery.refetch()}>
            Try again
          </Button>
        </div>
      ) : null}

      {!productsQuery.isLoading && !productsQuery.isError && products.length === 0 ? (
        <div className="rounded-lg border bg-card p-10 text-center text-card-foreground">
          <h2 className="text-xl font-semibold">No products found</h2>
          <p className="mt-2 text-muted-foreground">
            Try a different search term or clear the selected category.
          </p>
        </div>
      ) : null}

      {!productsQuery.isLoading && !productsQuery.isError && products.length > 0 ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Page {meta?.page ?? page} of {meta?.totalPages ?? 1}
              {meta?.total ? ` · ${meta.total} products` : ""}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={!meta?.hasPreviousPage}
                onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={!meta?.hasNextPage}
                onClick={() => setPage((currentPage) => currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="aspect-[4/3] rounded-md bg-muted" />
          <div className="mt-5 h-5 w-3/4 rounded bg-muted" />
          <div className="mt-3 h-4 w-1/2 rounded bg-muted" />
          <div className="mt-8 h-9 w-full rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
