'use client';

import { useState } from 'react';
import { Product } from '@/app/products/types';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

import './cart.css';

type CartModalProps = {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
};

export function CartModal({ product, isOpen, onClose }: CartModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  if (!isOpen) return null;

  // Price is in cents, convert to display
  const displayPrice = (product.price / 100).toFixed(2);
  const totalPrice = ((product.price * quantity) / 100).toFixed(2);

  const handleConfirm = async () => {
    if (!user?.sub) {
      alert('Please sign in to add items to your cart');
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(product.id, quantity);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setQuantity(1);
        onClose();
      }, 1200);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const incrementQuantity = () => setQuantity((q) => Math.min(q + 1, 99));
  const decrementQuantity = () => setQuantity((q) => Math.max(q - 1, 1));

  return (
    <div className="cart-modal-backdrop" onClick={handleBackdropClick}>
      <div className="cart-modal">
        <button className="cart-modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {showSuccess ? (
          <div className="cart-modal__success">
            <div className="cart-modal__success-icon">✓</div>
            <p>Added to cart!</p>
          </div>
        ) : (
          <>
            <div className="cart-modal__product">
              <img src={product.image_url} alt={product.name} className="cart-modal__image" />
              <div className="cart-modal__info">
                <h3 className="cart-modal__name">{product.name}</h3>
                <p className="cart-modal__price">€{displayPrice}</p>
              </div>
            </div>

            <div className="cart-modal__quantity">
              <label>Quantity:</label>
              <div className="cart-modal__quantity-controls">
                <button
                  className="cart-modal__qty-btn"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
                  min={1}
                  max={99}
                  className="cart-modal__qty-input"
                />
                <button
                  className="cart-modal__qty-btn"
                  onClick={incrementQuantity}
                  disabled={quantity >= 99}
                >
                  +
                </button>
              </div>
            </div>

            <div className="cart-modal__total">
              <span>Total:</span>
              <span className="cart-modal__total-price">€{totalPrice}</span>
            </div>

            <button
              className="cart-modal__confirm button button--primary"
              onClick={handleConfirm}
              disabled={isAdding}
            >
              {isAdding ? 'Adding...' : 'Confirm'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
