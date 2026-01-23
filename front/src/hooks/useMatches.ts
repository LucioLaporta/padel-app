import { useEffect, useState } from "react";
import { getMatches, joinMatch, leaveMatch } from "../services/matches.service";
import { Partido } from "../types/Partido";

export function useMatches() {
  const [matches, setMatches] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMatches = async () => {
    try {
      const data = await getMatches();
      setMatches(data);
    } catch (err) {
      console.error("Error loading matches", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const join = async (id: number) => {
    await joinMatch(id);
    loadMatches();
  };

  const leave = async (id: number) => {
    await leaveMatch(id);
    loadMatches();
  };

  return { matches, loading, join, leave };
}
