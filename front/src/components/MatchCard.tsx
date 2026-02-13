import { Partido } from "../types/Partido";
import StarRating from "./StarRating";
import { ratePlayer } from "../services/rating.service";
import { useAuth } from "../context/AuthContext";

type Props = {
  match: Partido;
  onJoin: (id: number) => void;
  onLeave: (id: number) => void;
  onFinish: (id: number) => void;
};

export default function MatchCard({ match, onJoin, onLeave, onFinish }: Props) {
  const { user } = useAuth();

  // ⭐ Calificar jugador
  const handleRate = async (playerId: number, stars: number) => {
    try {
      await ratePlayer(match.id, playerId, stars);
      alert("Jugador calificado correctamente");
    } catch (err) {
      alert("No podés calificar (ya votaste o error)");
      console.error(err);
    }
  };

  // 🎨 COLOR SEGÚN ESTADO
  const getStatusColor = () => {
    if (match.status === "FINISHED") return "#ff5252";
    if (match.is_full) return "#ff9100";
    return "#00e676";
  };

  const getStatusText = () => {
    if (match.status === "FINISHED") return "FINALIZADO";
    if (match.is_full) return "COMPLETO";
    return "ABIERTO";
  };

  return (
    <div
      style={{
        border: "1px solid #444",
        padding: 12,
        marginBottom: 12,
        borderRadius: 10,
        background: "#1e1e1e",
      }}
    >
      <h3>🎾 Partido #{match.id}</h3>

      {/* ESTADO VISUAL */}
      <p style={{ color: getStatusColor(), fontWeight: "bold" }}>
        {getStatusText()}
      </p>

      {/* SI ESTÁS DENTRO */}
      {match.is_joined && match.status !== "FINISHED" && (
        <p style={{ color: "#00e676", fontWeight: "bold" }}>
          Estás dentro de este partido
        </p>
      )}

      <p>Inicio: {new Date(match.start_time).toLocaleString()}</p>
      <p>Fin: {new Date(match.end_time).toLocaleString()}</p>

      <p>Nivel: {match.level}</p>
      <p>Precio: ${match.price}</p>

      <p>Jugadores: {match.players_count}/4</p>
      <p>Cupos libres: {match.spots_left}</p>

      {/* BOTONES */}
      <div style={{ marginTop: 10 }}>
        {match.can_join && match.status !== "FINISHED" && (
          <button onClick={() => onJoin(match.id)}>Unirme</button>
        )}

        {match.is_joined && match.status !== "FINISHED" && (
          <button onClick={() => onLeave(match.id)}>Salir</button>
        )}

        {match.is_owner && match.status !== "FINISHED" && (
          <button onClick={() => onFinish(match.id)}>Finalizar</button>
        )}
      </div>

      {/* 🔥 MOSTRAR JUGADORES */}
      {match.players && match.players.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <h4>👥 Jugadores del partido:</h4>

          {match.players.map((pid) => (
            <div
              key={pid}
              style={{
                borderTop: "1px solid #333",
                padding: 6,
              }}
            >
              <p>Jugador ID: {pid}</p>

              {/* No te calificás a vos mismo */}
              {user && user.id !== pid && match.players_ratings && (
                <StarRating
                  rating={match.players_ratings[pid] || 0}
                  onRate={(stars) => handleRate(pid, stars)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
