import { useEffect, useState } from "react";

/**
 * Hook to prevent hydration mismatches.
 * Returns true only after the component has mounted on the client.
 */
export const useMountGuard = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
};
