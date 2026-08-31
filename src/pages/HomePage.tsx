import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card, Badge, Button } from '../components/NeoBrutalism';

// ============================================================
// HomePage.tsx — Feed snippet publik terbaru
// ============================================================
export default function HomePage({ onUploadClick, user }) {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from('snippets_feed')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (alive) {
        if (!error) setSnippets(data || []);
        setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  const filtered = snippets.filter(
    (s) =>
      !q ||
      s.title?.toLowerCase().includes(q.toLowerCase()) ||
      s.language?.toLowerCase().includes(q.toLowerCase()) ||
      s.author_username?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="bg-[#FFD93D]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              Snippets<span className="text-[#FF5747]">.</span>
            </h1>
            <p className="mt-1 font-bold">Share kode brutal. Tanpa kompromi.</p>
          </div>
          <Button variant="dark" onClick={onUploadClick}>
            + UPLOAD SNIPPET
          </Button>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="CARI: judul, bahasa, author..."
          className="mt-4 w-full border-[3px] border-black bg-white px-4 py-3 font-bold outline-none shadow-[4px_4px_0_0_#000] placeholder:text-neutral-400"
        />
      </Card>

      {/* Feed */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 animate-pulse border-[3px] border-black bg-neutral-200 shadow-[4px_4px_0_0_#000]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="text-center">
          <p className="text-xl font-black">🦗 KOSONG.</p>
          <p className="mt-1 font-bold text-neutral-600">
            {user ? 'Jadilah yang pertama upload snippet!' : 'Login dan upload snippet pertama.'}
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <Link key={s.id} to={`/snippet/${s.id}`}>
              <Card hoverable className="h-full">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="truncate text-lg font-black">{s.title}</h3>
                  <Badge color="red">{s.language}</Badge>
                </div>
                <pre className="mt-3 h-24 overflow-hidden border-2 border-black bg-neutral-900 p-2 text-xs text-neutral-100">
                  {s.code?.slice(0, 220)}
                </pre>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {(s.tags || []).slice(0, 3).map((t) => (
                    <Badge key={t.id} color="lime">{t.name}</Badge>
                  ))}
                  <span className="ml-auto text-xs font-bold text-neutral-600">
                    by @{s.author_username}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
