import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CreditCard, PackageSearch, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const supportCards = [
  {
    title: "Persistent cart",
    description: "Cart state stays consistent while users browse products and review selected items.",
    icon: ShoppingBag,
  },
  {
    title: "Validated checkout",
    description: "Checkout forms are wired for clean input handling and API-ready order submission.",
    icon: CreditCard,
  },
];

export default function HomePage() {
  return (
    <div className="bg-slate-50/70 dark:bg-slate-950/40">
      <section className="container grid gap-10 py-12 sm:py-16 lg:min-h-[calc(100dvh-8rem)] lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-20">
        <div className="max-w-2xl space-y-7">
          <div className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm shadow-slate-200/60 dark:shadow-none">
            <BadgeCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            Fullstack ecommerce demo
          </div>
          <div className="space-y-5">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Browse products, manage your cart, and check out with a real API.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              A polished Next.js storefront connected to a NestJS backend, featuring authentication,
              product catalog, cart state, and checkout validation.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/products">
                Browse products
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/cart">View cart</Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-lg border bg-card shadow-xl shadow-slate-200/80 dark:shadow-none">
            <Image
              src="https://picsum.photos/seed/modern-commerce-studio/1200/900"
              alt="Curated products arranged for an ecommerce storefront"
              width={1200}
              height={900}
              priority
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:absolute lg:-bottom-8 lg:left-6 lg:right-6 lg:mt-0">
            {["Live API", "Auth flow", "Checkout ready"].map((item) => (
              <div
                key={item}
                className="rounded-lg border bg-card/95 p-4 text-sm font-semibold shadow-sm shadow-slate-200/80 backdrop-blur dark:bg-card/90 dark:shadow-none"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container pb-14 sm:pb-20 lg:pb-24">
        <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-lg border bg-card p-6 shadow-sm shadow-slate-200/60 dark:shadow-none sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PackageSearch className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="mt-8 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
              Built to demonstrate real ecommerce workflows.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
              Explore a complete shopping flow with product discovery, detail pages, cart management,
              protected user actions, and order-ready checkout screens.
            </p>
            <Button asChild className="mt-7">
              <Link href="/products">Open catalog</Link>
            </Button>
          </div>

          <div className="grid gap-5">
            {supportCards.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-lg border bg-card p-6 shadow-sm shadow-slate-200/60 dark:shadow-none"
                >
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h3 className="mt-5 text-xl font-semibold tracking-tight">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
