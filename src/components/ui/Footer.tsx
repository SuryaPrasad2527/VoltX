'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import {
  Zap,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-volt-dark border-t border-volt-border text-volt-muted pt-16 pb-12">
      {/* Brand Features Trust Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-volt-border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-volt-card/60 border border-volt-border/60">
            <div className="w-12 h-12 rounded-lg bg-volt-accent/10 border border-volt-accent/30 flex items-center justify-center text-volt-accent">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Rapid Electro-Surge</h4>
              <p className="text-xs text-volt-muted">Bio-available taurine & nootropics</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-volt-card/60 border border-volt-border/60">
            <div className="w-12 h-12 rounded-lg bg-volt-accent/10 border border-volt-accent/30 flex items-center justify-center text-volt-accent">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Express Lightning Delivery</h4>
              <p className="text-xs text-volt-muted">Free across India over ₹500</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-volt-card/60 border border-volt-border/60">
            <div className="w-12 h-12 rounded-lg bg-volt-accent/10 border border-volt-accent/30 flex items-center justify-center text-volt-accent">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Clean Label Certified</h4>
              <p className="text-xs text-volt-muted">0g Sugar, No Crash formula</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-volt-card/60 border border-volt-border/60">
            <div className="w-12 h-12 rounded-lg bg-volt-accent/10 border border-volt-accent/30 flex items-center justify-center text-volt-accent">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Satisfaction</h4>
              <p className="text-xs text-volt-muted">Hassle-free replacement guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              VOLTX is the next-generation hyper-performance energy drink engineered for creators, competitive esports athletes, and high-intensity professionals who demand unyielding focus and pure stamina.
            </p>
            <div className="pt-2 text-xs text-zinc-400">
              <p>VOLTX Labs Inc. • Bengaluru, India</p>
              <p className="text-volt-accent mt-1">support@voltx.com | +91 800-VOLT-NOW</p>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-4">
              Products
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/shop?category=Classic" className="hover:text-volt-accent transition-colors">
                  Original Neon Lime
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Zero+Sugar" className="hover:text-volt-accent transition-colors">
                  Cyber Berry (Zero Sugar)
                </Link>
              </li>
              <li>
                <Link href="/shop?category=High-Volt" className="hover:text-volt-accent transition-colors">
                  Electric Citrus High-Volt
                </Link>
              </li>
              <li>
                <Link href="/shop?category=High-Volt" className="hover:text-volt-accent transition-colors">
                  Midnight Voltage Stealth
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Variety+Pack" className="hover:text-volt-accent transition-colors">
                  12-Can Hyper Variety Crate
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Portal */}
          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-4">
              Customer Hub
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/orders" className="hover:text-volt-accent transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-volt-accent transition-colors">
                  Manage Account
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-volt-accent transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-volt-accent/80 hover:text-volt-accent transition-colors flex items-center gap-1 font-semibold">
                  Admin Portal →
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-4">
              VOLT VIP ACCESS
            </h5>
            <p className="text-xs text-zinc-400 mb-3">
              Unlock secret drops, formula updates, and 20% off your next order.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-volt-accent/15 border border-volt-accent/40 text-volt-accent text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                You are on the VIP List! Check your inbox.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full bg-volt-card border border-volt-border rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-volt-accent transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-volt-accent hover:bg-volt-accentHover text-black rounded font-black text-xs transition-colors"
                  >
                    JOIN
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-volt-border flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
        <p>© {new Date().getFullYear()} VOLTX Hyper-Energy Inc. All Rights Reserved. Built for high achievers.</p>
        <div className="flex items-center gap-6">
          <span>Razorpay Secure Test Gateway</span>
          <span>•</span>
          <span>Cash on Delivery</span>
          <span>•</span>
          <span>HSSAI Certified</span>
        </div>
      </div>
    </footer>
  );
}
