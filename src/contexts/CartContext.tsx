import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Cart, CartItem, Product } from '@/types';

interface CartContextType {
  cart: Cart;
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'baypro_cart';

const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.sale_price || item.product.price;
    return sum + price * item.quantity;
  }, 0);
  
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over R500
  const tax = subtotal * 0.15; // 15% VAT
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedItems = JSON.parse(savedCart);
        setItems(parsedItems);
      }
    } catch {
      // Invalid cart data
      localStorage.removeItem(CART_STORAGE_KEY);
    }
    setIsLoading(false);
  }, []);

  // Save cart to localStorage when items change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoading]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      const newItem: CartItem = {
        id: Date.now(),
        product,
        quantity,
      };

      return [...prevItems, newItem];
    });
  }, []);

  const updateQuantity = useCallback((itemId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } else {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  }, []);

  const removeFromCart = useCallback((itemId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const getItemCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const { subtotal, shipping, tax, total } = calculateTotals(items);

  const cart: Cart = {
    items,
    subtotal,
    shipping,
    tax,
    total,
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
