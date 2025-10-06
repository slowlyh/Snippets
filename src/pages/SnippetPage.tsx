// src/pages/SnippetPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSnippetBySlug, type Snippet } from "@/lib/gist";
import { SnippetDetail } from "@/components/SnippetDetail";
import { Header } from "@/components/Header";

export default function SnippetPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!slug) return;
        setLoading(true);
        const s = await getSnippetBySlug(slug);
        if (mounted) setSnippet(s ?? null);
      } catch (e: any) {
        if (mounted) setErr(e.message || "Failed to load snippet");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [slug]);

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={""} onSearchChange={() => {}} />
      <main className="container mx-auto px-4 py-6">
        {loading && <p className="text-muted-foreground">Loading…</p>}
        {!loading && err && <p className="text-destructive">{err}</p>}
        {!loading && !err && !snippet && (
          <p className="text-muted-foreground">Snippet not found.</p>
        )}
        {snippet && (
          <SnippetDetail
            title={snippet.title}
            description={snippet.description}
            language={snippet.language}
            code={snippet.code}
            author={snippet.author}
            date={snippet.date}
            slug={snippet.slug}
            onClose={() => navigate(-1)}
          />
        )}
      </main>
    </div>
  );
}
