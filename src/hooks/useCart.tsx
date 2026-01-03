'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from './useAuth';

// Cart item with product data joined from database
export type CartItem = {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  // Joined from products table
  name: string;
  description: string;
  price: number; // in cents
  image_url: string;
};

type CartContextValue = {
  items: CartItem[];
  isLoading: boolean;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number; // in cents
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const userId = user?.sub;

  const refreshCart = useCallback(async () => {
    if (!userId) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/cart?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(async (productId: number, quantity: number) => {
    if (!userId) return;

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, quantity }),
      });

      if (res.ok) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  }, [userId, refreshCart]);

  const updateQuantity = useCallback(async (productId: number, quantity: number) => {
    if (!userId) return;

    try {
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, quantity }),
      });

      if (res.ok) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  }, [userId, refreshCart]);

  const removeItem = useCallback(async (productId: number) => {
    if (!userId) return;

    try {
      const res = await fetch(`/api/cart?userId=${encodeURIComponent(userId)}&productId=${productId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  }, [userId, refreshCart]);

  const clearCartFn = useCallback(async () => {
    if (!userId) return;

    try {
      const res = await fetch(`/api/cart?userId=${encodeURIComponent(userId)}&clearAll=true`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setItems([]);
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  }, [userId]);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  const value = useMemo(
    () => ({ items, isLoading, addToCart, updateQuantity, removeItem, clearCart: clearCartFn, refreshCart, totalItems, totalPrice }),
    [items, isLoading, addToCart, updateQuantity, removeItem, clearCartFn, refreshCart, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
