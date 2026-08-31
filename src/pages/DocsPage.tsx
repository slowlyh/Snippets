import React from 'react';
import { Card, Badge, Button } from '../components/NeoBrutalism';

// ============================================================
// DocsPage.tsx — Dokumentasi API publik
// ============================================================
const BASE_URL = 'https://YOUR-PROJECT.supabase.co/rest/v1';

const ENDPOINTS = [
  {
    method: 'GET',
    path: '/snippets',
    auth: 'Publik',
    desc: 'Mengambil daftar semua snippet publik. Mendukung filter ?language=python&order=created_at.desc&limit=20',
    sample: `curl "${BASE_URL}/snippets?select=id,title,language,code&order=created_at.desc&limit=20" \\
  -H "apikey: $SUPABASE_ANON_KEY"`,
  },
  {
    method: 'GET',
    path: '/snippets/:id',
    auth: 'Publik',
    desc: 'Mengambil satu snippet berdasarkan UUID, lengkap dengan author dan tags via view snippets_feed.',
    sample: `curl "${BASE_URL}/snippets_feed?id=eq.<SNIPPET_UUID>" \\
  -H "apikey: $SUPABASE_ANON_KEY"`,
  },
  {
    method: 'POST',
    path: '/snippets',
    auth: 'User (Bearer JWT)',
    desc: 'Membuat snippet baru. RLS menolak jika user_id bukan uid milik token.',
    sample: `curl -X POST "${BASE_URL}/snippets" \\
  -H "apikey: $SUPABASE_ANON_KEY" \\
  -H "Authorization: Bearer $USER_JWT" \\
  -H "Content-Type: application/json" \\
  -H "Prefer: return=representation" \\
  -d '{
    "user_id": "<YOUR_UID>",
    "title": "Debounce in JS",
    "language": "javascript",
    "code": "function debounce(fn, ms) { ... }"
  }'`,
  },
  {
    method: 'PATCH',
    path: '/snippets/:id',
    auth: 'Pemilik saja',
    desc: 'Update snippet milik sendiri. RLS menolak update milik user lain.',
    sample: `curl -X PATCH "${BASE_URL}/snippets?id=eq.<SNIPPET_UUID>" \\
  -H "apikey: $SUPABASE_ANON_KEY" \\
  -H "Authorization: Bearer $USER_JWT" \\
  -d '{"title": "Judul baru"}'`,
  },
  {
    method: 'DELETE',
    path: '/snippets/:id',
    auth: 'Pemilik saja',
    desc: 'Hapus snippet milik sendiri.',
    sample: `curl -X DELETE "${BASE_URL}/snippets?id=eq.<SNIPPET_UUID>" \\
  -H "apikey: $SUPABASE_ANON_KEY" \\
  -H "Authorization: Bearer $USER_JWT"`,
  },
];

const METHOD_COLOR = {
  GET: 'bg-[#6C9EFF] text-black',
  POST: 'bg-[#DEFF8E] text-black',
  PATCH: 'bg-[#FFD93D] text-black',
  DELETE: 'bg-[#FF5747] text-white',
};

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Hero */}
      <Card className="bg-[#FFD93D]">
        <h1 className="text-3xl font-black uppercase tracking-tight">📖 API Docs</h1>
        <p className="mt-2 font-bold">
          Semua data diakses langsung via Supabase REST (PostgREST). Tidak ada backend khusus.
        </p>
      </Card>

      {/* Base URL */}
      <section>
        <h2 className="mb-3 inline-block bg-black px-3 py-1 text-sm font-black uppercase text-white">
          Base URL
        </h2>
        <Card className="font-mono text-sm break-all">
          {BASE_URL}
          <p className="mt-2 font-sans text-xs text-neutral-600">
            Ganti YOUR-PROJECT dengan ref project Supabase-mu. Endpoint tabel: /snippets, /profiles, /tags, /snippet_tags, /snippets_feed (view).
          </p>
        </Card>
      </section>

      {/* Auth */}
      <section>
        <h2 className="mb-3 inline-block bg-black px-3 py-1 text-sm font-black uppercase text-white">
          Autentikasi
        </h2>
        <Card className="space-y-4">
          <div>
            <Badge color="red">API Key (anon) — WAJIB di setiap request</Badge>
            <pre className="mt-2 overflow-x-auto border-[3px] border-black bg-black p-3 text-xs text-[#DEFF8E]">
{`-H "apikey: $SUPABASE_ANON_KEY"`}
            </pre>
          </div>
          <div>
            <Badge color="blue">User JWT — untuk POST/PATCH/DELETE</Badge>
            <pre className="mt-2 overflow-x-auto border-[3px] border-black bg-black p-3 text-xs text-[#DEFF8E]">
{`-H "Authorization: Bearer $USER_JWT"

# Dapatkan JWT via Supabase Auth:
supabase.auth.signInWithPassword({ email, password })`}
            </pre>
            <p className="mt-2 text-sm font-bold">
              ⚡ RLS menjamin: publik hanya bisa <em>membaca</em>; tulis/edit/hapus hanya untuk pemilik snippet (auth.uid() = user_id).
            </p>
          </div>
        </Card>
      </section>

      {/* Endpoints */}
      <section>
        <h2 className="mb-3 inline-block bg-black px-3 py-1 text-sm font-black uppercase text-white">
          Endpoints
        </h2>
        <div className="space-y-4">
          {ENDPOINTS.map((ep) => (
            <Card key={ep.method + ep.path}>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`border-2 border-black px-3 py-1 font-black shadow-[3px_3px_0_0_#000] ${METHOD_COLOR[ep.method]}`}>
                  {ep.method}
                </span>
                <code className="text-lg font-bold">{ep.path}</code>
                <span className="ml-auto">
                  <Badge color={ep.auth === 'Publik' ? 'lime' : 'yellow'}>{ep.auth}</Badge>
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold">{ep.desc}</p>
              <pre className="mt-3 overflow-x-auto border-[3px] border-black bg-neutral-900 p-3 text-xs text-neutral-100">
                {ep.sample}
              </pre>
            </Card>
          ))}
        </div>
      </section>

      <Card className="bg-[#DEFF8E] text-center">
        <p className="font-black uppercase">Butuh bantuan?</p>
        <p className="mt-1 text-sm font-bold">Baca schema lengkap di file <code className="border-2 border-black bg-white px-1">supabase_schema.sql</code></p>
      </Card>
    </div>
  );
}
