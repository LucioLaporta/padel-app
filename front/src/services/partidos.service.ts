import { Partido } from "../types/Partido";

let partidos: Partido[] = [
  {
    id: 1,
    canchaId: 1,
    jugadoresIds: [1, 2],
    finalizado: false,
    votosCancha: [],
    votosJugador: [],
  },
];

export async function getPartidos(): Promise<Partido[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(partidos), 300);
  });
}

export async function finalizarPartido(
  partidoId: number
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      partidos = partidos.map((p) =>
        p.id === partidoId ? { ...p, finalizado: true } : p
      );
      resolve();
    }, 300);
  });
}
