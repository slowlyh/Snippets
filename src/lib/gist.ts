import { slugify, langToExt } from '@/lib/utils';

export interface Snippet {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  author: { name: string; url?: string };
  date: string;
  tags?: string[];
  slug: string;
}

const GIST_USER = import.meta.env.VITE_GIST_USER as string;
const GH_TOKEN = import.meta.env.VITE_GH_TOKEN as string | undefined;

// Helper to fetch JSON with optional auth
async function gh<T>(url: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (GH_TOKEN) headers.Authorization = `Bearer ${GH_TOKEN}`;
  const res = await fetch(url, { ...init, headers: { ...headers, ...(init.headers || {}) } });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

let _cache: { time: number; data: Snippet[] } | null = null;

export async function listSnippets(): Promise<Snippet[]> {
  if (!GIST_USER) throw new Error("Missing VITE_GIST_USER env");
  if (_cache && Date.now() - _cache.time < 30000) return _cache.data;

  const gists: any[] = await gh<any[]>(`https://api.github.com/users/${GIST_USER}/gists`);
  const details = await Promise.all(gists.map(g => gh<any>(`https://api.github.com/gists/${g.id}`)));
  const snippets: Snippet[] = [];

  for (const d of details) {
    const files = d.files || {};
    if (!files["meta.json"]) continue;
    const metaFile = files["meta.json"];
    try {
      const metaRes = await fetch(metaFile.raw_url);
      const meta = await metaRes.json();
      const codeEntry = Object.values(files).find((f: any) => f.filename !== "meta.json") as any;
      if (!codeEntry) continue;
      const codeText = await (await fetch(codeEntry.raw_url)).text();
      const slug = meta.slug || slugify(meta.title || codeEntry.filename);

      snippets.push({
        id: d.id,
        title: meta.title || codeEntry.filename,
        description: meta.description || d.description || "",
        language: meta.language || codeEntry.language || "text",
        code: codeText,
        author: (typeof meta.author === "object") ? meta.author : { name: (meta.author || (d.owner?.login ?? GIST_USER)) },
        date: meta.updatedAt || d.updated_at,
        tags: meta.tags || [],
        slug,
      });
    } catch (e) {
      console.error("Failed to parse gist", d.id, e);
    }
  }
  const sorted = snippets.sort((a,b)=> (a.date > b.date ? -1 : 1));
  _cache = { time: Date.now(), data: sorted };
  return sorted;
}

export async function getSnippetBySlug(slug: string): Promise<Snippet | null> {
  const all = await listSnippets();
  return all.find(s => s.slug === slug) ?? null;
}

export interface CreateSnippetInput {
  title: string;
  description: string;
  language: string;
  code: string;
  tags?: string[];
  author: { name: string; url?: string };
  slug?: string;
}

async function ensureUniqueSlug(base: string): Promise<string> {
  const all = await listSnippets();
  const existing = new Set(all.map(s => s.slug));
  if (!existing.has(base)) return base;
  let i = 2;
  while (existing.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

export async function createSnippet(input: CreateSnippetInput): Promise<{ id: string; slug: string }> {
  if (!GH_TOKEN) throw new Error("Missing VITE_GH_TOKEN for write operations");
  const { title, description, language, code, tags, author } = input;
  let slug = (input.slug?.trim() || slugify(title));
  slug = await ensureUniqueSlug(slug);

  const ext = langToExt(language);

  const payload = {
    description: `snippet:${language}:${title}`,
    public: true,
    files: {
      "meta.json": {
        content: JSON.stringify(
          {
            title,
            description,
            language,
            tags: tags ?? [],
            author,
            slug,
            updatedAt: new Date().toISOString(),
          },
          null,
          2
        ),
      },
      [`${slug}.${ext}`]: {
        content: code,
      },
    },
  };

  const res = await gh<any>("https://api.github.com/gists", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  _cache = null;

  return { id: res.id as string, slug };
}
