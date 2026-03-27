import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/webhooks
 * Handles payment gateway webhooks (e.g., Stripe, MercadoPago, PagSeguro).
 *
 * This endpoint:
 * 1. Verifies the webhook signature for security
 * 2. Parses the event type and payload
 * 3. Updates the order's payment status accordingly
 * 4. Returns 200 to acknowledge receipt
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()

    // ──────────────────────────────────────────────
    // 1. Verify webhook signature
    // ──────────────────────────────────────────────
    // In production: validate the signature header against your webhook secret
    //
    // Example for Stripe:
    // const signature = request.headers.get('stripe-signature')
    // const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
    // let event: Stripe.Event
    // try {
    //   event = stripe.webhooks.constructEvent(body, signature!, webhookSecret)
    // } catch (err) {
    //   console.error('Webhook signature verification failed:', err)
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    // }
    //
    // Example for MercadoPago:
    // const xSignature = request.headers.get('x-signature')
    // const xRequestId = request.headers.get('x-request-id')
    // Verify HMAC with process.env.MP_WEBHOOK_SECRET

    const signature = request.headers.get('x-webhook-signature')
    if (!signature) {
      console.warn('Webhook received without signature header')
      // In production: return 400. For development, we continue.
    }

    // ──────────────────────────────────────────────
    // 2. Parse the event
    // ──────────────────────────────────────────────
    let payload: {
      event: string
      data: {
        payment_id?: string
        order_id?: string
        status?: string
        amount?: number
        metadata?: Record<string, string>
      }
    }

    try {
      payload = JSON.parse(body)
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      )
    }

    const { event, data } = payload

    if (!event || !data) {
      return NextResponse.json(
        { error: 'Missing event or data in payload' },
        { status: 400 }
      )
    }

    console.log(`[Webhook] Received event: ${event}`, {
      payment_id: data.payment_id,
      order_id: data.order_id,
    })

    // ──────────────────────────────────────────────
    // 3. Handle event types
    // ──────────────────────────────────────────────
    switch (event) {
      case 'payment.approved':
      case 'payment_intent.succeeded': {
        // Update order payment status to 'paid'
        // In production:
        // const { error } = await supabase
        //   .from('orders')
        //   .update({
        //     payment_status: 'paid',
        //     payment_id: data.payment_id,
        //     status: 'confirmed',
        //     updated_at: new Date().toISOString(),
        //   })
        //   .eq('id', data.order_id)
        //
        // Send confirmation email:
        // await sendOrderConfirmationEmail(data.order_id)

        console.log(`[Webhook] Payment approved for order ${data.order_id}`)
        break
      }

      case 'payment.failed':
      case 'payment_intent.payment_failed': {
        // Update order payment status to 'failed'
        // const { error } = await supabase
        //   .from('orders')
        //   .update({
        //     payment_status: 'failed',
        //     updated_at: new Date().toISOString(),
        //   })
        //   .eq('id', data.order_id)
        //
        // Send payment failed email:
        // await sendPaymentFailedEmail(data.order_id)

        console.log(`[Webhook] Payment failed for order ${data.order_id}`)
        break
      }

      case 'payment.refunded':
      case 'charge.refunded': {
        // Update order status to refunded
        // const { error } = await supabase
        //   .from('orders')
        //   .update({
        //     payment_status: 'refunded',
        //     status: 'refunded',
        //     updated_at: new Date().toISOString(),
        //   })
        //   .eq('id', data.order_id)
        //
        // Restore product stock:
        // const { data: items } = await supabase
        //   .from('order_items')
        //   .select('product_id, quantity')
        //   .eq('order_id', data.order_id)
        // for (const item of items) {
        //   await supabase.rpc('increment_stock', {
        //     p_product_id: item.product_id,
        //     p_quantity: item.quantity,
        //   })
        // }

        console.log(`[Webhook] Payment refunded for order ${data.order_id}`)
        break
      }

      case 'payment.cancelled':
      case 'payment_intent.canceled': {
        // const { error } = await supabase
        //   .from('orders')
        //   .update({
        //     payment_status: 'cancelled',
        //     status: 'cancelled',
        //     updated_at: new Date().toISOString(),
        //   })
        //   .eq('id', data.order_id)

        console.log(`[Webhook] Payment cancelled for order ${data.order_id}`)
        break
      }

      default: {
        console.log(`[Webhook] Unhandled event type: ${event}`)
      }
    }

    // ──────────────────────────────────────────────
    // 4. Always return 200 to acknowledge receipt
    // ──────────────────────────────────────────────
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error)
    // Still return 200 to prevent retries for unrecoverable errors,
    // or return 500 if you want the gateway to retry
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
