'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { ProductCard } from '@/components/customer/ProductCard';
import { Search, Filter, SlidersHorizontal, Sparkles } from 'lucide-react';

const CATEGORIES = ['All', 'Classic', 'Zero Sugar', 'High-Volt', 'Variety Pack'];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory !== 'All') queryParams.set('category', selectedCategory);
        if (search) queryParams.set('search', search);
        if (sortBy) queryParams.set('sort', sortBy);

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (e) {
        console.error('Failed to load products', e);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(fetchProducts, 250);
    return () => clearTimeout(timer);
  }, [selectedCategory, search, sortBy]);

  return (
    <div className="bg-volt-bg min-h-screen py-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-volt-border pb-8 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-volt-card border border-volt-border text-xs font-bold text-volt-accent uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" /> OFFICIAL VOLTX STORE
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            THE PERFORMANCE ARSENAL
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl">
            Choose from pure energy classics, zero-sugar cognitive formulas, high-osmolarity electrolyte cans, and multi-flavor collector packs.
          </p>
        </div>

        {/* Filter and Search Controls */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-volt-accent text-black shadow-[0_0_15px_rgba(183,255,50,0.3)]'
                    : 'bg-volt-card text-zinc-400 hover:text-white border border-volt-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search flavors, SKU, cans..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-volt-card border border-volt-border rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-volt-accent transition-colors"
              />
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-zinc-400 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto bg-volt-card border border-volt-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-volt-accent transition-colors"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="popular">Best Sellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid / Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-volt-card/40 border border-volt-border animate-pulse"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-volt-card/40 rounded-3xl border border-volt-border p-8 space-y-4">
            <Filter className="w-10 h-10 text-zinc-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No products match your criteria</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Try adjusting your category selection, search terms, or price sorting filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearch('');
              }}
              className="px-6 py-2.5 rounded-xl bg-volt-accent text-black font-black text-xs uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
