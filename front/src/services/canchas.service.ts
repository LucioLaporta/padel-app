import { apiFetch } from "./api";
import { Cancha } from "../types/Cancha";

// GET
export const getCanchas = async (): Promise<Cancha[]> => {
  const data = await apiFetch("/courts");
  return data.courts;
};

// POST voto
export const votarCancha = async (
  canchaId: number,
  value: number
) => {
  return apiFetch(`/courts/${canchaId}/vote`, {
    method: "POST",
    body: JSON.stringify({ value }),
  });
};
