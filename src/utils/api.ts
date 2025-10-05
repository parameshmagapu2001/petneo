"use client";

// utils/api.ts
// Make sure to restart Next.js after editing .env.local
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://unbiased-dane-new.ngrok-free.app/api/v1";

const ACCESS_TOKEN_KEY = "accessToken";

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

export function clearAccessToken() {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {}
  try {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {}
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
    ].forEach((k) => {
        try {
            localStorage.removeItem(k);
            sessionStorage.removeItem(k);
        } catch {}
    });
};

// --- Wrapper for fetch with auth ---
async function request(
  endpoint: string,
  options: RequestInit = {},
  queryParams?: Record<string, any>,
  { expectJson = true }: { expectJson?: boolean } = {}
) {
  const token = getAccessToken();

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

  const url = new URL(endpoint, API_BASE_URL);

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
    { expectJson = true }: { expectJson?: boolean } = {}
) {
    const token = getAccessToken();

    const defaultHeaders: HeadersInit = {
        Accept: "application/json",
        ...(SKIP_NGROK_HEADER ? { "ngrok-skip-browser-warning": "69420" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const mergedHeaders: HeadersInit = {
        ...defaultHeaders,
        ...(options.headers || {}),
    };

    const url = new URL(endpoint, API_BASE_URL);

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
  get: (endpoint: string, queryParams?: Record<string, any>) =>
    request(endpoint, { method: "GET" }, queryParams),
  post: (endpoint: string, body: any) =>
    request(endpoint, { method: "POST", body: JSON.stringify(body) }),
  formDatapost: (endpoint: string, body: any) =>
    multiPartRequest(endpoint, { method: "POST", body: body }),
  put: (endpoint: string, body: any) =>
    request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  formDataPut: (endpoint: string, body: any) =>
      multiPartRequest(endpoint, { method: "PUT", body: body }),
  patch: (endpoint: string, body?: any, queryParams?: Record<string, any>) =>
    request(
      endpoint,
      { method: "PATCH", body: body !== undefined ? JSON.stringify(body) : undefined },
      queryParams
    ),
  delete: (endpoint: string) => request(endpoint, { method: "DELETE" }),
};
