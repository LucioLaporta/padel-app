import { Partido } from "../types/Partido";
import { User } from "../types/User";

interface Props {
  user: User | null;
  partidos: Partido[];
}

export function usePermissions({ user, partidos }: Props) {
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

  return {
    puedeVotarCancha,
    puedeVotarJugador,
  };
}
