import axios, { AxiosHeaders } from "axios";
import { env } from "@/lib/env";

export const API_BASE_URL = env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const rawAuthState = window.localStorage.getItem("auth-storage");

  if (!rawAuthState) {
    return config;
  }

  try {
    const authState = JSON.parse(rawAuthState) as {
      state?: {
        accessToken?: string | null;
      };
    };
    const accessToken = authState.state?.accessToken;

    if (accessToken) {
      config.headers = AxiosHeaders.from(config.headers);
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
  } catch {
    window.localStorage.removeItem("auth-storage");
  }

  return config;
});
