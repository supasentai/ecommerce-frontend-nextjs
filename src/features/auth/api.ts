import { apiClient } from "@/lib/api-client";
import type {
  AuthBackendResponse,
  AuthSession,
  LoginPayload,
  RefreshTokenPayload,
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

export async function login(payload: LoginPayload) {
  const response = await apiClient.post<AuthBackendResponse>("/auth/login", payload);

  return normalizeAuthResponse(response.data);
}

export async function register(payload: RegisterPayload) {
  const response = await apiClient.post<AuthBackendResponse>("/auth/register", payload);

  return normalizeAuthResponse(response.data);
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
