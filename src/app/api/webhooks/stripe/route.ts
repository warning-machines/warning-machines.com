import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { sendBookingConfirmation, sendPaidBookingNotification, sendOrderConfirmation, sendOrderNotification } from '@/lib/email';
import { clearCart } from '@/lib/db/cart';
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
  const checkoutType = session.metadata?.type || 'meeting';
  const amount = session.amount_total || 0;
  const currency = session.currency || 'eur';
  const confirmationId = session.id.slice(-8).toUpperCase();

  if (!customerEmail) {
    console.error('No customer email in session:', session.id);
    return;
  }

  console.log(`Processing completed checkout for ${customerEmail}, type: ${checkoutType}`);

  if (checkoutType === 'product') {
    // Handle product order
    const productNames = session.metadata?.productNames || 'Products';
    const userId = session.metadata?.userId;
    const customerName = session.metadata?.customerName || '';
    const phone = session.metadata?.phone || '';
    const country = session.metadata?.country || '';
    const city = session.metadata?.city || '';
    const courier = session.metadata?.courier || '';
    const courierOffice = session.metadata?.courierOffice || '';

    // Clear the user's cart
    if (userId) {
      try {
        await clearCart(userId);
        console.log(`Cart cleared for user ${userId}`);
      } catch (err) {
        console.error('Failed to clear cart:', err);
      }
    }

    // Send order confirmation email to customer
    try {
      await sendOrderConfirmation({
        customerEmail,
        productNames,
        amount,
        currency,
        orderId: confirmationId,
      });
      console.log(`Order confirmation email sent to ${customerEmail}`);
    } catch (err) {
      console.error('Failed to send order confirmation:', err);
    }

    // Send notification to admin
    try {
      await sendOrderNotification({
        customerEmail,
        customerName,
        phone,
        country,
        city,
        courier,
        courierOffice,
        productNames,
        amount,
        currency,
        orderId: confirmationId,
      });
      console.log('Admin order notification sent');
    } catch (err) {
      console.error('Failed to send admin order notification:', err);
    }
  } else {
    // Handle meeting booking
    const customerName = session.metadata?.customerName || 'Customer';
    const service = session.metadata?.service || 'Consultation';
    const message = session.metadata?.message || '';

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
      console.log(`Booking confirmation email sent to ${customerEmail}`);
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
      console.log('Admin booking notification sent');
    } catch (err) {
      console.error('Failed to send admin notification:', err);
    }
  }
}

