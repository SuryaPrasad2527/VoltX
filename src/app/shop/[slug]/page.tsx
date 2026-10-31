'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  Star,
  Check,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Flame,
  Truck,
  RotateCcw,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');
  const [added, setAdded] = useState(false);
  const [reviews, setReviews] = useState<any[]>([
    {
      _id: 'rev-1',
      userName: 'Aakash Verma',
      rating: 5,
      date: '2 days ago',
      comment: 'Remarkable difference in taste and stamina compared to usual sweet drinks. The lime kick is crisp and ice-cold!',
    },
    {
      _id: 'rev-2',
      userName: 'Kavita Nair',
      rating: 5,
      date: '1 week ago',
      comment: 'Super clean energy. Drank it before a 10K marathon simulation and set a new personal record.',
    },
  ]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          setActiveImage(data.product.image);
        }
      } catch (e) {
        console.error('Failed to load product details', e);
      } finally {
        setLoading(false);
      }
    }
    if (slug) loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-volt-bg text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-volt-border border-t-volt-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-volt-bg text-white flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <Link
          href="/shop"
          className="px-6 py-2.5 rounded-xl bg-volt-accent text-black font-black text-xs uppercase"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product._id);

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    const res = addToCart(product, quantity);
    if (res.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setReviews([
      {
        _id: `rev-${Date.now()}`,
        userName: 'Verified Buyer',
        rating: newRating,
        date: 'Just now',
        comment: newComment.trim(),
      },
      ...reviews,
    ]);
    setNewComment('');
  };

  return (
    <div className="bg-volt-bg min-h-screen text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-volt-accent uppercase tracking-wider mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO ARSENAL</span>
        </Link>

        {/* Main Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-volt-card rounded-3xl border border-volt-border p-6 sm:p-10 shadow-2xl">
          {/* Left Image Stage */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative bg-gradient-to-b from-[#0a0f0c] to-volt-bg rounded-2xl p-8 border border-volt-border/60">
            {/* Glow halo */}
            <div className="absolute inset-0 bg-volt-accent/10 rounded-2xl blur-3xl" />

            <div className="relative w-72 h-96 sm:w-80 sm:h-[450px]">
              <Image
                src={activeImage || product.image}
                alt={product.name}
                fill
                className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
                priority
              />
            </div>

            {/* Thumbnail switcher if multiple images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 mt-6">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-xl border p-1 bg-volt-card transition-all ${
                      activeImage === img
                        ? 'border-volt-accent shadow-[0_0_10px_#B7FF32]'
                        : 'border-volt-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <Image src={img} alt="Thumbnail" fill className="object-contain" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Buy Box & Specs */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              {/* Badge & Category */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-volt-accent/15 text-volt-accent border border-volt-accent/30">
                  {product.category}
                </span>
                <span className="text-xs text-zinc-400 font-mono">SKU: {product.SKU}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                {product.name}
              </h1>

              {/* Flavor & Size subtitle */}
              <p className="text-sm text-volt-accent font-semibold mt-1">
                Flavour: {product.flavour} • {product.size}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3 text-xs text-zinc-300">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400" />
                  ))}
                </div>
                <span className="font-bold">{product.rating?.toFixed(1) || '5.0'}</span>
                <span className="text-zinc-500">({product.numReviews || 24} Verified Athlete Reviews)</span>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="p-4 rounded-xl bg-volt-bg border border-volt-border flex items-baseline gap-4">
              <span className="text-3xl font-black text-white">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-base text-zinc-500 line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-xs font-black text-volt-accent px-2 py-0.5 rounded bg-volt-accent/10 border border-volt-accent/30">
                    SAVE ₹{product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-300 leading-relaxed">
              {product.description}
            </p>

            {/* Nutritional Spec Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-volt-bg border border-volt-border text-center">
                <span className="block text-xs uppercase font-bold text-zinc-500">Caffeine</span>
                <span className="text-lg font-black text-white">{product.caffeineMg || 160}mg</span>
              </div>
              <div className="p-3 rounded-xl bg-volt-bg border border-volt-border text-center">
                <span className="block text-xs uppercase font-bold text-zinc-500">Calories</span>
                <span className="text-lg font-black text-white">{product.calories ?? 15} kcal</span>
              </div>
              <div className="p-3 rounded-xl bg-volt-bg border border-volt-border text-center">
                <span className="block text-xs uppercase font-bold text-zinc-500">Sugar</span>
                <span className="text-lg font-black text-volt-accent">0g</span>
              </div>
            </div>

            {/* Stock status */}
            <div className="pt-2">
              {product.stock <= 0 ? (
                <div className="flex items-center gap-2 text-red-400 text-sm font-bold">
                  <AlertTriangle className="w-4 h-4" /> Out of stock. Restock in progress.
                </div>
              ) : product.stock < 15 ? (
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold bg-amber-950/20 p-2.5 rounded-lg border border-amber-800/40">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  High Demand: Only {product.stock} units remaining in the vault!
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Vault inventory: In Stock ({product.stock} units ready to dispatch)
                </div>
              )}
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-volt-border">
              {/* Stepper */}
              <div className="flex items-center justify-between border border-volt-border bg-volt-bg rounded-xl px-4 py-2.5 w-full sm:w-36">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || product.stock <= 0}
                  className="text-lg font-bold text-zinc-400 hover:text-white disabled:opacity-30"
                >
                  -
                </button>
                <span className="text-base font-black text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || product.stock <= 0}
                  className="text-lg font-bold text-zinc-400 hover:text-white disabled:opacity-30"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 py-4 px-6 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-all ${
                  product.stock <= 0
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : added
                    ? 'bg-emerald-500 text-black shadow-[0_0_20px_#10B981]'
                    : 'bg-volt-accent hover:bg-volt-accentHover text-black shadow-[0_0_25px_rgba(183,255,50,0.4)]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5 stroke-[3]" />
                    ADDED TO CART
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    ADD {quantity} TO CART • ₹{product.price * quantity}
                  </>
                )}
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product._id)}
                className={`p-4 rounded-xl border transition-colors ${
                  isWishlisted
                    ? 'bg-red-500/20 text-red-400 border-red-500/40'
                    : 'bg-volt-bg border-volt-border text-zinc-400 hover:text-white'
                }`}
                title="Toggle Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            {/* Quick trust perks */}
            <div className="pt-4 grid grid-cols-2 gap-2 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-volt-accent" /> Lightning Dispatch in 24h
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-volt-accent" /> 100% Genuine Formula
              </span>
            </div>
          </div>
        </div>

        {/* Customer Reviews & Feedback Section */}
        <div className="mt-16 bg-volt-card rounded-3xl border border-volt-border p-8 sm:p-12">
          <h2 className="text-2xl font-black uppercase text-white tracking-tight mb-8">
            VERIFIED REVIEWS & FIELD REPORTS
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="p-5 rounded-xl bg-volt-bg border border-volt-border space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{rev.userName}</span>
                    <span className="text-xs text-zinc-500">{rev.date}</span>
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>

            {/* Submit Review Form */}
            <div className="lg:col-span-5 bg-volt-bg border border-volt-border rounded-2xl p-6">
              <h3 className="font-bold text-sm uppercase tracking-wider text-white mb-4">
                Submit Your Field Report
              </h3>
              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Rating (1-5 Stars)
                  </label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full bg-volt-card border border-volt-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-volt-accent"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5) Exceptional Surge</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5) Very Solid</option>
                    <option value={3}>⭐⭐⭐ (3/5) Average</option>
                    <option value={2}>⭐⭐ (2/5) Below Expectations</option>
                    <option value={1}>⭐ (1/5) Needs R&D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Your Experience
                  </label>
                  <textarea
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                    placeholder="Describe how VOLTX impacted your focus, energy, or training..."
                    className="w-full bg-volt-card border border-volt-border rounded-lg p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-volt-accent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-volt-accent hover:bg-volt-accentHover text-black font-black text-xs uppercase tracking-wider transition-colors"
                >
                  POST REVIEW
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
