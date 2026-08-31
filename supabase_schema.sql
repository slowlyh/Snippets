-- ============================================================
-- Snippets Platform — Supabase Schema
-- Jalankan di Supabase SQL Editor (atau supabase db push)
-- ============================================================

-- ---------- 1. PROFILES (terhubung ke auth.users) ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique not null,
  avatar_url  text,
  bio         text,
  created_at  timestamptz not null default now(),
  constraint username_length check (char_length(username) between 3 and 30)
);

alter table public.profiles enable row level security;

create policy "Profiles publik dapat dibaca semua orang"
  on public.profiles for select using (true);

create policy "User hanya bisa insert/update profile miliknya sendiri"
  on public.profiles for insert with check (auth.uid() = id);

create policy "User hanya bisa update profile miliknya sendiri"
  on public.profiles for update using (auth.uid() = id);

-- ---------- 2. SNIPPETS ----------
create table if not exists public.snippets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  code        text not null,
  language    text not null default 'plaintext',
  description text,
  created_at  timestamptz not null default now()
);

create index if not exists snippets_user_id_idx   on public.snippets(user_id);
create index if not exists snippets_created_at_idx on public.snippets(created_at desc);
create index if not exists snippets_language_idx  on public.snippets(language);

alter table public.snippets enable row level security;

create policy "Snippet publik dapat dibaca semua orang"
  on public.snippets for select using (true);

create policy "User login bisa membuat snippet miliknya"
  on public.snippets for insert with check (auth.uid() = user_id);

create policy "User hanya bisa edit snippet miliknya"
  on public.snippets for update using (auth.uid() = user_id);

create policy "User hanya bisa hapus snippet miliknya"
  on public.snippets for delete using (auth.uid() = user_id);

-- ---------- 3. TAGS ----------
create table if not exists public.tags (
  id   serial primary key,
  name text unique not null
);

alter table public.tags enable row level security;

create policy "Tags dapat dibaca semua orang"
  on public.tags for select using (true);

-- ---------- 4. SNIPPET_TAGS (relasi many-to-many) ----------
create table if not exists public.snippet_tags (
  snippet_id uuid not null references public.snippets(id) on delete cascade,
  tag_id     int  not null references public.tags(id) on delete cascade,
  primary key (snippet_id, tag_id)
);

alter table public.snippet_tags enable row level security;

create policy "Relasi tag dapat dibaca semua orang"
  on public.snippet_tags for select using (true);

create policy "Hanya pemilik snippet yang bisa mengelola tag-nya"
  on public.snippet_tags for insert with check (
    exists (select 1 from public.snippets s where s.id = snippet_id and s.user_id = auth.uid())
  );

create policy "Hanya pemilik snippet yang bisa menghapus tag-nya"
  on public.snippet_tags for delete using (
    exists (select 1 from public.snippets s where s.id = snippet_id and s.user_id = auth.uid())
  );

-- ---------- 5. AUTO-CREATE PROFILE SAAT REGISTER ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'username',
      split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 6)
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- 6. KOMBINASI QUERY LIST (snippet + author + tags) ----------
create or replace view public.snippets_feed as
select
  s.id,
  s.title,
  s.code,
  s.language,
  s.description,
  s.created_at,
  s.user_id,
  p.username as author_username,
  p.avatar_url as author_avatar,
  coalesce(
    json_agg(json_build_object('id', t.id, 'name', t.name))
    filter (where t.id is not null),
    '[]'::json
  ) as tags
from public.snippets s
join public.profiles p on p.id = s.user_id
left join public.snippet_tags st on st.snippet_id = s.id
left join public.tags t on t.id = st.tag_id
group by s.id, p.username, p.avatar_url;
