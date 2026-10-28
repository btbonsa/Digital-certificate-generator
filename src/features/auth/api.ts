import { apiClient } from "@/lib/api-client";
import type { LoginRequest, LoginResponse } from "@/types/auth";

export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/auth/login", credentials);
  },
};
