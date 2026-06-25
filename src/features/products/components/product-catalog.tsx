"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { AlertTriangle, PackageOpen, RefreshCw, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCategories, useProducts } from "@/hooks/use-products";
import type { ProductListParams, ProductSort } from "../types";
import { ProductCard } from "./product-card";

const PAGE_SIZE = 12;

const sortOptions: Array<{ value: ProductSort; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
];

const sortParamsByOption: Record<ProductSort, Pick<ProductListParams, "sortBy" | "sortOrder">> = {
  newest: { sortBy: "createdAt", sortOrder: "desc" },
  price_asc: { sortBy: "price", sortOrder: "asc" },
  price_desc: { sortBy: "price", sortOrder: "desc" },
  name_asc: { sortBy: "name", sortOrder: "asc" },
  name_desc: { sortBy: "name", sortOrder: "desc" },
};

export function ProductCatalog() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState<ProductSort>("newest");
  const deferredSearch = useDeferredValue(search);

  const queryParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: deferredSearch.trim() || undefined,
      categoryId: categoryId || undefined,
      ...sortParamsByOption[sort],
    }),
    [categoryId, deferredSearch, page, sort],
  );

  const productsQuery = useProducts(queryParams);
  const categoriesQuery = useCategories();
  const products = productsQuery.data?.items ?? [];
  const meta = productsQuery.data?.meta;
  const hasActiveFilters = Boolean(search || categoryId || sort !== "newest");

  function resetToFirstPage() {
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setCategoryId("");
    setSort("newest");
    setPage(1);
  }

  return (
    <section className="bg-slate-50/70 py-10 dark:bg-slate-950/40 sm:py-14">
      <div className="container space-y-8">
        <div className="overflow-hidden rounded-lg border bg-card shadow-sm shadow-slate-200/70 dark:shadow-none">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.35fr_0.65fr] lg:p-10">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-semibold text-primary">Product catalog</p>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Find the right piece faster.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Search live inventory, filter by category, and sort the collection without leaving
                the storefront flow.
              </p>
            </div>
            <div className="grid content-end gap-3 rounded-lg bg-slate-100 p-4 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-muted-foreground">Collection size</span>
                <span className="text-2xl font-bold tracking-tight">
                  {meta?.total ?? products.length}
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-muted-foreground">Current page</span>
                <span className="text-sm font-semibold">
                  {meta?.page ?? page} of {meta?.totalPages ?? 1}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
          <aside className="rounded-lg border bg-card p-4 shadow-sm shadow-slate-200/60 dark:shadow-none lg:sticky lg:top-20">
            <div className="mb-5 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" aria-hidden="true" />
              <h2 className="font-semibold tracking-tight">Refine products</h2>
            </div>
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-medium">
                Search
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      resetToFirstPage();
                    }}
                    className="pl-9"
                    placeholder="Try a product name"
                    aria-label="Search products"
                  />
                </div>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Category
                <Select
                  value={categoryId}
                  onChange={(event) => {
                    setCategoryId(event.target.value);
                    resetToFirstPage();
                  }}
                  aria-label="Filter by category"
                  disabled={categoriesQuery.isLoading}
                >
                  <option value="">All categories</option>
                  {categoriesQuery.data?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Sort
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
              </label>
              <Button
                type="button"
                variant="outline"
                disabled={!hasActiveFilters}
                onClick={clearFilters}
                className="mt-1 w-full"
              >
                Clear filters
              </Button>
            </div>
          </aside>

          <div className="space-y-5">
            <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm shadow-slate-200/60 dark:shadow-none sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {productsQuery.isLoading
                    ? "Loading collection"
                    : `${meta?.total ?? products.length} products available`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {hasActiveFilters
                    ? "Showing products that match your refinements."
                    : "Showing the latest inventory."}
                </p>
              </div>
              {productsQuery.isFetching && !productsQuery.isLoading ? (
                <span
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground"
                  aria-live="polite"
                >
                  <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Refreshing
                </span>
              ) : null}
            </div>

            {categoriesQuery.isError ? (
              <div className="flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
                <AlertTriangle
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <p>Category filters are unavailable because categories could not be loaded.</p>
              </div>
            ) : null}

            {productsQuery.isLoading ? <ProductGridSkeleton /> : null}

            {productsQuery.isError ? (
              <div className="rounded-lg border border-destructive/30 bg-card p-8 text-card-foreground shadow-sm shadow-slate-200/60 dark:shadow-none">
                <div className="flex max-w-2xl flex-col gap-4 sm:flex-row">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                    <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">
                      Unable to load products
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      Check that the backend API is running and `NEXT_PUBLIC_API_URL` is configured.
                    </p>
                    <Button className="mt-5" onClick={() => productsQuery.refetch()}>
                      Try again
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}

            {!productsQuery.isLoading && !productsQuery.isError && products.length === 0 ? (
              <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm shadow-slate-200/60 dark:shadow-none sm:p-10">
                <div className="mx-auto flex max-w-md flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <PackageOpen className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold tracking-tight">No products found</h2>
                  <p className="mt-2 text-muted-foreground">
                    Try a different search term, choose another category, or clear your refinements.
                  </p>
                  <Button className="mt-6" onClick={clearFilters} disabled={!hasActiveFilters}>
                    Clear filters
                  </Button>
                </div>
              </div>
            ) : null}

            {!productsQuery.isLoading && !productsQuery.isError && products.length > 0 ? (
              <>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm shadow-slate-200/60 dark:shadow-none sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {meta?.page ?? page} of {meta?.totalPages ?? 1}
                    {meta?.total ? ` - ${meta.total} products` : ""}
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
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-lg border bg-card shadow-sm shadow-slate-200/60 dark:shadow-none"
        >
          <div className="aspect-[4/3] animate-pulse bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-4 p-5">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-2">
              <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <div className="h-5 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-8 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
