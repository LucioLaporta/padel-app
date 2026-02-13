import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={navStyle}>
      {/* LOGO */}
      <div style={logoStyle}>
        🎾 PadelApp
      </div>

      {/* LINKS */}
      <div style={linksStyle}>
        <Link to="/home" style={linkStyle}>Home</Link>
        <Link to="/courts" style={linkStyle}>Canchas</Link>
        <Link to="/profile" style={linkStyle}>Perfil</Link>
      </div>

      {/* USER */}
      <div style={userStyle}>
        {user && (
          <>
            <span style={{ marginRight: 10 }}>
              👤 {user.username}
            </span>

            <button onClick={handleLogout} style={logoutBtn}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const navStyle = {
  height: 60,
  background: "#121212",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 20px",
  borderBottom: "1px solid #333",
  position: "sticky" as const,
  top: 0,
  zIndex: 999,
};

const logoStyle = {
  fontWeight: "bold",
  fontSize: 18,
};

const linksStyle = {
  display: "flex",
  gap: 20,
};

const linkStyle = {
  textDecoration: "none",
  color: "white",
};

const userStyle = {
  display: "flex",
  alignItems: "center",
};

const logoutBtn = {
  background: "#ff5252",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
};
