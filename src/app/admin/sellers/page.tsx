'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, 
  Users, 
  DollarSign, 
  Package, 
  TrendingUp,
  Clock,
  Check,
  X,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  ShoppingCart,
  BarChart3,
  AlertCircle,
  Shield,
  ShieldCheck,
  Crown
} from 'lucide-react';

interface SellerStats {
  totalCards: number;
  activeCards: number;
  totalOrders: number;
  totalRevenue: number;
}

interface Seller {
  _id: string;
  name: string;
  email: string;
  role: string;
  isSeller: boolean;
  sellerRequestStatus: string;
  shopName: string;
  shopDescription: string;
  businessAddress: string;
  gstNumber: string;
  sellerRequestedAt: string;
  createdAt: string;
  stats: SellerStats;
}

export default function AdminSellers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || (session.user as any)?.role !== 'admin') {
      router.push('/auth/signin');
    } else {
      fetchSellers();
    }
  }, [session, status, router]);

  const fetchSellers = async () => {
    try {
      const response = await fetch(`/api/admin/sellers?filter=${filter}`);
      if (response.ok) {
        const data = await response.json();
        setSellers(data);
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [filter]);

  const handleSellerAction = async (userId: string, action: string, status?: string) => {
    setActionLoading(userId);
    try {
      const response = await fetch('/api/admin/sellers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          action,
          sellerStatus: status ? { status } : undefined
        }),
      });

      if (response.ok) {
        fetchSellers();
        setSelectedSeller(null);
      }
    } catch (error) {
      console.error('Error updating seller:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredSellers = sellers.filter(seller => 
    seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.shopName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = sellers.filter(s => s.sellerRequestStatus === 'pending').length;
  const approvedCount = sellers.filter(s => s.sellerRequestStatus === 'approved' || s.isSeller).length;

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-indigo-600 font-medium">Loading sellers...</p>
        </div>
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-indigo-600 hover:text-indigo-900 flex items-center">
                ← Back
              </Link>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Store className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Seller Management
                </h1>
                <p className="text-sm text-pink-600">Manage seller accounts and requests</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-pink-600">Welcome back,</p>
                <p className="font-semibold text-pink-900">{session.user?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600 mb-1">Total Sellers</p>
                <p className="text-3xl font-bold text-pink-900">{sellers.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                <Store className="text-white" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600 mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                <ShieldCheck className="text-white" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600 mb-1">Pending Requests</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 shadow-lg">
                <Clock className="text-white" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-indigo-600">
                  ₹{sellers.reduce((sum, s) => sum + (s.stats?.totalRevenue || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
                <DollarSign className="text-white" size={24} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'all'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                }`}
              >
                All Sellers ({sellers.length})
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'approved'
                    ? 'bg-green-500 text-white'
                    : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                }`}
              >
                Approved ({approvedCount})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  filter === 'pending'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                }`}
              >
                <Clock size={16} />
                Pending ({pendingCount})
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
              <input
                type="text"
                placeholder="Search sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Sellers Grid */}
        {filteredSellers.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <Store className="mx-auto h-16 w-16 text-pink-300 mb-4" />
            <h3 className="text-xl font-semibold text-pink-900 mb-2">No sellers found</h3>
            <p className="text-pink-600">
              {filter === 'pending' 
                ? 'No pending seller requests'
                : 'No sellers registered yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSellers.map((seller) => (
              <motion.div
                key={seller._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
              >
                {/* Seller Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Store className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{seller.shopName || 'Unnamed Shop'}</h3>
                        <p className="text-sm text-white/80">{seller.name}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      seller.sellerRequestStatus === 'approved' || seller.isSeller
                        ? 'bg-green-100 text-green-700'
                        : seller.sellerRequestStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {seller.sellerRequestStatus === 'approved' || seller.isSeller ? 'Active' : 
                       seller.sellerRequestStatus === 'pending' ? 'Pending' : 'Rejected'}
                    </span>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="p-4">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm">
                      <span className="text-pink-500 w-8">Email:</span>
                      <span className="text-pink-900">{seller.email}</span>
                    </div>
                    {seller.stats && (
                      <>
                        <div className="flex items-center text-sm">
                          <Package className="text-pink-500 w-4 h-4 mr-2" />
                          <span className="text-pink-600">Cards:</span>
                          <span className="text-pink-900 font-medium ml-2">{seller.stats.totalCards}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <ShoppingCart className="text-pink-500 w-4 h-4 mr-2" />
                          <span className="text-pink-600">Orders:</span>
                          <span className="text-pink-900 font-medium ml-2">{seller.stats.totalOrders}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <DollarSign className="text-pink-500 w-4 h-4 mr-2" />
                          <span className="text-pink-600">Revenue:</span>
                          <span className="text-pink-900 font-medium ml-2">₹{seller.stats.totalRevenue.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedSeller(seller)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition text-sm"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    {seller.sellerRequestStatus === 'pending' && (
                      <>
                        <button
                          onClick={() => handleSellerAction(seller._id, 'approve')}
                          disabled={actionLoading === seller._id}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm disabled:opacity-50"
                        >
                          <Check size={16} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleSellerAction(seller._id, 'reject')}
                          disabled={actionLoading === seller._id}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm disabled:opacity-50"
                        >
                          <X size={16} />
                          Reject
                        </button>
                      </>
                    )}
                    {(seller.sellerRequestStatus === 'approved' || seller.isSeller) && (
                      <button
                        onClick={() => handleSellerAction(seller._id, 'disable')}
                        disabled={actionLoading === seller._id}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm disabled:opacity-50"
                      >
                        <X size={16} />
                        Disable
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Seller Details Modal */}
      <AnimatePresence>
        {selectedSeller && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedSeller(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Store className="text-white" size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-pink-900">{selectedSeller.shopName || 'Unnamed Shop'}</h2>
                    <p className="text-pink-600">{selectedSeller.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSeller(null)}
                  className="text-pink-400 hover:text-pink-600"
                >
                  ✕
                </button>
              </div>

              {/* Status Badge */}
              <div className={`mb-6 p-4 rounded-xl ${
                selectedSeller.sellerRequestStatus === 'approved' || selectedSeller.isSeller
                  ? 'bg-green-50 border border-green-200'
                  : selectedSeller.sellerRequestStatus === 'pending'
                  ? 'bg-yellow-50 border border-yellow-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {(selectedSeller.sellerRequestStatus === 'approved' || selectedSeller.isSeller) && (
                      <Check className="text-green-600" />
                    )}
                    {selectedSeller.sellerRequestStatus === 'pending' && (
                      <Clock className="text-yellow-600" />
                    )}
                    {selectedSeller.sellerRequestStatus === 'rejected' && (
                      <X className="text-red-600" />
                    )}
                    <span className={`font-semibold ${
                      selectedSeller.sellerRequestStatus === 'approved' || selectedSeller.isSeller
                        ? 'text-green-700'
                        : selectedSeller.sellerRequestStatus === 'pending'
                        ? 'text-yellow-700'
                        : 'text-red-700'
                    }`}>
                      {selectedSeller.sellerRequestStatus === 'approved' || selectedSeller.isSeller ? 'Approved Seller' : 
                       selectedSeller.sellerRequestStatus === 'pending' ? 'Pending Approval' : 'Rejected'}
                    </span>
                  </div>
                  <span className="text-sm text-pink-600">
                    Joined: {new Date(selectedSeller.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-pink-50 rounded-xl p-4 text-center">
                  <Package className="mx-auto text-pink-600 mb-2" size={24} />
                  <p className="text-2xl font-bold text-pink-900">{selectedSeller.stats?.totalCards || 0}</p>
                  <p className="text-sm text-pink-600">Total Cards</p>
                </div>
                <div className="bg-pink-50 rounded-xl p-4 text-center">
                  <BarChart3 className="mx-auto text-pink-600 mb-2" size={24} />
                  <p className="text-2xl font-bold text-pink-900">{selectedSeller.stats?.activeCards || 0}</p>
                  <p className="text-sm text-pink-600">Active Cards</p>
                </div>
                <div className="bg-pink-50 rounded-xl p-4 text-center">
                  <ShoppingCart className="mx-auto text-pink-600 mb-2" size={24} />
                  <p className="text-2xl font-bold text-pink-900">{selectedSeller.stats?.totalOrders || 0}</p>
                  <p className="text-sm text-pink-600">Total Orders</p>
                </div>
                <div className="bg-pink-50 rounded-xl p-4 text-center">
                  <DollarSign className="mx-auto text-pink-600 mb-2" size={24} />
                  <p className="text-2xl font-bold text-pink-900">₹{(selectedSeller.stats?.totalRevenue || 0).toLocaleString()}</p>
                  <p className="text-sm text-pink-600">Revenue</p>
                </div>
              </div>

              {/* Seller Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-pink-700">Email</label>
                  <p className="text-pink-900">{selectedSeller.email}</p>
                </div>
                {selectedSeller.shopDescription && (
                  <div>
                    <label className="block text-sm font-medium text-pink-700">Shop Description</label>
                    <p className="text-pink-900">{selectedSeller.shopDescription}</p>
                  </div>
                )}
                {selectedSeller.businessAddress && (
                  <div>
                    <label className="block text-sm font-medium text-pink-700">Business Address</label>
                    <p className="text-pink-900">{selectedSeller.businessAddress}</p>
                  </div>
                )}
                {selectedSeller.gstNumber && (
                  <div>
                    <label className="block text-sm font-medium text-pink-700">GST Number</label>
                    <p className="text-pink-900 font-mono">{selectedSeller.gstNumber}</p>
                  </div>
                )}
                {selectedSeller.sellerRequestedAt && (
                  <div>
                    <label className="block text-sm font-medium text-pink-700">Seller Requested At</label>
                    <p className="text-pink-900">{new Date(selectedSeller.sellerRequestedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {selectedSeller.sellerRequestStatus === 'pending' && (
                  <>
                    <button
                      onClick={() => handleSellerAction(selectedSeller._id, 'approve')}
                      disabled={actionLoading === selectedSeller._id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition disabled:opacity-50"
                    >
                      <Check size={20} />
                      Approve Seller
                    </button>
                    <button
                      onClick={() => handleSellerAction(selectedSeller._id, 'reject')}
                      disabled={actionLoading === selectedSeller._id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition disabled:opacity-50"
                    >
                      <X size={20} />
                      Reject Request
                    </button>
                  </>
                )}
                {(selectedSeller.sellerRequestStatus === 'approved' || selectedSeller.isSeller) && (
                  <button
                    onClick={() => handleSellerAction(selectedSeller._id, 'disable')}
                    disabled={actionLoading === selectedSeller._id}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition disabled:opacity-50"
                  >
                    <X size={20} />
                    Disable Seller
                  </button>
                )}
                {selectedSeller.sellerRequestStatus === 'rejected' && (
                  <button
                    onClick={() => handleSellerAction(selectedSeller._id, 'enable')}
                    disabled={actionLoading === selectedSeller._id}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition disabled:opacity-50"
                  >
                    <Check size={20} />
                    Enable Seller
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
