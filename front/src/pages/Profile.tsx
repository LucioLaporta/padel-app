import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return <p>No logueado</p>;

  return (
    <div>
      <h2>Perfil</h2>
      <p>Email: {user.email}</p>
      <p>Usuario: {user.username}</p>
      <p>Clase: {user.clase}</p>
    </div>
  );
}
