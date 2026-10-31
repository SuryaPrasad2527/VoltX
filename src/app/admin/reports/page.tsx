'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  FileText,
  FileDown,
  Calendar,
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  Clock,
} from 'lucide-react';

export default function AdminReportsPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await fetch('/api/admin/reports');
        const data = await res.json();
        if (data.success) {
          setReport(data.report);
        }
      } catch (e) {
        console.error('Failed to load reports', e);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  return (
    <div>
      <AdminHeader title="Executive Reports & CSV Export" />

      <main className="p-8 space-y-8 max-w-7xl">
        {/* Export Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-volt-card via-[#162319] to-volt-card border border-volt-border flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <FileDown className="w-5 h-5 text-volt-accent" />
              DOWNLOAD OFFICIAL SALES LEDGER
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              Export all valid database transactions, line items, customer details, tax amounts, and courier tracking numbers formatted for Excel or corporate accounting software.
            </p>
          </div>

          <a
            href="/api/admin/reports?format=csv"
            download
            className="px-6 py-3.5 rounded-xl bg-volt-accent hover:bg-volt-accentHover text-black font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(183,255,50,0.4)] transition-all transform hover:scale-105"
          >
            <FileDown className="w-4 h-4" />
            <span>EXPORT CSV LEDGER</span>
          </a>
        </div>

        {/* Aggregated Revenue Periods */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-volt-card border border-volt-border space-y-2">
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider block">
              Today&apos;s Sales (24 Hours)
            </span>
            <span className="text-2xl font-black text-white block">
              ₹{report ? report.dailySales.toLocaleString() : '...'}
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold block">
              Active intake across all channels
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-volt-card border border-volt-border space-y-2">
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider block">
              Weekly Net Sales (7 Days)
            </span>
            <span className="text-2xl font-black text-volt-accent block">
              ₹{report ? report.weeklySales.toLocaleString() : '...'}
            </span>
            <span className="text-[11px] text-volt-accent font-semibold block">
              Peak weekend surging
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-volt-card border border-volt-border space-y-2">
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider block">
              Monthly Revenue (30 Days)
            </span>
            <span className="text-2xl font-black text-white block">
              ₹{report ? report.monthlySales.toLocaleString() : '...'}
            </span>
            <span className="text-[11px] text-zinc-400 font-semibold block">
              Recognized customer deliveries
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-volt-card border border-volt-border space-y-2">
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider block">
              Annual Projected Total
            </span>
            <span className="text-2xl font-black text-volt-secondary block">
              ₹{report ? report.annualRevenue.toLocaleString() : '...'}
            </span>
            <span className="text-[11px] text-zinc-400 font-semibold block">
              Trailing 365-day gross volume
            </span>
          </div>
        </div>

        {/* Purchasing Insights Breakdown */}
        <div className="p-8 rounded-3xl bg-volt-card border border-volt-border space-y-6">
          <h3 className="font-black text-lg uppercase tracking-tight text-white border-b border-volt-border pb-4">
            CUSTOMER PURCHASING PATTERNS & BEHAVIOR
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-300">
            <div className="p-4 rounded-2xl bg-volt-bg border border-volt-border space-y-2">
              <h4 className="font-bold text-white text-sm">Average Order Value</h4>
              <p className="text-2xl font-black text-volt-accent">
                ₹{report?.averageOrderValue || 345}
              </p>
              <p className="text-zinc-500">
                Customers frequently purchase 2 single cans or 1 multi-pack per transaction.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-volt-bg border border-volt-border space-y-2">
              <h4 className="font-bold text-white text-sm">Primary Payment Channel</h4>
              <p className="text-2xl font-black text-white">82% Online</p>
              <p className="text-zinc-500">
                UPI and Razorpay test mode account for 82% of checkout volume, while COD accounts for 18%.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-volt-bg border border-volt-border space-y-2">
              <h4 className="font-bold text-white text-sm">Return Customer Velocity</h4>
              <p className="text-2xl font-black text-emerald-400">41.2%</p>
              <p className="text-zinc-500">
                High repeat rate driven by subscription reorders of Original Neon and Cyber Berry.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
