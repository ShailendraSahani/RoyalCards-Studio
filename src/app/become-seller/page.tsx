'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, MapPin, FileText, Loader2, CheckCircle, XCircle, AlertCircle, Bell, Wifi, WifiOff } from 'lucide-react';
import { useSellerRealtime } from '@/hooks/useSellerRealtime';

interface SellerStatus {
  isSeller: boolean;
  sellerRequestStatus: string;
  shopName?: string;
  shopDescription?: string;
  businessAddress?: string;
  gstNumber?: string;
}

export default function BecomeSellerPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [sellerStatus, setSellerStatus] = useState<SellerStatus | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [previousStatus, setPreviousStatus] = useState<string>('none');
  const [formData, setFormData] = useState({
    shopName: '',
    shopDescription: '',
    businessAddress: '',
    gstNumber: '',
  });

  // Use seller realtime hook when user has a pending request
  const shouldUseRealtime = sellerStatus?.sellerRequestStatus === 'pending' || sellerStatus?.sellerRequestStatus === 'none';
  const { isConnected, sellerStatus: realtimeStatus, reconnect } = useSellerRealtime(shouldUseRealtime);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/become-seller');
    } else if (status === 'authenticated') {
      fetchSellerStatus();
    }
  }, [status, router]);

  // Handle realtime status updates
  useEffect(() => {
    if (realtimeStatus && realtimeStatus.status) {
      // Only show notification if status actually changed
      if (realtimeStatus.status !== previousStatus && previousStatus !== 'none') {
        if (realtimeStatus.status === 'approved') {
          setNotification({
            type: 'success',
            message: 'Congratulations! Your seller request has been approved!',
          });
          // Refresh session to update user role
          update();
        } else if (realtimeStatus.status === 'rejected') {
          setNotification({
            type: 'error',
            message: 'Your seller request was rejected. Please contact support.',
          });
        }
      }
      
      setSellerStatus({
        ...sellerStatus,
        isSeller: realtimeStatus.isSeller,
        sellerRequestStatus: realtimeStatus.status,
        shopName: realtimeStatus.shopName,
      });
      setPreviousStatus(realtimeStatus.status);
    }
  }, [realtimeStatus]);

  // Auto-dismiss notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchSellerStatus = async () => {
    try {
      const res = await fetch('/api/seller/register');
      const data = await res.json();
      setSellerStatus(data);
      setPreviousStatus(data.sellerRequestStatus || 'none');
    } catch (error) {
      console.error('Error fetching seller status:', error);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/seller/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setNotification({
          type: 'success',
          message: 'Seller request submitted! Waiting for admin approval.',
        });
        fetchSellerStatus();
      } else {
        setNotification({
          type: 'error',
          message: data.message || 'Something went wrong',
        });
      }
    } catch (error) {
      console.error('Error submitting seller request:', error);
      setNotification({
        type: 'error',
        message: 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  if (statusLoading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-yellow-50 to-pink-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
          <p className="text-pink-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-pink-50 py-12 px-4">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 ${
              notification.type === 'success' ? 'bg-green-500 text-white' :
              notification.type === 'error' ? 'bg-red-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            {notification.type === 'success' && <CheckCircle className="w-6 h-6" />}
            {notification.type === 'error' && <XCircle className="w-6 h-6" />}
            {notification.type === 'info' && <Bell className="w-6 h-6" />}
            <span className="font-medium">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-yellow-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-400 via-yellow-300 to-pink-400 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Store className="w-10 h-10 text-pink-500" />
            </motion.div>
            <h1 className="text-3xl font-bold text-pink-900">Become a Seller</h1>
            <p className="text-pink-700 mt-2">Start selling your wedding cards today</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Real-time Connection Status */}
            {sellerStatus?.sellerRequestStatus === 'pending' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 flex items-center justify-center gap-2 text-sm"
              >
                {isConnected ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <Wifi className="w-4 h-4" />
                    Live updates enabled
                  </span>
                ) : (
                  <button 
                    onClick={reconnect}
                    className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700"
                  >
                    <WifiOff className="w-4 h-4" />
                    Click to reconnect
                  </button>
                )}
              </motion.div>
            )}

            {/* Show if user already has a request */}
            {sellerStatus && sellerStatus.sellerRequestStatus && sellerStatus.sellerRequestStatus !== 'none' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mb-8 p-6 rounded-xl border-2 ${
                  sellerStatus.sellerRequestStatus === 'pending'
                    ? 'bg-yellow-50 border-yellow-300'
                    : sellerStatus.sellerRequestStatus === 'approved'
                    ? 'bg-green-50 border-green-300'
                    : 'bg-red-50 border-red-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {sellerStatus.sellerRequestStatus === 'pending' && (
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                  )}
                  {sellerStatus.sellerRequestStatus === 'approved' && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                  {sellerStatus.sellerRequestStatus === 'rejected' && (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                  <h3 className="text-xl font-bold text-pink-900">
                    Status: {sellerStatus.sellerRequestStatus.charAt(0).toUpperCase() + sellerStatus.sellerRequestStatus.slice(1)}
                  </h3>
                </div>
                {sellerStatus.sellerRequestStatus === 'pending' && (
                  <p className="text-pink-700">
                    Your seller request is pending approval. Our team will review your application soon. You will be notified in real-time when it is approved!
                  </p>
                )}
                {sellerStatus.sellerRequestStatus === 'approved' && (
                  <div className="text-green-700">
                    <p>Congratulations! You are now a seller.</p>
                    <button
                      onClick={() => router.push('/seller/dashboard')}
                      className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      Go to Seller Dashboard
                    </button>
                  </div>
                )}
                {sellerStatus.sellerRequestStatus === 'rejected' && (
                  <p className="text-red-700">
                    Your seller request was rejected. Please contact support for more information.
                  </p>
                )}
              </motion.div>
            )}

            {/* Seller Form */}
            {(!sellerStatus || sellerStatus.sellerRequestStatus === 'none' || sellerStatus.sellerRequestStatus === 'rejected') && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-pink-900 font-semibold mb-2">
                    Shop Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your shop name"
                    className="w-full px-4 py-3 border border-yellow-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-pink-900 font-semibold mb-2">
                    Shop Description
                  </label>
                  <textarea
                    name="shopDescription"
                    value={formData.shopDescription}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe your shop and products"
                    className="w-full px-4 py-3 border border-yellow-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-pink-900 font-semibold mb-2">
                    Business Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-yellow-500" />
                    <textarea
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleChange}
                      required
                      rows={3}
                      placeholder="Enter your business address"
                      className="w-full pl-10 pr-4 py-3 border border-yellow-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-pink-900 font-semibold mb-2">
                    GST Number (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-yellow-500" />
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      placeholder="Enter your GST number"
                      className="w-full pl-10 pr-4 py-3 border border-yellow-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 via-yellow-400 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Store className="w-5 h-5" />
                      Submit Seller Request
                    </>
                  )}
                </motion.button>
              </form>
            )}

            {/* Benefits Section */}
            <div className="mt-10 pt-8 border-t border-yellow-200">
              <h3 className="text-xl font-bold text-pink-900 mb-4">Why Become a Seller?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: '💰', title: 'Earn Money', desc: 'Sell your wedding cards and earn revenue' },
                  { icon: '📊', title: 'Easy Dashboard', desc: 'Manage your orders and products easily' },
                  { icon: '🚚', title: 'Fast Delivery', desc: 'We handle shipping to your customers' },
                  { icon: '💼', title: 'Low Fees', desc: 'Competitive platform fees for sellers' },
                ].map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-pink-50 rounded-xl"
                  >
                    <span className="text-2xl">{benefit.icon}</span>
                    <div>
                      <h4 className="font-semibold text-pink-900">{benefit.title}</h4>
                      <p className="text-sm text-pink-700">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
