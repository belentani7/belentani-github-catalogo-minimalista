import { useMemo } from "react";

/**
 * Static deep-black backdrop: nebula fog, animated grid floor,
 * twinkling far stars and a moving scanline. Kept purely decorative.
 */
export default function Backdrop() {
  const stars = useMemo(
    () =>
      Array.from({ length: 90 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: Math.random() * 1.4 + 0.3,
        o: Math.random() * 0.5 + 0.1,
        d: Math.random() * 6,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black">
      {/* radial depth — colder, finer, deeper */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-15%,rgba(30,42,90,0.32),transparent_48%),radial-gradient(ellipse_at_15%_30%,rgba(14,20,42,0.3),transparent_42%),radial-gradient(ellipse_at_85%_78%,rgba(18,24,48,0.26),transparent_48%)]" />

      {/* cold nebula fog only */}
      <div className="absolute -left-48 top-1/4 h-[600px] w-[600px] rounded-full bg-indigo-950/35 blur-[150px]" />
      <div className="absolute -right-48 bottom-0 h-[600px] w-[600px] rounded-full bg-slate-900/40 blur-[160px]" />

      {/* twinkle stars */}
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.s}px`,
            height: `${s.s}px`,
            ["--o" as string]: s.o,
            animation: `twinkle ${4 + s.d}s ease-in-out ${s.d}s infinite`,
          }}
        />
      ))}

      {/* perspective grid floor */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[45vh] opacity-[0.1]"
        style={{
          background:
            "linear-gradient(rgba(130,160,255,0.28) 1px, transparent 1px), linear-gradient(90deg, rgba(130,160,255,0.28) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          transform: "perspective(400px) rotateX(60deg)",
          transformOrigin: "bottom",
          maskImage:
            "linear-gradient(to top, black 0%, transparent 90%)",
          WebkitMaskImage:
            "linear-gradient(to top, black 0%, transparent 90%)",
          animation: "gridmove 8s linear infinite",
        }}
      />

      {/* scanline */}
      <div
        className="absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-indigo-400/[0.04] to-transparent"
        style={{ animation: "scanline 9s linear infinite" }}
      />

      {/* scan texture + deep vignette */}
      <div className="scan-overlay absolute inset-0 opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.98)_100%)]" />
    </div>
  );
}
