"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/api";
import { useAuthStore } from "@/store/auth-store";

export function AuthNav() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore((state) => state.user);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const clearSession = useAuthStore((state) => state.clearSession);
  const logoutMutation = useMutation({
    mutationFn: () => logout(refreshToken),
    onSettled: () => {
      clearSession();
      router.push("/login");
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link className="transition-colors hover:text-foreground" href="/login">
          Login
        </Link>
        <Button asChild size="sm">
          <Link href="/register">Register</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden max-w-44 truncate text-foreground sm:inline">{user.email}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
      >
        {logoutMutation.isPending ? "Logging out..." : "Logout"}
      </Button>
    </div>
  );
}
