import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import { Cancha } from "../types/Cancha";
import { Jugador } from "../types/Jugador";
import { Partido } from "../types/Partido";

export default function Home() {
  const { user, login, logout } = useAuth();

  // ───────────────── USUARIOS ─────────────────
  const fakeUser = {
    id: 1,
    username: "nahuel",
    category: "6ta",
  };

  // ───────────────── ESTADOS ─────────────────
  const [canchas, setCanchas] = useState<Cancha[]>([
    { id: 1, nombre: "Cancha Central", rating: 4.2, votos: 10 },
    { id: 2, nombre: "Cancha Norte", rating: 3.8, votos: 6 },
    { id: 3, nombre: "Cancha Sur", rating: 4.6, votos: 21 },
  ]);

  const [jugadores, setJugadores] = useState<Jugador[]>([
    { id: 1, nombre: "Juan Pérez", categoria: "6ta", rating: 4.1, votos: 12 },
    { id: 2, nombre: "Martín López", categoria: "5ta", rating: 3.6, votos: 8 },
    { id: 3, nombre: "Lucas Gómez", categoria: "7ma", rating: 4.8, votos: 20 },
  ]);

  const [partidos, setPartidos] = useState<Partido[]>([
    {
      id: 1,
      canchaId: 1,
      jugadoresIds: [1, 2],
      finalizado: true,
      votosCancha: [],
      votosJugador: [],
    },
    {
      id: 2,
      canchaId: 2,
      jugadoresIds: [2, 3],
      finalizado: false,
      votosCancha: [],
      votosJugador: [],
    },
  ]);

  // ───────────────── LÓGICA CANCHAS ─────────────────
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

  const handleRateCancha = (canchaId: number, value: number) => {
    setCanchas((prev) =>
      prev.map((c) => {
        if (c.id !== canchaId) return c;

        const total = c.rating * c.votos + value;
        const votos = c.votos + 1;

        return { ...c, rating: total / votos, votos };
      })
    );

    setPartidos((prev) =>
      prev.map((p) =>
        p.canchaId === canchaId
          ? { ...p, votosCancha: [...p.votosCancha, user!.id] }
          : p
      )
    );
  };

  // ───────────────── LÓGICA JUGADORES ─────────────────
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

  const handleRateJugador = (jugadorId: number, value: number) => {
    setJugadores((prev) =>
      prev.map((j) => {
        if (j.id !== jugadorId) return j;

        const total = j.rating * j.votos + value;
        const votos = j.votos + 1;

        return { ...j, rating: total / votos, votos };
      })
    );

    setPartidos((prev) =>
      prev.map((p) =>
        p.jugadoresIds.includes(jugadorId) &&
        p.jugadoresIds.includes(user!.id)
          ? { ...p, votosJugador: [...p.votosJugador, user!.id] }
          : p
      )
    );
  };

  // ───────────────── UI ─────────────────
  return (
    <div style={{ padding: "20px" }}>
      <h1>Padel App</h1>

      {!user ? (
        <button onClick={() => login(fakeUser)}>Iniciar sesión</button>
      ) : (
        <>
          <p>
            Bienvenido <strong>{user.username}</strong> – {user.category}
          </p>
          <button onClick={logout}>Cerrar sesión</button>
        </>
      )}

      <hr />

      <h2>Canchas</h2>

      {canchas.map((cancha) => (
        <div
          key={cancha.id}
          style={{
            border: "1px solid #444",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "8px",
          }}
        >
          <h3>{cancha.nombre}</h3>
          <p>
            ⭐ {cancha.rating.toFixed(1)} ({cancha.votos} votos)
          </p>

          {puedeVotarCancha(cancha.id) && (
            <StarRating
              rating={0}
              onRate={(value) => handleRateCancha(cancha.id, value)}
            />
          )}
        </div>
      ))}

      <hr />

      <h2>Jugadores</h2>

      {jugadores.map((jugador) => (
        <div
          key={jugador.id}
          style={{
            border: "1px solid #555",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "8px",
          }}
        >
          <h3>{jugador.nombre}</h3>
          <p>Categoría: {jugador.categoria}</p>
          <p>
            ⭐ {jugador.rating.toFixed(1)} ({jugador.votos} votos)
          </p>

          {puedeVotarJugador(jugador.id) && (
            <StarRating
              rating={0}
              onRate={(value) =>
                handleRateJugador(jugador.id, value)
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}
