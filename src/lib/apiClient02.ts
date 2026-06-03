class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "/api/justdb-proxy?path=";
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
    const url = `${this.baseUrl}${encodeURI(endpoint)}`;

    const baseHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    const config: RequestInit = {
      headers: {
        ...baseHeaders,
        ...(options.headers || {}),
      },
      ...options,
    };

    // Debug hooks you already use
    // console.log("request最初");
    // console.log(API_KEY)

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const bodyText = await response.text().catch(() => "");
        throw new Error(`HTTP error! status: ${response.status}, body:${bodyText}`);
      }

      // Some endpoints may return empty body (204). Guard for that.
      const text = await response.text();
      const json = text ? JSON.parse(text) : null;

      // console.log("接続はおｋ");
      // console.log("rawData");
      // console.log(json);

      return this.normalizeResponse<T>(json);
    } catch (err) {
      console.error("API request failed:", err);
      throw err;
    }
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  // post
  async post<T>(endpoint: string, data: any): Promise<T> {
    const wrappedData = {
      records:[
        {
          record: {...data}
        }
      ]
    };

    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(wrappedData),
    });
  }

  async put<T>(endpoint: string, data: any, fieldname: string, id: string): Promise<T> {
    const wrappedData = {
      records:[
        {
          recordKey:{
            [fieldname]: id
          },
          record:{...data}
        }
      ]
    };
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(wrappedData),
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
