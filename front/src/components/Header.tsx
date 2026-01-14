export function Header() {
  return (
    <header style={styles.header}>
      <h2 style={styles.logo}>Padel App</h2>

      <nav style={styles.nav}>
        <button style={styles.button}>Ingresar</button>
        <button style={styles.buttonPrimary}>Registrarse</button>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    borderBottom: "1px solid #333",
  },
  logo: {
    margin: 0,
  },
  nav: {
    display: "flex",
    gap: "12px",
  },
  button: {
    background: "transparent",
    color: "white",
    border: "1px solid #555",
    padding: "8px 12px",
    cursor: "pointer",
  },
  buttonPrimary: {
    background: "#00e676",
    color: "black",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
