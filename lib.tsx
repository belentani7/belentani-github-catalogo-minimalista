/**
 * lib - Utility functions used across the catalog components
 * Provides formatting and date utilities for repo metadata display
 */
export function langColor(lang: string | null): string {
  const colors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#35724f',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#DEA584',
    Flow: '#88573e',
    CSS: '#563d7c',
    HTML: '#e34f26',
    scss: '#c6538c',
    less: '#563d7c',
    markdown: '#181717',
    '': '#888888',
  };
  return colors[lang] || '#888888';
}

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;

  if (interval >= 1) {
    const years = Math.floor(interval);
    if (years === 1) return 'hace 1 año';
    return `hace ${years} años`;
  }
  interval = seconds / 2592000;
  if (interval >= 1) {
    const months = Math.floor(interval);
    if (months <= 2) return 'hace 1 mes';
    return `hace ${months} meses`;
  }
  interval = seconds / 86400;
  if (interval >= 1) {
    const days = Math.floor(interval);
    if (days === 1) return 'hace 1 día';
    return `hace ${days} días`;
  }
  interval = seconds / 3600;
  if (interval >= 1) {
    const hours = Math.floor(interval);
    if (hours === 1) return 'hace 1 hora';
    return `hace ${hours} horas`;
  }
  interval = seconds / 60;
  if (interval >= 1) {
    const minutes = Math.floor(interval);
    if (minutes === 1) return 'hace 1 minuto';
    return `hace ${minutes} minutos`;
  }
  return 'hace menos de un minuto';
}

export function fmtSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round(bytes / Math.pow(k, i + 1) * 10) / 10} ${sizes[i]}`;
}

export function fullDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}