-- Corrective migration for admin product add/delete not working.
--
-- Same class of issue as the earlier orders RLS fix: the policy defined in
-- the original schema may not have actually taken effect. This re-asserts
-- everything needed for an admin to add, edit and delete products, and is
-- safe to run more than once.

-- 1. Re-assert is_admin() itself — if this one function is broken, every
--    admin-gated policy across every table silently fails at once, which
--    would explain problems in more than just products.
create or replace function is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- 2. Make sure RLS is actually on.
alter table products enable row level security;
alter table categories enable row level security;

-- 3. Re-create the products policies explicitly.
drop policy if exists "products readable" on products;
create policy "products readable" on products
  for select using (active = true or is_admin());

drop policy if exists "products admin write" on products;
create policy "products admin write" on products
  for all using (is_admin()) with check (is_admin());

-- 4. Same for categories, since the admin panel may touch these too.
drop policy if exists "categories readable" on categories;
create policy "categories readable" on categories for select using (true);

drop policy if exists "categories admin write" on categories;
create policy "categories admin write" on categories
  for all using (is_admin()) with check (is_admin());

-- 5. Diagnostic: confirm what's actually in place now.
select policyname, cmd, qual, with_check
from pg_policies
where tablename in ('products', 'categories');

-- 6. Diagnostic: confirm which accounts are actually admin right now —
--    the single most common reason "admin actions don't work" is that the
--    account being tested with isn't the one that was promoted.
select u.email, p.role
from auth.users u
join profiles p on p.id = u.id
where p.role = 'admin';
