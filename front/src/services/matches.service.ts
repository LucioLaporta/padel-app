import { apiFetch } from "./api";
import { Partido } from "../types/Partido";

// =====================
// GET MATCHES POR CANCHA
// =====================
export const getMatchesByCourt = async (
  courtId: number
): Promise<Partido[]> => {
  const data = await apiFetch(`/courts/${courtId}/matches`);
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
  const data = await apiFetch(`/matches/${id}/join`, {
    method: "POST",
  });

  return data.match;
};

// =====================
// LEAVE MATCH
// =====================
export const leaveMatch = async (id: number) => {
  const data = await apiFetch(`/matches/${id}/leave`, {
    method: "POST",
  });

  return data.match;
};

// =====================
// FINISH MATCH
// =====================
export const finishMatch = async (id: number) => {
  return apiFetch(`/matches/${id}/finish`, {
    method: "POST",
  });
};
