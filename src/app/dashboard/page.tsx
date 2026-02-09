'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Booking {
  _id: string;
  status: string;
  createdAt: string;
  orderId: string;
}

interface CartItem {
  _id: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Booking[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/auth/signin');
  }, [session, status, router]);

  useEffect(() => {
    if (session) {
      fetchData();
      const interval = setInterval(fetchData, 10000); // Fetch every 10 seconds
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [session]);

  const fetchData = async () => {
    try {
      const [ordersRes, cartRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/cart'),
      ]);

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }

      if (cartRes.ok) {
        const cartData = await cartRes.json();
        setCartItems(cartData);
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const cartCount = cartItems.length;

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <motion.h1
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent"
            >
              Dashboard
            </motion.h1>
            <div className="flex items-center space-x-4">
              <motion.span
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-gray-700 font-medium"
              >
                Welcome, {session.user?.name}!
              </motion.span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Your Wedding Card Hub
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your orders, customize cards, and create unforgettable memories
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-2xl shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{totalOrders}</h3>
                <p className="text-blue-100">Total Orders</p>
              </div>
              <div className="text-6xl">📦</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-8 rounded-2xl shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{pendingOrders}</h3>
                <p className="text-yellow-100">Pending Orders</p>
              </div>
              <div className="text-6xl">⏳</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-2xl shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{cartCount}</h3>
                <p className="text-green-100">Items in Cart</p>
              </div>
              <div className="text-6xl">🛒</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">💒</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Browse Cards</h3>
              <p className="text-gray-600 mb-4">
                Explore our stunning collection of wedding card designs
              </p>
              <Link
                href="/cards"
                className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-rose-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
              >
                Browse Now
              </Link>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, rotateY: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">My Orders</h3>
              <p className="text-gray-600 mb-4">
                Track and manage your card orders and downloads
              </p>
              <Link
                href="/orders"
                className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-rose-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
              >
                View Orders
              </Link>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Shopping Cart</h3>
              <p className="text-gray-600 mb-4">
                Review items in your cart and proceed to checkout
              </p>
              <Link
                href="/cart"
                className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-rose-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
              >
                View Cart
              </Link>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, rotateY: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Customize</h3>
              <p className="text-gray-600 mb-4">
                Start customizing your perfect wedding card
              </p>
              <Link
                href="/cards"
                className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-rose-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Activity */}
        {orders.length > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 bg-white rounded-xl shadow-lg p-8"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Orders</h3>
            <div className="space-y-4">
              {orders.slice(0, 3).map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-800">Order #{order.orderId || order._id.slice(-8)}</p>
                    <p className="text-gray-600 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            {orders.length > 3 && (
              <div className="text-center mt-6">
                <Link
                  href="/orders"
                  className="text-rose-500 hover:text-rose-600 font-semibold"
                >
                  View All Orders →
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
