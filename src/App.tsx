import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Backdrop from "./components/Backdrop";
import ParticleField from "./components/ParticleField";
import Cursor from "./components/Cursor";
import CoreVisual from "./components/CoreVisual";
import DecryptText from "./components/DecryptText";
import ProjectCard from "./components/ProjectCard";
import ProjectModal from "./components/ProjectModal";
import FeaturedSlider from "./components/FeaturedSlider";
import { useRepos, USERNAME } from "./useRepos";
import { useSmoothScroll } from "./useSmoothScroll";
import { langColor } from "./lib";
import type { Repo } from "./types";

type SortKey = "stars" | "recent" | "name";

export default function App() {
  useSmoothScroll();
  const { repos, profile, loading, error } = useRepos();
  const [query, setQuery] = useState("");
  const [activeLang, setActiveLang] = useState("Todos");
  const [sort, setSort] = useState<SortKey>("stars");
  const [selected, setSelected] = useState<Repo | null>(null);

  const languages = useMemo(() => {
    const map = new Map<string, number>();
    repos.forEach((r) => r.language && map.set(r.language, (map.get(r.language) ?? 0) + 1));
    const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    return ["Todos", ...sorted.map(([l]) => l)];
  }, [repos]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    const list = repos.filter((r) => {
      const matchLang = activeLang === "Todos" || r.language === activeLang;
      const matchQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q) ||
        (r.topics ?? []).some((t) => t.toLowerCase().includes(q));
      return matchLang && matchQuery;
    });
    return [...list].sort((a, b) => {
      if (sort === "stars") return b.stargazers_count - a.stargazers_count;
      if (sort === "name") return a.name.localeCompare(b.name);
      return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
    });
  }, [repos, activeLang, query, sort]);

  const totalStars = repos.reduce((a, r) => a + r.stargazers_count, 0);
  const totalForks = repos.reduce((a, r) => a + r.forks_count, 0);

  return (
    <div className="relative min-h-screen bg-black">
      <Cursor />
      <Backdrop />
      <ParticleField />

      {/* fixed HUD frame */}
      <div className="pointer-events-none fixed inset-0 z-[60] hidden md:block">
        <div className="absolute left-6 top-6 font-mono text-[10px] tracking-[0.3em] text-white/25 animate-[flicker_6s_infinite]">
          NOIACORE // SYS.ONLINE
        </div>
        <div className="absolute right-6 top-6 font-mono text-[10px] tracking-[0.3em] text-white/25">
          LAT 41.38 · LON 2.17
        </div>
        <div className="absolute bottom-6 left-6 font-mono text-[10px] tracking-[0.3em] text-white/25">
          v2.5.0 — STABLE
        </div>
        <div className="absolute bottom-6 right-6 font-mono text-[10px] tracking-[0.3em] text-white/25">
          @{USERNAME}
        </div>
      </div>

      {/* ================= HERO ================= */}
      <header className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
        <CoreVisual />

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8 flex items-center justify-center gap-8 font-mono text-[10px] tracking-[0.35em] text-white/35 md:gap-16"
          >
            <span>— 001</span>
            <span className="hidden sm:inline">CATÁLOGO DE PROYECTOS</span>
            <span>2025 —</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, letterSpacing: "0.3em" }}
            animate={{ opacity: 1, letterSpacing: "0.05em" }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[16vw] font-light leading-none md:text-[9.5rem]"
          >
            <span className="shimmer-text">NOIA</span>
            <span className="text-white/60">CORE</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="font-display tracking-mega mt-2 text-xs text-white/40 md:text-sm"
          >
            L A B
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-6 sm:flex-row sm:justify-between"
          >
            <div className="text-left font-mono text-[10px] leading-relaxed tracking-[0.15em] text-white/40">
              INTELIGENCIA SILENCIOSA.
              <br />
              TECNOLOGÍA ESENCIAL.
            </div>
            <div className="text-right font-mono text-[10px] leading-relaxed tracking-[0.15em] text-white/40">
              ARQUITECTURA DE PROYECTOS
              <br />
              PARA EL FUTURO DEL CÓDIGO.
            </div>
          </motion.div>

          <motion.a
            href="#proyectos"
            data-hover
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="group mt-14 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-8 py-3.5 font-mono text-xs tracking-[0.25em] text-white/70 backdrop-blur transition-all hover:border-white/40 hover:text-white"
          >
            INICIAR SECUENCIA
            <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      </header>

      {/* ============ FEATURED SLIDER (smartwatch) ============ */}
      {!loading && !error && repos.length > 0 && (
        <FeaturedSlider repos={repos} onOpen={setSelected} />
      )}

      {/* ================= STATS ================= */}
      <section className="relative z-10 mx-auto grid max-w-5xl grid-cols-2 gap-px overflow-hidden border-y border-white/[0.06] bg-white/[0.01] md:grid-cols-4">
        <Stat label="REPOSITORIOS" value={loading ? "—" : String(repos.length)} />
        <Stat label="ESTRELLAS" value={loading ? "—" : String(totalStars)} />
        <Stat label="FORKS" value={loading ? "—" : String(totalForks)} />
        <Stat label="SEGUIDORES" value={loading ? "—" : String(profile?.followers ?? 0)} />
      </section>

      {/* ================= TECH STACK ================= */}
      {!loading && !error && languages.length > 1 && (
        <section className="relative z-10 mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 text-center">
            <span className="font-mono text-[10px] tracking-[0.4em] text-indigo-300/60">
              // MATRIZ TECNOLÓGICA
            </span>
            <h2 className="mt-3">
              <DecryptText
                text="Lenguajes en órbita"
                className="font-display block text-2xl font-light tracking-wide text-white md:text-3xl"
              />
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {languages.slice(1).map((lang, i) => (
              <motion.span
                key={lang}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="glass flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs text-white/60"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: langColor(lang), boxShadow: `0 0 8px ${langColor(lang)}90` }}
                />
                {lang}
              </motion.span>
            ))}
          </div>
        </section>
      )}

      {/* ================= PROJECTS ================= */}
      <main id="proyectos" className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mb-14 text-center">
          <span className="font-mono text-[10px] tracking-[0.4em] text-indigo-300/60">
            — SISTEMA DE PROYECTOS —
          </span>
          <h2 className="mt-4">
            <DecryptText
              text="Tarjetas flotantes"
              className="font-display block text-4xl font-light tracking-wide text-white md:text-6xl"
            />
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/40">
            Cada proyecto abierto orbita en su propio módulo. Telemetría en
            tiempo real desde la API de GitHub · @{USERNAME}.
          </p>
        </div>

        {!loading && !error && repos.length > 0 && (
          <div className="mb-12 flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-xs">
                <svg viewBox="0 0 24 24" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" strokeLinecap="round" />
                </svg>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="buscar módulo..."
                  className="glass w-full rounded-full py-2.5 pl-11 pr-4 font-mono text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-indigo-300/40"
                />
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest">
                <span className="text-white/30">ORDEN:</span>
                {(["stars", "recent", "name"] as SortKey[]).map((k) => (
                  <button
                    key={k}
                    data-hover
                    onClick={() => setSort(k)}
                    className={`rounded-full border px-3 py-1.5 uppercase transition-all ${
                      sort === k
                        ? "border-indigo-300/50 bg-indigo-400/10 text-white"
                        : "border-white/10 text-white/40 hover:text-white/80"
                    }`}
                  >
                    {k === "stars" ? "★" : k === "recent" ? "◷" : "A–Z"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  data-hover
                  onClick={() => setActiveLang(lang)}
                  className={`rounded-full border px-4 py-1.5 font-mono text-xs tracking-wide transition-all ${
                    activeLang === lang
                      ? "border-indigo-300/50 bg-indigo-400/10 text-white"
                      : "border-white/10 bg-white/[0.02] text-white/45 hover:border-white/25 hover:text-white/80"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <div className="font-mono text-[10px] tracking-[0.25em] text-white/25">
              &gt; MOSTRANDO {filtered.length} DE {repos.length} MÓDULOS
            </div>
          </div>
        )}

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass h-60 animate-pulse rounded-2xl" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="p-6">
                  <div className="mb-6 h-3 w-16 rounded bg-white/10" />
                  <div className="h-4 w-3/4 rounded bg-white/10" />
                  <div className="mt-3 h-3 w-full rounded bg-white/5" />
                  <div className="mt-2 h-3 w-2/3 rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="glass-strong mx-auto max-w-lg rounded-2xl p-10 text-center">
            <div className="font-mono text-4xl text-white/20">⚠</div>
            <p className="mt-4 font-mono text-sm text-white/60">{error}</p>
            <a
              href={`https://github.com/${USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              data-hover
              className="mt-6 inline-block rounded-full border border-white/20 px-6 py-2 font-mono text-xs tracking-widest text-white/70 transition-colors hover:border-white/50 hover:text-white"
            >
              VER EN GITHUB
            </a>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((repo, i) => (
                <ProjectCard key={repo.id} repo={repo} index={i} onOpen={setSelected} />
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="py-16 text-center font-mono text-sm text-white/40">
                &gt; SIN COINCIDENCIAS EN EL SISTEMA
              </p>
            )}
          </>
        )}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
          <div>
            <p className="font-display text-sm tracking-[0.3em] text-white/70">NOIACORE LAB</p>
            <p className="mt-1.5 font-mono text-xs tracking-wide text-white/30">
              ARQUITECTURA DE PROYECTOS · @{USERNAME}
            </p>
            {profile?.bio && (
              <p className="mt-3 max-w-sm text-xs leading-relaxed text-white/35">{profile.bio}</p>
            )}
          </div>
          <a
            href={`https://github.com/${USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            data-hover
            className="group flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 font-mono text-xs tracking-[0.2em] text-white/50 transition-all hover:border-white/40 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 015 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.02 10.02 0 0022 12.25C22 6.58 17.52 2 12 2z" />
            </svg>
            CONECTAR
          </a>
        </div>
        <div className="mx-auto mt-10 max-w-6xl border-t border-white/[0.04] pt-6 text-center font-mono text-[10px] tracking-[0.25em] text-white/20">
          © 2025 NOIACORE LAB — TODOS LOS SISTEMAS OPERATIVOS
        </div>
      </footer>

      <ProjectModal repo={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center py-10"
    >
      <span className="font-display text-3xl font-light text-white md:text-4xl">{value}</span>
      <span className="mt-2 font-mono text-[10px] tracking-[0.3em] text-white/35">{label}</span>
    </motion.div>
  );
}
