import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCourt } from "../context/CourtContext";

import { Cancha } from "../types/Cancha";
import { Jugador } from "../types/Jugador";
import { Partido } from "../types/Partido";

// SERVICES
import { getCanchas } from "../services/canchas.service";
import { getJugadores } from "../services/jugadores.service";

import {
  getMatchesByCourt,
  createMatch,
  joinMatch,
  leaveMatch,
  finishMatch,
} from "../services/matches.service";

export function useHomeData() {
  const { user } = useAuth();
  const { selectedCourt } = useCourt();

  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // =====================
  // LOAD DATA
  // =====================
  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [canchasData, jugadoresData] = await Promise.all([
        getCanchas(),
        getJugadores(),
      ]);

      setCanchas(canchasData);
      setJugadores(jugadoresData);

      // 🔥 Traer partidos SOLO si hay cancha seleccionada
      if (selectedCourt) {
        const matchesData = await getMatchesByCourt(selectedCourt.id);
        setPartidos(matchesData);
      } else {
        setPartidos([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [selectedCourt]);

  // =====================
  // ACTIONS
  // =====================

  const crearPartido = async (payload: {
    start_time: string;
    end_time: string;
    level: string;
    price: number;
    court_id: number;
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

  const finalizarPartido = async (matchId: number) => {
    if (!user) return;

    await finishMatch(matchId);
    cargarDatos();
  };

  return {
    canchas,
    jugadores,
    partidos,
    loading,
    error,

    crearPartido,
    joinPartido,
    leavePartido,
    finalizarPartido,
  };
}
