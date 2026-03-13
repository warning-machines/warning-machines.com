'use client';

import { useState } from 'react';
import { CartModal } from '@/components/cart/CartModal';
import type { Product } from '@/app/products/types';

export function AddToCartButton({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="button button--primary product-detail__cta" onClick={() => setOpen(true)}>
        Add to cart
      </button>
      <CartModal product={product} isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
