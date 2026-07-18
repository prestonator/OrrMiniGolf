import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import Stripe from 'npm:stripe@^14.x'
import { createClient } from 'npm:@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16', // or latest
  httpClient: Stripe.createFetchHttpClient(),
})

Deno.serve(async (req) => {
  // Handle CORS
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
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { plotId, pioneerId, alias } = await req.json()

    if (plotId === undefined || !pioneerId || !alias) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      )
    }

    // Initialize Supabase Client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Verify user
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user || user.id !== pioneerId) {
      return new Response('Unauthorized', { status: 401 })
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
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
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
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      )
    }

    // Create a PaymentIntent with the fixed amount and metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1500, // $15.00
      currency: 'usd',
      metadata: {
        plot_id: plotId.toString(),
        pioneer_id: pioneerId,
        alias: alias
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    )

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    )
  }
})
