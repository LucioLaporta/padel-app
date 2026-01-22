import { apiFetch } from "./api";

// =====================
// CANCHAS
// =====================
export const rateCourt = async (
  courtId: number,
  stars: number,
  comment?: string
) => {
  return apiFetch("/ratings/court", {
    method: "POST",
    body: JSON.stringify({
      court_id: courtId,
      stars,
      comment,
    }),
  });
};

export const getCourtRating = async (courtId: number) => {
  return apiFetch(`/ratings/court/${courtId}`);
};

// =====================
// JUGADORES
// =====================
export const ratePlayer = async (
  playerId: number,
  stars: number,
  comment?: string
) => {
  return apiFetch("/ratings/player", {
    method: "POST",
    body: JSON.stringify({
      player_id: playerId,
      stars,
      comment,
    }),
  });
};

export const getPlayerRating = async (playerId: number) => {
  return apiFetch(`/ratings/player/${playerId}`);
};
