// Cold-only palette: blues, steel and white. No warm hues anywhere.
const COLD = [
  "#c8d6ff", // ice white-blue
  "#8fb0ff", // light azure
  "#6f8fe0", // periwinkle
  "#5a72c0", // steel blue
  "#9aa8d8", // muted slate blue
  "#b6c4f0", // pale blue
  "#7fa0d8", // sky steel
];

export function langColor(lang: string | null): string {
  if (!lang) return "#8fb0ff";
  // deterministic cold colour from the language name
  let h = 0;
  for (let i = 0; i < lang.length; i++) h = (h * 31 + lang.charCodeAt(i)) >>> 0;
  return COLD[h % COLD.length];
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "hoy";
  if (days === 1) return "ayer";
  if (days < 30) return `hace ${days}d`;
  const months = Math.floor(days / 30);
  if (months < 12) return `hace ${months}m`;
  return `hace ${Math.floor(months / 12)}a`;
}

export function fullDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function fmtSize(kb: number): string {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}
