'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { CartProvider } from '@/hooks/useCart';
import { QuoteCartProvider } from '@/hooks/useQuoteCart';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <QuoteCartProvider>{children}</QuoteCartProvider>
      </CartProvider>
    </AuthProvider>
  );
}

