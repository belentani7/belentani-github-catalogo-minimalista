/**
 * types - Type definitions used across the catalog application
 * Defines the Repo interface used throughout the app
 */
export interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  fork_count: number;
  topics: string[];
  pushed_at: string;
  size: number;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    url: string | null;
    spdx_id: string;
  } | null;
  allow_forking: boolean;
  homepage: string | null;
}

/**
 * CatalogFilter - Filter options for the repo catalog
 */
export interface CatalogFilter {
  language: string | null;
  minStars: number;
  maxStars: number;
  searchQuery: string;
}

/**
 * RepoCardProps - Props for individual repo card display
 */
export interface RepoCardProps {
  repo: Repo;
  onViewDetails?: (repo: Repo) => void;
}