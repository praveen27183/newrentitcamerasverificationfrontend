import React, { useState, useEffect, useRef, useCallback } from 'react';

const Swipeable = ({ children, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, className = '' }) => {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const containerRef = useRef(null);
  const SWIPE_THRESHOLD = 50; // pixels
  const VERTICAL_SWIPE_THRESHOLD = 80; // pixels for vertical swipes

  const handleTouchStart = useCallback((e) => {
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
    setCurrentX(e.touches[0].clientX);
    setCurrentY(e.touches[0].clientY);
    setIsSwiping(true);
  }, []);

  const handleTouchMove = useCallback(
    (e) => {
      if (!isSwiping) return;
      setCurrentX(e.touches[0].clientX);
      setCurrentY(e.touches[0].clientY);
    },
    [isSwiping]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isSwiping) return;
    
    const diffX = startX - currentX;
    const diffY = startY - currentY;
    
    // Determine if it's a horizontal or vertical swipe
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      if (Math.abs(diffX) > SWIPE_THRESHOLD) {
        if (diffX > 0 && onSwipeLeft) {
          onSwipeLeft();
        } else if (diffX < 0 && onSwipeRight) {
          onSwipeRight();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(diffY) > VERTICAL_SWIPE_THRESHOLD) {
        if (diffY > 0 && onSwipeUp) {
          onSwipeUp();
        } else if (diffY < 0 && onSwipeDown) {
          onSwipeDown();
        }
      }
    }
    
    setIsSwiping(false);
  }, [currentX, currentY, isSwiping, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, startX, startY]);

  // Add event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Calculate transform for visual feedback during swipe
  const transformX = isSwiping ? `translateX(${currentX - startX}px)` : 'none';
  const transformY = isSwiping ? `translateY(${currentY - startY}px)` : 'none';
  const transform = isSwiping ? `${transformX} ${transformY}` : 'none';
  const transition = isSwiping ? 'none' : 'transform 0.2s ease-out';

  return (
    <div
      ref={containerRef}
      className={`touch-none select-none ${className}`}
      style={{
        transform,
        transition,
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      {children}
    </div>
  );
};

export default Swipeable;
