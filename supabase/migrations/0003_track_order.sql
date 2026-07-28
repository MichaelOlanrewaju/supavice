-- Guest order tracking by email + order number.
--
-- The existing RLS policy on `orders` only lets a signed-in customer read
-- their own rows. A guest tracking an order by email and order number needs
-- a narrow, purpose-built lookup instead of a broader read policy — this
-- function returns only the fields the tracking page needs, only when both
-- the order number AND the email match, and nothing else about the orders
-- table is exposed.

create or replace function track_order(p_order_no text, p_email text)
returns table (
  order_no text,
  status text,
  subtotal integer,
  method text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select order_no, status, subtotal, method, created_at
  from orders
  where lower(order_no) = lower(trim(p_order_no))
    and lower(email) = lower(trim(p_email))
  limit 1;
$$;

-- order_items for a tracked order, same email+order_no gate
create or replace function track_order_items(p_order_no text, p_email text)
returns table (
  id uuid,
  name text,
  qty integer,
  price integer
)
language sql
security definer
set search_path = public
stable
as $$
  select oi.id, oi.name, oi.qty, oi.price
  from order_items oi
  join orders o on o.id = oi.order_id
  where lower(o.order_no) = lower(trim(p_order_no))
    and lower(o.email) = lower(trim(p_email));
$$;

grant execute on function track_order(text, text) to anon, authenticated;
grant execute on function track_order_items(text, text) to anon, authenticated;
