import { apiClient } from "@/lib/api-client";
import type {
  AuthBackendResponse,
  AuthSession,
  LoginPayload,
  RefreshTokenPayload,
  RegisterBackendResponse,
  RegisterPayload,
} from "./types";

function normalizeAuthResponse(payload: AuthBackendResponse): AuthSession {
  const data = "data" in payload ? payload.data : undefined;
  const user = data?.user ?? ("user" in payload ? payload.user : undefined);
  const accessToken =
    data?.accessToken ??
    data?.token ??
    ("accessToken" in payload ? payload.accessToken : undefined) ??
    ("token" in payload ? payload.token : undefined);
  const refreshToken =
    data?.refreshToken ?? ("refreshToken" in payload ? payload.refreshToken : undefined);

  if (!user || !accessToken) {
    throw new Error("Invalid auth response from backend.");
  }

  return {
    user,
    accessToken,
    refreshToken,
  };
}

function isAuthUser(value: unknown): value is RegisterBackendResponse & { email: string } {
  return Boolean(value && typeof value === "object" && "email" in value);
}

function normalizeRegisterResponse(payload: RegisterBackendResponse) {
  if (isAuthUser(payload)) {
    return payload;
  }

  if (payload.data) {
    if (isAuthUser(payload.data)) {
      return payload.data;
    }

    if (payload.data.user) {
      return payload.data.user;
    }
  }

  if (payload.user) {
    return payload.user;
  }

  throw new Error("Invalid register response from backend.");
}

export async function login(payload: LoginPayload) {
  const response = await apiClient.post<AuthBackendResponse>("/auth/login", payload);

  return normalizeAuthResponse(response.data);
}

export async function register(payload: RegisterPayload) {
  const response = await apiClient.post<RegisterBackendResponse>("/auth/register", payload);

  return normalizeRegisterResponse(response.data);
}

export async function refreshToken(payload: RefreshTokenPayload) {
  const response = await apiClient.post<AuthBackendResponse>("/auth/refresh", payload);

  return normalizeAuthResponse(response.data);
}

export async function logout(refreshTokenValue?: string | null) {
  await apiClient.post("/auth/logout", {
    refreshToken: refreshTokenValue,
  });
}
