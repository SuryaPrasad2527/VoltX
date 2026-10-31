'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Order, OrderStatus } from '@/types';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  MapPin,
  Printer,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

const TIMELINE_STEPS: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

export default function OrderTrackingPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
        }
      } catch (e) {
        console.error('Failed to load order', e);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    setCancelError(null);

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: 'Cancelled' }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to cancel order');
      }
      setOrder(data.order);
    } catch (err: any) {
      setCancelError(err.message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-volt-bg min-h-screen text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-volt-border border-t-volt-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-volt-bg min-h-screen text-white flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <Link href="/orders" className="text-volt-accent text-xs uppercase font-bold">
          Back to Orders
        </Link>
      </div>
    );
  }

  const currentStepIdx = TIMELINE_STEPS.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';
  const canCancel = (order.orderStatus === 'Pending' || order.orderStatus === 'Confirmed') && !isCancelled;

  return (
    <div className="bg-volt-bg min-h-screen text-white py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-volt-border gap-4">
          <div>
            <Link
              href="/orders"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-volt-accent uppercase tracking-wider mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to My Orders
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              <span>ORDER:</span>
              <span className="text-volt-accent font-mono">{order.orderNumber}</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-volt-card hover:bg-volt-cardHover border border-volt-border text-xs font-bold uppercase text-white flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4 text-volt-accent" />
              <span>Print Invoice</span>
            </button>

            {canCancel && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800 text-xs font-bold uppercase text-red-300 transition-colors"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>

        {cancelError && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs">
            {cancelError}
          </div>
        )}

        {/* Visual Stepper Timeline */}
        <div className="p-8 rounded-3xl bg-volt-card border border-volt-border mb-8 shadow-xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-8">
            DISPATCH & DELIVERY PROGRESS
          </h2>

          {isCancelled ? (
            <div className="p-6 rounded-2xl bg-red-950/30 border border-red-600/40 text-center space-y-2">
              <XCircle className="w-10 h-10 text-red-400 mx-auto" />
              <h3 className="text-lg font-bold text-red-300">This order has been cancelled</h3>
              <p className="text-xs text-zinc-400">
                Any pre-authorized payments will be refunded to your source payment method within 3-5 business days.
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline connecting line */}
              <div className="hidden sm:block absolute top-1/2 left-0 w-full h-1 bg-volt-border -translate-y-1/2 z-0" />
              <div
                className="hidden sm:block absolute top-1/2 left-0 h-1 bg-volt-accent -translate-y-1/2 z-0 transition-all duration-500"
                style={{
                  width: `${(Math.max(0, currentStepIdx) / (TIMELINE_STEPS.length - 1)) * 100}%`,
                }}
              />

              {/* Stepper points */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                {TIMELINE_STEPS.map((step, idx) => {
                  const isDone = currentStepIdx >= idx;
                  const isCurrent = currentStepIdx === idx;

                  return (
                    <div key={step} className="flex flex-col items-center text-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                          isDone
                            ? 'bg-volt-accent text-black shadow-[0_0_15px_#B7FF32]'
                            : 'bg-volt-bg text-zinc-500 border border-volt-border'
                        } ${isCurrent ? 'ring-4 ring-volt-accent/30 scale-110' : ''}`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <span
                        className={`text-xs font-bold uppercase tracking-wider mt-3 ${
                          isCurrent
                            ? 'text-volt-accent'
                            : isDone
                            ? 'text-white'
                            : 'text-zinc-500'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Courier & Tracking Details */}
          {order.trackingNumber && !isCancelled && (
            <div className="mt-8 pt-6 border-t border-volt-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-300 gap-4">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-volt-accent" />
                <span>
                  Carrier:{' '}
                  <strong className="text-white">{order.carrier || 'Volt Express Courier'}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>Tracking Number:</span>
                <span className="font-mono font-bold text-volt-accent px-2.5 py-1 rounded bg-black/60 border border-volt-border">
                  {order.trackingNumber}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Items Breakdown */}
          <div className="md:col-span-7 p-6 rounded-3xl bg-volt-card border border-volt-border space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-white border-b border-volt-border pb-3">
              ITEMS ORDERED ({order.items.length})
            </h3>

            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-14 bg-volt-bg rounded-lg border border-volt-border p-1 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-contain" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{item.name}</p>
                      <p className="text-volt-accent font-semibold">{item.flavour} • {item.size}</p>
                      <p className="text-zinc-500">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                  </div>
                  <span className="font-bold text-white text-sm">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtotals */}
            <div className="border-t border-volt-border pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="text-white font-bold">₹{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-volt-accent">
                  <span>Coupon Discount ({order.couponCode})</span>
                  <span className="font-bold">-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400">
                <span>GST (5%)</span>
                <span className="text-white font-bold">₹{order.tax}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Shipping</span>
                <span className="text-white font-bold">
                  {order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-3 border-t border-volt-border">
                <span>TOTAL PAID</span>
                <span className="text-volt-accent text-xl">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Info */}
          <div className="md:col-span-5 space-y-6">
            {/* Delivery address */}
            <div className="p-6 rounded-3xl bg-volt-card border border-volt-border space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2 border-b border-volt-border pb-3">
                <MapPin className="w-4 h-4 text-volt-accent" /> SHIPPING ADDRESS
              </h3>
              <div className="text-xs text-zinc-300 space-y-1">
                <p className="font-bold text-white">{order.customerName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                {order.customerPhone && (
                  <p className="text-zinc-400 pt-1">Phone: {order.customerPhone}</p>
                )}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="p-6 rounded-3xl bg-volt-card border border-volt-border space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-wider text-white border-b border-volt-border pb-3">
                PAYMENT DETAILS
              </h3>
              <div className="text-xs text-zinc-300 space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Method</span>
                  <span className="font-bold uppercase text-white">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Payment Status</span>
                  <span
                    className={`font-bold uppercase ${
                      order.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
