export interface Repo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  topics: string[];
}

export interface CatalogFilter {
  language: string;
  query: string;
  sort: "stars" | "recent" | "name";
}

export interface RepoCardProps {
  repo: Repo;
  index: number;
  onOpen: (repo: Repo) => void;
}