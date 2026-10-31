'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Heart, Star, AlertTriangle, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const isWishlisted = isInWishlist(product._id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;

    const res = addToCart(product, 1);
    if (res.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  return (
    <div className="group relative rounded-2xl bg-volt-card border border-volt-border hover:border-volt-accent/60 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
      {/* Top badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-volt-accent border border-volt-border">
            {product.category}
          </span>
          {discountPercent > 0 && (
            <span className="text-[10px] font-black uppercase px-2 py-1 rounded bg-volt-accent text-black shadow-[0_0_8px_#B7FF32]">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlistToggle}
          className={`p-2 rounded-full backdrop-blur-md transition-colors ${
            isWishlisted
              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
              : 'bg-black/60 text-zinc-400 hover:text-white border border-volt-border'
          }`}
          title="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
        </button>
      </div>

      {/* Product Image Area */}
      <Link
        href={`/shop/${product.slug}`}
        className="relative w-full h-64 sm:h-72 bg-gradient-to-b from-[#0a0f0c] to-volt-card flex items-center justify-center p-6 overflow-hidden"
      >
        {/* Glow halo */}
        <div className="absolute inset-0 bg-volt-accent/5 rounded-full blur-2xl group-hover:bg-volt-accent/15 transition-all duration-500" />

        <div className="relative w-44 h-56 sm:w-48 sm:h-64 flex items-center justify-center">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>

      {/* Card Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Flavor and Rating */}
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span className="font-semibold text-volt-accent uppercase tracking-wider text-[11px]">
              {product.flavour}
            </span>
            <div className="flex items-center gap-1 text-zinc-300">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-xs">{product.rating?.toFixed(1) || '5.0'}</span>
              <span className="text-[10px] text-zinc-400">({product.numReviews || 24})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link href={`/shop/${product.slug}`}>
            <h3 className="font-extrabold text-base text-white hover:text-volt-accent transition-colors tracking-tight line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Size / Specs */}
          <p className="text-xs text-zinc-400 mt-1">
            {product.size} • {product.caffeineMg || 160}mg Caffeine
          </p>

          {/* Stock state indicator */}
          <div className="mt-2.5">
            {product.stock <= 0 ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400">
                Out of Stock
              </span>
            ) : product.stock < 15 ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400">
                <AlertTriangle className="w-3 h-3" />
                Only {product.stock} units remaining!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                In Stock ({product.stock} cans)
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="pt-3 border-t border-volt-border/60 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-white">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-zinc-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all duration-300 ${
              product.stock <= 0
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-500 text-black shadow-[0_0_15px_#10B981]'
                : 'bg-volt-accent hover:bg-volt-accentHover text-black shadow-[0_0_15px_rgba(183,255,50,0.3)] hover:shadow-[0_0_20px_rgba(183,255,50,0.5)]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                ADDED
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                ADD
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
