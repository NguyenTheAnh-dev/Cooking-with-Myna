import { useEffect, useState } from "react";

/**
 * Hook to prevent hydration mismatches.
 * Returns true only after the component has mounted on the client.
 */
export const useMountGuard = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  return isMounted;
};
