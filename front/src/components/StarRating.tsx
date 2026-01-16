import { useState } from "react";

type Props = {
  rating: number;
  disabled?: boolean;
  onRate: (value: number) => void;
};

export default function StarRating({
  rating,
  onRate,
  disabled = false,
}: Props) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ fontSize: "28px" }}>
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          style={{
            cursor: disabled ? "not-allowed" : "pointer",
            color:
              value <= (hover || rating)
                ? "gold"
                : "lightgray",
          }}
          onMouseEnter={() => !disabled && setHover(value)}
          onMouseLeave={() => setHover(0)}
          onClick={() => !disabled && onRate(value)}
        >
          ★
        </span>
      ))}

      {disabled && (
        <p style={{ fontSize: "12px", color: "red" }}>
          Iniciá sesión para puntuar
        </p>
      )}
    </div>
  );
}
