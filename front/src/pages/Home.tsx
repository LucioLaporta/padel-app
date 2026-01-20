import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import PartidoCard from "../components/PartidoCard";

import { Cancha } from "../types/Cancha";
import { Jugador } from "../types/Jugador";
import { Partido } from "../types/Partido";

// =====================
// SERVICES
// =====================
import { getCanchas, votarCancha } from "../services/canchas.service";
import { getJugadores, votarJugador } from "../services/jugadores.service";
import { getPartidos, finalizarPartido } from "../services/partidos.service";

export default function Home() {
  // =====================
  // AUTH
  // =====================
  const { user, login, logout } = useAuth();

  const fakeUser = {
    id: 1,
    username: "nahuel",
    category: "6ta",
  };

  // =====================
  // STATES
  // =====================
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // =====================
  // CARGA DE DATOS
  // =====================
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
  // REGLAS DE NEGOCIO
  // =====================
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

  // =====================
  // HANDLERS
  // =====================
  const handleRateCancha = async (canchaId: number, value: number) => {
    if (!user) return;
    await votarCancha(canchaId, value);
    cargarDatos();
  };

  const handleRateJugador = async (jugadorId: number, value: number) => {
    if (!user) return;
    await votarJugador(jugadorId, value);
    cargarDatos();
  };

  const handleFinalizarPartido = async (id: number) => {
    await finalizarPartido(id);
    cargarDatos();
  };

  // =====================
  // RENDER CONTROL
  // =====================
  if (loading) return <p>Cargando aplicación...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // =====================
  // RENDER
  // =====================
  return (
    <div style={{ padding: "20px" }}>
      <h1>🎾 Padel App</h1>

      {!user ? (
        <button onClick={() => login(fakeUser)}>
          Iniciar sesión
        </button>
      ) : (
        <>
          <p>
            Bienvenido <strong>{user.username}</strong> –{" "}
            {user.category}
          </p>
          <button onClick={logout}>Cerrar sesión</button>
        </>
      )}

      <hr />

      <h2>🏟️ Canchas</h2>
      {canchas.map((cancha) => (
        <div key={cancha.id}>
          <h3>{cancha.nombre}</h3>
          <p>
            ⭐ {cancha.rating.toFixed(1)} ({cancha.votos} votos)
          </p>

          <StarRating
            rating={cancha.rating}
            disabled={!puedeVotarCancha(cancha.id)}
            onRate={(value) =>
              handleRateCancha(cancha.id, value)
            }
          />
        </div>
      ))}

      <hr />

      <h2>👤 Jugadores</h2>
      {jugadores.map((jugador) => (
        <div key={jugador.id}>
          <h3>{jugador.nombre}</h3>
          <p>Categoría: {jugador.categoria}</p>
          <p>
            ⭐ {jugador.rating.toFixed(1)} ({jugador.votos} votos)
          </p>

          <StarRating
            rating={jugador.rating}
            disabled={!puedeVotarJugador(jugador.id)}
            onRate={(value) =>
              handleRateJugador(jugador.id, value)
            }
          />
        </div>
      ))}

      <hr />

      <h2>🎾 Partidos</h2>
      {partidos.map((partido) => {
        const cancha = canchas.find(
          (c) => c.id === partido.canchaId
        );

        const jugadoresPartido = jugadores.filter((j) =>
          partido.jugadoresIds.includes(j.id)
        );

        if (!cancha) return null;

        return (
          <PartidoCard
            key={partido.id}
            partido={partido}
            cancha={cancha}
            jugadores={jugadoresPartido}
            onFinalizar={handleFinalizarPartido}
          />
        );
      })}
    </div>
  );
}
