import { useEffect, useRef } from "react";

type P = {
  x: number;
  y: number;
  z: number;
  r: number;
  baseA: number;
};

/**
 * 3D-ish parallax particle field with mouse reactivity + connecting
 * constellation lines near the pointer. Rendered on a canvas for perf.
 */
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    let particles: P[] = [];
    const count = Math.min(180, Math.floor((w * h) / 11000));

    const build = () => {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 1 + 0.2,
        r: Math.random() * 1.6 + 0.3,
        baseA: Math.random() * 0.6 + 0.15,
      }));
    };

    build();

    let raf = 0;
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      const mx = mouse.current.x;
      const my = mouse.current.y;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // slow drift scaled by depth
        p.y -= p.z * 0.15;
        p.x += Math.sin((p.y + i) * 0.002) * 0.12 * p.z;
        if (p.y < -5) p.y = h + 5;
        if (p.x < -5) p.x = w + 5;
        if (p.x > w + 5) p.x = -5;

        // mouse parallax push
        let dx = 0,
          dy = 0,
          alpha = p.baseA;
        if (mouse.current.active) {
          const ddx = p.x - mx;
          const ddy = p.y - my;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist < 160) {
            const force = (160 - dist) / 160;
            dx = (ddx / dist) * force * 24 * p.z;
            dy = (ddy / dist) * force * 24 * p.z;
            alpha = Math.min(1, p.baseA + force * 0.7);
          }
        }

        const px = p.x + dx;
        const py = p.y + dy;

        ctx.beginPath();
        ctx.arc(px, py, p.r * p.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,214,255,${alpha})`;
        ctx.fill();

        // constellation lines near the pointer
        if (mouse.current.active) {
          const ddx = px - mx;
          const ddy = py - my;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(mx, my);
            ctx.strokeStyle = `rgba(130,160,255,${(1 - dist / 150) * 0.25})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(render);
    };

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const onLeave = () => {
      mouse.current.active = false;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[1]"
      aria-hidden
    />
  );
}
