import { useLoadingStore } from "@/store/loading.store";

/**
 * Hook to manage global loading state.
 * Reuses the singleton LoadingStore.
 */
export const useGlobalLoading = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);
  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);

  return {
    isLoading,
    show: showLoading,
    hide: hideLoading,
  };
};
