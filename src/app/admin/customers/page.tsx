'use client';

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Users, Search, ShoppingBag, IndianRupee, Calendar } from 'lucide-react';

interface CustomerItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await fetch(`/api/admin/customers?search=${search}`);
        const data = await res.json();
        if (data.success) {
          setCustomers(data.customers);
        }
      } catch (e) {
        console.error('Failed to load customers', e);
      } finally {
        setLoading(false);
      }
    }
    const timer = setTimeout(loadCustomers, 200);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div>
      <AdminHeader title="Customer Directory & Spending" />

      <main className="p-8 space-y-6 max-w-7xl">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-volt-card p-4 rounded-2xl border border-volt-border">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-volt-bg border border-volt-border rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-volt-accent"
            />
          </div>

          <div className="text-xs text-zinc-400">
            Total Registered Customers: <strong className="text-white">{customers.length}</strong>
          </div>
        </div>

        {/* Customer Table */}
        <div className="bg-volt-card rounded-3xl border border-volt-border overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-volt-border bg-volt-dark/50 text-zinc-400 uppercase tracking-wider text-[11px]">
                  <th className="py-4 px-4">Customer Name</th>
                  <th className="py-4 px-4">Contact Info</th>
                  <th className="py-4 px-4">Registered Date</th>
                  <th className="py-4 px-4">Total Orders</th>
                  <th className="py-4 px-4">Lifetime Spend</th>
                  <th className="py-4 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-volt-border/60">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-volt-cardHover/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-volt-accent/20 border border-volt-accent text-volt-accent font-black flex items-center justify-center text-xs">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{c.name}</p>
                          <p className="text-[10px] text-zinc-500">ID: {c._id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-300">
                      <p>{c.email}</p>
                      <p className="text-[10px] text-zinc-500">{c.phone}</p>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-400">
                      {new Date(c.registeredAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white px-2 py-0.5 rounded bg-volt-bg border border-volt-border">
                        {c.totalOrders} Orders
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-black text-volt-accent text-sm">
                      ₹{c.totalSpent.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Active Athlete
                      </span>
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
