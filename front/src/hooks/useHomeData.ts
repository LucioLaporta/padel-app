import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import { Cancha } from "../types/Cancha";
import { Jugador } from "../types/Jugador";
import { Partido } from "../types/Partido";

import { getCanchas, votarCancha } from "../services/canchas.service";
import { getJugadores, votarJugador } from "../services/jugadores.service";
import { getPartidos, finalizarPartido } from "../services/partidos.service";

export function useHomeData() {
  const { user } = useAuth();

  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [canchasData, jugadoresData, partidosData] =
        await Promise.all([
          getCanchas(),
          getJugadores(),
          getPartidos(),
        ]);

      setCanchas(canchasData);
      setJugadores(jugadoresData);
      setPartidos(partidosData);
    } catch {
      setError("Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const puedeVotarCancha = (canchaId: number) => {
    if (!user) return false;

    return partidos.some(
      (p) =>
        p.canchaId === canchaId &&
        p.finalizado &&
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

  const rateCancha = async (canchaId: number, value: number) => {
    if (!user) return;
    await votarCancha(canchaId, value);
    cargarDatos();
  };

  const rateJugador = async (jugadorId: number, value: number) => {
    if (!user) return;
    await votarJugador(jugadorId, value);
    cargarDatos();
  };

  const finalizar = async (id: number) => {
    await finalizarPartido(id);
    cargarDatos();
  };

  return {
    canchas,
    jugadores,
    partidos,
    loading,
    error,
    puedeVotarCancha,
    puedeVotarJugador,
    rateCancha,
    rateJugador,
    finalizar,
  };
}
