import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header style={styles.header}>
      <h2 style={styles.logo}>🎾 Padel App</h2>

      <nav style={styles.nav}>
        {user && (
          <>
            <Link to="/home">Home</Link>
            <Link to="/courts">Canchas</Link>
            <Link to="/profile">Perfil</Link>
          </>
        )}

        {!user ? (
          <Link to="/">Login</Link>
        ) : (
          <button onClick={handleLogout}>Salir</button>
        )}
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
    gap: "16px",
    alignItems: "center",
  },
};
