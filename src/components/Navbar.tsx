'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, ShoppingCart, User, ChevronDown, Package } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
<nav className="sticky top-0 z-50 bg-gradient-to-r from-pink-600 to-rose-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-2">

          {/* Logo Section */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <span className="text-white italic">
                Wedding<span className="text-yellow-400 not-italic">Cards</span>
              </span>
            </Link>

            {/* Search Bar - Flipkart Style */}
            <div className="hidden md:flex flex-1 max-w-2xl">
              <div className="w-full relative">
                <input
                  type="text"
                  placeholder="Search for wedding cards, designs..."
                  className="w-full px-4 py-2.5 text-gray-900 rounded-sm border-0 outline-none"
                />
                <button className="absolute right-0 top-0 bottom-0 px-4 bg-pink-100 text-pink-600 font-semibold rounded-r-sm hover:bg-pink-200 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {/* Become a Seller - Yellow Button */}
            <Link
              href="/become-seller"
              className="px-8 py-1.5 bg-[#fb641b] text-white font-semibold rounded-sm hover:bg-[#e55a16] transition shadow-sm text-sm"
            >
              Become a Seller
            </Link>

            {/* More Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setMoreOpen(!moreOpen)}
                className="flex items-center gap-1 text-white font-semibold py-4 hover:text-yellow-400 transition"
              >
                More
                <ChevronDown size={16} className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-sm shadow-lg py-2">
                  <Link href="/contact" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100">
                    <Package size={18} /> Contact Us
                  </Link>
                  <Link href="/about" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100">
                    About Us
                  </Link>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart" className="flex items-center gap-2 text-white font-semibold hover:text-yellow-400 transition">
              <ShoppingCart size={20} />
              <span>Cart</span>
              {session && (
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5">0</span>
              )}
            </Link>

            {/* User Account */}
            {session ? (
              <div className="relative group">
                <button className="flex items-center gap-2 text-white font-semibold py-4">
                  <div className="w-7 h-7 rounded-full bg-yellow-400 text-[#2874f0] flex items-center justify-center font-bold text-sm">
                    {session.user?.name?.[0] || 'U'}
                  </div>
                  <span>{session.user?.name?.split(' ')[0] || 'Account'}</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-sm shadow-lg py-2 hidden group-hover:block">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm text-gray-600">Hello,</p>
                    <p className="font-semibold text-gray-900">{session.user?.name || session.user?.email}</p>
                  </div>
                  <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    My Account
                  </Link>
                  <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="px-10 py-1.5 bg-white text-[#2874f0] font-semibold rounded-sm hover:bg-gray-100 transition"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search wedding cards..."
              className="w-full px-4 py-2 text-gray-900 rounded-sm border-0 outline-none"
            />
            <button className="absolute right-0 top-0 bottom-0 px-4 bg-[#f0f0f0] text-[#2874f0] font-semibold rounded-r-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-2 bg-white rounded-sm shadow-xl py-2">
            <Link href="/" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Home
            </Link>
            <Link href="/cards" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Browse Cards
            </Link>
            <Link href="/cart" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Cart
            </Link>
            {session && (
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                My Account
              </Link>
            )}
            <div className="border-t mt-2 pt-2">
              {session ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-[#2874f0] font-semibold"
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
