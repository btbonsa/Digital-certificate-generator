export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: true;
  message: string;
  token: string;
  admin: AuthUser;
}

export interface AuthUser {
  id: number;
  name: string;
}
