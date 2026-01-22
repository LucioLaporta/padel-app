// =====================
// API BASE URL
// =====================
// Si existe .env usa eso, si no fallback a localhost
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// =====================
// FAKE DELAY (opcional)
// =====================
export const fakeDelay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// =====================
// FETCH WRAPPER
// =====================
export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    });

    // Si backend responde pero con error HTTP
    if (!res.ok) {
      let message = "Error API";

      try {
        const error = await res.json();
        message = error.message || message;
      } catch {}

      throw new Error(message);
    }

    return res.json();
  } catch (error) {
    console.error("❌ API FETCH ERROR:", error);
    throw new Error(
      "No se pudo conectar con el backend (¿backend apagado?)"
    );
  }
};