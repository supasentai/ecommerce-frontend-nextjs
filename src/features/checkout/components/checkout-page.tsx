"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useCart, useClearCart } from "@/hooks/use-cart";
import { useAuthStore } from "@/store/auth-store";

type CheckoutCartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore((state) => state.user);
  const cartQuery = useCart(mounted && Boolean(user));
  const clearCartMutation = useClearCart();
  const cart = cartQuery.data;
  const items = (cart?.items ?? []) as CheckoutCartItem[];
  useEffect(() => {
    setMounted(true);
  }, []);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.fullName || !form.email || !form.phone || !form.address) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitted(true);
    clearCartMutation.mutate();
  };

  if (isSubmitted) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-lg border p-8 text-center">
          <h1 className="text-2xl font-bold">Order placed successfully!</h1>
          <p className="mt-3 text-gray-600">
            Thank you for your order. This is a demo checkout flow.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-block rounded-md bg-black px-5 py-3 text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  if (!items || items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-lg border p-8 text-center">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-3 text-gray-600">Add some products before checking out.</p>

          <Link
            href="/products"
            className="mt-6 inline-block rounded-md bg-black px-5 py-3 text-white"
          >
            Go to Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="lg:col-span-2">
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold">Shipping Information</h2>

            <div className="mt-6 grid gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Full Name</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="Nguyen Van A"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="0901234567"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Address</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="min-h-24 w-full rounded-md border px-3 py-2"
                  placeholder="Your delivery address"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-black px-5 py-3 font-medium text-white"
          >
            Place Order
          </button>
        </form>

        <aside className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Order Summary</h2>

          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 border-b pb-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>

                <p className="font-medium">
                  {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{total.toLocaleString("vi-VN")}₫</span>
          </div>
        </aside>
      </div>
    </main>
  );
}
