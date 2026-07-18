import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import Stripe from 'npm:stripe@^14.x'
import { createClient } from 'npm:@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16', // or latest
  httpClient: Stripe.createFetchHttpClient(),
})

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const { plotId, pioneerId, alias, type = 'claim' } = await req.json()

    if (!pioneerId || !alias) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase Client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    if (type === 'claim') {
      if (plotId === undefined) {
        return new Response(
          JSON.stringify({ error: 'plotId is required for claiming.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Verify plot is not already claimed
      const { data: plot } = await supabaseClient
        .from('plots')
        .select('owner_id')
        .eq('id', plotId)
        .single()

      if (plot?.owner_id) {
        return new Response(
          JSON.stringify({ error: 'Plot is already claimed by someone else.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Check if user already owns a plot
      const { count: ownedPlotsCount } = await supabaseClient
        .from('plots')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', pioneerId)

      if (ownedPlotsCount && ownedPlotsCount > 0) {
        return new Response(
          JSON.stringify({ error: 'You have already claimed a plot. You can only claim one plot total.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    } else if (type === 'visit') {
      // Check if user actually owns a plot
      const { count: ownedPlotsCount } = await supabaseClient
        .from('plots')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', pioneerId)

      if (!ownedPlotsCount || ownedPlotsCount === 0) {
        return new Response(
          JSON.stringify({ error: 'You do not own a plot to visit.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid type parameter.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create a PaymentIntent with the fixed amount and metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1500, // $15.00
      currency: 'usd',
      metadata: {
        type: type,
        plot_id: plotId !== undefined ? plotId.toString() : '',
        pioneer_id: pioneerId,
        alias: alias
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
