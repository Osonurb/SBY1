-- ============================================================================
-- UNIVERSO SBY (Sound Name · Broken Net · yep a lot / Yep, A Lot)
-- Schema completo de produção para Supabase (Postgres + Auth + RLS + Storage)
-- Execute este script no SQL Editor do seu projeto Supabase.
-- ============================================================================

-- 1. TABELA DE PERFIS DE REDATORES (vinculada a auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Redator',
  role text not null default 'writer' check (role in ('admin', 'writer', 'reader')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Função auxiliar para checar se o usuário logado é Admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Trigger automático: cria perfil em public.profiles quando um novo redator se cadastra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1), 'Redator'),
    'writer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. TABELA DE PERSONAGENS CRIADOS POR REDATORES / EXPANSÃO DO CÂNONE
create table if not exists public.characters (
  id text primary key default ('char_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)),
  name text not null,
  codename text not null,
  role_pt text not null,
  role_en text not null,
  evidence_pt text not null,
  evidence_en text not null,
  summary_pt text not null,
  summary_en text not null,
  quote_pt text not null default '"..."',
  quote_en text not null default '"..."',
  connections text[] not null default array['Universo SBY']::text[],
  categories text[] not null default array['community']::text[],
  accent text not null default '#29B6D1',
  has_visual boolean not null default false,
  image_url text,
  silhouette text not null default 'mystery',
  status text not null default 'review' check (status in ('draft', 'review', 'published')),
  is_canon boolean not null default false,
  author_id uuid references public.profiles(id) on delete set null,
  author_name text not null default 'Redator',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. TABELA DE TEXTOS, CENAS, DIÁLOGOS E DOSSIÊS SOBRE PERSONAGENS
create table if not exists public.character_writings (
  id text primary key default ('w_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)),
  character_id text not null,
  entry_type text not null default 'scene' check (entry_type in ('scene', 'dossier', 'dialogue', 'lore')),
  era text not null default 'Yep, A Lot',
  title text not null,
  body text not null,
  status text not null default 'review' check (status in ('draft', 'review', 'published')),
  is_canon boolean not null default false,
  author_id uuid references public.profiles(id) on delete set null,
  author_name text not null default 'Redator',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_writings_character_id on public.character_writings(character_id);
create index if not exists idx_writings_status on public.character_writings(status);
create index if not exists idx_characters_status on public.characters(status);

-- 5. HISTÓRICO AUTOMÁTICO DE REVISÕES (nunca perde versões anteriores)
create table if not exists public.writing_revisions (
  id uuid primary key default gen_random_uuid(),
  writing_id text not null references public.character_writings(id) on delete cascade,
  title text not null,
  body text not null,
  status text not null,
  edited_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.log_writing_revision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (old.title is distinct from new.title) or (old.body is distinct from new.body) then
    insert into public.writing_revisions (writing_id, title, body, status, edited_by)
    values (old.id, old.title, old.body, old.status, auth.uid());
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_log_writing_revision on public.character_writings;
create trigger trg_log_writing_revision
  before update on public.character_writings
  for each row execute procedure public.log_writing_revision();

-- 6. SEGURANÇA — ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.characters enable row level security;
alter table public.character_writings enable row level security;
alter table public.writing_revisions enable row level security;

-- PROFILES
drop policy if exists "Perfis visíveis para usuários logados" on public.profiles;
create policy "Perfis visíveis para usuários logados"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Usuário atualiza o próprio nome" on public.profiles;
create policy "Usuário atualiza o próprio nome"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select p.role from public.profiles p where p.id = auth.uid()));

-- CHARACTERS
drop policy if exists "Leitura pública de personagens publicados" on public.characters;
create policy "Leitura pública de personagens publicados"
  on public.characters for select
  using (status = 'published' or author_id = auth.uid() or public.is_admin());

drop policy if exists "Redatores criam personagens" on public.characters;
create policy "Redatores criam personagens"
  on public.characters for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and (
      public.is_admin()
      or (status in ('draft', 'review') and is_canon = false)
    )
  );

drop policy if exists "Redatores editam próprios rascunhos ou Admin edita tudo" on public.characters;
create policy "Redatores editam próprios rascunhos ou Admin edita tudo"
  on public.characters for update
  to authenticated
  using (public.is_admin() or (author_id = auth.uid() and status <> 'published'))
  with check (
    public.is_admin()
    or (author_id = auth.uid() and status in ('draft', 'review') and is_canon = false)
  );

drop policy if exists "Redatores apagam próprios rascunhos ou Admin apaga tudo" on public.characters;
create policy "Redatores apagam próprios rascunhos ou Admin apaga tudo"
  on public.characters for delete
  to authenticated
  using (public.is_admin() or (author_id = auth.uid() and status <> 'published'));

-- CHARACTER WRITINGS
drop policy if exists "Leitura pública de textos publicados" on public.character_writings;
create policy "Leitura pública de textos publicados"
  on public.character_writings for select
  using (status = 'published' or author_id = auth.uid() or public.is_admin());

drop policy if exists "Redatores criam textos" on public.character_writings;
create policy "Redatores criam textos"
  on public.character_writings for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and (
      public.is_admin()
      or (status in ('draft', 'review') and is_canon = false)
    )
  );

drop policy if exists "Redatores editam próprios textos ou Admin edita tudo" on public.character_writings;
create policy "Redatores editam próprios textos ou Admin edita tudo"
  on public.character_writings for update
  to authenticated
  using (public.is_admin() or (author_id = auth.uid() and status <> 'published'))
  with check (
    public.is_admin()
    or (author_id = auth.uid() and status in ('draft', 'review') and is_canon = false)
  );

drop policy if exists "Redatores apagam próprios textos ou Admin apaga tudo" on public.character_writings;
create policy "Redatores apagam próprios textos ou Admin apaga tudo"
  on public.character_writings for delete
  to authenticated
  using (public.is_admin() or (author_id = auth.uid() and status <> 'published'));

-- WRITING REVISIONS
drop policy if exists "Admin ou autor visualiza histórico" on public.writing_revisions;
create policy "Admin ou autor visualiza histórico"
  on public.writing_revisions for select
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.character_writings w
      where w.id = writing_revisions.writing_id and w.author_id = auth.uid()
    )
  );

-- 7. STORAGE BUCKET PARA IMAGENS E ÁUDIOS (sby-media)
insert into storage.buckets (id, name, public)
values ('sby-media', 'sby-media', true)
on conflict (id) do nothing;

drop policy if exists "Leitura pública de mídia SBY" on storage.objects;
create policy "Leitura pública de mídia SBY"
  on storage.objects for select
  using (bucket_id = 'sby-media');

drop policy if exists "Redatores autenticados enviam mídia" on storage.objects;
create policy "Redatores autenticados enviam mídia"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'sby-media');

-- ============================================================================
-- PASSO FINAL APÓS CRIAR SUA CONTA NO SITE:
-- Rode o comando abaixo trocando pelo seu e-mail para se tornar ADMIN:
--
-- update public.profiles
-- set role = 'admin', display_name = 'Bruno Moreira e Silva'
-- where id = (select id from auth.users where email = 'SEU_EMAIL_AQUI');
-- ============================================================================
