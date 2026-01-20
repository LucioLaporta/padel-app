import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import PartidoCard from "../components/PartidoCard";

// HOOKS
import { useHomeData } from "../hooks/useHomeData";
import { usePermissions } from "../hooks/usePermissions";

export default function Home() {
  // =====================
  // AUTH
  // =====================
  const { user, login, logout } = useAuth();

  // =====================
  // LOGIN FORM STATE
  // =====================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setLoginError(null);
      await login(email, password);
    } catch (err) {
      setLoginError(
        err instanceof Error ? err.message : "Error al iniciar sesión"
      );
    }
  };

  // =====================
  // DATA + ACTIONS
  // =====================
  const {
    canchas,
    jugadores,
    partidos,
    loading,
    error,
    rateCancha,
    rateJugador,
    cerrarPartido,
  } = useHomeData();

  // =====================
  // PERMISSIONS
  // =====================
  const { puedeVotarCancha, puedeVotarJugador } = usePermissions({
    user,
    partidos,
  });

  // =====================
  // RENDER STATES
  // =====================
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  // =====================
  // RENDER
  // =====================
  return (
    <div style={{ padding: "20px" }}>
      <h1>🎾 Padel App</h1>

      {!user ? (
        <div style={{ maxWidth: "300px" }}>
          <h3>Iniciar sesión</h3>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: "8px" }}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginBottom: "8px" }}
          />

          <button onClick={handleLogin}>Entrar</button>

          {loginError && (
            <p style={{ color: "red" }}>{loginError}</p>
          )}
        </div>
      ) : (
        <>
          <p>
            Bienvenido <strong>{user.username}</strong> –{" "}
            {user.clase}
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
              rateCancha(cancha.id, value)
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
              rateJugador(jugador.id, value)
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
            onFinalizar={cerrarPartido}
          />
        );
      })}
    </div>
  );
}
