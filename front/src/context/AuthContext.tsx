import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { loginApi } from "../services/auth.service";

// =====================
// TYPES
// =====================
export interface User {
  id: number;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loadingAuth: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// =====================
// CONTEXT
// =====================
const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

// =====================
// PROVIDER
// =====================
export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // =====================
  // INIT SESSION
  // =====================
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoadingAuth(false);
  }, []);

  // =====================
  // LOGIN REAL
  // =====================
  const login = async (email: string, password: string) => {
    const { token, user } = await loginApi(email, password);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setToken(token);
    setUser(user);
  };

  // =====================
  // LOGOUT
  // =====================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loadingAuth, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =====================
// HOOK
// =====================
export function useAuth() {
  return useContext(AuthContext);
}
