-- 밑줄이 머문 자리 — Supabase 데이터베이스 스키마
-- Supabase 대시보드 > SQL Editor에 이 파일 전체를 붙여넣고 실행하세요.
-- (새 프로젝트를 처음 만들 때 한 번만 실행하면 됩니다.)

create extension if not exists pgcrypto;

-- ── 테이블 ────────────────────────────────────────────────

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nickname text,
  review_time time not null default '21:00',
  created_at timestamptz not null default now()
);

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('book', 'drama', 'movie', 'tv', 'youtube', 'sns', 'etc')),
  title text not null,
  creator text,
  url text,
  cover_url text,
  external_id text,
  status text not null default 'ongoing' check (status in ('wish', 'ongoing', 'done')),
  created_at timestamptz not null default now()
);

create table public.book_details (
  source_id uuid primary key references public.sources (id) on delete cascade,
  total_pages integer,
  current_page integer not null default 0,
  started_at timestamptz,
  finished_at timestamptz
);

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  source_id uuid references public.sources (id) on delete set null,
  text text not null,
  image_path text,
  highlight_boxes jsonb,
  page_number integer,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.thoughts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  quote_id uuid references public.quotes (id) on delete cascade,
  source_id uuid references public.sources (id) on delete set null,
  body text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.reading_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  source_id uuid not null references public.sources (id) on delete cascade,
  started_at timestamptz not null,
  ended_at timestamptz,
  minutes integer,
  pages_read integer
);

create table public.review_schedule (
  quote_id uuid primary key references public.quotes (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  interval_days integer not null default 1,
  next_review_at timestamptz,
  last_result text check (last_result in ('remembered', 'again')),
  review_count integer not null default 0
);

create index sources_user_id_idx on public.sources (user_id);
create index quotes_user_id_idx on public.quotes (user_id);
create index quotes_source_id_idx on public.quotes (source_id);
create index thoughts_user_id_idx on public.thoughts (user_id);
create index reading_sessions_user_id_idx on public.reading_sessions (user_id);
create index review_schedule_user_id_idx on public.review_schedule (user_id);

-- ── RLS (행 단위 보안) ────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.sources enable row level security;
alter table public.book_details enable row level security;
alter table public.quotes enable row level security;
alter table public.thoughts enable row level security;
alter table public.reading_sessions enable row level security;
alter table public.review_schedule enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

create policy "sources_select_own" on public.sources for select using (auth.uid() = user_id);
create policy "sources_insert_own" on public.sources for insert with check (auth.uid() = user_id);
create policy "sources_update_own" on public.sources for update using (auth.uid() = user_id);
create policy "sources_delete_own" on public.sources for delete using (auth.uid() = user_id);

create policy "book_details_select_own" on public.book_details for select
  using (exists (select 1 from public.sources s where s.id = book_details.source_id and s.user_id = auth.uid()));
create policy "book_details_insert_own" on public.book_details for insert
  with check (exists (select 1 from public.sources s where s.id = book_details.source_id and s.user_id = auth.uid()));
create policy "book_details_update_own" on public.book_details for update
  using (exists (select 1 from public.sources s where s.id = book_details.source_id and s.user_id = auth.uid()));
create policy "book_details_delete_own" on public.book_details for delete
  using (exists (select 1 from public.sources s where s.id = book_details.source_id and s.user_id = auth.uid()));

create policy "quotes_select_own" on public.quotes for select using (auth.uid() = user_id);
create policy "quotes_insert_own" on public.quotes for insert with check (auth.uid() = user_id);
create policy "quotes_update_own" on public.quotes for update using (auth.uid() = user_id);
create policy "quotes_delete_own" on public.quotes for delete using (auth.uid() = user_id);

create policy "thoughts_select_own" on public.thoughts for select using (auth.uid() = user_id);
create policy "thoughts_insert_own" on public.thoughts for insert with check (auth.uid() = user_id);
create policy "thoughts_update_own" on public.thoughts for update using (auth.uid() = user_id);
create policy "thoughts_delete_own" on public.thoughts for delete using (auth.uid() = user_id);

create policy "reading_sessions_select_own" on public.reading_sessions for select using (auth.uid() = user_id);
create policy "reading_sessions_insert_own" on public.reading_sessions for insert with check (auth.uid() = user_id);
create policy "reading_sessions_update_own" on public.reading_sessions for update using (auth.uid() = user_id);
create policy "reading_sessions_delete_own" on public.reading_sessions for delete using (auth.uid() = user_id);

create policy "review_schedule_select_own" on public.review_schedule for select using (auth.uid() = user_id);
create policy "review_schedule_insert_own" on public.review_schedule for insert with check (auth.uid() = user_id);
create policy "review_schedule_update_own" on public.review_schedule for update using (auth.uid() = user_id);
create policy "review_schedule_delete_own" on public.review_schedule for delete using (auth.uid() = user_id);

-- ── 트리거 ────────────────────────────────────────────────

-- 회원가입 시 profiles 행 자동 생성
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 문장 저장 시 review_schedule 행 자동 생성(바로 복습 대상이 되도록)
create or replace function public.handle_new_quote()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.review_schedule (quote_id, user_id, interval_days, next_review_at, review_count)
  values (new.id, new.user_id, 1, now(), 0);
  return new;
end;
$$;

create trigger on_quote_created
  after insert on public.quotes
  for each row
  execute function public.handle_new_quote();
