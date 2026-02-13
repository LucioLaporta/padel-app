import { useState } from "react";
import { useCourt } from "../context/CourtContext";

type Props = {
  onCreate: (data: {
    start_time: string;
    end_time: string;
    level: string;
    price: number;
    court_id: number;
  }) => void;
};

export default function CreateMatchForm({ onCreate }: Props) {
  const { selectedCourt } = useCourt();

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [level, setLevel] = useState("6ta");
  const [price, setPrice] = useState(1000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourt) {
      alert("Seleccioná una cancha primero");
      return;
    }

    onCreate({
      start_time: start,
      end_time: end,
      level,
      price,
      court_id: selectedCourt.id,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ border: "1px solid #444", padding: 10 }}
    >
      <h3>Crear Partido</h3>

      <label>Inicio:</label>
      <input
        type="datetime-local"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />

      <label>Fin:</label>
      <input
        type="datetime-local"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      />

      <select
        value={level}
        onChange={(e) => setLevel(e.target.value)}
      >
        <option>8va</option>
        <option>7ma</option>
        <option>6ta</option>
        <option>5ta</option>
        <option>4ta</option>
        <option>3ra</option>
        <option>2da</option>
        <option>1ra</option>
      </select>

      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      />

      <button type="submit">Crear</button>
    </form>
  );
}
