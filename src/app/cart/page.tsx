'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
  AlertCircle,
  Truck,
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    itemCount,
    subtotal,
    discount,
    couponCode,
    tax,
    shippingCost,
    totalAmount,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    setCouponMsg(null);

    const res = await applyCoupon(couponInput.trim());
    setApplying(false);
    setCouponMsg({ text: res.message || '', success: res.success });
    if (res.success) {
      setCouponInput('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-volt-bg min-h-screen text-white flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center space-y-6 bg-volt-card p-10 rounded-3xl border border-volt-border shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-volt-accent/10 border border-volt-accent/30 text-volt-accent mx-auto flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black uppercase text-white tracking-tight">
            YOUR CART IS EMPTY
          </h2>
          <p className="text-sm text-zinc-400">
            Looks like your energy reserves are running dry. Browse the VOLTX arsenal to stock up on signature cans and crates.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-volt-accent hover:bg-volt-accentHover text-black font-black uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(183,255,50,0.4)] transition-all"
          >
            <span>EXPLORE ARSENAL</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-volt-bg min-h-screen text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">
          SHOPPING CART ({itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'})
        </h1>
        <p className="text-sm text-zinc-400 mb-8">
          Review your order details. Orders over ₹500 qualify for free express courier delivery.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => {
              const maxStock = item.product.stock;
              return (
                <div
                  key={item.productId}
                  className="p-5 rounded-2xl bg-volt-card border border-volt-border flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-volt-accent/40 transition-colors"
                >
                  {/* Image & Title */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative w-20 h-24 rounded-xl bg-volt-bg border border-volt-border p-2 flex-shrink-0 flex items-center justify-center">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/shop/${item.product.slug}`}
                        className="font-extrabold text-base text-white hover:text-volt-accent transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-volt-accent font-semibold">
                        {item.product.flavour} • {item.product.size}
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">
                        ₹{item.product.price} each • Stock: {maxStock} available
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Line Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-volt-border">
                    {/* Stepper */}
                    <div className="flex items-center border border-volt-border bg-volt-bg rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-3 py-1.5 text-sm font-bold text-zinc-400 hover:text-white"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-black text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= maxStock}
                        className="px-3 py-1.5 text-sm font-bold text-zinc-400 hover:text-white disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-base font-black text-white">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Free shipping banner */}
            <div className="p-4 rounded-xl bg-volt-card/60 border border-volt-border flex items-center gap-3 text-xs text-zinc-300">
              <Truck className="w-5 h-5 text-volt-accent flex-shrink-0" />
              <span>
                {subtotal >= 500 ? (
                  <strong className="text-volt-accent">
                    You have unlocked FREE Lightning Delivery!
                  </strong>
                ) : (
                  <>
                    Add <strong>₹{500 - subtotal}</strong> more to your cart to unlock free express shipping.
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Order Summary & Coupon Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-volt-card border border-volt-border space-y-6">
              <h3 className="font-black text-lg uppercase tracking-tight text-white border-b border-volt-border pb-4">
                ORDER SUMMARY
              </h3>

              {/* Coupon Form */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-zinc-400">
                  Promo / Coupon Code
                </label>
                {couponCode ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-volt-accent/15 border border-volt-accent/40 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-volt-accent" />
                      <span className="font-bold text-volt-accent">{couponCode} APPLIED</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-400 hover:text-red-300 text-xs font-bold uppercase"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. VOLT20"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-volt-bg border border-volt-border rounded-xl px-3 py-2 text-xs uppercase text-white placeholder-zinc-500 focus:outline-none focus:border-volt-accent"
                    />
                    <button
                      type="submit"
                      disabled={applying}
                      className="px-4 py-2 bg-volt-accent hover:bg-volt-accentHover text-black rounded-xl text-xs font-black uppercase tracking-wider"
                    >
                      {applying ? '...' : 'APPLY'}
                    </button>
                  </form>
                )}

                {couponMsg && (
                  <p
                    className={`text-xs mt-1 flex items-center gap-1 ${
                      couponMsg.success ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {couponMsg.success ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5" />
                    )}
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3 text-xs pt-2 border-t border-volt-border/60">
                <div className="flex justify-between text-zinc-300">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">₹{subtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-volt-accent">
                    <span>Discount ({couponCode})</span>
                    <span className="font-bold">-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-300">
                  <span>Estimated GST (5%)</span>
                  <span className="font-bold text-white">₹{tax}</span>
                </div>

                <div className="flex justify-between text-zinc-300">
                  <span>Express Courier Delivery</span>
                  <span className="font-bold text-white">
                    {shippingCost === 0 ? (
                      <span className="text-volt-accent uppercase font-bold">FREE</span>
                    ) : (
                      `₹${shippingCost}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-white pt-4 border-t border-volt-border">
                  <span>FINAL TOTAL</span>
                  <span className="text-volt-accent text-xl">₹{totalAmount}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="w-full py-4 rounded-xl bg-volt-accent hover:bg-volt-accentHover text-black font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(183,255,50,0.4)] transition-all"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
