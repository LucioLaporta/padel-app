import { useState } from "react";
import { useAuth } from "../context/AuthContext";

type Props = {
  rating: number;
  onRate: (value: number) => void;
};

export default function StarRating({ rating, onRate }: Props) {
  const { user } = useAuth();
  const [hover, setHover] = useState(0);

  return (
    <div style={{ fontSize: "28px" }}>
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          style={{
            cursor: user ? "pointer" : "not-allowed",
            color:
  user && value <= (hover || rating)
    ? "gold"
    : "lightgray",

          }}
          onMouseEnter={() => user && setHover(value)}
          onMouseLeave={() => setHover(0)}
          onClick={() => user && onRate(value)}
        >
          ★
        </span>
      ))}
      {!user && (
        <p style={{ fontSize: "12px", color: "red" }}>
          Iniciá sesión para puntuar
        </p>
      )}
    </div>
  );
}
