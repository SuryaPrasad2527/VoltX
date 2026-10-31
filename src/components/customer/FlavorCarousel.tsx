'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface Flavor {
  id: string;
  name: string;
  flavour: string;
  slug: string;
  color: string;
  glowColor: string;
  image: string;
  caffeine: string;
  calories: string;
  description: string;
  price: number;
}

const FLAVORS: Flavor[] = [
  {
    id: 'prod-001',
    name: 'VoltX Original Neon',
    flavour: 'Electric Neon Lime',
    slug: 'voltx-original-neon',
    color: '#B7FF32',
    glowColor: 'rgba(183, 255, 50, 0.4)',
    image: '/images/voltx-original.png',
    caffeine: '160mg',
    calories: '15 kcal',
    description: 'The iconic pioneer. Crisp citrus lime infused with active B-complex and taurine for sharp, clean momentum.',
    price: 149,
  },
  {
    id: 'prod-002',
    name: 'VoltX Cyber Berry',
    flavour: 'Wild Cyber Berry',
    slug: 'voltx-cyber-berry',
    color: '#D946EF',
    glowColor: 'rgba(217, 70, 239, 0.4)',
    image: '/images/voltx-cyber-berry.png',
    caffeine: '180mg',
    calories: '0 kcal',
    description: 'Dark blueberries, crushed blackberries, and acai with zero sugar. Enhanced with natural green tea extract for neural focus.',
    price: 159,
  },
  {
    id: 'prod-003',
    name: 'VoltX Electric Citrus',
    flavour: 'Yuzu & Lime Overdrive',
    slug: 'voltx-electric-citrus',
    color: '#FACC15',
    glowColor: 'rgba(250, 204, 21, 0.4)',
    image: '/images/voltx-electric-citrus.png',
    caffeine: '200mg',
    calories: '25 kcal',
    description: 'High-voltage Japanese yuzu and crisp lime overdrive. Formulated with maximum electrolyte osmolarity for physical endurance.',
    price: 159,
  },
  {
    id: 'prod-004',
    name: 'VoltX Arctic Frost',
    flavour: 'Glacier Peppermint Freeze',
    slug: 'voltx-arctic-frost',
    color: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    image: '/images/voltx-arctic-frost.png',
    caffeine: '160mg',
    calories: '0 kcal',
    description: 'Sub-zero peppermint ice blast that clears the mind instantly. Clean glacier hydration with zero sugar.',
    price: 159,
  },
  {
    id: 'prod-005',
    name: 'VoltX Midnight Voltage',
    flavour: 'Dark Blackberry Stealth',
    slug: 'voltx-midnight-voltage',
    color: '#2DD4BF',
    glowColor: 'rgba(45, 212, 191, 0.4)',
    image: '/images/voltx-midnight.png',
    caffeine: '220mg',
    calories: '10 kcal',
    description: 'The stealth formula created for night coders and creators. High-potency Alpha-GPC and dark blackberry rush.',
    price: 169,
  },
];

export function FlavorCarousel() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeFlavor = FLAVORS[selectedIdx];
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = () => {
    // Construct dummy product matching selected flavor
    const prod: any = {
      _id: activeFlavor.id,
      name: activeFlavor.name,
      slug: activeFlavor.slug,
      price: activeFlavor.price,
      image: activeFlavor.image,
      stock: 50,
      size: '500ml Can',
      flavour: activeFlavor.flavour,
    };
    addToCart(prod, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section id="flavors" className="py-24 bg-volt-dark relative overflow-hidden border-t border-b border-volt-border">
      {/* Dynamic Colored Atmosphere Glow based on active flavor */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[150px] transition-all duration-700 pointer-events-none opacity-20"
        style={{ backgroundColor: activeFlavor.color }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-volt-accent flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" /> 5 SIGNATURE FORMULATIONS
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            CHOOSE YOUR FREQUENCY
          </h2>
          <p className="text-sm text-zinc-400">
            Every flavor is tailored for specific performance zones—from clean daily momentum to peak nighttime laser focus.
          </p>
        </div>

        {/* Flavor Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12">
          {FLAVORS.map((f, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <button
                key={f.id}
                onClick={() => setSelectedIdx(idx)}
                className={`px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2.5 ${
                  isSelected
                    ? 'text-black shadow-lg scale-105'
                    : 'bg-volt-card text-zinc-400 hover:text-white border border-volt-border'
                }`}
                style={{
                  backgroundColor: isSelected ? f.color : undefined,
                  boxShadow: isSelected ? `0 0 20px ${f.glowColor}` : undefined,
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: isSelected ? '#000000' : f.color }}
                />
                <span>{f.flavour}</span>
              </button>
            );
          })}
        </div>

        {/* Active Flavor Showcase Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-b from-volt-card/90 to-volt-bg/90 border border-volt-border rounded-3xl p-6 sm:p-12 shadow-2xl backdrop-blur-xl">
          {/* Can Center Stage */}
          <div className="lg:col-span-6 flex justify-center relative">
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-30 transition-all duration-700"
              style={{ backgroundColor: activeFlavor.color }}
            />
            <div className="relative w-64 h-80 sm:w-80 sm:h-96">
              <Image
                key={activeFlavor.image}
                src={activeFlavor.image}
                alt={activeFlavor.name}
                fill
                className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 duration-500"
              />
            </div>
          </div>

          {/* Flavor Details */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div>
              <span
                className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-md"
                style={{ backgroundColor: `${activeFlavor.color}25`, color: activeFlavor.color }}
              >
                {activeFlavor.flavour}
              </span>
              <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mt-2">
                {activeFlavor.name}
              </h3>
              <p className="text-2xl font-black text-white mt-1">
                ₹{activeFlavor.price} <span className="text-xs text-zinc-400 font-normal">/ 500ml Can</span>
              </p>
            </div>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              {activeFlavor.description}
            </p>

            {/* Nutrition metrics */}
            <div className="grid grid-cols-2 gap-4 max-w-sm">
              <div className="p-3.5 rounded-xl bg-volt-bg border border-volt-border">
                <span className="text-xs text-zinc-400 block uppercase font-bold">Caffeine</span>
                <span className="text-xl font-black text-white">{activeFlavor.caffeine}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-volt-bg border border-volt-border">
                <span className="text-xs text-zinc-400 block uppercase font-bold">Calories</span>
                <span className="text-xl font-black text-white">{activeFlavor.calories}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                onClick={handleQuickAdd}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-black font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                style={{
                  backgroundColor: activeFlavor.color,
                  boxShadow: `0 0 25px ${activeFlavor.glowColor}`,
                }}
              >
                <ShoppingBag className="w-4 h-4" />
                {added ? 'ADDED TO CART ✓' : 'ADD TO CART'}
              </button>

              <Link
                href={`/shop/${activeFlavor.slug}`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-volt-bg hover:bg-volt-cardHover border border-volt-border text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>VIEW FULL SPECS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
