export const API_BASE_URL = "http://localhost:8080/api/v1";

const TOKEN_KEY = "niSportAccessToken";
const USER_KEY = "niSportCurrentUser";

export class ApiError extends Error {
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function setStoredUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearStoredAuth() {
  removeToken();
  localStorage.removeItem(USER_KEY);
}

function getAssetPrefix() {
  const pathname = window.location.pathname.replace(/\\/g, "/");
  if (pathname.includes("/pages/") || pathname.includes("/admin/")) return "../assets/";
  return "assets/";
}

export function resolveAssetUrl(url, fallback = "assets/products/product-1.jpg") {
  if (!url) {
    if (!fallback) return "";
    return resolveAssetUrl(fallback, "");
  }
  if (/^https?:\/\//i.test(url)) return url;
  const cleanUrl = String(url).replace(/^\/+/, "");
  if (cleanUrl.startsWith("assets/")) return `${getAssetPrefix()}${cleanUrl.replace(/^assets\//, "")}`;
  return url;
}

function buildUrl(endpoint) {
  if (/^https?:\/\//i.test(endpoint)) return endpoint;
  return `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
}

function extractErrorMessage(payload, status) {
  if (!payload) return `API error ${status}`;
  if (typeof payload === "string") return payload;
  if (payload.message) return payload.message;
  if (payload.error) return payload.error;
  return `API error ${status}`;
}

export async function apiRequest(endpoint, options = {}) {
  const {
    headers = {},
    body,
    auth = true,
    ...rest
  } = options;

  const requestHeaders = { ...headers };
  const token = getToken();
  const isFormData = body instanceof FormData;

  if (!isFormData && body !== undefined && !requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = "application/json";
  }
  if (auth && token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(buildUrl(endpoint), {
      ...rest,
      headers: requestHeaders,
      body: isFormData || typeof body === "string" ? body : body === undefined ? undefined : JSON.stringify(body)
    });
  } catch {
    throw new ApiError("Khong ket noi duoc backend. Dang dung du lieu mau neu co.", 0);
  }

  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok || payload?.success === false) {
    if (response.status === 401) clearStoredAuth();
    throw new ApiError(extractErrorMessage(payload, response.status), response.status, payload?.errors || payload);
  }

  if (payload && typeof payload === "object" && Object.prototype.hasOwnProperty.call(payload, "data")) {
    return payload.data;
  }
  return payload;
}

export async function getCurrentUserFromApi() {
  if (!getToken()) return null;
  try {
    const user = await apiRequest("/auth/me");
    setStoredUser(user);
    return user;
  } catch (error) {
    if (error.status === 401) clearStoredAuth();
    throw error;
  }
}
