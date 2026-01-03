import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { sendBookingConfirmation, sendPaidBookingNotification } from '@/lib/email';
import type Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('Missing stripe-signature header');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      try {
        await handleCheckoutCompleted(session);
      } catch (err) {
        console.error('Error handling checkout.session.completed:', err);
        // Return 200 to acknowledge receipt, but log the error
        // Stripe will show this in their dashboard
      }
      break;
    }
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerEmail = session.customer_email;
  const customerName = session.metadata?.customerName || 'Customer';
  const service = session.metadata?.service || 'Consultation';
  const message = session.metadata?.message || '';
  const amount = session.amount_total || 0;
  const currency = session.currency || 'eur';
  const confirmationId = session.id.slice(-8).toUpperCase();

  if (!customerEmail) {
    console.error('No customer email in session:', session.id);
    return;
  }

  console.log(`Processing completed checkout for ${customerEmail}`);

  // Send confirmation email to customer
  try {
    await sendBookingConfirmation({
      customerEmail,
      customerName,
      service,
      amount,
      currency,
      confirmationId,
    });
    console.log(`Confirmation email sent to ${customerEmail}`);
  } catch (err) {
    console.error('Failed to send customer confirmation:', err);
  }

  // Send notification to admin
  try {
    await sendPaidBookingNotification({
      customerEmail,
      customerName,
      service,
      message,
      amount,
      currency,
      confirmationId,
    });
    console.log('Admin notification sent');
  } catch (err) {
    console.error('Failed to send admin notification:', err);
  }
}

