import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Product } from "@/features/products/types";
import {
  formatProductPrice,
  getProductCategoryLabel,
  getProductImageUrl,
  getProductSlug,
  isProductAvailable,
} from "../product-utils";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const available = isProductAvailable(product);
  const imageUrl = getProductImageUrl(product);
  const categoryLabel = getProductCategoryLabel(product);
  const productHref = `/products/${getProductSlug(product)}`;
  const initials = product.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm shadow-slate-200/60 transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg hover:shadow-slate-200/80 dark:shadow-none">
      <Link
        href={productHref}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-900">
          {imageUrl ? (
            <div
              aria-label={`${product.name} product image`}
              className="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-105"
              role="img"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.18),transparent_32%),linear-gradient(135deg,#f8fafc,#e2e8f0)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(96,165,250,0.22),transparent_34%),linear-gradient(135deg,#0f172a,#1e293b)]">
              <span className="rounded-md border border-white/70 bg-white/80 px-3 py-2 text-sm font-semibold tracking-tight text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-slate-100">
                {initials || "PR"}
              </span>
            </div>
          )}
          <span
            className={
              available
                ? "absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur dark:bg-slate-950/80"
                : "absolute left-3 top-3 rounded-md bg-slate-950/80 px-2.5 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur"
            }
          >
            {available ? "In stock" : "Sold out"}
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-5 p-5">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">{categoryLabel}</p>
            <Link
              href={productHref}
              className="block font-semibold tracking-tight hover:text-primary"
            >
              {product.name}
            </Link>
          </div>
          {product.description ? (
            <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
              {product.description}
            </p>
          ) : null}
        </div>
        <div className="mt-auto flex items-center justify-between gap-4 border-t pt-4">
          <span className="whitespace-nowrap text-base font-bold tracking-tight">
            {formatProductPrice(product.price)}
          </span>
          <Button asChild variant="outline" size="sm">
            <Link href={productHref}>Details</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
