'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, ShoppingCart, User, ChevronDown, Package, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartCount } from '@/hooks/useCartCount';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session } = useSession();
  const { cartCount } = useCartCount();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const isSeller = (session?.user as any)?.isSeller || (session?.user as any)?.role === 'seller';

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-gradient-to-r from-pink-300 via-yellow-200 to-pink-300 border-b border-yellow-400"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-2">

          {/* Logo Section */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
              <motion.span 
                className="text-pink-900 italic text-2xl"
                whileHover={{ scale: 1.05 }}
              >
                The Royal<span className="text-yellow-600 not-italic">Cards</span>
              </motion.span>
            </Link>

            {/* Search Bar - Premium Style */}
            <div className="hidden md:flex flex-1 max-w-2xl">
              <div className="w-full relative">
                <input
                  type="text"
                  placeholder="Search for wedding cards, designs..."
                  className="w-full px-4 py-2.5 text-pink-900 bg-white/80 rounded-full border border-yellow-300 outline-none focus:border-yellow-500 focus:bg-white transition-all placeholder-pink-400"
                />
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-1 top-1 bottom-1 px-4 bg-gradient-to-r from-yellow-400 to-pink-400 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-yellow-500/50 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {/* Become a Seller - Premium Button */}
            {!isSeller && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/become-seller"
                  className="px-8 py-2 bg-gradient-to-r from-yellow-400 to-pink-400 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-yellow-500/30 transition text-sm"
                >
                  Become a Seller
                </Link>
              </motion.div>
            )}

            {/* More Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setMoreOpen(!moreOpen)}
                className="flex items-center gap-1 text-pink-900 font-semibold py-4 hover:text-yellow-700 transition"
              >
                More
                <ChevronDown size={16} className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {moreOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl py-2 overflow-hidden border border-yellow-300"
                  >
                    <Link href="/contact" className="flex items-center gap-3 px-4 py-3 text-pink-900 hover:bg-yellow-100 transition">
                      <Package size={18} className="text-yellow-500" /> Contact Us
                    </Link>
                    <Link href="/about" className="flex items-center gap-3 px-4 py-3 text-pink-900 hover:bg-yellow-100 transition">
                      About Us
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link href="/cart" className="flex items-center gap-2 text-pink-900 font-semibold hover:text-yellow-700 transition">
                <div className="relative">
                  <ShoppingCart size={22} />
                  {cartCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </motion.span>
                  )}
                </div>
                <span>Cart</span>
              </Link>
            </motion.div>

{/* User Account */}
            {session ? (
              <div className="relative">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 text-pink-900 font-semibold py-4"
                >
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400 text-white flex items-center justify-center font-bold text-sm"
                  >
                    {session.user?.name?.[0] || 'U'}
                  </motion.div>
                  <span>{session.user?.name?.split(' ')[0] || 'Account'}</span>
                  <ChevronDown size={16} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </motion.button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl shadow-xl py-2 overflow-hidden border border-yellow-300"
                    >
                      <div className="px-4 py-3 border-b border-yellow-100">
                        <p className="text-sm text-yellow-600">Hello,</p>
                        <p className="font-semibold text-pink-900">{session.user?.name || session.user?.email}</p>
                      </div>
                      <Link href="/dashboard" onClick={() => setIsProfileOpen(false)} className="block px-4 py-3 text-pink-900 hover:bg-yellow-50 transition">
                        My Account
                      </Link>
                      <Link href="/dashboard" onClick={() => setIsProfileOpen(false)} className="block px-4 py-3 text-pink-900 hover:bg-yellow-50 transition">
                        My Orders
                      </Link>
                      {isSeller ? (
                        <Link href="/seller/dashboard" onClick={() => setIsProfileOpen(false)} className="block px-4 py-3 text-green-700 hover:bg-green-50 transition font-semibold">
                          <Store className="w-4 h-4 inline mr-2" />
                          Seller Dashboard
                        </Link>
                      ) : (
                        <Link href="/become-seller" onClick={() => setIsProfileOpen(false)} className="block px-4 py-3 text-pink-900 hover:bg-yellow-50 transition">
                          Become a Seller
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 transition"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/auth/signin"
                  className="px-10 py-2 bg-gradient-to-r from-yellow-400 to-pink-400 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-yellow-500/50 transition"
                >
                  Sign In
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-full bg-yellow-400/30 text-pink-900"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search wedding cards..."
              className="w-full px-4 py-2.5 text-pink-900 bg-white/80 rounded-full border border-yellow-300 outline-none focus:border-yellow-500 placeholder-pink-400"
            />
            <button className="absolute right-1 top-1 bottom-1 px-4 bg-gradient-to-r from-yellow-400 to-pink-400 text-white font-semibold rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-2 bg-white rounded-xl shadow-xl overflow-hidden border border-yellow-300"
            >
              <Link href="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-pink-900 hover:bg-yellow-50 transition">
                Home
              </Link>
              <Link href="/cards" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-pink-900 hover:bg-yellow-50 transition">
                Browse Cards
              </Link>
              <Link href="/cart" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-pink-900 hover:bg-yellow-50 transition">
                Cart
              </Link>
              {!isSeller && (
                <Link href="/become-seller" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-pink-900 hover:bg-yellow-50 transition">
                  Become a Seller
                </Link>
              )}
              {isSeller && (
                <Link href="/seller/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-green-700 hover:bg-green-50 transition font-semibold">
                  Seller Dashboard
                </Link>
              )}
              {session && (
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-pink-900 hover:bg-yellow-50 transition">
                  My Account
                </Link>
              )}
              <div className="border-t border-yellow-200 mt-2 pt-2">
                {session ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-pink-900 hover:bg-yellow-50 transition"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 bg-gradient-to-r from-yellow-400 to-pink-400 text-white font-semibold text-center mx-4 mb-4 rounded-full"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
