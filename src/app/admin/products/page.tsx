'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Product } from '@/types';
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  Upload,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: 149,
    originalPrice: 199,
    image: '/images/voltx-original.png',
    category: 'Classic',
    flavour: '',
    size: '500ml Can',
    SKU: '',
    stock: 100,
    isFeatured: true,
    isActive: true,
    caffeineMg: 160,
    calories: 15,
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?all=true');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error('Failed to load products', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: 149,
      originalPrice: 199,
      image: '/images/voltx-original.png',
      category: 'Classic',
      flavour: '',
      size: '500ml Can',
      SKU: `VX-NEW-${Math.floor(100 + Math.random() * 900)}`,
      stock: 100,
      isFeatured: true,
      isActive: true,
      caffeineMg: 160,
      calories: 15,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      image: p.image,
      category: p.category,
      flavour: p.flavour,
      size: p.size,
      SKU: p.SKU,
      stock: p.stock,
      isFeatured: p.isFeatured,
      isActive: p.isActive,
      caffeineMg: p.caffeineMg || 160,
      calories: p.calories || 10,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, image: data.url }));
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    try {
      if (editingProduct) {
        // Update product
        const res = await fetch(`/api/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, slug }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update product');
      } else {
        // Create product
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, slug }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create product');
      }

      setModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      }
    } catch (e) {
      alert('Failed to delete');
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      fetchProducts();
    } catch (e) {}
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.SKU.toLowerCase().includes(search.toLowerCase()) ||
      p.flavour.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <AdminHeader title="Product Management" />

      <main className="p-8 space-y-6 max-w-7xl">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-volt-card p-4 rounded-2xl border border-volt-border">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products, SKU, flavours..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-volt-bg border border-volt-border rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-volt-accent"
            />
          </div>

          <button
            onClick={openAddModal}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-volt-accent hover:bg-volt-accentHover text-black font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(183,255,50,0.3)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-volt-card rounded-3xl border border-volt-border overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-volt-border bg-volt-dark/50 text-zinc-400 uppercase tracking-wider text-[11px]">
                  <th className="py-4 px-4">Can Variant</th>
                  <th className="py-4 px-4">SKU</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Vault Stock</th>
                  <th className="py-4 px-4">Featured</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-volt-border/60">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-volt-cardHover/50 transition-colors">
                    {/* Image & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 bg-volt-bg rounded-lg border border-volt-border p-1 flex-shrink-0">
                          <Image src={p.image} alt={p.name} fill className="object-contain" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-volt-accent">{p.flavour}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-400">{p.SKU}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold text-[10px] uppercase">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-black text-white text-sm">₹{p.price}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-bold ${
                          p.stock === 0
                            ? 'text-red-400'
                            : p.stock < 15
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {p.isFeatured ? (
                        <span className="text-[10px] font-black uppercase text-volt-accent px-2 py-0.5 rounded bg-volt-accent/15 border border-volt-accent/30">
                          FEATURED
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-500">Standard</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          p.isActive
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                        }`}
                      >
                        {p.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {p.isActive ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg bg-volt-bg hover:bg-volt-border text-zinc-300 hover:text-white transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id, p.name)}
                          className="p-1.5 rounded-lg bg-volt-bg hover:bg-red-950/40 text-zinc-400 hover:text-red-400 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Product Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-volt-card border border-volt-border rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-volt-border pb-4">
                <h3 className="text-xl font-black uppercase tracking-tight text-white">
                  {editingProduct ? 'EDIT PRODUCT' : 'ADD NEW VOLTX PRODUCT'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                {/* Name & SKU */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. VoltX Quantum Citrus"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-volt-bg border border-volt-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-volt-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">SKU Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. VX-QNT-007"
                      value={formData.SKU}
                      onChange={(e) => setFormData({ ...formData, SKU: e.target.value })}
                      className="w-full bg-volt-bg border border-volt-border rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-volt-accent"
                    />
                  </div>
                </div>

                {/* Flavour & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Flavour Profile *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Electric Lime Rush"
                      value={formData.flavour}
                      onChange={(e) => setFormData({ ...formData, flavour: e.target.value })}
                      className="w-full bg-volt-bg border border-volt-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-volt-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full bg-volt-bg border border-volt-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-volt-accent"
                    >
                      <option value="Classic">Classic</option>
                      <option value="Zero Sugar">Zero Sugar</option>
                      <option value="High-Volt">High-Volt</option>
                      <option value="Variety Pack">Variety Pack</option>
                    </select>
                  </div>
                </div>

                {/* Price & Original Price */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full bg-volt-bg border border-volt-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-volt-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.originalPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, originalPrice: Number(e.target.value) })
                      }
                      className="w-full bg-volt-bg border border-volt-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-volt-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Vault Stock *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full bg-volt-bg border border-volt-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-volt-accent"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-volt-bg border border-volt-border rounded-xl p-3 text-white focus:outline-none focus:border-volt-accent"
                  />
                </div>

                {/* Image Upload / URL */}
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Product Can Image</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="flex-1 bg-volt-bg border border-volt-border rounded-xl px-3.5 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-volt-accent"
                    />
                    <label className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer font-bold flex items-center gap-1.5 transition-colors">
                      <Upload className="w-3.5 h-3.5 text-volt-accent" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="accent-[#B7FF32] w-4 h-4"
                    />
                    <span className="text-zinc-300 font-bold">Featured on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="accent-[#B7FF32] w-4 h-4"
                    />
                    <span className="text-zinc-300 font-bold">Active in Catalog</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-volt-border flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-volt-border text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-volt-accent hover:bg-volt-accentHover text-black font-black uppercase tracking-wider"
                  >
                    {editingProduct ? 'Save Updates' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
