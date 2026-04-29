export interface User {
  email: string;
  fullName: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}