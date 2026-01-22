import { apiFetch } from "./api";
import { Partido } from "../types/Partido";

// GET partidos
export const getMatches = async (): Promise<Partido[]> => {
  const data = await apiFetch("/matches");
  return data.matches;
};

// Crear partido
export const createMatch = async (payload: {
  date: string;
  level: string;
  price: number;
}) => {
  const data = await apiFetch("/matches", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data.match;
};

// Join
export const joinMatch = async (id: number) => {
  const data = await apiFetch(`/matches/${id}/join`, {
    method: "POST",
  });

  return data.match;
};

// Leave
export const leaveMatch = async (id: number) => {
  const data = await apiFetch(`/matches/${id}/leave`, {
    method: "POST",
  });

  return data.match;
};

// Delete
export const deleteMatch = async (id: number) => {
  await apiFetch(`/matches/${id}`, {
    method: "DELETE",
  });
};
