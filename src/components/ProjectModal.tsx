import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import type { Repo } from "../types";
import { fmtSize, fullDate, langColor, timeAgo } from "../lib";

export default function ProjectModal({
  repo,
  onClose,
}: {
  repo: Repo | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {repo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong hud-corner relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl p-8 md:p-10"
          >
            <span className="c1" />
            <span className="c2" />

            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] tracking-[0.3em] text-indigo-300/60">
                  // MÓDULO DE PROYECTO
                </span>
                <h3 className="font-display mt-2 text-3xl font-light tracking-wide text-white">
                  {repo.name}
                </h3>
              </div>
              <button
                onClick={onClose}
                data-hover
                className="rounded-full border border-white/10 p-2 text-white/60 transition-colors hover:border-white/40 hover:text-white"
                aria-label="Cerrar"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-white/55">
              {repo.description ?? "// sin descripción registrada en el repositorio."}
            </p>

            {repo.topics?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {repo.topics.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-indigo-300/20 bg-indigo-400/[0.06] px-3 py-1 font-mono text-[10px] tracking-wide text-indigo-100/70"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* telemetry grid */}
            <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] sm:grid-cols-4">
              <Cell label="STARS" value={String(repo.stargazers_count)} />
              <Cell label="FORKS" value={String(repo.forks_count)} />
              <Cell label="WATCH" value={String(repo.watchers_count)} />
              <Cell label="ISSUES" value={String(repo.open_issues_count)} />
            </div>

            <div className="mt-6 space-y-2.5 font-mono text-[11px] text-white/45">
              <Row k="LENGUAJE">
                {repo.language ? (
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: langColor(repo.language),
                        boxShadow: `0 0 8px ${langColor(repo.language)}90`,
                      }}
                    />
                    {repo.language}
                  </span>
                ) : (
                  "—"
                )}
              </Row>
              <Row k="LICENCIA">{repo.license?.spdx_id ?? "N/A"}</Row>
              <Row k="TAMAÑO">{fmtSize(repo.size)}</Row>
              <Row k="CREADO">{fullDate(repo.created_at)}</Row>
              <Row k="ÚLTIMO PUSH">
                {fullDate(repo.pushed_at)} · {timeAgo(repo.pushed_at)}
              </Row>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                data-hover
                className="group flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-xs tracking-[0.2em] text-white/80 transition-all hover:border-white/40 hover:text-white"
              >
                VER CÓDIGO EN GITHUB
                <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              {repo.homepage && (
                <a
                  href={repo.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-hover
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-indigo-300/30 bg-indigo-400/[0.08] px-6 py-3 text-xs tracking-[0.2em] text-indigo-100 transition-all hover:bg-indigo-400/15"
                >
                  DEMO EN VIVO
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center bg-black/20 py-4">
      <span className="font-display text-2xl font-light text-white">{value}</span>
      <span className="mt-1 font-mono text-[9px] tracking-[0.25em] text-white/35">
        {label}
      </span>
    </div>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
      <span className="tracking-[0.2em] text-white/30">{k}</span>
      <span className="text-white/65">{children}</span>
    </div>
  );
}
