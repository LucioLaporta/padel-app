import { apiFetch } from "./api";
import { Partido } from "../types/Partido";

// =====================
// GET MATCHES (TODOS)
// =====================
export const getMatches = async (): Promise<Partido[]> => {
  const data = await apiFetch("/matches");
  return data.matches;
};

// =====================
// CREAR PARTIDO
// =====================
export const createMatch = async (payload: {
  start_time: string;
  end_time: string;
  level: string;
  price: number;
  court_id: number;
}) => {
  const data = await apiFetch("/matches", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data.match;
};

// =====================
// JOIN MATCH
// =====================
export const joinMatch = async (id: number) => {
  return apiFetch(`/matches/${id}/join`, {
    method: "POST",
  });
};

// =====================
// LEAVE MATCH
// =====================
export const leaveMatch = async (id: number) => {
  return apiFetch(`/matches/${id}/leave`, {
    method: "POST",
  });
};

// =====================
// FINISH MATCH
// =====================
export const finishMatch = async (id: number) => {
  return apiFetch(`/matches/${id}/finish`, {
    method: "POST",
  });
};
