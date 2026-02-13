import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCourt } from "../context/CourtContext";

import StarRating from "../components/StarRating";
import MatchCardSkeleton from "../components/MatchCardSkeleton";

import { Cancha } from "../types/Cancha";
import { Jugador } from "../types/Jugador";
import { ratePlayer } from "../services/rating.service";

// MATCHES
import { useHomeData } from "../hooks/useHomeData";
import MatchCard from "../components/MatchCard";
import CreateMatchForm from "../components/CreateMatchForm";

export default function Home() {
  const { user } = useAuth();
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

  // MOCK DATA (jugadores)
  const [jugadores, setJugadores] = useState<Jugador[]>([
    { id: 1, nombre: "Juan Pérez", categoria: "6ta", rating: 4.1, votos: 12 },
    { id: 2, nombre: "Martín López", categoria: "5ta", rating: 3.6, votos: 8 },
    { id: 3, nombre: "Lucas Gómez", categoria: "7ma", rating: 4.8, votos: 20 },
  ]);

  // RATE PLAYER
  const handleRateJugador = async (playerId: number, stars: number) => {
    if (!user) return alert("Tenés que estar logueado");

    try {
      await ratePlayer(1, playerId, stars);

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

  // =====================
  // ORDENAR PARTIDOS
  // =====================

  const partidosActivos = partidos
    .filter((p) => p.status !== "FINISHED")
    .sort(
      (a, b) =>
        new Date(a.start_time).getTime() -
        new Date(b.start_time).getTime()
    );

  const partidosFinalizados = partidos
    .filter((p) => p.status === "FINISHED")
    .sort(
      (a, b) =>
        new Date(b.start_time).getTime() -
        new Date(a.start_time).getTime()
    );

  return (
    <div style={{ fontFamily: "Arial", color: "white" }}>
      <h1>🎾 Padel App</h1>

      {/* CANCHA SELECCIONADA DESDE SIDEBAR */}
      {selectedCourt && (
        <p style={{ color: "#00e676", marginBottom: 10 }}>
          📍 {selectedCourt.name}
        </p>
      )}

      <hr />

      {/* CREAR PARTIDO */}
      {user && (
        <>
          <h2>➕ Crear Partido</h2>

          {!selectedCourt ? (
            <p style={{ color: "orange" }}>
              Seleccioná una cancha en el panel izquierdo
            </p>
          ) : (
            <CreateMatchForm onCreate={crearPartido} />
          )}

          <hr />
        </>
      )}

      {/* PARTIDOS */}
      <h2>🎾 Partidos</h2>

      {!selectedCourt && (
        <p style={{ color: "orange" }}>
          Seleccioná una cancha en el sidebar para ver partidos
        </p>
      )}

      {/* LOADING */}
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

      {/* PARTIDOS ACTIVOS */}
      {selectedCourt &&
        !loading &&
        partidosActivos.map((p) => (
          <MatchCard
            key={p.id}
            match={p}
            onJoin={joinPartido}
            onLeave={leavePartido}
            onFinish={finalizarPartido}
          />
        ))}

      {/* FINALIZADOS */}
      {selectedCourt &&
        !loading &&
        partidosFinalizados.length > 0 && (
          <>
            <h3 style={{ marginTop: 20, color: "#ff5252" }}>
              Partidos finalizados
            </h3>

            {partidosFinalizados.map((p) => (
              <MatchCard
                key={p.id}
                match={p}
                onJoin={joinPartido}
                onLeave={leavePartido}
                onFinish={finalizarPartido}
              />
            ))}
          </>
        )}

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
