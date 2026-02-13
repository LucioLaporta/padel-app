import { useCourt } from "../context/CourtContext";

// MOCK TEMPORAL hasta conectar backend
const courts = [
  { id: 1, name: "Cancha Central" },
  { id: 2, name: "Cancha Norte" },
  { id: 3, name: "Cancha Sur" },
];

export default function CourtSelector() {
  const { selectedCourt, setSelectedCourt } = useCourt();

  return (
    <div style={{ marginBottom: 20 }}>
      <label>Seleccionar cancha: </label>

      <select
        value={selectedCourt?.id || ""}
        onChange={(e) => {
          const court = courts.find(
            (c) => c.id === Number(e.target.value)
          );
          if (court) setSelectedCourt(court);
        }}
      >
        <option value="">Elegir cancha</option>

        {courts.map((court) => (
          <option key={court.id} value={court.id}>
            {court.name}
          </option>
        ))}
      </select>
    </div>
  );
}
