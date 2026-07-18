import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import Stripe from 'npm:stripe@^14.x'
import { createClient } from 'npm:@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16', // or latest
  httpClient: Stripe.createFetchHttpClient(),
})

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    const signature = req.headers.get('Stripe-Signature')
    if (!signature) {
      return new Response('No signature provided', { status: 400 })
    }

    const body = await req.text()
    let event;

    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET') as string,
        undefined,
        Stripe.createCryptoProvider()
      )
    } catch (err) {
      return new Response(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`, { status: 400 })
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const type = paymentIntent.metadata.type || 'claim'
      const plotIdStr = paymentIntent.metadata.plot_id
      const pioneerId = paymentIntent.metadata.pioneer_id

      if (type === 'claim' && plotIdStr && pioneerId) {
        const plotId = parseInt(plotIdStr, 10)

        // Initialize Supabase Client with Service Role Key to bypass RLS
        const supabaseAdmin = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Find an active visit that hasn't claimed a plot yet
        const { data: visits } = await supabaseAdmin
          .from('visits')
          .select('id')
          .eq('user_id', pioneerId)
          .eq('plot_claimed', false)
          .order('visit_date', { ascending: false })
          .limit(1)

        if (visits && visits.length > 0) {
          const visitId = visits[0].id

          // Upsert the plot with the new owner
          const { error: plotError } = await supabaseAdmin
            .from('plots')
            .upsert({ id: plotId, owner_id: pioneerId, visit_id: visitId, claimed_at: new Date().toISOString() })

          if (!plotError) {
            // Mark the visit as claimed
            await supabaseAdmin
              .from('visits')
              .update({ plot_claimed: true })
              .eq('id', visitId)
          }
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
})
