'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Key } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Invalid email or password.');
      } else {
        const destination = redirectParam || res.redirectUrl || '/shop';
        router.push(destination);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: 'ADMIN' | 'CUSTOMER') => {
    if (role === 'ADMIN') {
      setEmail('admin@voltx.com');
      setPassword('AdminVoltX2025!');
    } else {
      setEmail('alex@voltx.com');
      setPassword('Customer123!');
    }
  };

  return (
    <div className="bg-volt-card border border-volt-border rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@voltx.com"
              className="w-full bg-volt-bg border border-volt-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-volt-accent transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-volt-bg border border-volt-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-volt-accent transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-volt-accent hover:bg-volt-accentHover text-black font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(183,255,50,0.35)] transition-all transform hover:scale-[1.02]"
        >
          <span>{loading ? 'AUTHENTICATING...' : 'SIGN IN'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Quick Demo Credentials Autofill Helper */}
      <div className="pt-4 border-t border-volt-border space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block text-center">
          Quick Test Credentials:
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('ADMIN')}
            className="p-2 rounded-lg bg-volt-bg hover:bg-volt-cardHover border border-volt-border text-left transition-colors"
          >
            <div className="flex items-center gap-1.5 text-volt-accent text-[11px] font-black uppercase">
              <Key className="w-3 h-3" /> Admin
            </div>
            <p className="text-[10px] text-zinc-400 truncate">admin@voltx.com</p>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('CUSTOMER')}
            className="p-2 rounded-lg bg-volt-bg hover:bg-volt-cardHover border border-volt-border text-left transition-colors"
          >
            <div className="flex items-center gap-1.5 text-white text-[11px] font-black uppercase">
              <Key className="w-3 h-3 text-zinc-400" /> Customer
            </div>
            <p className="text-[10px] text-zinc-400 truncate">alex@voltx.com</p>
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-zinc-400 pt-2">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-volt-accent font-bold hover:underline">
          Create Customer Account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-volt-bg min-h-screen text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Neon Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-volt-accent/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Logo size="lg" className="justify-center" />
        <h2 className="mt-6 text-2xl font-black uppercase tracking-tight text-white">
          AUTHENTICATE YOUR SESSION
        </h2>
        <p className="mt-2 text-xs text-zinc-400">
          Enter credentials to access customer perks or administrator controls.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <Suspense fallback={<div className="h-64 bg-volt-card rounded-3xl animate-pulse" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
