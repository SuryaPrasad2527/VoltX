'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Order, OrderStatus, PaymentStatus } from '@/types';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  Eye,
  X,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const q = statusFilter !== 'All' ? `?status=${statusFilter}` : '';
      const res = await fetch(`/api/orders${q}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (res.ok) {
        await fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
        }
      }
    } catch (e) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaymentStatusChange = async (orderId: string, paymentStatus: PaymentStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus }),
      });
      if (res.ok) {
        await fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, paymentStatus } : null));
        }
      }
    } catch (e) {
      alert('Failed to update payment');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <AdminHeader title="Order Processing & Dispatch" />

      <main className="p-8 space-y-6 max-w-7xl">
        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-volt-card p-4 rounded-2xl border border-volt-border">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order ID, Name, or Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-volt-bg border border-volt-border rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-volt-accent"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {['All', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                  statusFilter === st
                    ? 'bg-volt-accent text-black font-black'
                    : 'bg-volt-bg text-zinc-400 hover:text-white border border-volt-border'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-volt-card rounded-3xl border border-volt-border overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-volt-border bg-volt-dark/50 text-zinc-400 uppercase tracking-wider text-[11px]">
                  <th className="py-4 px-4">Order ID & Date</th>
                  <th className="py-4 px-4">Customer</th>
                  <th className="py-4 px-4">Items Summary</th>
                  <th className="py-4 px-4">Total Amount</th>
                  <th className="py-4 px-4">Payment</th>
                  <th className="py-4 px-4">Order Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-volt-border/60">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-volt-cardHover/50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-mono font-bold text-white text-sm">{order.orderNumber}</p>
                      <p className="text-[10px] text-zinc-500">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{order.customerName}</p>
                      <p className="text-[10px] text-zinc-400">{order.customerEmail}</p>
                    </td>

                    <td className="py-3 px-4 text-zinc-300">
                      <p className="line-clamp-1">
                        {order.items.map((it) => `${it.name} (x${it.quantity})`).join(', ')}
                      </p>
                      <span className="text-[10px] text-zinc-500">
                        {order.items.reduce((s, it) => s + it.quantity, 0)} cans total
                      </span>
                    </td>

                    <td className="py-3 px-4 font-black text-white text-sm">
                      ₹{order.totalAmount}
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) =>
                          handlePaymentStatusChange(order._id, e.target.value as PaymentStatus)
                        }
                        className="bg-volt-bg border border-volt-border rounded-lg px-2 py-1 text-[11px] font-bold text-white uppercase focus:outline-none focus:border-volt-accent"
                      >
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value as OrderStatus)
                        }
                        className="bg-volt-bg border border-volt-border rounded-lg px-2 py-1 text-[11px] font-bold text-volt-accent uppercase focus:outline-none focus:border-volt-accent"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg bg-volt-bg hover:bg-volt-border text-zinc-300 hover:text-white transition-colors"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4 text-volt-accent" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-volt-card border border-volt-border rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-volt-border pb-4">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                    <span>ORDER:</span>
                    <span className="text-volt-accent font-mono">{selectedOrder.orderNumber}</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-zinc-400">
                  Products in Shipment ({selectedOrder.items.length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedOrder.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-volt-bg border border-volt-border flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-10 bg-black rounded p-0.5 flex-shrink-0">
                          <Image src={it.image} alt={it.name} fill className="object-contain" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{it.name}</p>
                          <p className="text-zinc-500">
                            {it.flavour} • Qty: {it.quantity} × ₹{it.price}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-white">₹{it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping & Payment summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-volt-bg border border-volt-border space-y-1">
                  <p className="font-bold text-white flex items-center gap-1.5 mb-1 text-[11px] uppercase">
                    <MapPin className="w-3.5 h-3.5 text-volt-accent" /> Destination Address
                  </p>
                  <p className="text-zinc-300 font-semibold">{selectedOrder.customerName}</p>
                  <p className="text-zinc-400">{selectedOrder.shippingAddress.street}</p>
                  <p className="text-zinc-400">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} -{' '}
                    {selectedOrder.shippingAddress.postalCode}
                  </p>
                  <p className="text-zinc-500">Phone: {selectedOrder.customerPhone || 'N/A'}</p>
                </div>

                <div className="p-4 rounded-xl bg-volt-bg border border-volt-border space-y-2">
                  <p className="font-bold text-white text-[11px] uppercase mb-1">
                    Financial Summary
                  </p>
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal:</span>
                    <span className="text-white font-bold">₹{selectedOrder.subtotal}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-volt-accent">
                      <span>Discount ({selectedOrder.couponCode}):</span>
                      <span className="font-bold">-₹{selectedOrder.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-400">
                    <span>GST (5%):</span>
                    <span className="text-white font-bold">₹{selectedOrder.tax}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Shipping:</span>
                    <span className="text-white font-bold">
                      {selectedOrder.shippingCost === 0 ? 'FREE' : `₹${selectedOrder.shippingCost}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-white font-bold pt-1 border-t border-volt-border">
                    <span>Total Charged:</span>
                    <span className="text-volt-accent text-sm">₹{selectedOrder.totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 rounded-xl bg-volt-accent text-black font-black uppercase text-xs tracking-wider"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
