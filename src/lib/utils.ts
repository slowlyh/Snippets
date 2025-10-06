// src/lib/utils.ts

/**
 * Simple className combiner:
 * Menggabungkan string kelas Tailwind secara aman dengan menghapus nilai falsy.
 * Tidak membutuhkan dependency (clsx/tailwind-merge).
 */
export function cn(...classes: Array<string | false | null | undefined | 0>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Membuat slug URL-friendly dari teks.
 */
export function slugify(input: string): string {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Memetakan nama bahasa ke ekstensi file.
 */
export function langToExt(lang: string): string {
  const l = (lang || "").toLowerCase();
  if (l === "typescript" || l === "ts") return "ts";
  if (l === "javascript" || l === "js") return "js";
  if (l === "python" || l === "py") return "py";
  if (l === "html") return "html";
  if (l === "css") return "css";
  if (l === "shell" || l === "bash" || l === "sh") return "sh";
  if (l === "sql") return "sql";
  return "txt";
}
