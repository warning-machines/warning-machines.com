'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type QuoteService = '3D Printing' | 'CNC Machining' | 'Laser Cutting';

export type QuoteItem = {
  id: string;
  service: QuoteService;
  label: string;      // short display line, e.g. "PLA · Standard · 25% · ×2"
  specs: string;      // full specs for email body
  priceRange: string; // e.g. "€45 – €60"
  fileName?: string;  // file attached by the user (name only)
  quantity: number;
  addedAt: number;    // timestamp
};

type QuoteCartCtx = {
  quotes: QuoteItem[];
  addQuote: (item: Omit<QuoteItem, 'id' | 'addedAt'>) => void;
  removeQuote: (id: string) => void;
  clearQuotes: () => void;
  totalQuoteItems: number;
};

const QuoteCartContext = createContext<QuoteCartCtx | null>(null);

const STORAGE_KEY = 'wm_quote_cart';

export function QuoteCartProvider({ children }: { children: ReactNode }) {
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setQuotes(JSON.parse(stored) as QuoteItem[]);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  }, [quotes]);

  const addQuote = useCallback((item: Omit<QuoteItem, 'id' | 'addedAt'>) => {
    setQuotes((prev) => [
      ...prev,
      { ...item, id: Date.now().toString(), addedAt: Date.now() },
    ]);
  }, []);

  const removeQuote = useCallback((id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
  }, []);

  const clearQuotes = useCallback(() => setQuotes([]), []);

  return (
    <QuoteCartContext.Provider value={{
      quotes,
      addQuote,
      removeQuote,
      clearQuotes,
      totalQuoteItems: quotes.reduce((s, q) => s + q.quantity, 0),
    }}>
      {children}
    </QuoteCartContext.Provider>
  );
}

export function useQuoteCart() {
  const ctx = useContext(QuoteCartContext);
  if (!ctx) throw new Error('useQuoteCart must be used within QuoteCartProvider');
  return ctx;
}
