import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import { Cancha } from "../types/Cancha";
import { Jugador } from "../types/Jugador";
import { Partido } from "../types/Partido";

// SERVICES
import { getCanchas } from "../services/canchas.service";
import { getJugadores } from "../services/jugadores.service";

import {
  getMatches,
  createMatch,
  joinMatch,
  leaveMatch,
  deleteMatch,
} from "../services/matches.service";

export function useHomeData() {
  const { user } = useAuth();

  // =====================
  // STATE
  // =====================
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // =====================
  // CARGA INICIAL
  // =====================
  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [canchasData, jugadoresData, matchesResponse] =
        await Promise.all([
          getCanchas(),
          getJugadores(),
          getMatches(),
        ]);

      setCanchas(canchasData);
      setJugadores(jugadoresData);

      // backend devuelve { matches: [] }
      setPartidos(matchesResponse.matches);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error cargando datos"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // =====================
  // ACTIONS (MATCHES)
  // =====================

  const crearPartido = async (payload: {
    date: string;
    level: string;
    price: number;
  }) => {
    if (!user) return;
    await createMatch(payload);
    cargarDatos();
  };

  const joinPartido = async (matchId: number) => {
    if (!user) return;
    await joinMatch(matchId);
    cargarDatos();
  };

  const leavePartido = async (matchId: number) => {
    if (!user) return;
    await leaveMatch(matchId);
    cargarDatos();
  };

  const finalizar = async (matchId: number) => {
    if (!user) return;
    await deleteMatch(matchId);
    cargarDatos();
  };

  // =====================
  // RETURN
  // =====================
  return {
    canchas,
    jugadores,
    partidos,
    loading,
    error,

    // acciones
    crearPartido,
    joinPartido,
    leavePartido,
    finalizar,
  };
}
