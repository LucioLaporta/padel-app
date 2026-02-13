import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

interface Court {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  price_per_hour: number;
}

// Fix icon default (porque Leaflet a veces no los carga bien en Vite)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function MapPage() {
  const [courts, setCourts] = useState<Court[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/courts")
      .then((res) => res.json())
      .then((data) => {
        // Convertimos lat y lng a nÃºmero por las dudas
        const parsed = data.courts.map((c: Court) => ({
          ...c,
          latitude: Number(c.latitude),
          longitude: Number(c.longitude),
        }));
        setCourts(parsed);
      })
      .catch((err) => console.error("Error cargando canchas:", err));
  }, []);

  return (
    <div>
      <h2>Mapa de Canchas en Rosario</h2>

      <MapContainer
        center={[-32.947129, -60.669773]} // Centro fijo en Rosario
        zoom={11.3}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {courts.map((court) => (
          <Marker
            key={court.id}
            position={[court.latitude, court.longitude]}
          >
            <Popup>
              <h3>{court.name}</h3>
              <p>{court.address}</p>
              <p>${court.price_per_hour} / hora</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}