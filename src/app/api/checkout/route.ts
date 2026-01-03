import { NextRequest, NextResponse } from 'next/server';
import { stripe, MEETING_PRODUCT } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, service, message } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: MEETING_PRODUCT.currency,
            product_data: {
              name: MEETING_PRODUCT.name,
              description: `${MEETING_PRODUCT.description} - Service: ${service}`,
            },
            unit_amount: MEETING_PRODUCT.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        customerName: name,
        service,
        message: message?.substring(0, 500) || '', // Stripe metadata limit
      },
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

