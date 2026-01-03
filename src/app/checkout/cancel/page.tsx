import Link from 'next/link';
import '../checkout.css';

export default function CheckoutCancelPage() {
  return (
    <div className="checkout-page">
      <div className="checkout-page__container">
        <div className="checkout-cancel">
          <div className="checkout-cancel__icon">←</div>
          <h1>Payment Cancelled</h1>
          <p>No worries! Your payment was not processed. If you have any questions about our services or pricing, feel free to reach out.</p>
          
          <div className="checkout-cancel__actions">
            <Link href="/quote-form" className="button button--primary">
              Try Again
            </Link>
            <Link href="/" className="button button--ghost">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

