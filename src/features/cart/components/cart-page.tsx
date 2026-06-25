"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useCart,
  useClearCart,
  useRemoveCartItem,
  useUpdateCartItemQuantity,
} from "@/hooks/use-cart";
import { useAuthStore } from "@/store/auth-store";
import { getCartItemSubtotal, toCurrency } from "../cart-utils";
import type { CartItem } from "../types";

function isUnauthorized(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

function getErrorMessage(error: unknown) {
  if (isUnauthorized(error)) {
    return "Please login to view your cart.";
  }

  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "Unable to load cart.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load cart.";
}

export function CartPage() {
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore((state) => state.user);
  const cartQuery = useCart(mounted && Boolean(user));
  const updateQuantityMutation = useUpdateCartItemQuantity();
  const removeItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();
  const cart = cartQuery.data;
  const items = cart?.items ?? [];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="container py-10">
        <CartSkeleton />
      </section>
    );
  }

  if (!user) {
    return (
      <section className="container py-10">
        <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
          <h1 className="text-2xl font-semibold">Login required</h1>
          <p className="mt-2 text-muted-foreground">Please login to view and manage your cart.</p>
          <Button asChild className="mt-5">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </section>
    );
  }

  if (cartQuery.isLoading) {
    return (
      <section className="container py-10">
        <CartSkeleton />
      </section>
    );
  }

  if (cartQuery.isError) {
    return (
      <section className="container py-10">
        <div className="rounded-lg border border-destructive/30 bg-card p-8 text-card-foreground shadow-sm">
          <h1 className="text-2xl font-semibold">Unable to load cart</h1>
          <p className="mt-2 text-muted-foreground">{getErrorMessage(cartQuery.error)}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {isUnauthorized(cartQuery.error) ? (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            ) : (
              <Button onClick={() => cartQuery.refetch()}>Try again</Button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container space-y-8 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary">Shopping cart</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Your cart</h1>
        </div>
        {items.length > 0 ? (
          <Button
            variant="outline"
            disabled={clearCartMutation.isPending}
            onClick={() => clearCartMutation.mutate()}
          >
            {clearCartMutation.isPending ? "Clearing..." : "Clear cart"}
          </Button>
        ) : null}
      </div>

      {clearCartMutation.isError ? (
        <p className="rounded-md border border-destructive/30 bg-card p-3 text-sm text-destructive">
          Clear cart is not available or failed for this backend.
        </p>
      ) : null}

      {items.length === 0 ? (
        <div className="rounded-lg border bg-card p-10 text-center text-card-foreground shadow-sm">
          <h2 className="text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-muted-foreground">Add products from the catalog to start shopping.</p>
          <Button asChild className="mt-5">
            <Link href="/products">Browse products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                updating={updateQuantityMutation.isPending}
                removing={removeItemMutation.isPending}
                onQuantityChange={(quantity) =>
                  updateQuantityMutation.mutate({ itemId: item.id, quantity })
                }
                onRemove={() => removeItemMutation.mutate(item.id)}
              />
            ))}
          </div>

          <aside className="h-fit rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Items</dt>
                <dd className="font-medium">{cart?.totalItems ?? 0}</dd>
              </div>
              <div className="flex items-center justify-between border-t pt-3">
                <dt className="text-muted-foreground">Total</dt>
                <dd className="text-lg font-semibold">{toCurrency(cart?.totalAmount ?? 0)}</dd>
              </div>
            </dl>
            <Button asChild className="mt-6 w-full">
              <Link href="/checkout">Checkout</Link>
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Checkout and order creation are planned for a later sprint.
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}

type CartItemRowProps = {
  item: CartItem;
  updating: boolean;
  removing: boolean;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
};

function CartItemRow({
  item,
  updating,
  removing,
  onQuantityChange,
  onRemove,
}: CartItemRowProps) {
  const productHref = item.product?.slug
    ? `/products/${item.product.slug}`
    : `/products/${item.productId}`;
  const nextDecrease = Math.max(1, item.quantity - 1);

  return (
    <article className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          <Link href={productHref} className="font-semibold hover:text-primary">
            {item.name}
          </Link>
          <p className="text-sm text-muted-foreground">Unit price: {toCurrency(item.price)}</p>
          <p className="text-sm font-medium">Subtotal: {toCurrency(getCartItemSubtotal(item))}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-md border">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={updating || item.quantity <= 1}
              onClick={() => onQuantityChange(nextDecrease)}
            >
              -
            </Button>
            <span className="min-w-10 text-center text-sm font-medium">{item.quantity}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={updating}
              onClick={() => onQuantityChange(item.quantity + 1)}
            >
              +
            </Button>
          </div>
          <Button variant="outline" size="sm" disabled={removing} onClick={onRemove}>
            {removing ? "Removing..." : "Remove"}
          </Button>
        </div>
      </div>
    </article>
  );
}

function CartSkeleton() {
  return (
    <div className="space-y-5">
      <div className="h-8 w-48 rounded bg-muted" />
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-lg border bg-card p-5">
          <div className="h-5 w-2/3 rounded bg-muted" />
          <div className="mt-3 h-4 w-36 rounded bg-muted" />
          <div className="mt-5 h-10 w-full rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
