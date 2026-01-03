'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '../checkout.css';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="checkout-page">
      {showConfetti && (
        <div className="checkout-success__confetti" aria-hidden="true">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="checkout-success__confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#ffc107', '#34d399', '#60a5fa', '#f472b6', '#a78bfa'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </div>
      )}
      
      <div className="checkout-page__container">
        <div className="checkout-success">
          <div className="checkout-success__icon">✓</div>
          <h1>Payment Successful!</h1>
          <p>Thank you for booking a consultation with us. We&apos;ve received your payment and will be in touch within 24 hours to schedule your meeting.</p>
          
          <div className="checkout-success__details">
            <div className="checkout-success__row">
              <span>Confirmation ID:</span>
              <span className="checkout-success__id">{sessionId?.slice(-8).toUpperCase() || 'N/A'}</span>
            </div>
            <p className="checkout-success__note">A confirmation email has been sent to your inbox.</p>
          </div>

          <div className="checkout-success__actions">
            <Link href="/" className="button button--primary">
              Back to Home
            </Link>
            <Link href="/services" className="button button--ghost">
              Explore Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

