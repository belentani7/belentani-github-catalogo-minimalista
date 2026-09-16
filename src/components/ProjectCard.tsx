import { motion } from "framer-motion";
import type { Repo } from "../types";
import { langColor, timeAgo } from "../lib";

export default function ProjectCard({
  repo,
  index,
  onOpen,
}: {
  repo: Repo;
  index: number;
  onOpen: (r: Repo) => void;
}) {
  const color = langColor(repo.language);

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onOpen(repo)}
      data-hover
      className="card-glow hud-corner group animate-float glass relative flex flex-col overflow-hidden rounded-2xl p-6 text-left"
      style={{ animationDelay: `${(index % 6) * 0.6}s` }}
    >
      <span className="c1" />
      <span className="c2" />

      {/* top-left hover sweep */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      <div className="mb-5 flex items-start justify-between">
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/25">
          MOD/{String(index + 1).padStart(3, "0")}
        </span>
        <span className="text-white/25 transition-all group-hover:rotate-45 group-hover:text-indigo-200">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M7 17L17 7M17 7H8M17 7V16" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      <h3 className="font-display text-lg font-medium tracking-wide text-white/95 transition-colors group-hover:text-white">
        {repo.name}
      </h3>

      <p className="mt-3 min-h-[2.6rem] text-sm leading-relaxed text-white/45 line-clamp-2">
        {repo.description ?? "// sin descripción registrada"}
      </p>

      {repo.topics && repo.topics.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] tracking-wide text-white/40"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center gap-4 border-t border-white/[0.06] pt-4 font-mono text-[11px] text-white/45">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}90` }}
            />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.8 5.8 21l1.6-7L2 9.2l7.1-.6z" />
          </svg>
          {repo.stargazers_count}
        </span>
        <span className="flex items-center gap-1">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="6" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="7" r="2.5" />
            <path d="M6 8.5v7M18 9.5c0 3-4 3-6 4" />
          </svg>
          {repo.forks_count}
        </span>
        <span className="ml-auto text-white/25">{timeAgo(repo.pushed_at)}</span>
      </div>
    </motion.button>
  );
}
