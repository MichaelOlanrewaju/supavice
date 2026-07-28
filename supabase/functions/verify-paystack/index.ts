// Verifies a Paystack transaction server-side and marks the matching order
// as paid. Never trust a client-side "payment successful" callback alone —
// it can be spoofed by anyone who opens devtools. This function re-checks
// the transaction directly with Paystack using the secret key, which never
// leaves the server.
//
// Deploy:   supabase functions deploy verify-paystack
// Secret:   supabase secrets set PAYSTACK_SECRET_KEY=sk_live_xxxxx
//
// Called from the frontend as:
//   supabase.functions.invoke('verify-paystack', { body: { reference, orderNo } })

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const PAYSTACK_SECRET = Deno.env.get('PAYSTACK_SECRET_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    if (!PAYSTACK_SECRET) {
      return json({ error: 'PAYSTACK_SECRET_KEY is not set on this project.' }, 500)
    }

    const { reference, orderNo } = await req.json()
    if (!reference || !orderNo) {
      return json({ error: 'reference and orderNo are both required.' }, 400)
    }

    // ---- 1. ask Paystack directly whether this transaction actually succeeded ----
    const psRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
    )
    const ps = await psRes.json()

    if (!ps.status || ps.data?.status !== 'success') {
      return json({ error: 'Payment was not successful.', detail: ps.data?.gateway_response }, 402)
    }

    // ---- 2. confirm the amount charged matches the order, so a reference for
    //         a different, smaller payment can't be replayed against this order ----
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
    const { data: order, error: findErr } = await supabase
      .from('orders')
      .select('id, subtotal, paid')
      .eq('order_no', orderNo)
      .maybeSingle()

    if (findErr || !order) return json({ error: 'Order not found.' }, 404)

    const expectedKobo = order.subtotal * 100
    if (ps.data.amount !== expectedKobo) {
      return json(
        { error: 'Amount paid does not match the order total.', expected: expectedKobo, got: ps.data.amount },
        402
      )
    }

    if (order.paid) {
      return json({ ok: true, alreadyPaid: true })
    }

    // ---- 3. mark the order paid ----
    const { error: updateErr } = await supabase
      .from('orders')
      .update({ paid: true, payment_ref: reference, status: 'confirmed' })
      .eq('id', order.id)

    if (updateErr) return json({ error: updateErr.message }, 500)

    return json({ ok: true })
  } catch (e) {
    return json({ error: e.message || 'Unexpected error.' }, 500)
  }
})

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
}
