import { useState } from "react";
import { Cancha } from "../types/Cancha";
import { Jugador } from "../types/Jugador";
import { Partido } from "../types/Partido";
import { User } from "../types/User";

export function useRatingsMock(
  user: User | null,
  canchasIniciales: Cancha[],
  jugadoresIniciales: Jugador[],
  partidosIniciales: Partido[]
) {
  const [canchas, setCanchas] = useState(canchasIniciales);
  const [jugadores, setJugadores] = useState(jugadoresIniciales);
  const [partidos, setPartidos] = useState(partidosIniciales);

  const puedeVotarCancha = (canchaId: number) => {
    if (!user) return false;
    return partidos.some(
      (p) =>
        p.finalizado &&
        p.canchaId === canchaId &&
        p.jugadoresIds.includes(user.id) &&
        !p.votosCancha.includes(user.id)
    );
  };

  const rateCancha = (canchaId: number, stars: number) => {
    setCanchas((prev) =>
      prev.map((c) =>
        c.id === canchaId
          ? {
              ...c,
              rating: (c.rating * c.votos + stars) / (c.votos + 1),
              votos: c.votos + 1,
            }
          : c
      )
    );
  };

  const puedeVotarJugador = (jugadorId: number) => {
    if (!user) return false;
    return partidos.some(
      (p) =>
        p.finalizado &&
        p.jugadoresIds.includes(user.id) &&
        p.jugadoresIds.includes(jugadorId) &&
        !p.votosJugador.includes(user.id)
    );
  };

  const rateJugador = (jugadorId: number, stars: number) => {
    setJugadores((prev) =>
      prev.map((j) =>
        j.id === jugadorId
          ? {
              ...j,
              rating: (j.rating * j.votos + stars) / (j.votos + 1),
              votos: j.votos + 1,
            }
          : j
      )
    );
  };

  return {
    canchas,
    jugadores,
    partidos,
    puedeVotarCancha,
    puedeVotarJugador,
    rateCancha,
    rateJugador,
  };
}
