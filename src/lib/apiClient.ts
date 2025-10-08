/// <reference types="vite/client" />
const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ApiResponse<T> {
  record: T;
  [key: string]: any;
}


// APIクライアント、GETとかPOSTとかできる関数
class ApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.apiKey = API_KEY;
    this.baseUrl = BASE_URL;
  }

  private normalizeResponse<T>(data: any): T {
    // データが配列の場合
    if (Array.isArray(data)) {
      return data.map((item) => {
        // 各アイテムがrecordプロパティを持つ場合
        if (item && typeof item === "object" && "record" in item) {
          return item.record;
        }
        return item;
      }) as T;
    }

    // データが単一オブジェクトでrecordプロパティを持つ場合
    if (data && typeof data === "object" && "record" in data) {
      return data.record as T;
    }

    // その他の場合はそのまま返す
    return data as T;
  }

  // 基本的にここでAPIにリクエストをする。
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!API_KEY || !BASE_URL) {
      throw new Error(
        "環境変数 VITE_API_KEY または VITE_API_BASE_URL が設定されていません"
      );
    }

    const url = `${this.baseUrl}${endpoint}`;

    console.log("request最初");

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json", // JSONデータを送信
        Authorization: `Bearer ${this.apiKey}`, // 認証ヘッダー
        // または 'X-API-Key': this.apiKey,       // 別の認証方式
        ...options.headers, // 追加ヘッダーをマージ
      },
      ...options, // その他のオプション（method, bodyなど）をマージ
    };

    try {
      // 接続
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData: ApiResponse<T>[] = await response.json();

      const data = this.normalizeResponse<T>(rawData);


      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Getのリクエスト
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  // post
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

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
