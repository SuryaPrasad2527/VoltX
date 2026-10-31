'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, ArrowRight, ShieldCheck, Flame, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-volt-bg pt-8 pb-20 lg:pt-16 lg:pb-32">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-volt-accent/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-20 right-10 w-[350px] h-[350px] bg-volt-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Cyber Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#B7FF32 1px, transparent 1px), linear-gradient(90deg, #B7FF32 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-volt-card border border-volt-border text-xs font-bold text-volt-accent uppercase tracking-widest shadow-[0_0_15px_rgba(183,255,50,0.15)]">
              <Zap className="w-4 h-4 fill-volt-accent animate-bounce" />
              <span>NEXT-GEN HYPER ENERGY HAS ARRIVED</span>
            </div>

            {/* Catchy Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[1.05]">
              UNLEASH <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-volt-accent via-volt-secondary to-white drop-shadow-[0_0_35px_rgba(183,255,50,0.4)]">
                YOUR ENERGY.
              </span>
            </h1>

            {/* Supporting Brand Description */}
            <p className="text-base sm:text-lg text-zinc-300 max-w-xl leading-relaxed">
              Engineered with clean bio-available caffeine, active nootropics, and a 4-salt electrolyte matrix. 
              Zero sugar. Zero artificial crash. Pure, unfiltered mental velocity and athletic stamina in an icy 500ml charge.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-volt-accent hover:bg-volt-accentHover text-black font-black uppercase tracking-wider text-sm flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_30px_rgba(183,255,50,0.4)] hover:shadow-[0_0_40px_rgba(183,255,50,0.6)] transform hover:-translate-y-0.5"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/#flavors"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-volt-card hover:bg-volt-cardHover border border-volt-border hover:border-volt-accent text-white font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-all duration-300"
              >
                <Sparkles className="w-4 h-4 text-volt-accent" />
                <span>EXPLORE 5 FLAVORS</span>
              </Link>
            </div>

            {/* Key Specs Pills */}
            <div className="pt-6 grid grid-cols-3 gap-3 border-t border-volt-border/70 max-w-lg mx-auto lg:mx-0">
              <div className="p-3 rounded-xl bg-volt-card/60 border border-volt-border/60 text-center">
                <span className="block text-2xl font-black text-volt-accent">160mg</span>
                <span className="text-[11px] uppercase font-bold text-zinc-400">Natural Caffeine</span>
              </div>
              <div className="p-3 rounded-xl bg-volt-card/60 border border-volt-border/60 text-center">
                <span className="block text-2xl font-black text-white">0g</span>
                <span className="text-[11px] uppercase font-bold text-zinc-400">Added Sugar</span>
              </div>
              <div className="p-3 rounded-xl bg-volt-card/60 border border-volt-border/60 text-center">
                <span className="block text-2xl font-black text-volt-secondary">100%</span>
                <span className="text-[11px] uppercase font-bold text-zinc-400">Recyclable Can</span>
              </div>
            </div>
          </div>

          {/* Right Product Can Showcase */}
          <div className="lg:col-span-5 flex justify-center relative">
            {/* Concentric Glow Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-volt-accent/20 animate-ping opacity-25" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-volt-accent/15" />

            {/* Can Product Display Card */}
            <div className="relative group max-w-sm">
              {/* Electric Neon Aura Shadow */}
              <div className="absolute inset-0 bg-volt-accent/25 rounded-3xl blur-2xl transform group-hover:scale-105 transition-all duration-500" />
              
              <div className="relative rounded-3xl bg-gradient-to-b from-volt-card via-[#0e1610] to-black border border-volt-border p-6 shadow-2xl flex flex-col items-center">
                {/* Floating Badge */}
                <div className="absolute top-4 right-4 bg-volt-accent text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-[0_0_10px_#B7FF32]">
                  SIGNATURE DROP
                </div>

                {/* The Real Uploaded Can Image */}
                <div className="relative w-64 h-80 sm:w-72 sm:h-96 my-2 flex items-center justify-center">
                  <Image
                    src="/images/voltx-original.png"
                    alt="VOLTX Original Neon Energy Drink Can"
                    fill
                    className="object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.9)] transform group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>

                {/* Micro Label */}
                <div className="w-full text-center mt-2 pt-3 border-t border-volt-border/60">
                  <h3 className="text-white font-extrabold text-base tracking-wide uppercase">
                    VoltX Original Neon
                  </h3>
                  <p className="text-xs text-volt-accent font-semibold">Electric Neon Lime • 500ml</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
