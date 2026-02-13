export default function MatchCardSkeleton() {
  return (
    <div style={styles.card}>
      <div style={styles.lineTitle} />
      <div style={styles.line} />
      <div style={styles.line} />
      <div style={styles.lineShort} />
    </div>
  );
}

const shimmer = {
  background:
    "linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 37%, #2a2a2a 63%)",
  backgroundSize: "400% 100%",
  animation: "shimmer 1.4s ease infinite",
};

const styles = {
  card: {
    border: "1px solid #333",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    background: "#1e1e1e",
  },
  lineTitle: {
    ...shimmer,
    height: 18,
    width: "40%",
    borderRadius: 4,
    marginBottom: 12,
  },
  line: {
    ...shimmer,
    height: 12,
    width: "80%",
    borderRadius: 4,
    marginBottom: 8,
  },
  lineShort: {
    ...shimmer,
    height: 12,
    width: "50%",
    borderRadius: 4,
  },
};
