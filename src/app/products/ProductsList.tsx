'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from './types';

export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="products-list products-list--loading">
        <div className="products-list__spinner" />
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-list products-list--error">
        <p>Failed to load products: {error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="products-list products-list--empty">
        <p>No products available yet.</p>
      </div>
    );
  }

  return (
    <div className="products-list">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
