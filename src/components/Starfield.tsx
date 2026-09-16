import { useMemo } from "react";

type Star = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
};

export default function Starfield() {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 140 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.4,
      opacity: Math.random() * 0.7 + 0.15,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Deep gradient base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(40,55,110,0.35),transparent_55%),radial-gradient(ellipse_at_80%_90%,rgba(30,40,80,0.25),transparent_50%)]" />
      {/* Faint nebula on the left/right like the reference */}
      <div className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-indigo-900/20 blur-[120px]" />
      <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-slate-700/20 blur-[130px]" />

      {/* Stars */}
      <div className="absolute inset-0">
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              boxShadow: s.size > 1.4 ? "0 0 6px rgba(255,255,255,0.6)" : "none",
              animation: `pulse-core ${3 + s.delay}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(3,3,7,0.85)_100%)]" />
    </div>
  );
}
