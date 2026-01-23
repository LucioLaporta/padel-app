import { ratePlayer } from "../services/rating.service";

export function useRatingsReal() {
  const rateJugador = async (
    matchId: number,
    playerId: number,
    stars: number,
    comment?: string
  ) => {
    await ratePlayer({
      match_id: matchId,
      rated_user_id: playerId,
      stars,
      comment,
    });
  };

  return { rateJugador };
}
