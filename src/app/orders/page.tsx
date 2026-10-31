'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Order } from '@/types';
import {
  Package,
  ArrowRight,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (e) {
        console.error('Failed to load customer orders', e);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/40">
            <Truck className="w-3.5 h-3.5" /> Shipped
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-1 rounded-md bg-volt-accent/20 text-volt-accent border border-volt-accent/40">
            <Clock className="w-3.5 h-3.5" /> Processing
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-1 rounded-md bg-red-500/20 text-red-400 border border-red-500/40">
            <AlertCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="bg-volt-bg min-h-screen text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-volt-border border-t-volt-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-volt-bg min-h-screen text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-volt-border gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">
              MY ORDERS & SHIPMENTS
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              View your order history, live dispatch status, and download tax invoices.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-volt-card hover:bg-volt-cardHover border border-volt-border text-xs font-bold uppercase text-white tracking-wider"
          >
            <ShoppingBag className="w-4 h-4 text-volt-accent" />
            <span>ORDER MORE CANS</span>
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-volt-card/60 rounded-3xl border border-volt-border p-8 space-y-4 max-w-md mx-auto">
            <Package className="w-12 h-12 text-zinc-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No orders found</h3>
            <p className="text-xs text-zinc-400">
              You haven&apos;t placed any orders yet. Once you place an order, live tracking details will appear here.
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-2.5 rounded-xl bg-volt-accent text-black font-black text-xs uppercase tracking-wider"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="p-6 rounded-2xl bg-volt-card border border-volt-border hover:border-volt-accent/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Order Meta */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-bold text-base text-white">
                      {order.orderNumber}
                    </span>
                    {getStatusBadge(order.orderStatus)}
                    <span className="text-xs text-zinc-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Products preview */}
                  <div className="flex items-center gap-3">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="relative w-12 h-14 bg-volt-bg rounded-lg border border-volt-border p-1"
                        title={`${item.name} x${item.quantity}`}
                      >
                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-xs text-zinc-500 font-bold">
                        +{order.items.length - 3} more
                      </span>
                    )}
                    <div className="text-xs text-zinc-400 pl-2">
                      <p className="font-semibold text-white">
                        {order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                      </p>
                      {order.trackingNumber && (
                        <p className="text-[11px] text-volt-accent mt-0.5 font-mono">
                          Tracking: {order.trackingNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Amount and Link */}
                <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-volt-border">
                  <div className="text-right">
                    <p className="text-xs text-zinc-400">Total Amount</p>
                    <p className="text-xl font-black text-white">₹{order.totalAmount}</p>
                    <span className="text-[10px] uppercase font-bold text-emerald-400">
                      Payment: {order.paymentStatus}
                    </span>
                  </div>

                  <Link
                    href={`/orders/${order._id}`}
                    className="px-5 py-3 rounded-xl bg-volt-bg hover:bg-volt-cardHover border border-volt-border hover:border-volt-accent text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                  >
                    <span>Track Order</span>
                    <ArrowRight className="w-4 h-4 text-volt-accent" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
