import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import { Cancha } from "../types/Cancha";
import { Jugador } from "../types/Jugador";

export default function Home() {
  const { user, logout } = useAuth();

  // ================= MOCK DATA =================
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

  // ================= VOTAR CANCHA =================
  const rateCancha = (id: number, stars: number) => {
    setCanchas((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              rating: (c.rating * c.votos + stars) / (c.votos + 1),
              votos: c.votos + 1,
            }
          : c
      )
    );
  };

  // ================= VOTAR JUGADOR =================
  const rateJugador = (id: number, stars: number) => {
    setJugadores((prev) =>
      prev.map((j) =>
        j.id === id
          ? {
              ...j,
              rating: (j.rating * j.votos + stars) / (j.votos + 1),
              votos: j.votos + 1,
            }
          : j
      )
    );
  };

  // ================= UI =================
  return (
    <div style={{ padding: "20px", fontFamily: "Arial", color: "white" }}>
      <h1>🎾 Padel App</h1>

      {/* LOGIN INFO */}
      {!user ? (
        <p style={{ color: "orange" }}>⚠ No logueado (usar pantalla login)</p>
      ) : (
        <>
          <p>
            Bienvenido <b>{user.username}</b> – {user.clase}
          </p>
          <button onClick={logout}>Cerrar sesión</button>
        </>
      )}

      <hr />

      {/* CANCHAS */}
      <h2>🏟️ Canchas</h2>
      {canchas.map((c) => (
        <div
          key={c.id}
          style={{
            border: "1px solid #444",
            padding: 10,
            marginBottom: 10,
            borderRadius: 8,
          }}
        >
          <h3>{c.nombre}</h3>
          <p>
            ⭐ {c.rating.toFixed(1)} ({c.votos} votos)
          </p>

          <StarRating rating={c.rating} onRate={(v) => rateCancha(c.id, v)} />
        </div>
      ))}

      <hr />

      {/* JUGADORES */}
      <h2>👤 Jugadores</h2>
      {jugadores.map((j) => (
        <div
          key={j.id}
          style={{
            border: "1px solid #555",
            padding: 10,
            marginBottom: 10,
            borderRadius: 8,
          }}
        >
          <h3>{j.nombre}</h3>
          <p>Categoría: {j.categoria}</p>
          <p>
            ⭐ {j.rating.toFixed(1)} ({j.votos} votos)
          </p>

          <StarRating rating={j.rating} onRate={(v) => rateJugador(j.id, v)} />
        </div>
      ))}
    </div>
  );
}
