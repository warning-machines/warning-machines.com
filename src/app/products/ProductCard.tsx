'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product } from './types';
import { CartModal } from '@/components/cart/CartModal';

export function ProductCard({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayPrice = (product.price / 100).toFixed(2);

  return (
    <>
      <div className="product-card">
        <div className="row first-row">
          <button className="is-saved">
            <img src="/images/icons/heart.svg" alt="Save" />
          </button>
        </div>

        <Link href={`/products/${product.id}`} style={{ display: 'contents' }}>
          <img src={product.image_url} alt={product.name} style={{ marginTop: 'auto', cursor: 'pointer' }} />
        </Link>

        <div className="row" style={{ marginTop: 'auto' }}>
          <div className="column">
            <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
              <h6 className="name" style={{ cursor: 'pointer' }}>{product.name}</h6>
            </Link>
            <p className="description">{product.description}</p>
          </div>
          <div className="column">
            <h3 className="price">€{displayPrice}</h3>
            <button className="add-to-cart" onClick={() => setIsModalOpen(true)}>
              Add to cart
            </button>
          </div>
        </div>
      </div>

      <CartModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
