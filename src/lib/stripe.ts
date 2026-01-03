import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
});

// Meeting booking product configuration
export const MEETING_PRODUCT = {
  name: '1 hour meeting',
  description: '1 hour meeting with technical leaders to discuss your project',
  price: 3000, // €30.00 in cents
  currency: 'eur',
};

