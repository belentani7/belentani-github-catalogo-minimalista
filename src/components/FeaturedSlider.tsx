import { motion, useMotionValue, animate } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Repo } from "../types";
import { timeAgo } from "../lib";

const AUTOPLAY_MS = 5200;

/**
 * Coverflow / roulette style featured carousel.
 * - Cards are stacked in depth; the centre one is active.
 * - Navigation is SWIPE / DRAG only (no buttons).
 * - Cold pulsing light only (blue / white). No warm colours.
 */
export default function FeaturedSlider({
  repos,
  onOpen,
}: {
  repos: Repo[];
  onOpen: (r: Repo) => void;
}) {
  const items = repos.slice(0, 7);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const startRef = useRef<number>(Date.now());
  const rafRef = useRef<number>(0);
  const drag = useMotionValue(0);

  const len = items.length;
  const go = useCallback(
    (next: number) => {
      setIndex(((next % len) + len) % len);
      startRef.current = Date.now();
      setProgress(0);
    },
    [len]
  );

  // autoplay + cold progress line
  useEffect(() => {
    if (len <= 1 || paused) return;
    startRef.current = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const p = Math.min(1, elapsed / AUTOPLAY_MS);
      setProgress(p);
      if (p >= 1) go(index + 1);
      else rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [index, paused, len, go]);

  if (len === 0) return null;

  // relative offset for coverflow layout (handles wrap-around, max ±2 visible)
  const offsetOf = (i: number) => {
    let d = i - index;
    if (d > len / 2) d -= len;
    if (d < -len / 2) d += len;
    return d;
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const threshold = 60;
    const power = info.offset.x + info.velocity.x * 0.15;
    if (power < -threshold) go(index + 1);
    else if (power > threshold) go(index - 1);
    animate(drag, 0, { type: "spring", stiffness: 320, damping: 34 });
  };

  return (
    <section
      className="relative z-30 -mt-20 mb-2 select-none px-6 md:-mt-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-lg text-center">
        <span className="font-mono text-[9px] tracking-[0.45em] text-white/25">
          MÓDULOS DESTACADOS · DESLIZA
        </span>
      </div>

      {/* stage */}
      <div className="relative mx-auto mt-6 h-[248px] max-w-3xl [perspective:1600px]">
        <motion.div
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.16}
          style={{ x: drag }}
          onDragEnd={handleDragEnd}
        >
          {items.map((repo, i) => {
            const off = offsetOf(i);
            const abs = Math.abs(off);
            if (abs > 2) return null;
            const active = off === 0;

            return (
              <motion.div
                key={repo.id}
                className="absolute left-1/2 top-1/2 w-[300px] md:w-[360px]"
                animate={{
                  x: `calc(-50% + ${off * 132}px)`,
                  y: "-50%",
                  rotateY: off * -22,
                  scale: active ? 1 : 0.82 - (abs - 1) * 0.08,
                  opacity: abs > 2 ? 0 : active ? 1 : 0.4 - (abs - 1) * 0.18,
                  filter: active ? "blur(0px)" : `blur(${abs * 1.4}px)`,
                  zIndex: 10 - abs,
                }}
                transition={{ type: "spring", stiffness: 210, damping: 30 }}
                onClick={() => (active ? onOpen(repo) : go(i))}
                data-hover={active ? true : undefined}
              >
                <Capsule repo={repo} active={active} index={i} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* cold progress line + ticks */}
      {len > 1 && (
        <div className="mx-auto mt-2 flex max-w-[220px] items-center justify-center gap-1.5">
          {items.map((it, i) => (
            <button
              key={it.id}
              data-hover
              onClick={() => go(i)}
              aria-label={`Módulo ${i + 1}`}
              className="group relative h-4 flex-1"
            >
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/10" />
              {i === index && (
                <span
                  className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-white/70 shadow-[0_0_6px_1px_rgba(200,214,255,0.6)]"
                  style={{ width: `${progress * 100}%` }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function Capsule({ repo, active }: { repo: Repo; active: boolean; index: number }) {
  return (
    <div
      className={`hud-corner relative overflow-hidden rounded-[1.75rem] px-6 py-7 transition-colors duration-500 ${
        active
          ? "border border-white/12 bg-gradient-to-b from-white/[0.05] to-white/[0.01] backdrop-blur-xl"
          : "border border-white/[0.05] bg-white/[0.015] backdrop-blur-md"
      }`}
      style={
        active
          ? { boxShadow: "0 40px 90px -35px rgba(60,90,220,0.5), inset 0 1px 0 rgba(255,255,255,0.06)" }
          : undefined
      }
    >
      {active && <span className="c1" />}
      {active && <span className="c2" />}

      {/* cold pulsing halo */}
      {active && (
        <div className="animate-pulse-core pointer-events-none absolute -top-14 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(150,180,255,0.35),transparent_70%)] blur-2xl" />
      )}

      <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-white/30">
        <span>FEAT</span>
        <span className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
            <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.8 5.8 21l1.6-7L2 9.2l7.1-.6z" />
          </svg>
          {repo.stargazers_count}
        </span>
      </div>

      <h3 className="font-display mt-4 truncate text-xl font-light tracking-wide text-white md:text-2xl">
        {repo.name}
      </h3>

      <p className="mt-2.5 min-h-[2.5rem] text-[13px] leading-relaxed text-white/45 line-clamp-2">
        {repo.description ?? "// sin descripción registrada"}
      </p>

      <div className="mt-4 flex items-center gap-3 font-mono text-[10px] tracking-wide text-white/35">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white/60 shadow-[0_0_5px_1px_rgba(200,214,255,0.6)]" />
            {repo.language}
          </span>
        )}
        <span className="ml-auto">{timeAgo(repo.pushed_at)}</span>
      </div>

      {active && (
        <div className="mt-5 flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-white/40">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          TOCA PARA INSPECCIONAR
        </div>
      )}
    </div>
  );
}


