// utils/api.ts
const API_BASE_URL = "https://unbiased-dane-new.ngrok-free.app/";
const ACCESS_TOKEN_KEY = "accessToken";

// --- Token helpers ---
export function setAccessToken(token: string) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken(): string | null {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function clearAccessToken() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}

// --- Wrapper for fetch with auth ---
async function request(endpoint: string, options: RequestInit = {}) {
  const token = getAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `${token}` } : {}),
    ...options.headers,
    //TODO needs to be removed after testing
    "ngrok-skip-browser-warning": "69420"
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "API request failed");
  }

  return res.json();
}

// --- Public API methods ---
export const api = {
  get: (endpoint: string) => request(endpoint),
  post: (endpoint: string, body: any) =>
    request(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: (endpoint: string, body: any) =>
    request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  patch: (endpoint: string, body: any) =>
    request(endpoint, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (endpoint: string) =>
    request(endpoint, { method: "DELETE" }),
};
