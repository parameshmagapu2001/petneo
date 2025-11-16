"use client";

// utils/api.ts
// Make sure to restart Next.js after editing .env.local
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://unbiased-dane-new.ngrok-free.app/api/v1";

const ACCESS_TOKEN_KEY = "accessToken";
const PARTNER_ACCESS_TOKEN_KEY = "partnerAccessToken";

// Toggle adding the ngrok skip header (set this in .env.local during dev)
const SKIP_NGROK_HEADER =
  (process.env.NEXT_PUBLIC_SKIP_NGROK_HEADER || "false").toLowerCase() === "true";

// --- Token helpers ---
export function setAccessToken(token: string) {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    try {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch {}
  }
}

export function getAccessToken(): string | null {
  try {
    const fromLocal = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (fromLocal) return fromLocal;
  } catch {}
  try {
    const fromSession = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    if (fromSession) return fromSession;
  } catch {}
  return null;
}

export function getPartnerAccessToken(): string | null {
    try {
        const fromLocal = localStorage.getItem(PARTNER_ACCESS_TOKEN_KEY);
        if (fromLocal) return fromLocal;
    } catch {}
    try {
        const fromSession = sessionStorage.getItem(PARTNER_ACCESS_TOKEN_KEY);
        if (fromSession) return fromSession;
    } catch {}
    return null;
}

export function clearAccessToken() {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {}
  try {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {}
}

// Clear all auth
export function clearAuth(flow: "partner" | "customer" = "customer")  {
    try {
        if (flow === "partner") {
            //remove the partner token
            localStorage.removeItem("partnerAccessToken");
            // Clear cookie
            document.cookie = 'partnerAuthToken=; path=/; max-age=0; SameSite=Strict';
        } else if (flow === "customer") {
            //remove the customer token
            localStorage.removeItem("accessToken");
            // Clear cookie
            document.cookie = 'customerAuthToken=; path=/; max-age=0; SameSite=Strict';
        }
    } catch (e) {}
};

// --- Wrapper for fetch with auth ---
async function request(
  endpoint: string,
  options: RequestInit = {},
  queryParams?: Record<string, any>,
  flow: "partner" | "customer" = "customer"
) {
  const token = flow === "customer" ? getAccessToken() : flow === "partner" ? getPartnerAccessToken() : null;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(SKIP_NGROK_HEADER ? { "ngrok-skip-browser-warning": "69420" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const mergedHeaders: HeadersInit = {
    ...defaultHeaders,
    ...(options.headers || {}),
  };

  const url = new URL(`${API_BASE_URL}${endpoint}`);

  const safeParams = queryParams ?? {};
  Object.entries(safeParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    ...options,
    headers: mergedHeaders,
  });

  if (res.status === 204 || res.status === 205) {
    return null;
  }

  const contentType = (res.headers.get("content-type") || "").toLowerCase();
  const parseBody = async () => {
    if (contentType.includes("application/json")) {
      return res.json().catch(() => ({}));
    }
    return res.text();
  };
  const body = await parseBody();

  if (!res.ok) {
      if (res.status === 403) {
          clearAuth();
          throw new Error("Unauthorized (403) - session expired");
      }
    if (typeof body === "string") {
      const snippet = body.length > 500 ? body.slice(0, 500) + "..." : body;
      console.error("API returned non-JSON error body:", body);
      throw new Error(`API error ${res.status}: ${snippet}`);
    } else if (body && (body as any).message) {
      throw new Error((body as any).message);
    } else if (body && (body as any).detail) {
        throw new Error((body as any).detail);
    } else {
      throw new Error(`API request failed with status ${res.status}`);
    }
  }

  if (typeof body === "string") {
    if (contentType.includes("application/json")) {
      try {
        return JSON.parse(body);
      } catch {
        return body;
      }
    }
    return body;
  }
  return body;
}

async function multiPartRequest(
    endpoint: string,
    options: RequestInit = {},
    queryParams?: Record<string, any>,
    flow: "partner" | "customer" = "customer"
) {
    const token = flow === "customer" ? getAccessToken() : flow === "partner" ? getPartnerAccessToken() : null;

    const defaultHeaders: HeadersInit = {
        Accept: "application/json",
        ...(SKIP_NGROK_HEADER ? { "ngrok-skip-browser-warning": "69420" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const mergedHeaders: HeadersInit = {
        ...defaultHeaders,
        ...(options.headers || {}),
    };

    const url = new URL(`${API_BASE_URL}${endpoint}`);

    const safeParams = queryParams ?? {};
    Object.entries(safeParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.set(key, String(value));
        }
    });

    const res = await fetch(url.toString(), {
        ...options,
        headers: mergedHeaders,
    });

    if (res.status === 204 || res.status === 205) {
        return null;
    }

    const contentType = (res.headers.get("content-type") || "").toLowerCase();
    const parseBody = async () => {
        if (contentType.includes("application/json")) {
            return res.json().catch(() => ({}));
        }
        return res.text();
    };
    const body = await parseBody();

    if (!res.ok) {
        if (res.status === 403) {
            clearAuth();
            throw new Error("Unauthorized (403) - session expired");
        }
        if (typeof body === "string") {
            const snippet = body.length > 500 ? body.slice(0, 500) + "..." : body;
            console.error("API returned non-JSON error body:", body);
            throw new Error(`API error ${res.status}: ${snippet}`);
        } else if (body && (body as any).message) {
            throw new Error((body as any).message);
        } else if (body && (body as any).detail) {
            throw new Error((body as any).detail);
        } else {
            throw new Error(`API request failed with status ${res.status}`);
        }
    }

    if (typeof body === "string") {
        if (contentType.includes("application/json")) {
            try {
                return JSON.parse(body);
            } catch {
                return body;
            }
        }
        return body;
    }
    return body;
}

// --- Public API methods ---
export const api = {
  get: (endpoint: string, queryParams?: Record<string, any>, flow?: "partner" | "customer") =>
    request(endpoint, { method: "GET" }, queryParams, flow),
  post: (endpoint: string, body: any, flow?: "partner" | "customer") =>
    request(endpoint, { method: "POST", body: JSON.stringify(body) },undefined, flow),
  formDatapost: (endpoint: string, body: any, flow?: "partner" | "customer") =>
    multiPartRequest(endpoint, { method: "POST", body: body },undefined, flow),
  put: (endpoint: string, body: any, flow?: "partner" | "customer") =>
    request(endpoint, { method: "PUT", body: JSON.stringify(body) },undefined, flow),
  formDataPut: (endpoint: string, body: any, flow?: "partner" | "customer") =>
      multiPartRequest(endpoint, { method: "PUT", body: body },undefined, flow),
  patch: (endpoint: string, body?: any, queryParams?: Record<string, any>, flow?: "partner" | "customer") =>
    request(
      endpoint,
      { method: "PATCH", body: body !== undefined ? JSON.stringify(body) : undefined },
      queryParams,
        flow
    ),
  delete: (endpoint: string, flow?: "partner" | "customer") => request(endpoint, { method: "DELETE" },undefined, flow),
};
