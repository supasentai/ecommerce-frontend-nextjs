import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Product } from "@/features/products/types";
import {
  formatProductPrice,
  getProductCategoryLabel,
  getProductSlug,
  isProductAvailable,
} from "../product-utils";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const available = isProductAvailable(product);

  return (
    <article className="flex h-full flex-col rounded-lg border bg-card text-card-foreground shadow-sm">
      <Link href={`/products/${getProductSlug(product)}`} className="block">
        <div className="flex aspect-[4/3] items-center justify-center rounded-t-lg bg-muted text-sm text-muted-foreground">
          Product image
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <Link
              href={`/products/${getProductSlug(product)}`}
              className="font-semibold tracking-tight hover:text-primary"
            >
              {product.name}
            </Link>
            <span className="whitespace-nowrap text-sm font-semibold">
              {formatProductPrice(product.price)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{getProductCategoryLabel(product)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3">
          <span
            className={
              available
                ? "rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                : "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
            }
          >
            {available ? "Available" : "Unavailable"}
          </span>
          <Button asChild variant="outline" size="sm">
            <Link href={`/products/${getProductSlug(product)}`}>Details</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
