-- Corrective migration for "new row violates row-level security policy for
-- table orders". Re-asserts the insert policy regardless of whatever state
-- it's currently in, and grants sequence usage that Supabase sometimes
-- doesn't carry over automatically for objects created via the SQL Editor.
--
-- Safe to run more than once — every statement either drops-then-recreates
-- or uses IF NOT EXISTS.

-- 1. Make sure RLS is actually on (it should be already, but this is cheap
--    insurance against a partially-applied earlier migration).
alter table orders enable row level security;
alter table order_items enable row level security;

-- 2. Re-create the orders insert policy explicitly. This is the one that
--    matches: guests (user_id null) and signed-in customers inserting
--    their own order (user_id = their own id).
drop policy if exists "orders insert" on orders;
create policy "orders insert" on orders
  for insert
  with check (user_id = auth.uid() or user_id is null);

-- 3. Same for order_items — needs the parent order to belong to the
--    requester (or be a guest order).
drop policy if exists "order_items insert" on order_items;
create policy "order_items insert" on order_items
  for insert
  with check (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or o.user_id is null)
    )
  );

-- 4. The order-number sequence needs USAGE granted explicitly — Supabase's
--    default grants for the anon/authenticated roles cover tables but not
--    always sequences created this way, and next_order_no() calling
--    nextval() will fail without it (a different error than RLS, but worth
--    covering here since it sits right before the insert that's failing).
grant usage, select on sequence order_no_seq to anon, authenticated;

-- 5. Confirm what's actually in place after running this.
select policyname, cmd, qual, with_check
from pg_policies
where tablename in ('orders', 'order_items');
