'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  Layers,
  ShoppingBag,
  Users,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: any;
  exact?: boolean;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Sales Analytics', href: '/admin/analytics', icon: TrendingUp },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Inventory', href: '/admin/inventory', icon: Layers },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Reports', href: '/admin/reports', icon: FileText },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-volt-dark border-r border-volt-border flex flex-col justify-between h-screen sticky top-0 z-40 select-none">
      <div>
        {/* Brand Logo Header */}
        <div className="h-20 flex items-center px-6 border-b border-volt-border">
          <Logo size="sm" />
        </div>

        {/* Admin Badge */}
        <div className="px-6 py-3 border-b border-volt-border/60 bg-volt-card/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-volt-accent font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>COMMAND CENTER</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">v2.4-PROD</span>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-volt-accent text-black shadow-[0_0_15px_rgba(183,255,50,0.35)]'
                    : 'text-zinc-400 hover:text-white hover:bg-volt-card'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-volt-border space-y-2">
        <Link
          href="/shop"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-volt-card hover:bg-volt-cardHover border border-volt-border text-xs font-bold text-zinc-300 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-volt-accent" />
            <span>View Live Store</span>
          </span>
          <span className="text-[10px] text-volt-accent">↗</span>
        </Link>

        <button
          onClick={() => logout()}
          className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
