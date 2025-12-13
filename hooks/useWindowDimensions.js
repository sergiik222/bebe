import { useState, useEffect } from 'react';

/**
 * Custom hook for tracking window dimensions and mobile detection
 * Consolidates duplicate logic from MediaComponent and MediaContainerAnimated
 */
export const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    isMobile: typeof window !== 'undefined' ? window.innerWidth <= 767 : false,
    isLandscape: typeof window !== 'undefined' ? window.innerWidth > window.innerHeight : false
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setDimensions({
        width,
        height,
        isMobile: width <= 767,
        isLandscape: width > height
      });
    };

    handleResize(); // Set initial values
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
};
