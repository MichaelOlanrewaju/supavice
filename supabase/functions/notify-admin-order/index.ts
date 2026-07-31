// Sends an email to the store admin whenever an order is placed — called
// from checkout right after the order and its items save successfully.
// Uses Resend (resend.com) because it's a single fetch call with a generous
// free tier, no SMTP setup needed.
//
// Deploy:  supabase functions deploy notify-admin-order
// Secrets: supabase secrets set RESEND_API_KEY=re_xxxxx
//          supabase secrets set ADMIN_NOTIFY_EMAIL=you@example.com
//          (comma-separate for more than one: "a@x.com,b@x.com")
//
// Called from the frontend as:
//   supabase.functions.invoke('notify-admin-order', { body: { orderNo } })

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = Deno.env.get('ADMIN_NOTIFY_EMAIL')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    if (!RESEND_KEY || !ADMIN_EMAIL) {
      // Fail quietly from the customer's point of view — a missing email
      // config should never block or show an error on checkout, since the
      // order itself already saved successfully.
      return json({ skipped: true, reason: 'RESEND_API_KEY or ADMIN_NOTIFY_EMAIL not set' })
    }

    const { orderNo } = await req.json()
    if (!orderNo) return json({ error: 'orderNo is required' }, 400)

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(name, qty, price)')
      .eq('order_no', orderNo)
      .maybeSingle()

    if (error || !order) return json({ error: 'Order not found' }, 404)

    const itemRows = (order.order_items || [])
      .map(
        (i) =>
          `<tr><td style="padding:4px 8px">${i.qty} × ${escapeHtml(i.name)}</td><td style="padding:4px 8px;text-align:right">₦${(i.price * i.qty).toLocaleString('en-NG')}</td></tr>`
      )
      .join('')

    const html = `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
        <h2 style="margin:0 0 4px">New order — ${order.order_no}</h2>
        <p style="color:#555;margin:0 0 16px">
          ${order.method === 'pickup' ? 'Collection' : 'Delivery'} · ${order.payment}
          ${order.has_pom ? ' · <b style="color:#c21414">Contains a prescription item</b>' : ''}
        </p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
          <tr><td style="padding:4px 8px;color:#555">Customer</td><td style="padding:4px 8px;text-align:right">${escapeHtml(order.full_name)}</td></tr>
          <tr><td style="padding:4px 8px;color:#555">Phone</td><td style="padding:4px 8px;text-align:right">${escapeHtml(order.phone)}</td></tr>
          <tr><td style="padding:4px 8px;color:#555">Email</td><td style="padding:4px 8px;text-align:right">${escapeHtml(order.email)}</td></tr>
          <tr><td style="padding:4px 8px;color:#555">Address</td><td style="padding:4px 8px;text-align:right">${order.method === 'pickup' ? 'Store collection' : escapeHtml(`${order.address}, ${order.area}`)}</td></tr>
        </table>
        <table style="width:100%;border-collapse:collapse;border-top:1px solid #ddd">
          ${itemRows}
        </table>
        <p style="text-align:right;font-weight:bold;font-size:16px;margin-top:8px">
          Total: ₦${order.subtotal.toLocaleString('en-NG')}
        </p>
        <p style="color:#888;font-size:12px;margin-top:24px">
          Payment status: ${order.paid ? 'Paid' : 'Not yet confirmed as paid — check the admin dashboard.'}
        </p>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Supavice Pharmacy <orders@resend.dev>',
        to: ADMIN_EMAIL.split(',').map((e) => e.trim()),
        subject: `New order ${order.order_no} — ₦${order.subtotal.toLocaleString('en-NG')}`,
        html,
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      return json({ error: 'Resend rejected the email', detail: body }, 502)
    }

    return json({ ok: true })
  } catch (e) {
    return json({ error: e.message || 'Unexpected error' }, 500)
  }
})

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c])
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
}
