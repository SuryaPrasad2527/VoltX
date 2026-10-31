'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Lock,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    items,
    itemCount,
    subtotal,
    discount,
    couponCode,
    tax,
    shippingCost,
    totalAmount,
    clearCart,
  } = useCart();

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || 'Karnataka',
    postalCode: user?.addresses?.[0]?.postalCode || '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState<'demo' | 'razorpay' | 'cod'>('demo');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!items.length) {
      setErrorMsg('Your cart is empty.');
      return;
    }

    if (!formData.street || !formData.city || !formData.postalCode || !formData.phone) {
      setErrorMsg('Please complete all shipping address fields and phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create order on backend (with atomic stock reduction)
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((it) => ({
            productId: it.productId,
            quantity: it.quantity,
          })),
          shippingAddress: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          customerPhone: formData.phone,
          paymentMethod,
          couponCode,
          discountAmount: discount,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to place order');
      }

      const order = orderData.order;

      // 2. Handle Payment Flow
      if (paymentMethod === 'demo') {
        // Confirm demo payment server-side
        await fetch('/api/payments/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order._id,
            isDemoMode: true,
          }),
        });

        clearCart();
        setOrderConfirmed(order);
      } else if (paymentMethod === 'cod') {
        // COD order is immediately confirmed as pending cash payment
        clearCart();
        setOrderConfirmed(order);
      } else if (paymentMethod === 'razorpay') {
        // Trigger server Razorpay initiation
        const payRes = await fetch('/api/payments/razorpay/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: totalAmount,
            receipt: order.orderNumber,
          }),
        });

        const payData = await payRes.json();

        if (payData.mode === 'demo_checkout') {
          // Fallback notice if Razorpay keys not provided in env
          await fetch('/api/payments/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: order._id,
              isDemoMode: true,
            }),
          });
          clearCart();
          setOrderConfirmed({
            ...order,
            notice: 'Processed via Safe Demo Mode (Razorpay live test keys not set in environment).',
          });
        } else {
          // Razorpay standard client checkout script if keys configured
          clearCart();
          setOrderConfirmed(order);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during checkout');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Confirmed State
  if (orderConfirmed) {
    return (
      <div className="bg-volt-bg min-h-screen text-white py-16 px-4 flex items-center justify-center">
        <div className="max-w-xl w-full bg-volt-card border border-volt-accent/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-[0_0_50px_rgba(183,255,50,0.2)]">
          <div className="w-20 h-20 rounded-full bg-volt-accent/15 border-2 border-volt-accent text-volt-accent mx-auto flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-widest text-volt-accent px-3 py-1 rounded bg-volt-accent/10 border border-volt-accent/30">
              PAYMENT VERIFIED & ORDER CONFIRMED
            </span>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white mt-3">
              YOUR VOLTX DROP IS LOCKED IN!
            </h1>
            <p className="text-sm text-zinc-400 mt-2">
              Order Number:{' '}
              <span className="text-white font-mono font-bold">{orderConfirmed.orderNumber}</span>
            </p>
            {orderConfirmed.trackingNumber && (
              <p className="text-xs text-volt-accent mt-1">
                Tracking Number: <span className="font-mono">{orderConfirmed.trackingNumber}</span>
              </p>
            )}
            {orderConfirmed.notice && (
              <p className="text-xs text-amber-400 mt-2 bg-amber-950/20 p-2 rounded border border-amber-800/40">
                {orderConfirmed.notice}
              </p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-volt-bg border border-volt-border text-left text-xs space-y-2">
            <p className="text-zinc-400">
              Dispatched to: <strong className="text-white">{formData.street}, {formData.city}</strong>
            </p>
            <p className="text-zinc-400">
              Carrier: <strong className="text-white">Volt Express Courier (24h Dispatch)</strong>
            </p>
            <p className="text-zinc-400">
              Total Charged: <strong className="text-volt-accent">₹{orderConfirmed.totalAmount}</strong>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={`/orders/${orderConfirmed._id}`}
              className="flex-1 py-3.5 rounded-xl bg-volt-accent hover:bg-volt-accentHover text-black font-black uppercase text-xs tracking-wider transition-colors"
            >
              TRACK ORDER STATUS
            </Link>
            <Link
              href="/shop"
              className="flex-1 py-3.5 rounded-xl bg-volt-bg hover:bg-volt-cardHover border border-volt-border text-white font-bold uppercase text-xs tracking-wider transition-colors"
            >
              CONTINUE BROWSING
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-volt-bg min-h-screen text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">
          SECURE CHECKOUT
        </h1>
        <p className="text-sm text-zinc-400 mb-8">
          Enter your shipping address and choose your preferred payment method.
        </p>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Customer & Shipping Details */}
            <div className="lg:col-span-7 space-y-6">
              {/* Customer Information */}
              <div className="p-6 rounded-2xl bg-volt-card border border-volt-border space-y-4">
                <h3 className="font-black text-sm uppercase tracking-wider text-white flex items-center gap-2 border-b border-volt-border pb-3">
                  <ShieldCheck className="w-4 h-4 text-volt-accent" />
                  1. CUSTOMER INFORMATION
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-volt-bg border border-volt-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-volt-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Phone Number (Required for Delivery) *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-volt-bg border border-volt-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-volt-accent"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-zinc-400 font-bold mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-volt-bg border border-volt-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-volt-accent"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="p-6 rounded-2xl bg-volt-card border border-volt-border space-y-4">
                <h3 className="font-black text-sm uppercase tracking-wider text-white flex items-center gap-2 border-b border-volt-border pb-3">
                  <Truck className="w-4 h-4 text-volt-accent" />
                  2. DELIVERY ADDRESS
                </h3>

                <div className="text-xs">
                  <label className="block text-zinc-400 font-bold mb-1">Street Address / Flat / Floor *</label>
                  <input
                    type="text"
                    name="street"
                    required
                    placeholder="e.g. 100 Volt Boulevard, Flat 402"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full bg-volt-bg border border-volt-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-volt-accent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="e.g. Bengaluru"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-volt-bg border border-volt-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-volt-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-volt-bg border border-volt-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-volt-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Postal Code (PIN) *</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      placeholder="560001"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full bg-volt-bg border border-volt-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-volt-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="p-6 rounded-2xl bg-volt-card border border-volt-border space-y-4">
                <h3 className="font-black text-sm uppercase tracking-wider text-white flex items-center gap-2 border-b border-volt-border pb-3">
                  <CreditCard className="w-4 h-4 text-volt-accent" />
                  3. PAYMENT GATEWAY
                </h3>

                <div className="space-y-3">
                  {/* Demo Mode Option */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'demo'
                        ? 'bg-volt-accent/10 border-volt-accent shadow-[0_0_15px_rgba(183,255,50,0.15)]'
                        : 'bg-volt-bg border-volt-border hover:border-zinc-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="demo"
                      checked={paymentMethod === 'demo'}
                      onChange={() => setPaymentMethod('demo')}
                      className="mt-1 accent-[#B7FF32]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">Instant Demo Checkout Mode</span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-volt-accent text-black">
                          RECOMMENDED
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">
                        Instantly completes order and simulates real payment without needing live gateway keys.
                      </p>
                    </div>
                  </label>

                  {/* Razorpay Test Mode */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'razorpay'
                        ? 'bg-volt-accent/10 border-volt-accent'
                        : 'bg-volt-bg border-volt-border hover:border-zinc-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="mt-1 accent-[#B7FF32]"
                    />
                    <div>
                      <span className="font-bold text-sm text-white">
                        Razorpay Gateway (Test Mode)
                      </span>
                      <p className="text-xs text-zinc-400 mt-1">
                        Pay via UPI, Debit/Credit Card, or NetBanking using Razorpay sandbox.
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'bg-volt-accent/10 border-volt-accent'
                        : 'bg-volt-bg border-volt-border hover:border-zinc-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 accent-[#B7FF32]"
                    />
                    <div>
                      <span className="font-bold text-sm text-white">Cash on Delivery (COD)</span>
                      <p className="text-xs text-zinc-400 mt-1">
                        Pay with cash or UPI QR code upon doorstep delivery.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review & Confirmation */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-volt-card border border-volt-border space-y-6">
                <h3 className="font-black text-sm uppercase tracking-wider text-white border-b border-volt-border pb-3">
                  ORDER SUMMARY ({itemCount} ITEMS)
                </h3>

                {/* Items Preview */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((it) => (
                    <div key={it.productId} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-10 h-12 bg-volt-bg rounded border border-volt-border p-1 flex-shrink-0">
                          <Image src={it.product.image} alt={it.product.name} fill className="object-contain" />
                        </div>
                        <div>
                          <p className="font-bold text-white line-clamp-1">{it.product.name}</p>
                          <p className="text-zinc-500">Qty: {it.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-white">₹{it.product.price * it.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 text-xs border-t border-volt-border pt-4">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="text-white font-bold">₹{subtotal}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-volt-accent">
                      <span>Discount ({couponCode})</span>
                      <span className="font-bold">-₹{discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-zinc-400">
                    <span>GST (5%)</span>
                    <span className="text-white font-bold">₹{tax}</span>
                  </div>

                  <div className="flex justify-between text-zinc-400">
                    <span>Shipping</span>
                    <span className="text-white font-bold">
                      {shippingCost === 0 ? <span className="text-volt-accent">FREE</span> : `₹${shippingCost}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-black text-white pt-3 border-t border-volt-border">
                    <span>FINAL TOTAL</span>
                    <span className="text-volt-accent text-xl">₹{totalAmount}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full py-4 rounded-xl bg-volt-accent hover:bg-volt-accentHover text-black font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(183,255,50,0.4)] disabled:opacity-50 transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isSubmitting ? 'PROCESSING ORDER...' : `PAY ₹${totalAmount} & PLACE ORDER`}
                  </span>
                </button>

                <p className="text-[10px] text-zinc-500 text-center flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> 256-bit SSL encrypted. No card data stored on server.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
