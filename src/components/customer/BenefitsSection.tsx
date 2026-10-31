'use client';

import React from 'react';
import {
  Zap,
  Activity,
  Brain,
  ShieldCheck,
  Recycle,
  Sparkles,
  Flame,
} from 'lucide-react';

const BENEFITS = [
  {
    icon: Zap,
    title: 'Clean Electro-Matrix',
    description: 'Loaded with 4 essential ionic salts (Sodium, Potassium, Magnesium, Calcium) for immediate hydration and cell osmosis.',
    stat: '4X FASTER',
    subtext: 'Rehydration vs water',
  },
  {
    icon: Brain,
    title: 'Nootropic Cognitive Focus',
    description: 'Enriched with pharmaceutical-grade L-Theanine and Alpha-GPC for razor-sharp reaction time and flow state without jittery spikes.',
    stat: '100% FOCUS',
    subtext: 'Zero brain fog',
  },
  {
    icon: Flame,
    title: 'Bio-Natural Caffeine',
    description: '160mg - 220mg of ultra-purified green coffee bean extract. Provides smooth kinetic energy that metabolizes over 6 sustained hours.',
    stat: '6+ HOURS',
    subtext: 'No crash formula',
  },
  {
    icon: ShieldCheck,
    title: 'Zero Sugar & Low Calorie',
    description: 'Sweetened with plant-derived stevia and monk fruit isolates. Keto-friendly, diabetic-safe, and zero glycemic impact.',
    stat: '0g SUGAR',
    subtext: 'Keto certified',
  },
  {
    icon: Activity,
    title: 'Cellular Taurine & B-Complex',
    description: 'B3, B6, and B12 vitamins combined with bio-identical taurine to accelerate ATP energy production at the mitochondrial level.',
    stat: '100% RDA',
    subtext: 'Essential vitamins',
  },
  {
    icon: Recycle,
    title: 'Infinitely Recyclable Can',
    description: 'Crafted in 100% recyclable matte aerospace aluminum that cools 3x faster than plastic and preserves pure carbonated flavor.',
    stat: 'ECO IMPACT',
    subtext: 'Zero plastic waste',
  },
];

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-24 bg-volt-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-volt-accent flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" /> THE VOLTX FORMULATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            ENGINEERED TO OUTPERFORM
          </h2>
          <p className="text-sm text-zinc-400">
            Most energy drinks rely on cheap high-fructose corn syrup and synthetic jitter compounds. 
            We spent two years in high-performance metabolic laboratories to build the cleanest energy matrix on Earth.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl bg-volt-card/80 border border-volt-border hover:border-volt-accent p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(183,255,50,0.15)] flex flex-col justify-between"
              >
                {/* Glow dot on top right */}
                <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-volt-border group-hover:bg-volt-accent group-hover:shadow-[0_0_8px_#B7FF32] transition-colors" />

                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-volt-accent/10 border border-volt-accent/30 flex items-center justify-center text-volt-accent group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-black uppercase text-white tracking-wide">
                    {item.title}
                  </h3>

                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-volt-border/60 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black text-volt-accent block">
                      {item.stat}
                    </span>
                    <span className="text-[11px] font-semibold uppercase text-zinc-400">
                      {item.subtext}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
