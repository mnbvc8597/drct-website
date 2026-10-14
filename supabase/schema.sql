-- =====================================================================
-- DRCT website – database, security policies and storage
-- Run ONCE: Supabase Dashboard -> SQL Editor -> New query -> paste all -> Run
-- =====================================================================

-- 1) Admin list. Only users listed here can change website content.
create table if not exists public.admins (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.admins enable row level security;

create or replace function public.is_admin() returns boolean
language sql security definer set search_path = public stable
as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "admin reads own row" on public.admins;
create policy "admin reads own row" on public.admins for select to authenticated using (user_id = auth.uid());
-- (No insert/update/delete policy on purpose: nobody can make themselves admin from the website.)

-- 2) Content tables
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null, code text, scheme text, description text, eligibility text, qualification text,
  duration text, location text,
  status text not null default 'upcoming' check (status in ('open','upcoming','closed')),
  image_url text, enquiry_phone text, enquiry_whatsapp text, enquiry_email text,
  published boolean not null default false,
  created_at timestamptz not null default now());

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null, category text not null default 'General',
  pub_date date not null default (now() at time zone 'Asia/Kolkata')::date,
  description text, course_id uuid references public.courses(id) on delete set null,
  pdf_url text, published boolean not null default false, expiry_date date,
  created_at timestamptz not null default now());

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text, image_url text not null, published boolean not null default true,
  created_at timestamptz not null default now());

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null, category text default 'Notice', file_url text not null,
  published boolean not null default true, created_at timestamptz not null default now());

create table if not exists public.entries (          -- Faculty & Staff and Success Stories
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('faculty','story')),
  title text not null, subtitle text, body text, image_url text,
  published boolean not null default false, created_at timestamptz not null default now());

create table if not exists public.site_content (key text primary key, value text);

-- 3) Row Level Security
do $$ declare t text; begin
  foreach t in array array['courses','announcements','gallery','documents','entries','site_content'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "admin full access" on public.%I', t);
    execute format('create policy "admin full access" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;
revoke all on public.admins from anon, authenticated;
grant select on public.admins to authenticated;

-- Public (visitors) can read ONLY published content
drop policy if exists "public read" on public.courses;
create policy "public read" on public.courses for select to anon, authenticated using (published);
drop policy if exists "public read" on public.gallery;
create policy "public read" on public.gallery for select to anon, authenticated using (published);
drop policy if exists "public read" on public.documents;
create policy "public read" on public.documents for select to anon, authenticated using (published);
drop policy if exists "public read" on public.entries;
create policy "public read" on public.entries for select to anon, authenticated using (published);
drop policy if exists "public read" on public.site_content;
create policy "public read" on public.site_content for select to anon, authenticated using (true);
drop policy if exists "public read" on public.announcements;
create policy "public read" on public.announcements for select to anon, authenticated using (
  published
  and pub_date <= (now() at time zone 'Asia/Kolkata')::date
  and (expiry_date is null or expiry_date >= (now() at time zone 'Asia/Kolkata')::date));

-- 4) Storage bucket for photos and PDFs (public read, admin-only write)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('public-files','public-files', true, 10485760, array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict (id) do update set public = true, file_size_limit = 10485760,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','application/pdf'];

drop policy if exists "drct admin select" on storage.objects;
drop policy if exists "drct admin insert" on storage.objects;
drop policy if exists "drct admin update" on storage.objects;
drop policy if exists "drct admin delete" on storage.objects;
create policy "drct admin select" on storage.objects for select to authenticated using (bucket_id = 'public-files' and public.is_admin());
create policy "drct admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'public-files' and public.is_admin());
create policy "drct admin update" on storage.objects for update to authenticated using (bucket_id = 'public-files' and public.is_admin());
create policy "drct admin delete" on storage.objects for delete to authenticated using (bucket_id = 'public-files' and public.is_admin());
