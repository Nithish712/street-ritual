import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product, size, quantity = 1) => {
    setItems(prev => {
      const key = `${product.id}-${size}`;
      const existing = prev.find(i => i.cartKey === key);
      if (existing) {
        return prev.map(i => i.cartKey === key ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...product, size, quantity, cartKey: key }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((cartKey) => {
    setItems(prev => prev.filter(i => i.cartKey !== cartKey));
  }, []);

  const updateQty = useCallback((cartKey, qty) => {
    if (qty < 1) return;
    setItems(prev => prev.map(i => i.cartKey === cartKey ? { ...i, quantity: qty } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, isOpen, setIsOpen, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
