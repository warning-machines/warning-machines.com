'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CartItem as CartItemType, useCart } from '@/hooks/useCart';
import { useQuoteCart, QuoteItem } from '@/hooks/useQuoteCart';
import { useAuth } from '@/hooks/useAuth';
import './cart.css';

function CartItem({ item }: { item: CartItemType }) {
  const itemPrice = (item.price / 100).toFixed(2);
  const subtotal = ((item.price * item.quantity) / 100).toFixed(2);
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="cart-item">
      <img src={item.image_url} alt={item.name} className="cart-item__image" />
      <div className="cart-item__details">
        <h3 className="cart-item__name">{item.name}</h3>
        <p className="cart-item__price">€{itemPrice}</p>
      </div>
      <div className="cart-item__quantity">
        <button className="cart-item__qty-btn" onClick={() => updateQuantity(item.product_id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
        <span className="cart-item__qty-value">{item.quantity}</span>
        <button className="cart-item__qty-btn" onClick={() => updateQuantity(item.product_id, item.quantity + 1)}>+</button>
      </div>
      <div className="cart-item__subtotal">€{subtotal}</div>
      <button className="cart-item__remove" onClick={() => removeItem(item.product_id)} aria-label="Remove item">×</button>
    </div>
  );
}

function QuoteItemCard({ item }: { item: QuoteItem }) {
  const { removeQuote } = useQuoteCart();
  return (
    <div className="cart-quote-item">
      <div className="cart-quote-item__icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </div>
      <div className="cart-quote-item__body">
        <p className="cart-quote-item__service">{item.service}</p>
        <p className="cart-quote-item__label">{item.label}</p>
        <p className="cart-quote-item__price">{item.priceRange}</p>
        {item.fileName && <p className="cart-quote-item__file">File: {item.fileName}</p>}
      </div>
      <button className="cart-quote-item__remove" onClick={() => removeQuote(item.id)} aria-label="Remove quote">×</button>
    </div>
  );
}

function QuoteEnquiryForm() {
  const { quotes, clearQuotes } = useQuoteCart();
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [error, setError]             = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitting(true);
    setError('');

    const message = [
      `MANUFACTURING QUOTE REQUEST`,
      ``,
      ...quotes.map((q, i) => [
        `--- Quote ${i + 1}: ${q.service} ---`,
        q.specs,
        q.fileName ? `File: ${q.fileName}` : '',
      ].filter(Boolean).join('\n')),
    ].join('\n\n');

    const fd = new FormData();
    fd.append('name', name);
    fd.append('email', email);
    fd.append('service', 'Manufacturing');
    fd.append('message', message);

    try {
      const res = await fetch('/api/contact', { method: 'POST', body: fd });
      const data = await res.json() as { success: boolean; error?: string };
      if (data.success) {
        setSubmitted(true);
        clearQuotes();
      } else {
        setError(data.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="cart-quotes__success">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Enquiry sent! We&apos;ll get back to you shortly.
      </div>
    );
  }

  return (
    <div className="cart-quotes__enquiry">
      <h3>Send Enquiry for All Quotes</h3>
      <form className="cart-quotes__enquiry-fields" onSubmit={handleSubmit}>
        <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        {error && <p className="cart-quotes__error">{error}</p>}
        <button type="submit" className="cart-quotes__send" disabled={submitting}>
          {submitting ? 'Sending…' : `Send ${quotes.length} Quote Request${quotes.length !== 1 ? 's' : ''}`}
        </button>
      </form>
    </div>
  );
}

export default function CartPage() {
  const { user } = useAuth();
  const { items, isLoading, clearCart, totalItems, totalPrice } = useCart();
  const { quotes, clearQuotes, totalQuoteItems } = useQuoteCart();

  const displayTotal = (totalPrice / 100).toFixed(2);
  const hasProducts = items.length > 0;
  const hasQuotes = quotes.length > 0;
  const isEmpty = !hasProducts && !hasQuotes;

  const needsSignIn = !user?.sub && !hasQuotes;

  if (needsSignIn) {
    return (
      <div className="cart-page">
        <div className="cart-page__empty">
          <div className="cart-page__empty-icon">🛒</div>
          <h2>Sign in to view your cart</h2>
          <p>Please sign in with Google to access your shopping cart.</p>
        </div>
      </div>
    );
  }

  if (isLoading && !hasQuotes) {
    return (
      <div className="cart-page">
        <div className="cart-page__loading">
          <div className="cart-page__spinner" />
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="cart-page">
        <div className="cart-page__empty">
          <div className="cart-page__empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Browse our products or get an instant manufacturing quote.</p>
          <Link href="/products" className="button button--primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page__header">
        <h1>Shopping Cart</h1>
        <span className="cart-page__count">{totalItems + totalQuoteItems} item{(totalItems + totalQuoteItems) !== 1 ? 's' : ''}</span>
      </div>

      <div className="cart-page__content">
        <div className="cart-page__items">
          {/* Product items */}
          {hasProducts && items.map((item) => <CartItem item={item} key={item.id} />)}

          {/* Manufacturing Quotes */}
          {hasQuotes && (
            <div className="cart-quotes">
              {hasProducts && <p className="cart-quotes__heading">Manufacturing Quotes</p>}
              {quotes.map((q) => <QuoteItemCard item={q} key={q.id} />)}
              <QuoteEnquiryForm />
              <button className="cart-quotes__clear" onClick={clearQuotes}>Remove all quotes</button>
            </div>
          )}
        </div>

        {/* Order summary — only show if there are product items */}
        {hasProducts && (
          <div className="cart-page__summary">
            <h2>Order Summary</h2>
            <div className="cart-summary__row">
              <span>Subtotal ({totalItems} items)</span>
              <span>€{displayTotal}</span>
            </div>
            <div className="cart-summary__row">
              <span>Shipping</span>
              <span className="cart-summary__free">Free</span>
            </div>
            <div className="cart-summary__divider" />
            <div className="cart-summary__row cart-summary__total">
              <span>Total</span>
              <span>€{displayTotal}</span>
            </div>
            <Link href="/checkout" className="button button--primary cart-summary__checkout">
              Proceed to Checkout
            </Link>
            <button className="cart-summary__clear" onClick={clearCart}>Clear Cart</button>
          </div>
        )}
      </div>
    </div>
  );
}
