import { Partido } from "../types/Partido";

type Props = {
  partido: Partido;
  onJoin?: (id: number) => void;
  onLeave?: (id: number) => void;
  onFinalizar?: (id: number) => void;
};

export default function PartidoCard({
  partido,
  onJoin,
  onLeave,
  onFinalizar,
}: Props) {
  return (
    <div style={styles.card}>
      <h3>🎾 Partido #{partido.id}</h3>

      <p>
        📅 {new Date(partido.date).toLocaleString()}
      </p>

      <p>🏷️ Nivel: {partido.level}</p>
      <p>💰 Precio: ${partido.price}</p>

      <p>
        👥 Jugadores: {partido.players_count} / 4
      </p>

      <p>
        ⏳ Cupos libres: {partido.spots_left}
      </p>

      <div style={styles.actions}>
        {partido.can_join && onJoin && (
          <button
            style={styles.join}
            onClick={() => onJoin(partido.id)}
          >
            Unirme
          </button>
        )}

        {partido.is_joined && onLeave && (
          <button
            style={styles.leave}
            onClick={() => onLeave(partido.id)}
          >
            Salir
          </button>
        )}

        {partido.can_delete && onFinalizar && (
          <button
            style={styles.delete}
            onClick={() => onFinalizar(partido.id)}
          >
            Borrar
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #444",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "12px",
    background: "#1e1e1e",
    color: "#fff",
  },
  actions: {
    display: "flex",
    gap: "8px",
    marginTop: "12px",
  },
  join: {
    flex: 1,
    padding: "8px",
    background: "#00e676",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
  leave: {
    flex: 1,
    padding: "8px",
    background: "#ff9100",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
  delete: {
    flex: 1,
    padding: "8px",
    background: "#ff5252",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
