import { apiFetch } from "./api";

interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
    clase: string;
    reputacion: number;
  };
}

export const loginApi = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // Guardamos token
  localStorage.setItem("token", data.token);

  return data;
};

export const logoutApi = () => {
  localStorage.removeItem("token");
};
