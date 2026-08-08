-- Blog posts. Public reads published posts; only admins can write.

create table if not exists blog_posts (
  id            uuid primary key default uuid_generate_v4(),
  slug          text unique not null,
  title         text not null,
  excerpt       text,
  content       text not null,          -- markdown
  cover_image   text,
  tags          text[] not null default '{}',
  related_products text[] not null default '{}',  -- product ids to cross-link
  published     boolean not null default false,
  author        text default 'Supavice Pharmacy',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists blog_posts_published_idx on blog_posts(published, created_at desc);
create index if not exists blog_posts_slug_idx on blog_posts(slug);

alter table blog_posts enable row level security;

drop policy if exists "blog readable" on blog_posts;
create policy "blog readable" on blog_posts
  for select using (published = true or is_admin());

drop policy if exists "blog admin write" on blog_posts;
create policy "blog admin write" on blog_posts
  for all using (is_admin()) with check (is_admin());
