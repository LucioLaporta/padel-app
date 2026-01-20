import { apiFetch } from "./api";
import { Partido } from "../types/Partido";

// =====================
// GET /api/matches
// =====================
export const getMatches = async (): Promise<Partido[]> => {
  const data = await apiFetch("/matches");
  return data.matches;
};

// =====================
// POST /api/matches
// Crear partido
// =====================
interface CreateMatchPayload {
  date: string;   // ISO string
  level: string;  // "6ta", "5ta", etc
  price: number;
}

export const createMatch = async (
  payload: CreateMatchPayload
): Promise<Partido> => {
  const data = await apiFetch("/matches", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data.match;
};

// =====================
// POST /api/matches/:id/join
// =====================
export const joinMatch = async (matchId: number): Promise<Partido> => {
  const data = await apiFetch(`/matches/${matchId}/join`, {
    method: "POST",
  });

  return data.match;
};

// =====================
// POST /api/matches/:id/leave
// =====================
export const leaveMatch = async (matchId: number): Promise<Partido> => {
  const data = await apiFetch(`/matches/${matchId}/leave`, {
    method: "POST",
  });

  return data.match;
};

// =====================
// DELETE /api/matches/:id
// =====================
export const deleteMatch = async (matchId: number): Promise<void> => {
  await apiFetch(`/matches/${matchId}`, {
    method: "DELETE",
  });
};
