'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { RevenueLineChart } from '@/components/charts/RevenueLineChart';
import { OrdersBarChart } from '@/components/charts/OrdersBarChart';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { BestSellersChart } from '@/components/charts/BestSellersChart';
import { Calendar, Filter, Sparkles, TrendingUp, ShoppingBag, BarChart3, PieChart } from 'lucide-react';

const DATE_RANGES = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'Last 12 Months', value: '12m' },
];

export default function AdminAnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function loadAnalytics() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/analytics?range=${selectedRange}`);
        const resData = await res.json();
        if (resData.success) {
          setData(resData);
        }
      } catch (e) {
        console.error('Failed to load analytics', e);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [selectedRange]);

  return (
    <div>
      <AdminHeader title="Sales Analytics & Intelligence" />

      <main className="p-8 space-y-8 max-w-7xl">
        {/* Date Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-volt-card p-4 rounded-2xl border border-volt-border">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-volt-accent" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Timeframe Filter:
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {DATE_RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setSelectedRange(r.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedRange === r.value
                    ? 'bg-volt-accent text-black shadow-[0_0_15px_rgba(183,255,50,0.3)]'
                    : 'bg-volt-bg text-zinc-400 hover:text-white border border-volt-border'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Period High-Level Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-volt-card border border-volt-border flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-bold uppercase">Period Revenue</p>
              <p className="text-2xl font-black text-volt-accent mt-1">
                {data ? `₹${data.totalRangeRevenue.toLocaleString()}` : '...'}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-volt-accent/40" />
          </div>

          <div className="p-5 rounded-2xl bg-volt-card border border-volt-border flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-bold uppercase">Period Valid Orders</p>
              <p className="text-2xl font-black text-white mt-1">
                {data ? `${data.totalRangeOrders} Orders` : '...'}
              </p>
            </div>
            <ShoppingBag className="w-8 h-8 text-blue-400/40" />
          </div>
        </div>

        {/* Chart Row 1: Revenue Over Time & Orders Over Time */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Over Time Line Chart */}
          <div className="p-6 rounded-3xl bg-volt-card border border-volt-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-base uppercase tracking-tight text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-volt-accent" />
                  REVENUE OVER TIME (₹)
                </h3>
                <p className="text-xs text-zinc-400">
                  Daily/monthly recognized net income trend
                </p>
              </div>
            </div>
            {loading ? (
              <div className="h-72 bg-volt-bg/40 rounded-xl animate-pulse" />
            ) : (
              <RevenueLineChart data={data?.timelineData || []} />
            )}
          </div>

          {/* Orders Over Time Area Chart */}
          <div className="p-6 rounded-3xl bg-volt-card border border-volt-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-base uppercase tracking-tight text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-volt-secondary" />
                  ORDERS VELOCITY
                </h3>
                <p className="text-xs text-zinc-400">
                  Volume of orders placed across selected period
                </p>
              </div>
            </div>
            {loading ? (
              <div className="h-72 bg-volt-bg/40 rounded-xl animate-pulse" />
            ) : (
              <OrdersBarChart data={data?.timelineData || []} />
            )}
          </div>
        </div>

        {/* Chart Row 2: Category Distribution & Best-Selling Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Category Distribution */}
          <div className="p-6 rounded-3xl bg-volt-card border border-volt-border space-y-4">
            <div>
              <h3 className="font-black text-base uppercase tracking-tight text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-volt-accent" />
                CATEGORY SALES SHARE
              </h3>
              <p className="text-xs text-zinc-400">
                Revenue split across Classic, Zero Sugar, High-Volt & Packs
              </p>
            </div>
            {loading ? (
              <div className="h-72 bg-volt-bg/40 rounded-xl animate-pulse" />
            ) : (
              <CategoryPieChart data={data?.categoryData || []} />
            )}
          </div>

          {/* Best-Selling Products Horizontal Bar Chart */}
          <div className="p-6 rounded-3xl bg-volt-card border border-volt-border space-y-4">
            <div>
              <h3 className="font-black text-base uppercase tracking-tight text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                TOP SELLING FLAVORS (UNITS)
              </h3>
              <p className="text-xs text-zinc-400">
                Highest velocity can variants ranked by units sold
              </p>
            </div>
            {loading ? (
              <div className="h-72 bg-volt-bg/40 rounded-xl animate-pulse" />
            ) : (
              <BestSellersChart data={data?.bestSellers || []} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
