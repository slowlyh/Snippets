import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card, Badge, Button } from '../components/NeoBrutalism';

// ============================================================
// SnippetDetailPage.tsx — Detail satu snippet + copy code
// ============================================================
export default function SnippetDetailPage({ user }) {
  const { id } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from('snippets_feed')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (alive) {
        if (!error) setSnippet(data);
        setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, [id]);

  async function copy() {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function deleteSnippet() {
    if (!window.confirm('Hapus snippet ini secara permanen?')) return;
    const { error } = await supabase.from('snippets').delete().eq('id', id);
    if (!error) window.location.href = '/';
  }

  if (loading) {
    return <div className="h-64 animate-pulse border-[3px] border-black bg-neutral-200 shadow-[4px_4px_0_0_#000]" />;
  }
  if (!snippet) {
    return (
      <Card className="bg-[#FF5747] text-center text-white">
        <p className="text-2xl font-black">404 — SNIPPET TIDAK DITEMUKAN</p>
        <Link to="/"><Button variant="dark" className="mt-4">← KEMBALI</Button></Link>
      </Card>
    );
  }

  const isOwner = user && user.id === snippet.user_id;

  return (
    <div className="space-y-5">
      <Link to="/" className="inline-block text-sm font-black underline">← BACK TO FEED</Link>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black tracking-tight">{snippet.title}</h1>
            <p className="mt-1 font-bold text-neutral-600">
              by <span className="bg-black px-1.5 py-0.5 text-white">@{snippet.author_username}</span>
              {' · '}
              {new Date(snippet.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <Badge color="red">{snippet.language}</Badge>
        </div>

        {snippet.description && (
          <p className="mt-4 border-l-4 border-black bg-[#FFD93D] p-3 font-semibold">{snippet.description}</p>
        )}

        {(snippet.tags || []).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {snippet.tags.map((t) => <Badge key={t.id} color="blue">#{t.name}</Badge>)}
          </div>
        )}
      </Card>

      {/* Code block */}
      <div className="border-[3px] border-black shadow-[6px_6px_0_0_#000]">
        <div className="flex items-center justify-between border-b-[3px] border-black bg-black px-4 py-2">
          <span className="font-mono text-xs font-bold text-[#DEFF8E]">main.{snippet.language === 'javascript' ? 'js' : snippet.language}</span>
          <Button size="sm" variant={copied ? 'secondary' : 'primary'} onClick={copy}>
            {copied ? '✓ COPIED' : 'COPY ⧉'}
          </Button>
        </div>
        <pre className="max-h-[60vh] overflow-auto bg-neutral-900 p-4 text-sm leading-relaxed text-neutral-100">
          <code>{snippet.code}</code>
        </pre>
      </div>

      {isOwner && (
        <Card className="flex items-center justify-between bg-[#DEFF8E]">
          <span className="font-black uppercase">Ini snippet-mu 👑</span>
          <Button variant="primary" size="sm" onClick={deleteSnippet}>HAPUS 🗑</Button>
        </Card>
      )}
    </div>
  );
}
