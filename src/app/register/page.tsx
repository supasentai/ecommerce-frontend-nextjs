import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <section className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <div className="mb-6 space-y-2 text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">Create account</p>
          <h1 className="text-2xl font-bold tracking-tight">Register</h1>
          <p className="text-sm text-muted-foreground">
            Create an account, then login to browse authenticated experiences.
          </p>
        </div>
        <RegisterForm />
      </div>
    </section>
  );
}
