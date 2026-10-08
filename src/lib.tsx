export function langColor(lang: string | null): string {
  const colorMap: Record<string, string> = {
    JavaScript: "yellow",
    TypeScript: "blue",
    Python: "orange",
    Rust: "red",
    Go: "green",
    Java: "red",
    CSS: "purple",
    HTML: "orange",
    JSON: "yellow",
    shell: "gray",
    markdown: "gray",
    ts: "blue",
    js: "yellow",
  };

  return colorMap[lang] || "gray";
}

export function timeAgo(dateStr: string): string {
  const created = new Date(dateStr).getTime();
  const now = new Date().getTime();
  const diff = now - created;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;

  if (diff < minute) {
    return "ahora";
  } else if (diff < hour) {
    const mins = Math.floor(diff / minute);
    return `${mins} min${mins !== 1 ? "utos" : "uto"}`;
  } else if (diff < day) {
    const hrs = Math.floor(diff / hour);
    return `${hrs} hr${hrs !== 1 ? "as" : "a"}`;
  } else if (diff < month) {
    const days = Math.floor(diff / day);
    return `${days} day${days !== 1 ? "as" : "a"}`;
  } else {
    const months = Math.floor(diff / month);
    return `${months} month${months !== 1 ? "s" : ""}`;
  }
}

export function fmtSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes: string[] = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export function fullDate(dateStr: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateStr).toLocaleDateString("es-ES", options);
}