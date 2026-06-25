"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/features/auth/api";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas";
import { useAuthStore } from "@/store/auth-store";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "Unable to login. Check your credentials.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to login. Check your credentials.";
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      setSession(session);
      router.push("/products");
    },
  });

  return (
    <form
      className="space-y-5"
      onSubmit={form.handleSubmit((values) => loginMutation.mutate(values))}
    >
      {searchParams.get("registered") ? (
        <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-sm text-primary">
          Registration complete. You can login now.
        </div>
      ) : null}

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          disabled={loginMutation.isPending}
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="password">
          Password
        </label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          disabled={loginMutation.isPending}
          {...form.register("password")}
        />
        {form.formState.errors.password ? (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      {loginMutation.isError ? (
        <div className="rounded-md border border-destructive/30 bg-card p-3 text-sm text-destructive">
          {getErrorMessage(loginMutation.error)}
        </div>
      ) : null}

      <Button className="w-full" type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        No account yet?{" "}
        <Link className="font-medium text-primary hover:underline" href="/register">
          Register
        </Link>
      </p>
    </form>
  );
}
