'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Coupon } from '@/types';
import { Tag, Plus, Trash2, CheckCircle2, ShieldCheck, Key, Database, Sparkles } from 'lucide-react';

export default function AdminSettingsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // New coupon form state
  const [newCode, setNewCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(20);
  const [minSpend, setMinSpend] = useState<number>(299);
  const [creating, setCreating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (e) {
      console.error('Failed to load coupons', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    setCreating(true);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCode.trim().toUpperCase(),
          discountPercent,
          minSpend,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Coupon "${data.coupon.code}" activated!`);
        setNewCode('');
        fetchCoupons();
      }
    } catch (e) {
      alert('Failed to create coupon');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      const res = await fetch(`/api/coupons?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCoupons();
      }
    } catch (e) {
      alert('Failed to delete coupon');
    }
  };

  return (
    <div>
      <AdminHeader title="Platform Controls & Coupon Settings" />

      <main className="p-8 space-y-8 max-w-7xl">
        {/* Coupon Management Section */}
        <div className="p-8 rounded-3xl bg-volt-card border border-volt-border space-y-6">
          <div className="flex items-center justify-between border-b border-volt-border pb-4">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-volt-accent" />
                ACTIVE PROMOTIONAL COUPONS
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Configure discount codes redeemable by customers during checkout.
              </p>
            </div>
          </div>

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Add Coupon Form */}
          <form
            onSubmit={handleCreateCoupon}
            className="p-5 rounded-2xl bg-volt-bg border border-volt-border grid grid-cols-1 sm:grid-cols-4 gap-4 items-end text-xs"
          >
            <div>
              <label className="block text-zinc-400 font-bold mb-1">Coupon Code</label>
              <input
                type="text"
                required
                placeholder="e.g. SUMMER25"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="w-full bg-volt-card border border-volt-border rounded-xl px-3.5 py-2 text-white font-mono uppercase focus:outline-none focus:border-volt-accent"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-bold mb-1">Discount %</label>
              <input
                type="number"
                min={1}
                max={100}
                required
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full bg-volt-card border border-volt-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-volt-accent"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-bold mb-1">Minimum Spend (₹)</label>
              <input
                type="number"
                min={0}
                required
                value={minSpend}
                onChange={(e) => setMinSpend(Number(e.target.value))}
                className="w-full bg-volt-card border border-volt-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-volt-accent"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="py-2.5 px-4 rounded-xl bg-volt-accent hover:bg-volt-accentHover text-black font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(183,255,50,0.3)] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{creating ? 'Adding...' : 'CREATE COUPON'}</span>
            </button>
          </form>

          {/* Coupons List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {coupons.map((c) => (
              <div
                key={c._id}
                className="p-4 rounded-2xl bg-volt-bg border border-volt-border flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-volt-accent tracking-wider">
                      {c.code}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    {c.discountPercent ? `${c.discountPercent}% OFF` : `₹${c.discountAmount} OFF`} • Min. ₹{c.minSpend || 0}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteCoupon(c._id)}
                  className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* System & Cloud Integration Status */}
        <div className="p-8 rounded-3xl bg-volt-card border border-volt-border space-y-4">
          <h3 className="font-black text-lg uppercase tracking-tight text-white border-b border-volt-border pb-4">
            CLOUD INFRASTRUCTURE & SECURITY
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-volt-bg border border-volt-border space-y-2">
              <div className="flex items-center gap-2 text-volt-accent font-bold">
                <Database className="w-4 h-4" /> MongoDB Atlas
              </div>
              <p className="text-zinc-400">
                Connected with Mongoose connection pooling for Vercel Serverless Functions.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-volt-bg border border-volt-border space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-bold">
                <ShieldCheck className="w-4 h-4" /> Razorpay Test Engine
              </div>
              <p className="text-zinc-400">
                Cryptographic HMAC SHA256 server-side signature verification enabled.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-volt-bg border border-volt-border space-y-2">
              <div className="flex items-center gap-2 text-yellow-400 font-bold">
                <Key className="w-4 h-4" /> JWT Session Auth
              </div>
              <p className="text-zinc-400">
                HTTP-only secure cookie encryption via <code>jose</code> and <code>bcryptjs</code>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
