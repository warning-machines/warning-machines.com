import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getProductById, getProductByType, getProductsByIds } from '@/lib/db/product';

export async function POST(request: NextRequest) {
  try {
    const body: { email: string } = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000';

    const product = await getProductByType('MEETING');
    if (!product) {
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
            price_data: {
              currency: 'eur',
              product_data: {
                name: product.name,
                description: product.description,
              },
              unit_amount: product.price,
            },
            quantity: 1,
          }
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

