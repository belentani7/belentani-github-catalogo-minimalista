import { useEffect } from "react";

export function useSmoothScroll() {
  useEffect(() => {
    const handlescroll = () => {
      const currentY = window.pageYOffset;
      const targetY = 0;
      const duration = 500;
      const start = performance.now();

      function animateScroll(currentTime: number) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentYPos = currentY * (1 - easeOut) + targetY * easeOut;

        window.scrollTo(0, currentYPos);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      }

      requestAnimationFrame(animateScroll);
    };

    window.addEventListener("scroll", handlescroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handlescroll);
    };
  }, []);
}