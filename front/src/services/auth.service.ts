import { apiFetch } from "./api";

// =====================
// TYPES
// =====================
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  clase: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
    clase: string;
    reputacion: number;
  };
}

// =====================
// API CALLS
// =====================

export const loginApi = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const registerApi = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
