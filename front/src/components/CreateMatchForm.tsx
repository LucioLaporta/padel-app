import { useState } from "react";

type Props = {
  onCreate: (data: { date: string; level: string; price: number }) => void;
};

export default function CreateMatchForm({ onCreate }: Props) {
  const [date, setDate] = useState("");
  const [level, setLevel] = useState("6ta");
  const [price, setPrice] = useState(1000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({ date, level, price });
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: "1px solid #444", padding: 10 }}>
      <h3>Crear Partido</h3>

      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <select value={level} onChange={(e) => setLevel(e.target.value)}>
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
