/**
 * useRepos - Hook to fetch repositories from GitHub API
 * Used by belentani-github-catalogo-minimalista to display repo catalog
 */
import { useEffect, useState } from 'react';

export const USERNAME = 'belentani7';

export function useRepos() {
  const [repos, setRepos] = useState<Array<{
    name: string;
    description: string | null;
    html_url: string;
    language: string | null;
    stargazers_count: number;
    fork_count: number;
    topics: string[];
  }>>([]);

  useEffect(() => {
    async function fetchRepos() {
      try {
        const response = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&type=public`);
        const data = await response.json();
        setRepos(data.map((r: any) => ({
          name: r.name,
          description: r.description,
          html_url: r.html_url,
          language: r.language,
          stargazers_count: r.stargazers_count,
          fork_count: r.forks_count,
          topics: r.topics || [],
        })));
      } catch (error) {
        console.error('Error fetching repos:', error);
      }
    }
    fetchRepos();
  }, []);

  return repos;
}

export default useRepos;