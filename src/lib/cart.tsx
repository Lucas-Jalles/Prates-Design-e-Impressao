"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { CartItem, Service } from "@/types";

const STORAGE_KEY = "grafica_carrinho_v1";

interface CartContextValue {
  items: CartItem[];
  addItem: (service: Service, quantity?: number) => void;
  removeItem: (serviceId: number) => void;
  updateQuantity: (serviceId: number, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, hydrated]);

  const addItem = useCallback((service: Service, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.service.id === service.id);
      if (existing) {
        return prev.map((i) =>
          i.service.id === service.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { service, quantity }];
    });
  }, []);

  const removeItem = useCallback((serviceId: number) => {
    setItems((prev) => prev.filter((i) => i.service.id !== serviceId));
  }, []);

  const updateQuantity = useCallback((serviceId: number, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.service.id === serviceId ? { ...i, quantity } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => {
    const price = i.service.valor_desconto !== null ? i.service.valor_desconto : i.service.valor_original;
    return s + price * i.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clear, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}