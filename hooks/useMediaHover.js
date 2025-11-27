import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for handling media hover and drag detection
 * Prevents accidental clicks during drag operations
 * Consolidates hover logic from ImageComponent and VideoComponent
 */
export const useMediaHover = (isDragging, onHoverChange) => {
  const [isHovered, setIsHovered] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, wasDragging: false });

  const handleMouseOver = useCallback(() => {
    if (!isDragging) {
      setIsHovered(true);
      onHoverChange?.(true);
    }
  }, [isDragging, onHoverChange]);

  const handleMouseOut = useCallback(() => {
    setIsHovered(false);
    onHoverChange?.(false);
  }, [onHoverChange]);

  const handleMouseDown = useCallback((e) => {
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      wasDragging: false
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (dragStartRef.current.x !== 0 || dragStartRef.current.y !== 0) {
      const deltaX = Math.abs(e.clientX - dragStartRef.current.x);
      const deltaY = Math.abs(e.clientY - dragStartRef.current.y);
      if (deltaX > 5 || deltaY > 5) {
        dragStartRef.current.wasDragging = true;
      }
    }
  }, []);

  const handleClick = useCallback((onClick) => {
    if (!isDragging && !dragStartRef.current.wasDragging) {
      onClick?.();
    }
    dragStartRef.current = { x: 0, y: 0, wasDragging: false };
  }, [isDragging]);

  return {
    isHovered,
    dragStartRef,
    handlers: {
      onMouseOver: handleMouseOver,
      onMouseOut: handleMouseOut,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove
    },
    handleClick
  };
};
