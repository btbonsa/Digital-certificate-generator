export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

class ApiClient {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("auth_token");
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const headers = new Headers({ Accept: "application/json" });
    const token = this.getAuthToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);

    new Headers(options.headers).forEach((value, key) => headers.set(key, value));

    const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
    if (typeof options.body === "string" && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    if (isFormData) headers.delete("Content-Type");

    try {
      const response = await fetch(`${this.baseUrl}${path}`, { ...options, headers });
      if (response.status === 204) return undefined as T;

      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("json");
      const responseData: unknown = isJson ? await response.json() : await response.blob();

      if (!response.ok) {
        const payload = typeof responseData === "object" && responseData !== null
          ? responseData as Record<string, unknown>
          : null;
        const message = typeof payload?.message === "string"
          ? payload.message
          : typeof payload?.error === "string"
            ? payload.error
            : response.statusText || `The request failed (${response.status}).`;
        throw new ApiError(message, response.status, responseData);
      }

      return responseData as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof DOMException && error.name === "AbortError") throw error;
      if (error instanceof TypeError && error.message.toLowerCase().includes("fetch")) {
        throw new ApiError("Network error. Check your connection and API server, then try again.");
      }
      throw new ApiError(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data === undefined ? undefined : JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data === undefined ? undefined : JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  async downloadBlob(endpoint: string, options?: RequestInit): Promise<Blob> {
    const headers = new Headers(options?.headers);
    headers.set("Accept", "application/pdf, application/octet-stream, application/json");
    return this.request<Blob>(endpoint, { ...options, method: "GET", headers });
  }
}

export const apiClient = new ApiClient();
