import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loadingAuth } = useAuth();

  // Esperar a que cargue la sesión
  if (loadingAuth) {
    return <p>Cargando sesión...</p>;
  }

  // Si no hay usuario → login
  if (!user) {
    return <Navigate to="/" />;
  }

  // Si hay usuario → deja pasar
  return children;
}
