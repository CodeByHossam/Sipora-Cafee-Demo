// src/hooks/useCart.tsx
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Product } from '@/types/product';
import { CartItem, CartOptions } from '@/types/cart';

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (product: Product, options: CartOptions, qty?: number) => void;
  updateQty: (key: string, qty: number) => void;
  updateOptions: (key: string, options: CartOptions) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function makeKey(productId: string, options: CartOptions) {
  return `${productId}::${options.size}::${options.milk}::${options.shot}::${options.sweet}`;
}

function computeUnitPrice(basePrice: number, customizations: Product['customizations'], options: CartOptions) {
  return (
    basePrice +
    (customizations.sizes.find((o) => o.id === options.size)?.priceDelta ?? 0) +
    (customizations.milks.find((o) => o.id === options.milk)?.priceDelta ?? 0) +
    (customizations.shots.find((o) => o.id === options.shot)?.priceDelta ?? 0) +
    (customizations.sweetness.find((o) => o.id === options.sweet)?.priceDelta ?? 0)
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Product, options: CartOptions, qty = 1) => {
    const key = makeKey(product.id, options);
    const unitPrice = computeUnitPrice(product.price, product.customizations, options);

    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [
        ...prev,
        { key, productId: product.id, name: product.name, image: product.image, options, customizations: product.customizations, basePrice: product.price, qty, unitPrice },
      ];
    });
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i))
    );
  }, []);

  const updateOptions = useCallback((key: string, options: CartOptions) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.key !== key) return i;
        const newKey = makeKey(i.productId, options);
        const unitPrice = computeUnitPrice(i.basePrice, i.customizations, options);
        return { ...i, key: newKey, options, unitPrice };
      })
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const total = items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, itemCount, total, addItem, updateQty, updateOptions, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}