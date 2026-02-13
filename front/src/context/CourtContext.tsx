import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// =====================
// TYPES
// =====================
export interface Court {
  id: number;
  name: string;
}

interface CourtContextType {
  selectedCourt: Court | null;
  setSelectedCourt: (court: Court) => void;
}

// =====================
// CONTEXT
// =====================
const CourtContext = createContext<CourtContextType>(
  {} as CourtContextType
);

// =====================
// PROVIDER
// =====================
export function CourtProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedCourt, setSelectedCourtState] =
    useState<Court | null>(null);

  // 🔥 Cargar cancha guardada al iniciar la app
  useEffect(() => {
    const savedCourt = localStorage.getItem("selectedCourt");
    if (savedCourt) {
      setSelectedCourtState(JSON.parse(savedCourt));
    }
  }, []);

  // 🔥 Guardar cancha cuando cambia
  const setSelectedCourt = (court: Court) => {
    localStorage.setItem("selectedCourt", JSON.stringify(court));
    setSelectedCourtState(court);
  };

  return (
    <CourtContext.Provider
      value={{ selectedCourt, setSelectedCourt }}
    >
      {children}
    </CourtContext.Provider>
  );
}

// =====================
// HOOK
// =====================
export function useCourt() {
  return useContext(CourtContext);
}
