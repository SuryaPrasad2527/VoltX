'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  Heart,
  User,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { itemCount, wishlist } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // If on admin routes, admin has its own layout, but keep standard for storefront
  const isAdminRoute = pathname.startsWith('/admin');
  if (isAdminRoute) return null;

  const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'Flavors', href: '/#flavors' },
    { label: 'The Science', href: '/#benefits' },
    { label: 'Track Order', href: '/orders' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-volt-bg/85 border-b border-volt-border transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-volt-dark via-[#111c13] to-volt-dark py-1.5 px-4 text-center text-xs font-medium text-volt-muted border-b border-volt-border/50">
        <span className="inline-flex items-center gap-1.5 text-white">
          <Sparkles className="w-3.5 h-3.5 text-volt-accent animate-pulse" />
          USE CODE <span className="text-volt-accent font-bold tracking-wider">VOLT20</span> FOR 20% OFF YOUR FIRST CRATE | FREE SHIPPING OVER ₹500
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Logo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-semibold tracking-wide uppercase transition-colors relative py-1 ${
                    isActive
                      ? 'text-volt-accent'
                      : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-volt-accent shadow-[0_0_8px_#B7FF32]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 text-zinc-300 hover:text-volt-accent transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-zinc-800 text-volt-accent border border-volt-accent text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-zinc-300 hover:text-volt-accent transition-colors group"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-6 h-6 group-hover:scale-105 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-volt-accent text-black text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_10px_#B7FF32]">
                    {itemCount}
                  </span>
                )}
              </div>
            </Link>

            {/* User Account / Auth Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full bg-volt-card hover:bg-volt-cardHover border border-volt-border text-sm font-medium text-white transition-all focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-volt-accent/20 border border-volt-accent text-volt-accent flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-semibold max-w-[100px] truncate">
                    {user.name}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-volt-card border border-volt-border rounded-xl shadow-2xl py-2 z-50 text-sm"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-volt-border">
                      <p className="text-xs text-volt-muted">Signed in as</p>
                      <p className="font-semibold text-white truncate">{user.email}</p>
                      {user.role === 'ADMIN' && (
                        <span className="inline-block mt-1 text-[10px] font-black px-2 py-0.5 rounded bg-volt-accent/20 text-volt-accent border border-volt-accent/40">
                          ADMINISTRATOR
                        </span>
                      )}
                    </div>

                    {user.role === 'ADMIN' ? (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-volt-accent hover:bg-volt-cardHover font-semibold transition-colors"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-volt-cardHover transition-colors"
                        >
                          <User className="w-4 h-4 text-volt-accent" />
                          My Profile
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-volt-cardHover transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4 text-volt-accent" />
                          My Orders
                        </Link>
                      </>
                    )}

                    <div className="border-t border-volt-border mt-1 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-xs uppercase font-bold tracking-wider text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-volt-card transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="text-xs uppercase font-bold tracking-wider bg-volt-accent hover:bg-volt-accentHover text-black px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(183,255,50,0.3)] hover:shadow-[0_0_20px_rgba(183,255,50,0.5)]"
                >
                  Join the Cult
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-volt-card border-b border-volt-border px-4 pt-3 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-bold text-zinc-200 hover:text-volt-accent py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {!user && (
            <div className="pt-4 border-t border-volt-border flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg border border-volt-border text-white font-bold text-sm"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-volt-accent text-black font-black text-sm"
              >
                Join the Cult
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
