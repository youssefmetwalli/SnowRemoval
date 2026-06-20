class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "/api/v1";
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const slash = endpoint.startsWith("/") ? "" : "/";
    const url = `${this.baseUrl}${slash}${endpoint}`;

    const baseHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    const config: RequestInit = {
      credentials: "include", // Cookieの送受信用
      headers: {
        ...baseHeaders,
        ...(options.headers || {}),
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const bodyText = await response.text().catch(() => "");
        throw new Error(`HTTP error! status: ${response.status}, body:${bodyText}`);
      }

      const text = await response.text();
      const json = text ? JSON.parse(text) : null;
      return json as T;
    } catch (err) {
      console.error("API request failed:", err);
      throw err;
    }
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
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
