# Snippets ⚡

Platform berbagi snippet kode — React + Tailwind CSS (Neo Brutalism, white mode) + Supabase (Auth & PostgreSQL).

## Setup

```bash
npm install
cp .env.example .env   # isi VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY
npm run dev
```

## Database

Jalankan `supabase_schema.sql` di Supabase SQL Editor. Isinya:

- `profiles` (auto-created via trigger dari `auth.users`)
- `snippets`, `tags`, `snippet_tags` (many-to-many)
- RLS: publik **read-only**, tulis/edit/hapus hanya pemilik (`auth.uid() = user_id`)
- View `snippets_feed` = snippet + author + tags dalam satu query

## Struktur

```
src/
  lib/supabase.js            # Supabase client
  components/
    NeoBrutalism.tsx         # UI kit: Button, Input, Card, Badge, Modal
    AuthModal.tsx            # Login / Register
    UploadModal.tsx          # Upload snippet (login-only)
  pages/
    HomePage.tsx             # /            → feed snippet
    SnippetDetailPage.tsx    # /snippet/:id → detail + copy + delete
    DocsPage.tsx             # /docs        → dokumentasi API
```

## Build

```bash
npm run build
```
