'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Calendar, ShoppingBag, Shield, ShieldCheck, Store, Clock, Check, X, AlertCircle } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  ordersCount: number;
  isSeller: boolean;
  sellerRequestStatus: string;
  shopName: string;
  shopDescription: string;
  businessAddress: string;
  gstNumber: string;
  sellerRequestedAt: string;
}

export default function AdminUsers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending_sellers'>('all');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || (session.user as any)?.role !== 'admin') {
      router.push('/auth/signin');
    } else {
      fetchUsers();
      const interval = setInterval(fetchUsers, 15000);
      return () => clearInterval(interval);
    }
  }, [session, status, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleSellerStatus = async (userId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          sellerStatus: { status } 
        }),
      });

      if (response.ok) {
        fetchUsers();
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Error updating seller status:', error);
    }
  };

  const filteredUsers = filter === 'pending_sellers' 
    ? users.filter(u => u.sellerRequestStatus === 'pending')
    : users;

  const pendingSellersCount = users.filter(u => u.sellerRequestStatus === 'pending').length;

  if (status === 'loading' || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session || (session.user as any)?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-indigo-600 hover:text-indigo-900">← Back to Dashboard</Link>
              <h1 className="text-2xl font-bold text-pink-900">Manage Users</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === 'all' 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                }`}
              >
                All Users ({users.length})
              </button>
              <button
                onClick={() => setFilter('pending_sellers')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  filter === 'pending_sellers' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}
              >
                <Clock size={16} />
                Pending Sellers ({pendingSellersCount})
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-pink-300" />
            <h3 className="mt-2 text-lg font-medium text-pink-900">No users found</h3>
            <p className="mt-1 text-sm text-pink-500">
              {filter === 'pending_sellers' 
                ? 'No pending seller requests'
                : 'No users registered yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User size={24} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-pink-900">{user.name}</h3>
                    <div className="flex items-center space-x-1 text-sm text-pink-500">
                      <Mail size={14} />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>

                {/* Seller Status Badge */}
                {user.sellerRequestStatus === 'pending' && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-700">
                      <Clock size={16} />
                      <span className="text-sm font-medium">Seller Request Pending</span>
                    </div>
                    {user.shopName && (
                      <p className="text-sm text-yellow-600 mt-1">Shop: {user.shopName}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleSellerStatus(user._id, 'approved')}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition"
                      >
                        <Check size={14} /> Approve
                      </button>
                      <button
                        onClick={() => handleSellerStatus(user._id, 'rejected')}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                      >
                        <X size={14} /> Reject
                      </button>
                    </div>
                  </div>
                )}

                {user.isSeller && (
                  <div className="mb-4 flex items-center gap-2 text-green-600">
                    <Store size={16} />
                    <span className="text-sm font-medium">Verified Seller</span>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-pink-600">Role:</span>
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user._id, e.target.value)}
                      className="text-xs border border-pink-300 rounded px-2 py-1"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="seller">Seller</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-pink-600">Orders:</span>
                    <div className="flex items-center space-x-1">
                      <ShoppingBag size={14} className="text-pink-500" />
                      <span className="text-sm font-medium">{user.ordersCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-pink-600">Joined:</span>
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} className="text-pink-500" />
                      <span className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : user.role === 'seller'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-pink-100 text-pink-800'
                  }`}>
                    {user.role === 'admin' ? (
                      <>
                        <ShieldCheck size={12} className="mr-1" />
                        Admin
                      </>
                    ) : user.role === 'seller' ? (
                      <>
                        <Store size={12} className="mr-1" />
                        Seller
                      </>
                    ) : (
                      <>
                        <Shield size={12} className="mr-1" />
                        User
                      </>
                    )}
                  </span>
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">User Details</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-pink-400 hover:text-pink-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User size={32} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-pink-900">{selectedUser.name}</h3>
                    <p className="text-pink-500">{selectedUser.email}</p>
                  </div>
                </div>

                {/* Seller Information */}
                {selectedUser.sellerRequestStatus !== 'none' && (
                  <div className="p-4 bg-pink-50 rounded-lg">
                    <h4 className="font-semibold text-pink-900 mb-3">Seller Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-pink-600">Status:</span>
                        <span className={`font-medium ${
                          selectedUser.sellerRequestStatus === 'approved' 
                            ? 'text-green-600' 
                            : selectedUser.sellerRequestStatus === 'rejected'
                              ? 'text-red-600'
                              : 'text-yellow-600'
                        }`}>
                          {selectedUser.sellerRequestStatus === 'approved' && '✓ Approved'}
                          {selectedUser.sellerRequestStatus === 'rejected' && '✕ Rejected'}
                          {selectedUser.sellerRequestStatus === 'pending' && '⏳ Pending'}
                        </span>
                      </div>
                      {selectedUser.shopName && (
                        <div className="flex justify-between">
                          <span className="text-pink-600">Shop Name:</span>
                          <span className="text-pink-900">{selectedUser.shopName}</span>
                        </div>
                      )}
                      {selectedUser.shopDescription && (
                        <div>
                          <span className="text-pink-600">Description:</span>
                          <p className="text-pink-900 mt-1">{selectedUser.shopDescription}</p>
                        </div>
                      )}
                      {selectedUser.businessAddress && (
                        <div>
                          <span className="text-pink-600">Address:</span>
                          <p className="text-pink-900 mt-1">{selectedUser.businessAddress}</p>
                        </div>
                      )}
                      {selectedUser.gstNumber && (
                        <div className="flex justify-between">
                          <span className="text-pink-600">GST Number:</span>
                          <span className="text-pink-900 font-mono">{selectedUser.gstNumber}</span>
                        </div>
                      )}
                      {selectedUser.sellerRequestedAt && (
                        <div className="flex justify-between">
                          <span className="text-pink-600">Requested:</span>
                          <span className="text-pink-900">{new Date(selectedUser.sellerRequestedAt).toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Approve/Reject Buttons */}
                    {selectedUser.sellerRequestStatus === 'pending' && (
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleSellerStatus(selectedUser._id, 'approved')}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                          <Check size={18} /> Approve Seller
                        </button>
                        <button
                          onClick={() => handleSellerStatus(selectedUser._id, 'rejected')}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          <X size={18} /> Reject Request
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-pink-700">Role</label>
                    <select
                      value={selectedUser.role}
                      onChange={(e) => {
                        updateUserRole(selectedUser._id, e.target.value);
                        setSelectedUser({ ...selectedUser, role: e.target.value });
                      }}
                      className="mt-1 block w-full border-pink-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="seller">Seller</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-pink-700">Orders</label>
                    <p className="mt-1 text-sm text-pink-900">{selectedUser.ordersCount}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-pink-700">Joined Date</label>
                  <p className="mt-1 text-sm text-pink-500">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-pink-700">User ID</label>
                  <p className="mt-1 text-sm text-pink-500 font-mono">{selectedUser._id}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
