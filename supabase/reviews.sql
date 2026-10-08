-- Kavo Technologies client reviews.
-- Run once in the Supabase SQL editor of the Kavo project.

create table if not exists public.reviews (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    name text not null check (char_length(name) between 1 and 80),
    company text not null check (char_length(company) between 1 and 120),
    role text check (char_length(role) <= 80),
    project_type text not null check (char_length(project_type) <= 60),
    project_name text check (char_length(project_name) <= 160),
    rating smallint not null check (rating between 1 and 5),
    body text not null check (char_length(body) between 20 and 1500),
    invite_id text not null unique,
    published boolean not null default true
);

create index if not exists reviews_published_created_idx
    on public.reviews (published, created_at desc);

-- Row Level Security on with no policies: the table is only reachable with
-- the service role key used by the serverless functions, never from browsers.
alter table public.reviews enable row level security;
