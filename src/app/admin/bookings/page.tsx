'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, DollarSign, Eye, Download, Share2, X, Info } from 'lucide-react';
import Link from 'next/link';

interface WeddingBooking {
  _id: string;
  orderId: string;
  groom: { fullName: string; fatherName: string; motherName: string; photoUrl?: string };
  bride: { fullName: string; fatherName: string; motherName: string; photoUrl?: string };
  wedding: { date: string; time: string; venueName: string; fullAddress: string; city: string; state: string; googleMapLink?: string };
  events: Array<{ eventName: string; eventDate: string; eventTime: string; eventVenue: string }>;
  messages: { familyInvitation: string; religiousQuote: string; specialMessage: string };
  theme: { cardTheme: string; language: string; colorTheme: string; backgroundMusic?: string };
  price: number;
  paymentStatus: string;
  status: string;
  shareSlug: string;
  pdfUrl: string;
  createdAt: string;
  userId: { name?: string; mobile?: string };
  templateId: { name: string; price: number; templateImage?: string };
  aspirant: { name: string; relation: string; contactNumber: string };
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}

export default function AdminBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [bookings, setBookings] = useState<WeddingBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<WeddingBooking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [particles] = useState(() => [...Array(30)].map((_, i) => ({
    id: i,
    left: (i * 3.33) % 100,
    top: (i * 5) % 100,
    duration: 4 + (i * 0.1),
    delay: i * 0.1,
  })));

  // Load bookings from localStorage on mount
  useEffect(() => {
    const savedBookings = localStorage.getItem('adminBookings');
    if (savedBookings) {
      try {
        const parsedBookings = JSON.parse(savedBookings);
        setBookings(parsedBookings);
        setLoading(false); // Don't show loading if we have cached data
      } catch (e) {
        // Ignore invalid data
      }
    }
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      // Clear any existing interval if session is invalid
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Only fetch if we don't have cached data or if it's been a while
    if (bookings.length === 0) {
      fetchBookings();
    }

    const interval = setInterval(fetchBookings, 30000); // Fetch every 30 seconds instead of 10
    intervalRef.current = interval;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [session, status, router]);

  const fetchBookings = async () => {
    // Don't fetch if session is invalid
    if (!session || session.user.role !== 'admin') {
      return;
    }

    console.log('Fetching bookings...');
    try {
      const response = await fetch('/api/admin/bookings');
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched data:', data);
        // Only update bookings if we got data, never clear to empty
        if (data.length > 0) {
          setBookings(data);
          // Save to localStorage for persistence
          localStorage.setItem('adminBookings', JSON.stringify(data));
        }
        setError(null); // Clear any previous errors
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch bookings' }));
        console.log('Error data:', errorData);
        setError(errorData.message || `Error: ${response.status} ${response.statusText}`);
        // Keep existing bookings on API error to prevent disappearing
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Network error: Unable to connect to server');
      // Keep existing bookings on network error to prevent disappearing
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'paid') return booking.paymentStatus === 'paid';
    if (filter === 'pending') return booking.paymentStatus === 'pending';
    if (filter === 'completed') return booking.status === 'completed';
    return true;
  });

  const stats = {
    total: bookings.length,
    paid: bookings.filter(b => b.paymentStatus === 'paid').length,
    pending: bookings.filter(b => b.paymentStatus === 'pending').length,
    revenue: bookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.price, 0),
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated Background - Pink and Yellow Theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900 via-rose-800 to-yellow-600">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-rose-500/20 to-yellow-500/20 animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-bounce delay-1000"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.1,
              }}
              style={{
                left: `${(i * 5) % 100}%`,
                top: `${(i * 7) % 100}%`,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{
            scale: { duration: 0.5, ease: "easeOut" },
            rotate: { duration: 1, repeat: Infinity, ease: 'linear' }
          }}
          className="relative z-10 w-20 h-20 border-4 border-white/30 border-t-white rounded-full shadow-2xl backdrop-blur-sm"
        />
      </div>
    );
  }

  // Show session expired message if session is invalid but we have bookings
  const showSessionExpired = (!session || session.user.role !== 'admin') && bookings.length > 0;

  if (!session || session.user.role !== 'admin') {
    if (bookings.length === 0) {
      return null;
    }
    // If we have bookings, show them with session expired message
  }

  // Show error banner if there's an error but we have existing bookings
  const showErrorBanner = error && bookings.length > 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Animated Background - Pink and Yellow Theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-900 via-rose-800 via-yellow-600 to-orange-700">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-rose-500/20 via-yellow-500/20 to-orange-500/20 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-pink-400/5 via-yellow-400/5 to-orange-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0" suppressHydrationWarning>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            animate={{
              y: [0, -120, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-xl shadow-2xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-pink-200 to-yellow-200 bg-clip-text text-transparent drop-shadow-lg">
                Admin Dashboard - Bookings
              </h1>
              <p className="text-sm text-white/80 mt-1">Manage wedding card bookings</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                href="/admin"
                className="group relative bg-gradient-to-r from-pink-600 to-yellow-500 text-white px-6 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Back to Dashboard</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Session Expired Banner */}
        {showSessionExpired && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  Your session has expired. You can still view cached bookings data, but some features may not work.
                </p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => router.push('/auth/signin')}
                  className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-md text-sm font-medium"
                >
                  Sign In Again
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Banner */}
        {showErrorBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">
                  Unable to refresh bookings data: {error}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={fetchBookings}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md text-sm font-medium"
                >
                  Retry
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-pink-600 font-medium">Total Bookings</p>
                <p className="text-2xl font-bold text-pink-700">{stats.total}</p>
              </div>
              <Calendar className="text-pink-500" size={24} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-pink-600 font-medium">Paid Orders</p>
                <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
              </div>
              <Users className="text-green-500" size={24} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-pink-600 font-medium">Pending Payment</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-pink-600 font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">₹{stats.revenue}</p>
              </div>
              <DollarSign className="text-green-500" size={24} />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 mb-6 border border-white/20"
        >
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter('all')}
              className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-xl'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 backdrop-blur-sm border border-white/20'
              }`}
            >
              <span className="relative z-10">All Bookings ({bookings.length})</span>
              {filter === 'all' && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter('paid')}
              className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
                filter === 'paid'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 backdrop-blur-sm border border-white/20'
              }`}
            >
              <span className="relative z-10">Paid ({stats.paid})</span>
              {filter === 'paid' && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter('pending')}
              className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
                filter === 'pending'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-xl'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 backdrop-blur-sm border border-white/20'
              }`}
            >
              <span className="relative z-10">Pending ({stats.pending})</span>
              {filter === 'pending' && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter('completed')}
              className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
                filter === 'completed'
                  ? 'bg-gradient-to-r from-yellow-600 to-amber-600 text-white shadow-xl'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 backdrop-blur-sm border border-white/20'
              }`}
            >
              <span className="relative z-10">Completed ({bookings.filter(b => b.status === 'completed').length})</span>
              {filter === 'completed' && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Bookings Table */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-yellow-200 bg-yellow-50">
            <h2 className="text-xl font-bold text-pink-800">Wedding Bookings</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-yellow-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-600 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-600 uppercase tracking-wider">
                    Couple
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-600 uppercase tracking-wider">
                    Wedding Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-yellow-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-yellow-100">
                {filteredBookings.map((booking) => (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-yellow-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-yellow-900">
                          {booking.orderId}
                        </div>
                        <div className="text-sm text-yellow-600">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-yellow-900 font-medium">
                        {booking.groom.fullName} & {booking.bride.fullName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-yellow-900">
                        {new Date(booking.wedding.date).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-pink-600">
                        ₹{booking.price}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : booking.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                          title="View booking details"
                          aria-label="View booking details"
                        >
                          <Info size={16} />
                          <span>Details</span>
                        </button>
                        <Link
                          href={`/invite/${booking.shareSlug}`}
                          target="_blank"
                          className="text-pink-600 hover:text-pink-900 flex items-center space-x-1"
                          title="View invitation card"
                          aria-label="View invitation card"
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </Link>
                        {booking.pdfUrl && (
                          <a
                            href={booking.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                            title="Download PDF"
                            aria-label="Download PDF"
                          >
                            <Download size={16} />
                            <span>PDF</span>
                          </a>
                        )}
                        <button
                          onClick={() => {
                            const shareUrl = `${window.location.origin}/invite/${booking.shareSlug}`;
                            navigator.clipboard.writeText(shareUrl);
                            alert('Share link copied!');
                          }}
                          className="text-yellow-600 hover:text-yellow-900 flex items-center space-x-1"
                          title="Copy share link"
                          aria-label="Copy share link to clipboard"
                        >
                          <Share2 size={16} />
                          <span>Share</span>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-pink-500">No bookings found for the selected filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden"
          >
            {/* Header - Pink and Yellow Theme */}
            <div className="bg-gradient-to-r from-pink-600 to-yellow-500 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">Booking Details</h2>
                  <p className="text-pink-100 mt-1">Order ID: {selectedBooking.orderId}</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                  title="Close"
                  aria-label="Close modal"
                >
                  <X size={28} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
              {/* Card Preview Section */}
              <div className="p-6 bg-gradient-to-br from-yellow-50 to-pink-50">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-pink-800 mb-4">Card Preview</h3>
                    {selectedBooking.templateId.templateImage ? (
                      <img
                        src={selectedBooking.templateId.templateImage}
                        alt={selectedBooking.templateId.name}
                        className="w-full max-w-md rounded-xl shadow-lg border-4 border-white"
                      />
                    ) : (
                      <div className="w-full max-w-md h-64 bg-pink-200 rounded-xl flex items-center justify-center">
                        <p className="text-pink-500">No preview available</p>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                      <h4 className="text-xl font-semibold text-pink-800 mb-4">Template Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-pink-600">Template</p>
                          <p className="font-semibold text-lg">{selectedBooking.templateId.name}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-pink-600">Theme</p>
                          <p className="font-semibold text-lg">{selectedBooking.theme.cardTheme}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-pink-600">Language</p>
                          <p className="font-semibold text-lg">{selectedBooking.theme.language}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-pink-600">Color</p>
                          <div className="flex items-center justify-center gap-2">
                            <div
                              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: selectedBooking.theme.colorTheme }}
                            ></div>
                            <span className="font-semibold">{selectedBooking.theme.colorTheme}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Information Table */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-pink-800 mb-6">Order Information</h3>
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
                    <tbody>
                      <tr className="border-b border-pink-200">
                        <td className="px-6 py-4 font-semibold bg-pink-50 w-1/3">Order ID</td>
                        <td className="px-6 py-4">{selectedBooking.orderId}</td>
                      </tr>
                      <tr className="border-b border-pink-200">
                        <td className="px-6 py-4 font-semibold bg-pink-50">Payment Status</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                            selectedBooking.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : selectedBooking.paymentStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {selectedBooking.paymentStatus}
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b border-pink-200">
                        <td className="px-6 py-4 font-semibold bg-pink-50">Amount</td>
                        <td className="px-6 py-4 text-lg font-bold text-green-600">₹{selectedBooking.price}</td>
                      </tr>
                      <tr className="border-b border-pink-200">
                        <td className="px-6 py-4 font-semibold bg-pink-50">Created Date</td>
                        <td className="px-6 py-4">{new Date(selectedBooking.createdAt).toLocaleString('en-IN')}</td>
                      </tr>
                      {selectedBooking.razorpayOrderId && (
                        <tr className="border-b border-pink-200">
                          <td className="px-6 py-4 font-semibold bg-pink-50">Razorpay Order ID</td>
                          <td className="px-6 py-4 font-mono text-sm">{selectedBooking.razorpayOrderId}</td>
                        </tr>
                      )}
                      {selectedBooking.razorpayPaymentId && (
                        <tr>
                          <td className="px-6 py-4 font-semibold bg-pink-50">Razorpay Payment ID</td>
                          <td className="px-6 py-4 font-mono text-sm">{selectedBooking.razorpayPaymentId}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Couple Details */}
              <div className="p-6 bg-pink-50">
                <h3 className="text-2xl font-bold text-pink-800 mb-6">Couple Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h4 className="text-xl font-semibold text-blue-600 mb-4 flex items-center gap-2">
                      <span className="text-2xl">👨</span> Groom Details
                    </h4>
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b border-pink-100">
                          <td className="py-2 font-medium text-pink-600">Name</td>
                          <td className="py-2">{selectedBooking.groom.fullName}</td>
                        </tr>
                        <tr className="border-b border-pink-100">
                          <td className="py-2 font-medium text-pink-600">Father</td>
                          <td className="py-2">{selectedBooking.groom.fatherName}</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium text-pink-600">Mother</td>
                          <td className="py-2">{selectedBooking.groom.motherName}</td>
                        </tr>
                      </tbody>
                    </table>
                    {selectedBooking.groom.photoUrl && (
                      <div className="mt-4">
                        <a
                          href={selectedBooking.groom.photoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        >
                          <Eye size={16} />
                          View Groom Photo
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h4 className="text-xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
                      <span className="text-2xl">👩</span> Bride Details
                    </h4>
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b border-pink-100">
                          <td className="py-2 font-medium text-pink-600">Name</td>
                          <td className="py-2">{selectedBooking.bride.fullName}</td>
                        </tr>
                        <tr className="border-b border-pink-100">
                          <td className="py-2 font-medium text-pink-600">Father</td>
                          <td className="py-2">{selectedBooking.bride.fatherName}</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium text-pink-600">Mother</td>
                          <td className="py-2">{selectedBooking.bride.motherName}</td>
                        </tr>
                      </tbody>
                    </table>
                    {selectedBooking.bride.photoUrl && (
                      <div className="mt-4">
                        <a
                          href={selectedBooking.bride.photoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-800"
                        >
                          <Eye size={16} />
                          View Bride Photo
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Wedding Details */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-pink-800 mb-6">Wedding Details</h3>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-pink-200 bg-pink-50">
                        <td className="px-6 py-4 font-semibold w-1/3">Wedding Date</td>
                        <td className="px-6 py-4">{new Date(selectedBooking.wedding.date).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</td>
                      </tr>
                      <tr className="border-b border-pink-200">
                        <td className="px-6 py-4 font-semibold bg-pink-50">Time</td>
                        <td className="px-6 py-4">{selectedBooking.wedding.time}</td>
                      </tr>
                      <tr className="border-b border-pink-200 bg-pink-50">
                        <td className="px-6 py-4 font-semibold">Venue</td>
                        <td className="px-6 py-4">{selectedBooking.wedding.venueName}</td>
                      </tr>
                      <tr className="border-b border-pink-200">
                        <td className="px-6 py-4 font-semibold bg-pink-50">Address</td>
                        <td className="px-6 py-4">{selectedBooking.wedding.fullAddress}</td>
                      </tr>
                      <tr className="border-b border-pink-200 bg-pink-50">
                        <td className="px-6 py-4 font-semibold">City & State</td>
                        <td className="px-6 py-4">{selectedBooking.wedding.city}, {selectedBooking.wedding.state}</td>
                      </tr>
                      {selectedBooking.wedding.googleMapLink && (
                        <tr>
                          <td className="px-6 py-4 font-semibold bg-pink-50">Map Link</td>
                          <td className="px-6 py-4">
                            <a
                              href={selectedBooking.wedding.googleMapLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              View on Google Maps
                            </a>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Events */}
              {selectedBooking.events.length > 0 && (
                <div className="p-6 bg-pink-50">
                  <h3 className="text-2xl font-bold text-pink-800 mb-6">Wedding Events</h3>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <table className="w-full">
                  <thead className="bg-gradient-to-r from-pink-600 to-yellow-500 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left">Event Name</th>
                      <th className="px-6 py-4 text-left">Date</th>
                      <th className="px-6 py-4 text-left">Time</th>
                      <th className="px-6 py-4 text-left">Venue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBooking.events.map((event, index) => (
                      <tr key={index} className={`border-b border-yellow-200 ${index % 2 === 0 ? 'bg-white' : 'bg-yellow-50'}`}>
                        <td className="px-6 py-4 font-semibold text-pink-600">{event.eventName}</td>
                        <td className="px-6 py-4">{new Date(event.eventDate).toLocaleDateString('en-IN')}</td>
                        <td className="px-6 py-4">{event.eventTime}</td>
                        <td className="px-6 py-4">{event.eventVenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-pink-800 mb-6">Messages & Invitations</h3>
                <div className="space-y-4">
                  {selectedBooking.messages.familyInvitation && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h4 className="text-lg font-semibold text-pink-800 mb-3">Family Invitation</h4>
                      <p className="text-pink-700 leading-relaxed bg-pink-50 p-4 rounded-lg italic whitespace-pre-wrap">
                        &ldquo;{selectedBooking.messages.familyInvitation}&rdquo;
                      </p>
                    </div>
                  )}
                  {selectedBooking.messages.religiousQuote && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h4 className="text-lg font-semibold text-pink-800 mb-3">Religious Quote</h4>
                      <p className="text-pink-700 leading-relaxed bg-pink-50 p-4 rounded-lg italic whitespace-pre-wrap">
                        &ldquo;{selectedBooking.messages.religiousQuote}&rdquo;
                      </p>
                    </div>
                  )}
                  {selectedBooking.messages.specialMessage && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h4 className="text-lg font-semibold text-pink-800 mb-3">Special Message</h4>
                      <p className="text-pink-700 leading-relaxed bg-pink-50 p-4 rounded-lg italic whitespace-pre-wrap">
                        &ldquo;{selectedBooking.messages.specialMessage}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-6 bg-pink-50">
                <h3 className="text-2xl font-bold text-pink-800 mb-6">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h4 className="text-lg font-semibold text-pink-800 mb-4">Aspirant Details</h4>
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b border-pink-100">
                          <td className="py-2 font-medium text-pink-600">Name</td>
                          <td className="py-2">{selectedBooking.aspirant.name}</td>
                        </tr>
                        <tr className="border-b border-pink-100">
                          <td className="py-2 font-medium text-pink-600">Relation</td>
                          <td className="py-2">{selectedBooking.aspirant.relation}</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium text-pink-600">Contact</td>
                          <td className="py-2 font-mono">{selectedBooking.aspirant.contactNumber}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {selectedBooking.userId && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h4 className="text-lg font-semibold text-pink-800 mb-4">User Details</h4>
                      <table className="w-full">
                        <tbody>
                          {selectedBooking.userId.name && (
                            <tr className="border-b border-pink-100">
                              <td className="py-2 font-medium text-pink-600">Name</td>
                              <td className="py-2">{selectedBooking.userId.name}</td>
                            </tr>
                          )}
                          {selectedBooking.userId.mobile && (
                            <tr>
                              <td className="py-2 font-medium text-pink-600">Mobile</td>
                              <td className="py-2 font-mono">{selectedBooking.userId.mobile}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
