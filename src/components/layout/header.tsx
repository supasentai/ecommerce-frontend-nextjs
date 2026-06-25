import Link from "next/link";
import { CartLink } from "@/features/cart/components/cart-link";
import { AuthNav } from "@/features/auth/components/auth-nav";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
];

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container flex min-h-16 flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-0">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Ecommerce
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground sm:gap-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
          <CartLink />
          <AuthNav />
        </div>
      </div>
    </header>
  );
}
