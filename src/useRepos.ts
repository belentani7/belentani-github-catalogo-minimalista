import { useEffect, useState } from "react";
import type { Profile, Repo } from "./types";

const USERNAME = "belentani7";

type State = {
  repos: Repo[];
  profile: Profile | null;
  loading: boolean;
  error: string | null;
};

export function useRepos(): State {
  const [state, setState] = useState<State>({
    repos: [],
    profile: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${USERNAME}`),
          fetch(
            `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`
          ),
        ]);

        if (!reposRes.ok) {
          throw new Error(
            reposRes.status === 403
              ? "// ERR 403 — Límite de la API de GitHub alcanzado. Reintenta en unos minutos."
              : reposRes.status === 404
              ? `// ERR 404 — Usuario @${USERNAME} no encontrado.`
              : `// ERR ${reposRes.status} — No se pudieron cargar los módulos.`
          );
        }

        const user = userRes.ok ? await userRes.json() : null;
        const repos: Repo[] = await reposRes.json();

        const filtered = repos
          .filter((r) => !r.fork && !r.archived)
          .sort((a, b) => {
            if (b.stargazers_count !== a.stargazers_count)
              return b.stargazers_count - a.stargazers_count;
            return (
              new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
            );
          });

        const profile: Profile | null = user
          ? {
              avatar: user.avatar_url ?? null,
              name: user.name ?? USERNAME,
              bio: user.bio ?? null,
              followers: user.followers ?? 0,
              following: user.following ?? 0,
              publicRepos: user.public_repos ?? filtered.length,
              location: user.location ?? null,
              company: user.company ?? null,
              blog: user.blog || null,
            }
          : null;

        if (cancelled) return;
        setState({ repos: filtered, profile, loading: false, error: null });
      } catch (e) {
        if (cancelled) return;
        setState((s) => ({
          ...s,
          loading: false,
          error: e instanceof Error ? e.message : "// ERR — Error desconocido.",
        }));
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

export { USERNAME };
