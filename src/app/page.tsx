import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="container flex min-h-[calc(100vh-8rem)] flex-col items-start justify-center gap-8 py-16">
      <div className="max-w-2xl space-y-5">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">Ecommerce starter</p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Build a fast storefront with Next.js 15.
        </h1>
        <p className="text-lg leading-8 text-muted-foreground">
          A production-minded foundation with App Router, TypeScript, Tailwind CSS, shadcn/ui
          patterns, TanStack Query, Zustand, React Hook Form, Zod, and Axios.
        </p>
      </div>
      <Button asChild size="lg">
        <Link href="/products">View products</Link>
      </Button>
    </section>
  );
}
