export type Repo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  size: number;
  topics: string[];
  fork: boolean;
  archived: boolean;
  license: { spdx_id: string } | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
};

export type Profile = {
  avatar: string | null;
  name: string;
  bio: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  location: string | null;
  company: string | null;
  blog: string | null;
};
