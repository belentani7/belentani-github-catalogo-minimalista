/**
 * useSmoothScroll - Hook for smooth scrolling within the catalog
 * Provides scroll-to-element functionality with optional offset
 */
import { useEffect, useRef } from 'react';

export function useSmoothScroll(options: {
  offset?: number;
  duration?: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
} = {}) {
  const { offset = 80, duration = 500, easing = 'ease-out' } = options;
  const targetRef = useRef<string | null>(null);
  const startTime = useRef<number>(performance.now());

  const scroll = (target: string) => {
    targetRef.current = target;
    startTime.current = performance.now();
  };

  useEffect(() => {
    if (!targetRef.current) return;

    const targetElement = document.querySelector(targetRef.current);
    if (!targetElement) return;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Apply easing function
      let easedProgress = progress;
      if (easing === 'ease-in') {
        easedProgress = Math.pow(progress, 2);
      } else if (easing === 'ease-out') {
        easedProgress = 1 - Math.pow(1 - progress, 2);
      } else if (easing === 'ease-in-out') {
        easedProgress = progress < 0.5 
          ? Math.pow(2 * progress, 2) / 2
          : 1 - Math.pow(2 * (1 - progress), 2) / 2;
      }

      const targetPos = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo(0, window.pageYOffset + (targetPos - window.pageYOffset) * easedProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        targetRef.current = null;
      }
    };

    requestAnimationFrame(animate);

    // Cleanup
    return () => {
      targetRef.current = null;
    };
  }, [offset, duration, easing]);

  return { scroll };
}

export default useSmoothScroll;