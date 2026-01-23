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

  return (
    <div style={{ border: "1px solid white", padding: 10, marginBottom: 10 }}>
      <h3>🎾 Partido #{match.id}</h3>

      <p>Inicio: {new Date(match.start_time).toLocaleString()}</p>
      <p>Fin: {new Date(match.end_time).toLocaleString()}</p>

      <p>Nivel: {match.level}</p>
      <p>Precio: ${match.price}</p>

      <p>Jugadores: {match.players_count}/4</p>
      <p>Cupos libres: {match.spots_left}</p>

      {/* BOTONES */}
      {match.can_join && <button onClick={() => onJoin(match.id)}>Unirme</button>}
      {match.is_joined && <button onClick={() => onLeave(match.id)}>Salir</button>}
      {match.is_owner && <button onClick={() => onFinish(match.id)}>Finalizar</button>}

      {/* 🔥 MOSTRAR JUGADORES */}
      {match.players && match.players.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <h4>👥 Jugadores del partido:</h4>

          {match.players.map((pid) => (
            <div key={pid} style={{ borderTop: "1px solid gray", padding: 5 }}>
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
