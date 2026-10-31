'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';

export default function CustomerProfilePage() {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Address
  const [street, setStreet] = useState(user?.addresses?.[0]?.street || '');
  const [city, setCity] = useState(user?.addresses?.[0]?.city || '');
  const [state, setState] = useState(user?.addresses?.[0]?.state || 'Karnataka');
  const [postalCode, setPostalCode] = useState(user?.addresses?.[0]?.postalCode || '');

  // Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const addresses = street
        ? [{ street, city, state, postalCode, country: 'India', isDefault: true }]
        : [];

      const payload: any = {
        name,
        phone,
        addresses,
      };

      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      await refreshUser();
      setFeedback({ text: 'Profile updated successfully!', success: true });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setFeedback({ text: err.message, success: false });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-volt-bg min-h-screen text-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-volt-border pb-6 mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">
            CUSTOMER PROFILE
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your personal credentials, contact details, and default delivery addresses.
          </p>
        </div>

        {feedback && (
          <div
            className={`mb-6 p-4 rounded-xl text-xs flex items-center gap-2 ${
              feedback.success
                ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                : 'bg-red-950/40 border border-red-500/40 text-red-300'
            }`}
          >
            {feedback.success ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-8">
          {/* Personal Info */}
          <div className="p-8 rounded-3xl bg-volt-card border border-volt-border space-y-6">
            <h2 className="text-base font-bold uppercase tracking-wider text-white flex items-center gap-2 border-b border-volt-border pb-4">
              <User className="w-4 h-4 text-volt-accent" /> BASIC DETAILS
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-volt-bg border border-volt-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-volt-accent"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full bg-volt-bg/50 border border-volt-border rounded-xl px-3.5 py-2.5 text-zinc-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-volt-bg border border-volt-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-volt-accent"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">Account Role</label>
                <input
                  type="text"
                  disabled
                  value={user?.role || 'CUSTOMER'}
                  className="w-full bg-volt-bg/50 border border-volt-border rounded-xl px-3.5 py-2.5 text-volt-accent font-bold cursor-not-allowed uppercase"
                />
              </div>
            </div>
          </div>

          {/* Saved Delivery Address */}
          <div className="p-8 rounded-3xl bg-volt-card border border-volt-border space-y-6">
            <h2 className="text-base font-bold uppercase tracking-wider text-white flex items-center gap-2 border-b border-volt-border pb-4">
              <MapPin className="w-4 h-4 text-volt-accent" /> SAVED DELIVERY ADDRESS
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-bold mb-1">Street Address</label>
                <input
                  type="text"
                  placeholder="Apartment, suite, street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-volt-bg border border-volt-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-volt-accent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-volt-bg border border-volt-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-volt-accent"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-volt-bg border border-volt-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-volt-accent"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-volt-bg border border-volt-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-volt-accent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="p-8 rounded-3xl bg-volt-card border border-volt-border space-y-6">
            <h2 className="text-base font-bold uppercase tracking-wider text-white flex items-center gap-2 border-b border-volt-border pb-4">
              <Lock className="w-4 h-4 text-volt-accent" /> CHANGE SECURITY PASSWORD
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-bold mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-volt-bg border border-volt-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-volt-accent"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">New Password (Min 6 chars)</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-volt-bg border border-volt-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-volt-accent"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 rounded-xl bg-volt-accent hover:bg-volt-accentHover text-black font-black uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(183,255,50,0.4)] transition-all"
          >
            {saving ? 'SAVING CHANGES...' : 'SAVE PROFILE UPDATES'}
          </button>
        </form>
      </div>
    </div>
  );
}
