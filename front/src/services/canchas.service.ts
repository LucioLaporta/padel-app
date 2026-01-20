import { Cancha } from "../types/Cancha";

let canchas: Cancha[] = [
  {
    id: 1,
    nombre: "Cancha Central",
    rating: 4.5,
    votos: 10,
  },
  {
    id: 2,
    nombre: "Cancha Norte",
    rating: 4.2,
    votos: 5,
  },
];

const delay = (ms = 500) =>
  new Promise((res) => setTimeout(res, ms));

export const getCanchas = async (): Promise<Cancha[]> => {
  await delay();
  return canchas;
};

export const votarCancha = async (
  canchaId: number,
  value: number
) => {
  await delay();

  canchas = canchas.map((c) =>
    c.id === canchaId
      ? {
          ...c,
          rating: (c.rating * c.votos + value) / (c.votos + 1),
          votos: c.votos + 1,
        }
      : c
  );
};
