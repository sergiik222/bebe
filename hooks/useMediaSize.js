import { useMemo } from 'react';

/**
 * Custom hook for calculating media size and margin based on screen size
 * Consolidates size calculation logic from MediaComponent
 */
export const useMediaSize = (isMobile) => {
  return useMemo(() => ({
    size: isMobile ? 320 : 450,
    margin: isMobile ? 30 : 100
  }), [isMobile]);
};
