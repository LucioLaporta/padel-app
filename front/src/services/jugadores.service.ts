import { Jugador } from "../types/Jugador";

let jugadores: Jugador[] = [
  { id: 1, nombre: "Juan", categoria: "6ta", rating: 4.0, votos: 4 },
  { id: 2, nombre: "Pedro", categoria: "6ta", rating: 4.5, votos: 6 },
];

export async function getJugadores(): Promise<Jugador[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(jugadores), 300);
  });
}

export async function votarJugador(
  jugadorId: number,
  value: number
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      jugadores = jugadores.map((j) =>
        j.id !== jugadorId
          ? j
          : {
              ...j,
              rating: (j.rating * j.votos + value) / (j.votos + 1),
              votos: j.votos + 1,
            }
      );
      resolve();
    }, 300);
  });
}
