'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, ShoppingCart, LayoutDashboard, Home, Sparkles, Heart } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 shadow-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">

          {/* 🔥 Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="p-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg">
              <Heart size={18} />
            </div>
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Royal Card Studio
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 font-medium text-gray-700">
            <Link href="/" className="flex items-center gap-1 hover:text-rose-600 transition">
              <Home size={18} /> Home
            </Link>

            <Link href="/cards" className="hover:text-rose-600 transition">
              Cards
            </Link>

            {/* ✅ Dashboard only after login */}
            {session && (
              <Link href="/dashboard" className="flex items-center gap-1 hover:text-rose-600 transition">
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            )}

            <Link href="/cart" className="flex items-center gap-1 hover:text-rose-600 transition">
              <ShoppingCart size={18} /> Cart
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold shadow">
                  {session.user?.name?.[0] || 'U'}
                </div>

                <span className="text-sm font-medium text-gray-700">
                  {session.user?.name || session.user?.email}
                </span>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full border border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 rounded-full border border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white transition"
                >
                  Sign In
                </Link>

                <Link
                  href="/auth/signup"
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg hover:scale-105 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* 🔥 Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-3 bg-white rounded-2xl shadow-xl p-4 space-y-4 animate-fadeIn">
            <Link href="/" onClick={() => setIsOpen(false)} className="block hover:text-rose-600">
              Home
            </Link>

            <Link href="/cards" onClick={() => setIsOpen(false)} className="block hover:text-rose-600">
              Cards
            </Link>

            {/* ✅ Dashboard only after login */}
            {session && (
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block hover:text-rose-600">
                Dashboard
              </Link>
            )}

            <Link href="/cart" onClick={() => setIsOpen(false)} className="block hover:text-rose-600">
              Cart
            </Link>

            <div className="border-t pt-3">
              {session ? (
                <>
                  <p className="text-sm text-gray-600 text-center">
                    Welcome, {session.user?.name || session.user?.email}
                  </p>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full mt-2 py-2 rounded-full border border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    onClick={() => setIsOpen(false)}
                    className="block text-center py-2 rounded-full border border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white transition"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/auth/signup"
                    onClick={() => setIsOpen(false)}
                    className="block text-center mt-2 py-2 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
