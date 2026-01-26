import { useCallback } from "react";
import { useGamePhaseStore, GamePhase } from "@/store/gamePhase.store";
import { useLoadingStore } from "@/store/loading.store";

/**
 * Hook to handle transitions between game screens.
 * Can optionally show a loading spinner during the transition delay.
 */
export const useScreenTransition = () => {
  const setPhase = useGamePhaseStore((state) => state.setPhase);
  const { showLoading, hideLoading } = useLoadingStore();

  const transitionTo = useCallback(
    (
      targetPhase: GamePhase,
      delayMs: number = 0,
      withLoading: boolean = false,
    ) => {
      if (delayMs > 0) {
        if (withLoading) {
          showLoading();
        }
        setTimeout(() => {
          setPhase(targetPhase);
          if (withLoading) {
            hideLoading();
          }
        }, delayMs);
      } else {
        setPhase(targetPhase);
      }
    },
    [setPhase, showLoading, hideLoading],
  );

  return {
    transitionTo,
  };
};
