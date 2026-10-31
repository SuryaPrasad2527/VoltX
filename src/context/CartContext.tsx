'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/types';
import { useAuth } from './AuthContext';

export interface CartItemWithProduct {
  productId: string;
  quantity: number;
  product: Product;
}

interface CartContextType {
  items: CartItemWithProduct[];
  itemCount: number;
  subtotal: number;
  discount: number;
  couponCode: string | null;
  tax: number;
  shippingCost: number;
  totalAmount: number;
  wishlist: string[];
  addToCart: (product: Product, quantity?: number) => { success: boolean; message?: string };
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message?: string }>;
  removeCoupon: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart & wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('voltx_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedWishlist = localStorage.getItem('voltx_wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (e) {
      console.error('Failed to load local cart', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('voltx_cart', JSON.stringify(items));
      localStorage.setItem('voltx_wishlist', JSON.stringify(wishlist));
    } catch (e) {}

    // Sync with server if logged in
    if (user) {
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((it) => ({ productId: it.productId, quantity: it.quantity })),
        }),
      }).catch(() => {});
    }
  }, [items, wishlist, user, isLoaded]);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (product.stock <= 0) {
      return { success: false, message: 'This item is currently out of stock.' };
    }

    let result = { success: true, message: 'Added to cart' };

    setItems((prev) => {
      const existing = prev.find((it) => it.productId === product._id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) {
          result = {
            success: false,
            message: `Cannot add more. Maximum available stock is ${product.stock}.`,
          };
          return prev;
        }
        return prev.map((it) =>
          it.productId === product._id ? { ...it, quantity: newQty, product } : it
        );
      } else {
        if (quantity > product.stock) {
          result = {
            success: false,
            message: `Cannot add ${quantity} units. Only ${product.stock} available.`,
          };
          return prev;
        }
        return [...prev, { productId: product._id, quantity, product }];
      }
    });

    return result;
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prev) =>
      prev.map((it) => {
        if (it.productId === productId) {
          if (quantity > it.product.stock) {
            return { ...it, quantity: it.product.stock };
          }
          return { ...it, quantity };
        }
        return it;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((it) => it.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
    setDiscount(0);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Calculations
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const tax = Math.round(discountedSubtotal * 0.05); // 5% tax
  const shippingCost = items.length === 0 ? 0 : discountedSubtotal >= 500 ? 0 : 50;
  const totalAmount = items.length === 0 ? 0 : discountedSubtotal + tax + shippingCost;

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Failed to apply coupon' };
      }
      setCouponCode(data.coupon.code);
      setDiscount(data.coupon.discount);
      return { success: true, message: `Coupon applied: ${data.coupon.description}` };
    } catch (e: any) {
      return { success: false, message: e.message || 'Error applying coupon' };
    }
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setDiscount(0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount,
        couponCode,
        tax,
        shippingCost,
        totalAmount,
        wishlist,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
