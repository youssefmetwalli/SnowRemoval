/// <reference types="vite/client" />
const API_KEY = import.meta.env.VITE_API_KEY;                
const DEV_BASE_URL = import.meta.env.VITE_API_BASE_URL;      
const IS_PROD = import.meta.env.PROD;

/**
 * Safely join base + endpoint with exactly one slash.
 */
const join = (base: string, path: string) => {
  if (!base) return path;
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path.slice(1) : path;
  return `${b}/${p}`;
};

interface ApiEnvelope<T> {
  record?: T;
  [key: string]: any;
}

class ApiClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor() {

    this.baseUrl = IS_PROD ? "/api/justdb-proxy?path=" : (DEV_BASE_URL || "");
    this.apiKey = API_KEY;
    if (!IS_PROD && (!this.apiKey || !this.baseUrl)) {
      console.warn("VITE_API_KEY or VITE_API_BASE_URL is missing in dev.");
    }
  }

  private normalizeResponse<T>(data: any): T {
    if (Array.isArray(data)) {
      return data.map((item) => {
        if (item && typeof item === "object" && "record" in item) {
          return item.record;
        }
        return item;
      }) as T;
    }
    if (data && typeof data === "object" && "record" in data) {
      return data.record as T;
    }
    return data as T;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = IS_PROD
      ? `${this.baseUrl}${encodeURI(endpoint)}`
      : join(this.baseUrl, endpoint);

    const baseHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (!IS_PROD && this.apiKey) {
      (baseHeaders as any).Authorization = `Bearer ${this.apiKey}`;
    }

    const config: RequestInit = {
      headers: {
        ...baseHeaders,
        ...(options.headers || {}),
      },
      ...options,
    };

    // Debug hooks you already use
    console.log("request最初");

    let response: Response | undefined;
    try {
      response = await fetch(url, config);

      if (!response.ok) {
        const bodyText = await response.text().catch(() => "");
        throw new Error(`HTTP error! status: ${response.status}, body:${bodyText}`);
      }

      // Some endpoints may return empty body (204). Guard for that.
      const text = await response.text();
      const json = text ? JSON.parse(text) : null;

      console.log("接続はおｋ");
      console.log("rawData");
      console.log(json);

      return this.normalizeResponse<T>(json);
    } catch (err) {
      console.error("API request failed:", err);
      throw err;
    }
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
