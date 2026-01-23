import { apiFetch } from "./api";

// =====================
// PLAYER RATINGS
// =====================
export const ratePlayer = async (
  matchId: number,
  playerId: number,
  stars: number,
  comment?: string
) => {
  return apiFetch("/ratings/player", {
    method: "POST",
    body: JSON.stringify({
      match_id: matchId,
      rated_user_id: playerId,
      stars,
      comment,
    }),
  });
};

export const getPlayerRating = async (playerId: number) => {
  return apiFetch(`/ratings/player/${playerId}`);
};
