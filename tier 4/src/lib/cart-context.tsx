"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { products, type Product } from "./products";

type CartLine = { id: string; qty: number };

type CartContextValue = {
  lines: CartLine[];
  isDrawerOpen: boolean;
  isCheckoutOpen: boolean;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  clearCart: () => void;
  count: number;
  subtotal: number;
  items: Array<{ product: Product; qty: number; lineTotal: number }>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  const addItem = useCallback((id: string) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) {
        return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l));
      }
      return [...prev, { id, qty: 1 }];
    });
    setDrawerOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) => {
      if (qty <= 0) return prev.filter((l) => l.id !== id);
      return prev.map((l) => (l.id === id ? { ...l, qty } : l));
    });
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const items = useMemo(
    () =>
      lines
        .map((l) => {
          const product = products.find((p) => p.id === l.id);
          if (!product) return null;
          return { product, qty: l.qty, lineTotal: product.price * l.qty };
        })
        .filter((x): x is { product: Product; qty: number; lineTotal: number } => x !== null),
    [lines]
  );

  const count = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.lineTotal, 0), [items]);

  const value: CartContextValue = {
    lines,
    isDrawerOpen,
    isCheckoutOpen,
    addItem,
    removeItem,
    setQty,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
    openCheckout: () => {
      setCheckoutOpen(true);
    },
    closeCheckout: () => setCheckoutOpen(false),
    clearCart,
    count,
    subtotal,
    items,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
