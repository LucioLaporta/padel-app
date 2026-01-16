// SIMULA POST /ratings/cancha
export const votarCancha = async (
  canchaId: number,
  userId: number,
  value: number
) => {
  // simulamos espera del servidor
  await new Promise((res) => setTimeout(res, 300));

  // simulamos respuesta del backend
  return {
    canchaId,
    userId,
    value,
  };
};

// SIMULA POST /ratings/jugador
export const votarJugador = async (
  jugadorId: number,
  userId: number,
  value: number
) => {
  await new Promise((res) => setTimeout(res, 300));

  return {
    jugadorId,
    userId,
    value,
  };
};
