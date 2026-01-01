'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import './cart.css';

export default function CartPage() {
  const { user } = useAuth();
  const { items, isLoading, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCart();

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
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.product_image} alt={item.product_name} className="cart-item__image" />
              
              <div className="cart-item__details">
                <h3 className="cart-item__name">{item.product_name}</h3>
                <p className="cart-item__price">€{Number(item.product_price).toFixed(2)}</p>
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

              <div className="cart-item__subtotal">
                €{(Number(item.product_price) * item.quantity).toFixed(2)}
              </div>

              <button
                className="cart-item__remove"
                onClick={() => removeItem(item.product_id)}
                aria-label="Remove item"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="cart-page__summary">
          <h2>Order Summary</h2>
          
          <div className="cart-summary__row">
            <span>Subtotal ({totalItems} items)</span>
            <span>€{totalPrice.toFixed(2)}</span>
          </div>
          
          <div className="cart-summary__row">
            <span>Shipping</span>
            <span className="cart-summary__free">Free</span>
          </div>
          
          <div className="cart-summary__divider" />
          
          <div className="cart-summary__row cart-summary__total">
            <span>Total</span>
            <span>€{totalPrice.toFixed(2)}</span>
          </div>

          <button className="button button--primary cart-summary__checkout">
            Proceed to Checkout
          </button>

          <button className="cart-summary__clear" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}

