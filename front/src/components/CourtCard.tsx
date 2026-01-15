import { useState } from "react";
import { StarRating } from "./StarRating";

type CourtCardProps = {
  name: string;
  address: string;
  price: number;
  rating: number;
};

export function CourtCard({ name, address, price, rating }: CourtCardProps) {
  const [currentRating, setCurrentRating] = useState(rating);

  return (
    <div style={styles.card}>
      <h3>{name}</h3>
      <p>{address}</p>

      <div style={styles.row}>
        <span>💲 {price}</span>
        <StarRating
          rating={currentRating}
          onRate={setCurrentRating}
        />
      </div>

      <button style={styles.button}>Reservar</button>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "16px",
    width: "260px",
    background: "#1e1e1e",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "12px 0",
  },
  button: {
    width: "100%",
    padding: "8px",
    background: "#00e676",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
