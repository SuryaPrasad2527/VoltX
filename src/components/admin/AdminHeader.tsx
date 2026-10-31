'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Bell, Search, Shield, Zap } from 'lucide-react';

export function AdminHeader({ title }: { title: string }) {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-volt-dark/80 backdrop-blur-md border-b border-volt-border px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
          <span>{title}</span>
        </h1>
        <p className="text-[11px] text-zinc-400">
          Real-time analytics & business control system
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Status indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-volt-card border border-volt-border text-xs text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-volt-accent animate-pulse" />
          <span className="font-mono text-[11px]">ATLAS DB CONNECTED</span>
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 p-1.5 rounded-full bg-volt-card border border-volt-border text-xs">
          <div className="w-7 h-7 rounded-full bg-volt-accent text-black font-black flex items-center justify-center text-xs">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <span className="font-bold text-white pr-2 hidden sm:inline-block">
            {user?.name || 'Administrator'}
          </span>
        </div>
      </div>
    </header>
  );
}
