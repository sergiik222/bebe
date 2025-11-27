import { useState, useEffect } from 'react';

/**
 * Custom hook for tracking window dimensions and mobile detection
 * Consolidates duplicate logic from MediaComponent and MediaContainerAnimated
 */
export const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    isMobile: typeof window !== 'undefined' ? window.innerWidth <= 767 : false
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setDimensions({
        width,
        height: window.innerHeight,
        isMobile: width <= 767
      });
    };

    handleResize(); // Set initial values
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
};
