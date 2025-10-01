"use client";

// utils/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;
const ACCESS_TOKEN_KEY = "accessToken";

// --- Token helpers ---
export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

// Clear all auth
export function clearAuth()  {
    [
    "petneo_token",
    "accessToken",
    "access_token",
    "token",
    "auth_token",
    "vetToken",
    "refreshToken",
    "refresh_token",
    "vet_id",
    ].forEach((k) => localStorage.removeItem(k));
};

// --- Wrapper for fetch with auth ---
async function request(endpoint: string, options: RequestInit = {}, queryParams?: Record<string, any>) {
  const token = getAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `${token}` } : {}),
    ...options.headers,
    //TODO needs to be removed after testing
    "ngrok-skip-browser-warning": "69420"
  };

  const url = new URL(`${API_BASE_URL}${endpoint}`);

  const safeParams = queryParams ?? {};
  
  Object.entries(safeParams).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 403) {
      clearAuth();
      throw new Error("Unauthorized (403) - session expired");
    }
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "API request failed");
  }

  return res.json();
}

// --- Wrapper for fetch with auth ---
async function multiPartRequest(endpoint: string, options: RequestInit = {}, queryParams?: Record<string, any>) {
  const token = getAccessToken();

  const headers: HeadersInit = {
    ...(token ? { Authorization: `${token}` } : {}),
    ...options.headers,
    //TODO needs to be removed after testing
    "ngrok-skip-browser-warning": "69420"
  };

  const url = new URL(`${API_BASE_URL}${endpoint}`);

  const safeParams = queryParams ?? {};
  
  Object.entries(safeParams).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 403) {
      clearAuth();
      throw new Error("Unauthorized (403) - session expired");
    }
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "API request failed");
  }

  return res.json();
}

// --- Public API methods ---
export const api = {
  get: (endpoint: string, queryParams?: Record<string, any>) => request(endpoint, {}, queryParams),
  post: (endpoint: string, body: any) =>
    request(endpoint, { method: "POST", body: JSON.stringify(body) }),
  formDatapost: (endpoint: string, body: any) =>
    multiPartRequest(endpoint, { method: "POST", body: body }),
  put: (endpoint: string, body: any) =>
    request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  formDataPut: (endpoint: string, body: any) =>
      multiPartRequest(endpoint, { method: "PUT", body: body }),
  patch: (endpoint: string, body?: any, queryParams?: Record<string, any>) =>
    request(endpoint, { method: "PATCH", body: JSON.stringify(body) }, queryParams),
  delete: (endpoint: string) =>
    request(endpoint, { method: "DELETE" }),
};
