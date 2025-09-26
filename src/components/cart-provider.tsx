
"use client";

import { useState, createContext, useEffect, type ReactNode } from "react";

// The Product type needs an imageId for the cart, but the new structure has imageIds.
// We'll create a modified Product type for the cart context.
export interface ProductInCart {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageIds: string[];
  imageId: string; // To ensure compatibility with cart logic
  category: 'Kits' | 'Components' | 'Recommendation';
}

export interface CartItem extends ProductInCart {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: ProductInCart, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('robomart-cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        // Basic validation to prevent crashes if stored data is malformed
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        setItems([]);
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('robomart-cart', JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [items]);

  const addItem = (product: ProductInCart, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
