'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { KpiCard } from '@/components/admin/KpiCard';
import { DashboardStats, Order } from '@/types';
import {
  IndianRupee,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  Boxes,
  AlertTriangle,
  ArrowRight,
  Plus,
  FileDown,
  Clock,
  CheckCircle2,
  Truck,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.metrics);
          setRecentOrders(data.recentOrders);
        }
      } catch (e) {
        console.error('Failed to load admin stats', e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/40">
            Shipped
          </span>
        );
      case 'Processing':
        return (
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-volt-accent/20 text-volt-accent border border-volt-accent/40">
            Processing
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div>
      <AdminHeader title="Executive Overview" />

      <main className="p-8 space-y-8 max-w-7xl">
        {/* Quick Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-volt-card p-4 rounded-2xl border border-volt-border">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-volt-accent animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Operations
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/products"
              className="px-3.5 py-2 rounded-xl bg-volt-accent hover:bg-volt-accentHover text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </Link>
            <Link
              href="/admin/analytics"
              className="px-3.5 py-2 rounded-xl bg-volt-bg hover:bg-volt-cardHover border border-volt-border text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <TrendingUp className="w-3.5 h-3.5 text-volt-accent" />
              <span>View Analytics</span>
            </Link>
            <a
              href="/api/admin/reports?format=csv"
              download
              className="px-3.5 py-2 rounded-xl bg-volt-bg hover:bg-volt-cardHover border border-volt-border text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <FileDown className="w-3.5 h-3.5 text-volt-accent" />
              <span>Export CSV</span>
            </a>
          </div>
        </div>

        {/* 6 Core KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <KpiCard
            title="Total Revenue"
            value={stats ? `₹${stats.totalRevenue.toLocaleString()}` : '...'}
            changePercent={stats?.revenueChangePercent || 18.4}
            icon={IndianRupee}
            accentColor="#B7FF32"
          />
          <KpiCard
            title="Total Orders"
            value={stats ? stats.totalOrders.toLocaleString() : '...'}
            changePercent={stats?.ordersChangePercent || 12.1}
            icon={ShoppingBag}
            accentColor="#38BDF8"
          />
          <KpiCard
            title="Total Products Sold"
            value={stats ? `${stats.productsSold.toLocaleString()} Cans` : '...'}
            changePercent={stats?.productsSoldChangePercent || 15.6}
            icon={Package}
            accentColor="#D946EF"
          />
          <KpiCard
            title="Total Customers"
            value={stats ? stats.totalCustomers.toLocaleString() : '...'}
            changePercent={stats?.customersChangePercent || 9.3}
            icon={Users}
            accentColor="#FACC15"
          />
          <KpiCard
            title="Average Order Value"
            value={stats ? `₹${stats.averageOrderValue}` : '...'}
            changePercent={stats?.aovChangePercent || 4.8}
            icon={TrendingUp}
            accentColor="#2DD4BF"
          />
          <KpiCard
            title="Products in Stock"
            value={stats ? `${stats.productsInStock} Units` : '...'}
            subtext={
              stats?.lowStockCount ? `${stats.lowStockCount} items low stock` : 'Healthy inventory'
            }
            icon={Boxes}
            accentColor="#79D900"
          />
        </div>

        {/* Low Stock Warning Banner if applicable */}
        {stats && stats.lowStockCount > 0 && (
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-300">
                  Inventory Alert: {stats.lowStockCount} Product Variants Running Low
                </h4>
                <p className="text-xs text-zinc-400">
                  Some items (such as Midnight Voltage) are down to critical vault levels.
                </p>
              </div>
            </div>
            <Link
              href="/admin/inventory"
              className="px-4 py-2 rounded-xl bg-amber-500 text-black font-black text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors"
            >
              Restock Vault
            </Link>
          </div>
        )}

        {/* Recent Orders Section */}
        <div className="p-6 rounded-3xl bg-volt-card border border-volt-border space-y-4">
          <div className="flex items-center justify-between border-b border-volt-border pb-4">
            <div>
              <h3 className="font-black text-base uppercase tracking-tight text-white">
                RECENT INCOMING ORDERS
              </h3>
              <p className="text-xs text-zinc-400">
                Latest customer purchases processed through cloud database.
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-volt-accent hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-volt-border text-zinc-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-volt-border/60">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-volt-cardHover/50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-white">{order.customerName}</p>
                      <p className="text-[10px] text-zinc-400">{order.customerEmail}</p>
                    </td>
                    <td className="py-3 px-3 text-zinc-300">
                      {order.items.reduce((s, it) => s + it.quantity, 0)} cans
                    </td>
                    <td className="py-3 px-3 font-bold text-white">
                      ₹{order.totalAmount}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold uppercase text-emerald-400">
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {getStatusBadge(order.orderStatus)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/admin/orders`}
                        className="text-volt-accent hover:underline font-bold text-[11px]"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
