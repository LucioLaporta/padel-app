import { useCourt } from "../context/CourtContext";

const MOCK_COURTS = [
  { id: 1, name: "Cancha Central" },
  { id: 2, name: "Cancha Norte" },
  { id: 3, name: "Cancha Sur" },
];

export default function SidebarCourts() {
  const { selectedCourt, setSelectedCourt } = useCourt();

  return (
    <div style={sidebar}>
      <h3 style={{ marginBottom: 15 }}>🎾 Canchas</h3>

      {MOCK_COURTS.map((court) => (
        <div
          key={court.id}
          onClick={() => setSelectedCourt(court)}
          style={{
            ...courtItem,
            background:
              selectedCourt?.id === court.id
                ? "#00e676"
                : "transparent",
            color:
              selectedCourt?.id === court.id
                ? "black"
                : "white",
          }}
        >
          {court.name}
        </div>
      ))}
    </div>
  );
}

const sidebar = {
  width: 240,
  background: "#1a1a1a",
  padding: 20,
  borderRight: "1px solid #333",
  minHeight: "calc(100vh - 60px)",
};

const courtItem = {
  padding: 12,
  borderRadius: 8,
  cursor: "pointer",
  marginBottom: 8,
};
