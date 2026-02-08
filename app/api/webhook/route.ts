import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook error:', err)
    return new NextResponse('Webhook Error', { status: 400 })
  }

  // 👉 EVENTOS IMPORTANTES
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    console.log('✅ PAGO CONFIRMADO')
    console.log('💰 Total:', session.amount_total)
    console.log('📧 Email:', session.customer_details?.email)

    // 👉 AQUÍ luego puedes:
    // - Guardar pedido en BD
    // - Enviar email
    // - Actualizar inventario
  }

  return NextResponse.json({ received: true })
}