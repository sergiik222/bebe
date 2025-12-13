import { useMemo } from 'react';

/**
 * Custom hook for calculating media size and margin based on screen size
 * Consolidates size calculation logic from MediaComponent
 */
export const useMediaSize = (isMobile, isLandscape = false) => {
  return useMemo(() => {
    // Mobile landscape: no margins, one line
    if (isMobile && isLandscape) {
      return {
        size: 320,
        margin: 0
      };
    }
    // Mobile portrait
    if (isMobile) {
      return {
        size: 320,
        margin: 30
      };
    }
    // Desktop
    return {
      size: 450,
      margin: 100
    };
  }, [isMobile, isLandscape]);
};
