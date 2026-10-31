'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import { ProductCard } from '@/components/customer/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistProducts() {
      try {
        const res = await fetch('/api/products?all=true');
        const data = await res.json();
        if (data.success) {
          const filtered = data.products.filter((p: Product) => wishlist.includes(p._id));
          setProducts(filtered);
        }
      } catch (e) {
        console.error('Failed to load wishlist products', e);
      } finally {
        setLoading(false);
      }
    }
    loadWishlistProducts();
  }, [wishlist]);

  return (
    <div className="bg-volt-bg min-h-screen text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-volt-border pb-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              <Heart className="w-7 h-7 text-red-500 fill-red-500" />
              <span>SAVED TO VAULT ({wishlist.length})</span>
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Your favorite VOLTX formulations saved for fast one-click replenishment.
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs uppercase font-bold text-volt-accent hover:underline flex items-center gap-1"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-24 bg-volt-card/60 rounded-3xl border border-volt-border p-8 space-y-4 max-w-md mx-auto">
            <Heart className="w-12 h-12 text-zinc-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">Your vault wishlist is empty</h3>
            <p className="text-xs text-zinc-400">
              Click the heart icon on any product in our store to save it here for fast reordering.
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 rounded-xl bg-volt-accent text-black font-black text-xs uppercase tracking-wider"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
