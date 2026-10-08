import { useEffect, useState } from "react";

type Repo = {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  topics: string[];
};

interface UseReposReturn {
  repos: Repo[];
  profile: {
    username: string;
    bio: string | null;
    followers: number;
  } | null;
  loading: boolean;
  error: string | null;
}

const USERNAME = "belentani";

export { USERNAME, type Repo, type UseReposReturn };

export function useRepos(): UseReposReturn {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [profile, setProfile] = useState<{
    username: string;
    bio: string | null;
    followers: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [reposRes, profileRes] = await Promise.all([
          fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`),
          fetch(`https://api.github.com/users/${USERNAME}`),
        ]);

        if (!reposRes.ok) throw new Error("Error fetching repos");
        if (!profileRes.ok) throw new Error("Error fetching profile");

        const reposData = (await reposRes.json()) as Repo[];
        const profileData = await profileRes.json();

        setRepos(
          reposData.map((r: any) => ({
            id: r.id,
            name: r.name,
            description: r.description,
            language: r.language,
            stargazers_count: r.stargazers_count,
            forks_count: r.forks_count,
            pushed_at: r.pushed_at,
            topics: r.topics || [],
          }))
        );

        setProfile({
          username: USERNAME,
          bio: profileData.bio || null,
          followers: profileData.followers || 0,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { repos, profile, loading, error };
}