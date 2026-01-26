import { useGamePhaseStore, GamePhase } from "@/store/gamePhase.store";

/**
 * Hook to access and update the current game phase.
 * Provides helper booleans for each phase.
 */
export const useGamePhase = () => {
  const phase = useGamePhaseStore((state) => state.phase);
  const setPhase = useGamePhaseStore((state) => state.setPhase);

  return {
    phase,
    setPhase,
    // Helper flags for cleaner UI logic
    isIdle: phase === "idle",
    isLobby: phase === "lobby",
    isPlaying: phase === "playing",
    isResult: phase === "result",
  };
};
