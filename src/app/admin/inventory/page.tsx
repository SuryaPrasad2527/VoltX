'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  Layers,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  Minus,
  Save,
} from 'lucide-react';

interface InventoryItem {
  _id: string;
  name: string;
  SKU: string;
  category: string;
  flavour: string;
  size: string;
  stock: number;
  unitsSold: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  price: number;
  image: string;
}

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingStock, setEditingStock] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/admin/inventory');
      const data = await res.json();
      if (data.success) {
        setInventory(data.inventory);
        const map: Record<string, number> = {};
        data.inventory.forEach((item: InventoryItem) => {
          map[item._id] = item.stock;
        });
        setEditingStock(map);
      }
    } catch (e) {
      console.error('Failed to load inventory', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockChange = (id: string, delta: number) => {
    setEditingStock((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) + delta),
    }));
  };

  const handleStockSave = async (id: string) => {
    setSavingId(id);
    const newStock = editingStock[id];
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id, stock: newStock }),
      });
      if (res.ok) {
        await fetchInventory();
      }
    } catch (e) {
      alert('Failed to update stock');
    } finally {
      setSavingId(null);
    }
  };

  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.SKU.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'low_stock'
        ? item.status === 'low_stock'
        : statusFilter === 'out_of_stock'
        ? item.status === 'out_of_stock'
        : item.status === 'in_stock';
    return matchesSearch && matchesStatus;
  });

  const lowStockCount = inventory.filter((i) => i.status === 'low_stock').length;
  const outOfStockCount = inventory.filter((i) => i.status === 'out_of_stock').length;

  return (
    <div>
      <AdminHeader title="Vault Inventory & Stock Management" />

      <main className="p-8 space-y-6 max-w-7xl">
        {/* Alerts and Overview Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-volt-card border border-volt-border flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-bold uppercase">Total Units in Vault</p>
              <p className="text-2xl font-black text-white mt-1">
                {inventory.reduce((s, i) => s + i.stock, 0)} Units
              </p>
            </div>
            <Layers className="w-8 h-8 text-volt-accent/40" />
          </div>

          <div className="p-5 rounded-2xl bg-volt-card border border-amber-800/40 flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-400 font-bold uppercase">Low Stock Alerts (&lt;15)</p>
              <p className="text-2xl font-black text-amber-400 mt-1">
                {lowStockCount} Variants
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-amber-400/40" />
          </div>

          <div className="p-5 rounded-2xl bg-volt-card border border-volt-border flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-bold uppercase">Total Cans Sold</p>
              <p className="text-2xl font-black text-volt-secondary mt-1">
                {inventory.reduce((s, i) => s + i.unitsSold, 0)} Cans
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-400/40" />
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-volt-card p-4 rounded-2xl border border-volt-border">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by SKU or Product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-volt-bg border border-volt-border rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-volt-accent"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {['All', 'in_stock', 'low_stock', 'out_of_stock'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                  statusFilter === st
                    ? 'bg-volt-accent text-black font-black'
                    : 'bg-volt-bg text-zinc-400 hover:text-white border border-volt-border'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-volt-card rounded-3xl border border-volt-border overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-volt-border bg-volt-dark/50 text-zinc-400 uppercase tracking-wider text-[11px]">
                  <th className="py-4 px-4">Product Variant</th>
                  <th className="py-4 px-4">SKU</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Total Units Sold</th>
                  <th className="py-4 px-4">Current Stock</th>
                  <th className="py-4 px-4 text-right">Quick Stock Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-volt-border/60">
                {filteredItems.map((item) => {
                  const currentEdit = editingStock[item._id] ?? item.stock;
                  const hasChanged = currentEdit !== item.stock;

                  return (
                    <tr key={item._id} className="hover:bg-volt-cardHover/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-12 bg-volt-bg rounded-lg border border-volt-border p-1 flex-shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-contain" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{item.name}</p>
                            <p className="text-[11px] text-volt-accent">{item.flavour}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-zinc-400">{item.SKU}</td>

                      <td className="py-3 px-4">
                        {item.status === 'out_of_stock' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-500/40">
                            <XCircle className="w-3 h-3" /> Out of Stock
                          </span>
                        ) : item.status === 'low_stock' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-500/40 animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/40">
                            <CheckCircle2 className="w-3 h-3" /> Healthy
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-bold text-white">
                        {item.unitsSold} cans
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-sm text-white">
                          {item.stock} units
                        </span>
                      </td>

                      {/* Stepper + Save Button */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <div className="flex items-center border border-volt-border bg-volt-bg rounded-xl">
                            <button
                              onClick={() => handleStockChange(item._id, -5)}
                              className="px-2.5 py-1 text-zinc-400 hover:text-white font-bold"
                              title="-5 units"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => handleStockChange(item._id, -1)}
                              className="px-2 py-1 text-zinc-400 hover:text-white font-bold"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <input
                              type="number"
                              min={0}
                              value={currentEdit}
                              onChange={(e) =>
                                setEditingStock({
                                  ...editingStock,
                                  [item._id]: Math.max(0, parseInt(e.target.value) || 0),
                                })
                              }
                              className="w-14 bg-transparent text-center font-mono font-bold text-white text-xs focus:outline-none"
                            />
                            <button
                              onClick={() => handleStockChange(item._id, 1)}
                              className="px-2 py-1 text-zinc-400 hover:text-white font-bold"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleStockChange(item._id, 10)}
                              className="px-2.5 py-1 text-zinc-400 hover:text-white font-bold"
                              title="+10 units"
                            >
                              +10
                            </button>
                          </div>

                          <button
                            onClick={() => handleStockSave(item._id)}
                            disabled={!hasChanged || savingId === item._id}
                            className={`p-2 rounded-xl transition-all ${
                              hasChanged
                                ? 'bg-volt-accent text-black hover:bg-volt-accentHover shadow-[0_0_10px_#B7FF32]'
                                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                            }`}
                            title="Save Stock Level"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
