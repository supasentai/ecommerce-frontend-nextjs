import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <section className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <div className="mb-6 space-y-2 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">Welcome back</p>
          <h1 className="text-2xl font-bold tracking-tight">Login to your account</h1>
          <p className="text-sm text-muted-foreground">
            Use your backend account to continue to the catalog.
          </p>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </section>
  );
}
