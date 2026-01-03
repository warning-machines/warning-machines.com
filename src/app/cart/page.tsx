'use client';

import Link from 'next/link';
import { CartItem as CartItemType, useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import './cart.css';

function CartItem({ item }: { item: CartItemType }) {
  const itemPrice = (item.price / 100).toFixed(2);
  const subtotal = ((item.price * item.quantity) / 100).toFixed(2);

  const { updateQuantity, removeItem } = useCart();


  return <div key={item.id} className="cart-item">
    <img src={item.image_url} alt={item.name} className="cart-item__image" />

    <div className="cart-item__details">
      <h3 className="cart-item__name">{item.name}</h3>
      <p className="cart-item__price">€{itemPrice}</p>
    </div>

    <div className="cart-item__quantity">
      <button
        className="cart-item__qty-btn"
        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
        disabled={item.quantity <= 1}
      >
        −
      </button>
      <span className="cart-item__qty-value">{item.quantity}</span>
      <button
        className="cart-item__qty-btn"
        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
      >
        +
      </button>
    </div>

    <div className="cart-item__subtotal">€{subtotal}</div>

    <button
      className="cart-item__remove"
      onClick={() => removeItem(item.product_id)}
      aria-label="Remove item"
    >
      ×
    </button>
  </div>
}

function CheckoutButton() {
  const { user } = useAuth();

  async function checkout() {
    const response = await fetch('/api/checkout/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user?.email,
        userId: user?.sub,
      }),
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
  }

  return <button onClick={checkout} className="button button--primary cart-summary__checkout">
    Proceed to Checkout
  </button>
}

export default function CartPage() {
  const { user } = useAuth();
  const { items, isLoading, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCart();

  // totalPrice is in cents, convert to euros for display
  const displayTotal = (totalPrice / 100).toFixed(2);

  if (!user?.sub) {
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

  if (isLoading) {
    return (
      <div className="cart-page">
        <div className="cart-page__loading">
          <div className="cart-page__spinner" />
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-page__empty">
          <div className="cart-page__empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven&apos;t added any items yet.</p>
          <Link href="/products" className="button button--primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page__header">
        <h1>Shopping Cart</h1>
        <span className="cart-page__count">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
      </div>

      <div className="cart-page__content">
        <div className="cart-page__items">
          {items.map((item) => <CartItem item={item} key={item.id} />)}
        </div>

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

          <CheckoutButton />

          <button className="cart-summary__clear" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
