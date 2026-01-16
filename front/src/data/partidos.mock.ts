import { Partido } from "../types/Partido";

export const PARTIDOS: Partido[] = [
  {
    id: 1,
    canchaId: 1,
    jugadoresIds: [1, 2],
    finalizado: true,
    votosJugador: [],
    votosCancha: [],
  },
  {
    id: 2,
    canchaId: 2,
    jugadoresIds: [2, 3],
    finalizado: false,
    votosJugador: [],
    votosCancha: [],
  },
];
