// src/pages/Index.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { listSnippets, type Snippet } from "@/lib/gist";
import { SnippetCard } from "@/components/SnippetCard";

export default function Index() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await listSnippets();
        if (mounted) setSnippets(data);
      } catch (e: any) {
        if (mounted) setErr(e?.message || "Failed to load snippets");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = q
    ? snippets.filter(
        (s) =>
          s.title.toLowerCase().includes(q.toLowerCase()) ||
          s.description.toLowerCase().includes(q.toLowerCase()) ||
          (s.tags || []).some((t) => t.toLowerCase().includes(q.toLowerCase()))
      )
    : snippets;

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={q} onSearchChange={setQ} />
      <main className="container mx-auto px-4 py-8">
        {loading && <p className="text-muted-foreground">Loading snippets…</p>}
        {!loading && err && (
          <div className="text-destructive">
            <p className="font-medium mb-2">Failed to load snippets.</p>
            <p className="text-sm opacity-80">{err}</p>
          </div>
        )}
        {!loading && !err && filtered.length === 0 && (
          <p className="text-muted-foreground">No snippets yet.</p>
        )}
        {!loading && !err && filtered.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <SnippetCard
                key={s.id}
                title={s.title}
                description={s.description}
                language={s.language}
                code={s.code}
                author={s.author}
                date={s.date}
                slug={s.slug}
                onClick={() => navigate(`/snippets/${s.slug}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
