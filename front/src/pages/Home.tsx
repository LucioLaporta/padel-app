import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCourt } from "../context/CourtContext";

import StarRating from "../components/StarRating";
import CourtSelector from "../components/CourtSelector";
import MatchCardSkeleton from "../components/MatchCardSkeleton";

import { Cancha } from "../types/Cancha";
import { Jugador } from "../types/Jugador";
import { ratePlayer } from "../services/rating.service";

// MATCHES
import { useHomeData } from "../hooks/useHomeData";
import MatchCard from "../components/MatchCard";
import CreateMatchForm from "../components/CreateMatchForm";

export default function Home() {
  const { user, logout } = useAuth();
  const { selectedCourt } = useCourt();

  // MATCHES REAL DATA
  const {
    partidos = [],
    loading,
    crearPartido,
    joinPartido,
    leavePartido,
    finalizarPartido,
  } = useHomeData();

  // MOCK DATA
  const [canchas] = useState<Cancha[]>([
    { id: 1, nombre: "Cancha Central", rating: 4.2, votos: 10 },
    { id: 2, nombre: "Cancha Norte", rating: 3.8, votos: 6 },
    { id: 3, nombre: "Cancha Sur", rating: 4.6, votos: 21 },
  ]);

  const [jugadores, setJugadores] = useState<Jugador[]>([
    { id: 1, nombre: "Juan Pérez", categoria: "6ta", rating: 4.1, votos: 12 },
    { id: 2, nombre: "Martín López", categoria: "5ta", rating: 3.6, votos: 8 },
    { id: 3, nombre: "Lucas Gómez", categoria: "7ma", rating: 4.8, votos: 20 },
  ]);

  // RATE PLAYER
  const handleRateJugador = async (playerId: number, stars: number) => {
    if (!user) return alert("Tenés que estar logueado");

    try {
      await ratePlayer(1, playerId, stars); // matchId mock = 1

      setJugadores((prev) =>
        prev.map((j) =>
          j.id === playerId
            ? {
                ...j,
                rating: (j.rating * j.votos + stars) / (j.votos + 1),
                votos: j.votos + 1,
              }
            : j
        )
      );
    } catch (err) {
      alert("No podés votar (quizás no jugaste o ya votaste)");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial", color: "white" }}>
      <h1>🎾 Padel App</h1>

      {!user ? (
        <p style={{ color: "orange" }}>⚠ No logueado</p>
      ) : (
        <>
          <p>
            Bienvenido <b>{user.username}</b> – {user.clase}
          </p>
          <button onClick={logout}>Cerrar sesión</button>
        </>
      )}

      <hr />

      {/* SELECTOR DE CANCHA GLOBAL */}
      <CourtSelector />

      {selectedCourt && (
        <p style={{ color: "#00e676" }}>
          📍 Cancha seleccionada: {selectedCourt.name}
        </p>
      )}

      <hr />

      {/* CREAR PARTIDO */}
      {user && (
        <>
          <h2>➕ Crear Partido</h2>

          {!selectedCourt ? (
            <p style={{ color: "orange" }}>
              Primero seleccioná una cancha para crear partido
            </p>
          ) : (
            <CreateMatchForm onCreate={crearPartido} />
          )}

          <hr />
        </>
      )}

      {/* PARTIDOS */}
      <h2>🎾 Partidos</h2>

      {/* SIN CANCHA */}
      {!selectedCourt && (
        <p style={{ color: "orange" }}>
          Seleccioná una cancha para ver partidos
        </p>
      )}

      {/* LOADING → skeleton cards */}
      {selectedCourt && loading && (
        <>
          <MatchCardSkeleton />
          <MatchCardSkeleton />
          <MatchCardSkeleton />
        </>
      )}

      {/* SIN PARTIDOS */}
      {selectedCourt && !loading && partidos.length === 0 && (
        <div style={{ marginTop: 10 }}>
          <p>Esta cancha todavía no tiene partidos</p>
          <p style={{ color: "#00e676" }}>
            Sé el primero en crear uno 👇
          </p>
        </div>
      )}

      {/* LISTA REAL */}
      {selectedCourt &&
        !loading &&
        partidos.map((p) => (
          <MatchCard
            key={p.id}
            match={p}
            onJoin={joinPartido}
            onLeave={leavePartido}
            onFinish={finalizarPartido}
          />
        ))}

      <hr />

      {/* JUGADORES */}
      <h2>👤 Jugadores</h2>
      {jugadores.map((j) => (
        <div key={j.id} style={cardStyle}>
          <h3>{j.nombre}</h3>
          <p>Categoría: {j.categoria}</p>
          <p>
            ⭐ {j.rating.toFixed(1)} ({j.votos} votos)
          </p>

          <StarRating
            rating={j.rating}
            onRate={(v) => handleRateJugador(j.id, v)}
          />
        </div>
      ))}
    </div>
  );
}

const cardStyle = {
  border: "1px solid #444",
  padding: 10,
  marginBottom: 10,
  borderRadius: 8,
};
