'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Store, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Loader2,
  Plus,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Settings
} from 'lucide-react';

interface SellerStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  templateImage: string;
  isActive: boolean;
  createdAt: string;
}

interface Order {
  _id: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export default function SellerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SellerStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/seller/dashboard');
    } else if (status === 'authenticated') {
      // Check if user is a seller
      const userRole = (session.user as any)?.role;
      const isSeller = (session.user as any)?.isSeller;
      
      if (userRole !== 'seller' && !isSeller) {
        router.push('/become-seller');
      } else {
        fetchDashboardData();
      }
    }
  }, [status, session, router]);

  const fetchDashboardData = async () => {
    try {
      // Fetch seller stats
      const statsRes = await fetch('/api/seller/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch seller products
      const productsRes = await fetch('/api/seller/products');
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      }

      // Fetch seller orders
      const ordersRes = await fetch('/api/seller/orders');
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-yellow-50 to-pink-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
          <p className="text-pink-700 font-medium">Loading seller dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const sellerInfo = {
    shopName: (session.user as any)?.shopName || 'My Shop',
    name: session.user?.name || 'Seller',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-pink-900">{sellerInfo.shopName}</h1>
                <p className="text-pink-600">Welcome back, {sellerInfo.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/seller/products/add"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white rounded-lg hover:shadow-lg transition"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </Link>
              <Link
                href="/become-seller"
                className="flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition"
              >
                <Settings className="w-5 h-5" />
                Shop Settings
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'overview'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-pink-700 hover:bg-pink-100'
            }`}
          >
            <BarChart3 className="w-5 h-5 inline-block mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'products'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-pink-700 hover:bg-pink-100'
            }`}
          >
            <Package className="w-5 h-5 inline-block mr-2" />
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'orders'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-pink-700 hover:bg-pink-100'
            }`}
          >
            <ShoppingCart className="w-5 h-5 inline-block mr-2" />
            Orders
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-pink-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-600 text-sm">Total Products</p>
                    <p className="text-3xl font-bold text-pink-900">{stats.totalProducts}</p>
                  </div>
                  <Package className="w-10 h-10 text-pink-400" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-600 text-sm">Total Orders</p>
                    <p className="text-3xl font-bold text-pink-900">{stats.totalOrders}</p>
                  </div>
                  <ShoppingCart className="w-10 h-10 text-yellow-400" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-600 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-pink-900">₹{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-10 h-10 text-green-400" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-600 text-sm">Pending Orders</p>
                    <p className="text-3xl font-bold text-pink-900">{stats.pendingOrders}</p>
                  </div>
                  <Clock className="w-10 h-10 text-orange-400" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-pink-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/seller/products/add"
                  className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition"
                >
                  <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-pink-900">Add New Product</p>
                    <p className="text-sm text-pink-600">Create a new card design</p>
                  </div>
                </Link>

                <Link
                  href="/seller/orders"
                  className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition"
                >
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-pink-900">View Orders</p>
                    <p className="text-sm text-pink-600">Manage pending orders</p>
                  </div>
                </Link>

                <Link
                  href="/become-seller"
                  className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-pink-900">Shop Settings</p>
                    <p className="text-sm text-pink-600">Update your shop details</p>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-pink-900">My Products</h3>
                <Link
                  href="/seller/products/add"
                  className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                >
                  <Plus className="w-5 h-5" />
                  Add Product
                </Link>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-pink-900 mb-2">No products yet</h4>
                  <p className="text-pink-600 mb-4">Start adding your wedding card designs</p>
                  <Link
                    href="/seller/products/add"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                  >
                    <Plus className="w-5 h-5" />
                    Add Your First Product
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="border border-pink-100 rounded-xl overflow-hidden hover:shadow-lg transition">
                      <div className="h-48 bg-pink-100 relative">
                        {product.templateImage ? (
                          <img src={product.templateImage} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-12 h-12 text-pink-300" />
                          </div>
                        )}
                        <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                          product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-pink-900 mb-1">{product.name}</h4>
                        <p className="text-pink-600 font-bold">₹{product.price}</p>
                        <div className="flex gap-2 mt-3">
                          <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition text-sm">
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition text-sm">
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-pink-900 mb-6">My Orders</h3>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-pink-900 mb-2">No orders yet</h4>
                  <p className="text-pink-600">Orders for your products will appear here</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-pink-100">
                        <th className="text-left py-3 px-4 text-pink-700 font-semibold">Order ID</th>
                        <th className="text-left py-3 px-4 text-pink-700 font-semibold">Customer</th>
                        <th className="text-left py-3 px-4 text-pink-700 font-semibold">Amount</th>
                        <th className="text-left py-3 px-4 text-pink-700 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 text-pink-700 font-semibold">Date</th>
                        <th className="text-left py-3 px-4 text-pink-700 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} className="border-b border-pink-50 hover:bg-pink-50">
                          <td className="py-3 px-4">
                            <span className="font-mono text-sm text-pink-900">#{order._id.slice(-8)}</span>
                          </td>
                          <td className="py-3 px-4 text-pink-900">{order.customerName}</td>
                          <td className="py-3 px-4 font-bold text-pink-900">₹{order.total}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              order.status === 'completed' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-pink-600 text-sm">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <button className="text-pink-600 hover:text-pink-900">
                              <Eye className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
