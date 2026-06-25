"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAuthStore } from "@/store/auth-store";

export function CartLink() {
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore((state) => state.user);
  const cartQuery = useCart(mounted && Boolean(user));
  const totalItems = cartQuery.data?.totalItems ?? 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center gap-2 transition-colors hover:text-foreground"
      aria-label="Shopping cart"
    >
      <ShoppingCart className="h-4 w-4" aria-hidden="true" />
      <span>Cart</span>
      {totalItems > 0 ? (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs font-semibold text-primary-foreground">
          {totalItems}
        </span>
      ) : null}
    </Link>
  );
}
