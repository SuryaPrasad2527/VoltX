import React from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/customer/HeroSection';
import { FlavorCarousel } from '@/components/customer/FlavorCarousel';
import { BenefitsSection } from '@/components/customer/BenefitsSection';
import { ProductCard } from '@/components/customer/ProductCard';
import { getProducts } from '@/lib/db';
import { Zap, ArrowRight, ShieldCheck, Award, MessageSquare, Star, Sparkles } from 'lucide-react';

export default async function HomePage() {
  const products = await getProducts({ onlyActive: true });
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <div className="bg-volt-bg text-white min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Interactive Flavor Carousel */}
      <FlavorCarousel />

      {/* 3. Featured Products Showcase */}
      <section className="py-24 bg-volt-bg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-volt-accent flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> CURATED PERFORMANCE
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight mt-1">
                FEATURED ARSENAL
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-black text-volt-accent hover:text-white uppercase tracking-wider transition-colors"
            >
              <span>VIEW ALL {products.length} PRODUCTS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Brand Benefits / Scientific Matrix */}
      <BenefitsSection />

      {/* 5. High-Impact Promotional Banner */}
      <section className="py-16 bg-gradient-to-r from-black via-volt-card to-black border-t border-b border-volt-border relative overflow-hidden">
        <div className="absolute inset-0 bg-volt-radial opacity-30 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-volt-accent/20 border border-volt-accent text-xs font-black text-volt-accent uppercase tracking-widest">
            LIMITED TIME PROMO
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white max-w-2xl mx-auto">
            FUEL YOUR AMBITION WITH 20% OFF
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto">
            Apply promo code <span className="text-volt-accent font-black tracking-wider px-2 py-0.5 rounded bg-black/80 border border-volt-border">VOLT20</span> during checkout for an instant 20% discount on orders above ₹299.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-volt-accent hover:bg-volt-accentHover text-black font-black uppercase tracking-wider text-xs shadow-[0_0_25px_rgba(183,255,50,0.4)] transition-all transform hover:scale-105"
            >
              <span>CLAIM OFFER NOW</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Customer Reviews & Community Proof */}
      <section className="py-24 bg-volt-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-volt-accent flex items-center justify-center gap-1.5">
              <Award className="w-4 h-4" /> TESTED BY PRO ATHLETES & CREATORS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              THE 5-STAR VERDICT
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-volt-card border border-volt-border space-y-4">
              <div className="flex gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-zinc-300 italic leading-relaxed">
                &quot;As a software engineer pulling 14-hour sprints, other drinks gave me bad caffeine jitters followed by an afternoon crash. VoltX Original gives me pure, crystalline mental clarity.&quot;
              </p>
              <div className="pt-2 border-t border-volt-border/60">
                <p className="font-bold text-white text-sm">Vikram Malhotra</p>
                <p className="text-xs text-zinc-400">Senior Staff Engineer • Bengaluru</p>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-volt-card border border-volt-border space-y-4">
              <div className="flex gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-zinc-300 italic leading-relaxed">
                &quot;The Cyber Berry flavour is out of this world. Zero sugar, yet tastes like an electric wild berry sorbet. Plus the electrolyte matrix stopped my gym cramps completely.&quot;
              </p>
              <div className="pt-2 border-t border-volt-border/60">
                <p className="font-bold text-white text-sm">Ananya Roy</p>
                <p className="text-xs text-zinc-400">CrossFit Athlete & Trainer • Mumbai</p>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-volt-card border border-volt-border space-y-4">
              <div className="flex gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-zinc-300 italic leading-relaxed">
                &quot;Midnight Voltage is my secret weapon for Valorant tournament nights. The Alpha-GPC nootropics definitely shave off crucial milliseconds on reaction times.&quot;
              </p>
              <div className="pt-2 border-t border-volt-border/60">
                <p className="font-bold text-white text-sm">Rohan &quot;HyperX&quot; Deshmukh</p>
                <p className="text-xs text-zinc-400">Competitive Esports Athlete • Delhi</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
