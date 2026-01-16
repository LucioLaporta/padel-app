import { Cancha } from "../types/Cancha";
import { Jugador } from "../types/Jugador";
import { Partido } from "../types/Partido";

type Props = {
  partido: Partido;
  cancha: Cancha;
  jugadores: Jugador[];
  onFinalizar: (id: number) => void;
};

export default function PartidoCard({
  partido,
  cancha,
  jugadores,
  onFinalizar,
}: Props) {
  return (
    <div
      style={{
        border: "1px solid #666",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "12px",
      }}
    >
      <h3>🏟️ {cancha.nombre}</h3>

      <p>
        Estado:{" "}
        <strong>
          {partido.finalizado ? "Finalizado" : "En juego"}
        </strong>
      </p>

      <h4>Jugadores</h4>
      <ul>
        {jugadores.map((j) => (
          <li key={j.id}>
            {j.nombre} ({j.categoria})
          </li>
        ))}
      </ul>

      {!partido.finalizado && (
        <button onClick={() => onFinalizar(partido.id)}>
          Finalizar partido
        </button>
      )}
    </div>
  );
}
