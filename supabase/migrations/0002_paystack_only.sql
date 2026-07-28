-- Checkout now runs through Paystack only; cash on delivery has been removed
-- from the frontend. This updates the database to match — run once in the
-- Supabase SQL Editor.

alter table orders drop constraint if exists orders_payment_check;
alter table orders add constraint orders_payment_check
  check (payment in ('card', 'transfer', 'ussd'));
