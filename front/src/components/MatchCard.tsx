import { Partido } from "../types/Partido";

export default function MatchCard({ match, onJoin, onLeave, onDelete }: any) {
  return (
    <div style={{ border: "1px solid white", padding: 10, marginBottom: 10 }}>
      <h3>🎾 Partido #{match.id}</h3>
      <p>Fecha: {new Date(match.date).toLocaleString()}</p>
      <p>Nivel: {match.level}</p>
      <p>Precio: ${match.price}</p>
      <p>Jugadores: {match.players_count}/4</p>
      <p>Cupos libres: {match.spots_left}</p>

      {match.can_join && <button onClick={() => onJoin(match.id)}>Unirme</button>}
      {match.is_joined && <button onClick={() => onLeave(match.id)}>Salir</button>}
      {match.can_delete && <button onClick={() => onDelete(match.id)}>Borrar</button>}
    </div>
  );
}
