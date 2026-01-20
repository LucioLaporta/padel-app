import { Jugador } from "../types/Jugador";

let jugadores: Jugador[] = [
  {
    id: 1,
    nombre: "Juan",
    categoria: "6ta",
    rating: 4.3,
    votos: 8,
  },
  {
    id: 2,
    nombre: "Pedro",
    categoria: "5ta",
    rating: 4.7,
    votos: 12,
  },
];

const delay = (ms = 500) =>
  new Promise((res) => setTimeout(res, ms));

export const getJugadores = async (): Promise<Jugador[]> => {
  await delay();
  return jugadores;
};

export const votarJugador = async (
  jugadorId: number,
  value: number
) => {
  await delay();

  jugadores = jugadores.map((j) =>
    j.id === jugadorId
      ? {
          ...j,
          rating:
            (j.rating * j.votos + value) / (j.votos + 1),
          votos: j.votos + 1,
        }
      : j
  );
};
