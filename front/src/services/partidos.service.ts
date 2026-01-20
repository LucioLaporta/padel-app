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

const delay = (ms = 500) =>
  new Promise((res) => setTimeout(res, ms));

export const getPartidos = async (): Promise<Partido[]> => {
  await delay();
  return partidos;
};

export const finalizarPartido = async (id: number) => {
  await delay();

  partidos = partidos.map((p) =>
    p.id === id ? { ...p, finalizado: true } : p
  );
};
