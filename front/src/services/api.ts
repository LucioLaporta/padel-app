const API_URL = "http://localhost:3000/api";

export const fakeDelay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let message = "Error API";
    try {
      const error = await res.json();
      message = error.message || message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
};
