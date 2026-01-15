import { Partido } from "../types/Partido";
import { Cancha } from "../types/Cancha";
import { Jugador } from "../types/Jugador";

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
        marginBottom: "12px",
        borderRadius: "8px",
      }}
    >
      <h3>Partido #{partido.id}</h3>
      <p>Cancha: {cancha.nombre}</p>

      <p>Jugadores:</p>
      <ul>
        {jugadores.map((j) => (
          <li key={j.id}>
            {j.nombre} ({j.categoria})
          </li>
        ))}
      </ul>

      <p>
        Estado:{" "}
        <strong>
          {partido.finalizado ? "Finalizado" : "En curso"}
        </strong>
      </p>

      {!partido.finalizado && (
        <button onClick={() => onFinalizar(partido.id)}>
          Finalizar partido
        </button>
      )}
    </div>
  );
}
