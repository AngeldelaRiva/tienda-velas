import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const { items } = await req.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'mxn',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100, // Stripe usa centavos
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.NEXTAUTH_URL}/success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json(
      { error: 'Error creando sesión de pago' },
      { status: 500 }
    )
  }
}