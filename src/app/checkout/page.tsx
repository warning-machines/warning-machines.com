'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import './checkout.css';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Get booking details from URL params
  const name = searchParams.get('name') || '';
  const email = searchParams.get('email') || '';
  const service = searchParams.get('service') || '';
  const message = searchParams.get('message') || '';

  useEffect(() => {
    if (!email) {
      setError('Missing booking information. Please fill out the booking form first.');
      return;
    }

    const createCheckoutSession = async () => {
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, service, message }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create checkout session');
        }

        // Redirect to Stripe Checkout using the URL
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('No checkout URL received');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      }
    };

    createCheckoutSession();
  }, [name, email, service, message]);

  if (error) {
    return (
      <div className="checkout-page">
        <div className="checkout-page__container">
          <div className="checkout-page__error">
            <div className="checkout-page__icon checkout-page__icon--error">✕</div>
            <h1>Oops!</h1>
            <p>{error}</p>
            <button className="button button--primary" onClick={() => router.push('/quote-form')}>
              Back to Booking Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-page__container">
        <div className="checkout-page__loading">
          <div className="checkout-page__spinner" />
          <h2>Preparing your checkout...</h2>
          <p>You&apos;ll be redirected to our secure payment page.</p>
          
          <div className="checkout-page__summary">
            <h3>Booking Summary</h3>
            <div className="checkout-page__details">
              <div className="checkout-page__row">
                <span>Service:</span>
                <span>{service}</span>
              </div>
              <div className="checkout-page__row">
                <span>Email:</span>
                <span>{email}</span>
              </div>
              <div className="checkout-page__divider" />
              <div className="checkout-page__row checkout-page__row--total">
                <span>Total:</span>
                <span>€50.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

