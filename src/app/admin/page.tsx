'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users,
  CreditCard,
  Heart,
  TrendingUp,
  Calendar,
  DollarSign,
  Eye,
  Download,
  Share2,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Crown,
  Store
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  pendingPayments: number;
  todayBookings: number;
  activeCards: number;
}

interface RecentBooking {
  _id: string;
  orderId: string;
  groom: { fullName: string };
  bride: { fullName: string };
  paymentStatus: string;
  createdAt: string;
  price: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    todayBookings: 0,
    activeCards: 0,
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [chartData, setChartData] = useState({
    bookingsOverTime: [],
    revenueOverTime: [],
    paymentStatus: [],
    usersOverTime: [],
    weeklyBookings: []
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      router.push('/auth/signin');
      return;
    }
    fetchDashboardData();

    // Set up Server-Sent Events for real-time updates
    const eventSource = new EventSource('/api/admin/realtime');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'update') {
        console.log('Real-time update:', data);
        // Refresh data when any relevant collection changes
        fetchDashboardData();
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      // Fallback to polling if SSE fails
      const interval = setInterval(fetchDashboardData, 30000);
      return () => clearInterval(interval);
    };

    return () => {
      eventSource.close();
    };
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, bookingsRes, chartRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/recent-bookings'),
        fetch('/api/admin/chart-data'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setRecentBookings(bookingsData);
      }

      if (chartRes.ok) {
        const chartData = await chartRes.json();
        setChartData(chartData);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings.toString(),
      icon: Heart,
      color: 'from-pink-500 to-rose-600',
      bgColor: 'from-pink-50 to-rose-50',
      textColor: 'text-pink-600',
    },
    {
      title: 'Active Users',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Today\'s Orders',
      value: stats.todayBookings.toString(),
      icon: Calendar,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Pending Payments',
      value: stats.pendingPayments.toString(),
      icon: Clock,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'from-yellow-50 to-orange-50',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Active Cards',
      value: stats.activeCards.toString(),
      icon: Crown,
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'from-indigo-50 to-purple-50',
      textColor: 'text-indigo-600',
    },
  ];

const quickActions = [
    {
      title: 'Manage Cards',
      description: 'Add, update, or delete card designs',
      icon: Crown,
      href: '/admin/cards',
      color: 'bg-gradient-to-r from-indigo-500 to-purple-600',
      stats: `${stats.activeCards} active`,
    },
    {
      title: 'View Bookings',
      description: 'Monitor all wedding bookings',
      icon: Heart,
      href: '/admin/bookings',
      color: 'bg-gradient-to-r from-pink-500 to-rose-600',
      stats: `${stats.totalBookings} total`,
    },
    {
      title: 'Manage Orders',
      description: 'Handle order status and payments',
      icon: CreditCard,
      href: '/admin/orders',
      color: 'bg-gradient-to-r from-green-500 to-emerald-600',
      stats: `${stats.pendingPayments} pending`,
    },
    {
      title: 'User Management',
      description: 'View and manage user accounts',
      icon: Users,
      href: '/admin/users',
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      stats: `${stats.totalUsers} users`,
    },
    {
      title: 'Seller Management',
      description: 'Manage sellers and approve requests',
      icon: Store,
      href: '/admin/sellers',
      color: 'bg-gradient-to-r from-yellow-500 to-orange-600',
      stats: 'View sellers',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Crown className="text-white" size={24} />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-pink-600 flex items-center">
                  <Activity size={14} className="mr-1" />
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-pink-600">Welcome back,</p>
                <p className="font-semibold text-pink-900">{session.user?.name}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/api/auth/signout')}
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all shadow-lg"
              >
                Sign Out
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-r ${stat.bgColor} p-6 rounded-2xl shadow-lg border border-white/20 backdrop-blur-sm`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-pink-600 mb-1">{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                  <stat.icon className="text-white" size={24} />
                </div>
              </div>
              <div className={`mt-4 h-1 bg-gradient-to-r ${stat.color} rounded-full`}></div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <h2 className="text-2xl font-bold text-pink-800 mb-6 flex items-center">
              <BarChart3 className="mr-3 text-indigo-600" size={28} />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${action.color} shadow-lg`}>
                      <action.icon className="text-white" size={24} />
                    </div>
                    <span className="text-sm font-medium text-pink-500 bg-pink-100 px-2 py-1 rounded-full">
                      {action.stats}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-pink-800 mb-2">{action.title}</h3>
                  <p className="text-pink-600 mb-4">{action.description}</p>
                  <Link
                    href={action.href}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    Manage →
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-2xl font-bold text-pink-800 mb-6 flex items-center">
              <Activity className="mr-3 text-green-600" size={28} />
              Recent Bookings
            </h2>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recentBookings.length > 0 ? (
                  recentBookings.slice(0, 5).map((booking, index) => (
                    <motion.div
                      key={booking._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-pink-100"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-pink-800 text-sm">
                          {booking.groom.fullName} & {booking.bride.fullName}
                        </p>
                        <p className="text-xs text-pink-500">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.paymentStatus}
                        </span>
                        <span className="text-sm font-bold text-indigo-600">
                          ₹{booking.price}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Heart className="mx-auto text-pink-400 mb-2" size={32} />
                    <p className="text-pink-500">No recent bookings</p>
                  </div>
                )}
              </div>

              {recentBookings.length > 0 && (
                <div className="mt-4 pt-4 border-t border-pink-200">
                  <Link
                    href="/admin/bookings"
                    className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center"
                  >
                    View all bookings →
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Bookings Over Time */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-pink-800 mb-6 flex items-center">
              <TrendingUp className="mr-3 text-blue-600" size={24} />
              Bookings Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData.bookingsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="bookings" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Over Time */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-pink-800 mb-6 flex items-center">
              <DollarSign className="mr-3 text-green-600" size={24} />
              Revenue Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.revenueOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Status Distribution */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-pink-800 mb-6 flex items-center">
              <CreditCard className="mr-3 text-purple-600" size={24} />
              Payment Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.paymentStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => percent ? `${name} ${(percent * 100).toFixed(0)}%` : name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.paymentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#10b981', '#f59e0b', '#ef4444'][index % 3]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Bookings */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-pink-800 mb-6 flex items-center">
              <Calendar className="mr-3 text-indigo-600" size={24} />
              Weekly Bookings
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.weeklyBookings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
        >
          <h2 className="text-2xl font-bold text-pink-800 mb-6 flex items-center">
            <CheckCircle className="mr-3 text-green-600" size={28} />
            System Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-semibold text-pink-800">Database</p>
                <p className="text-sm text-pink-600">Connected & Healthy</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-semibold text-pink-800">Payment Gateway</p>
                <p className="text-sm text-pink-600">Razorpay Active</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-semibold text-pink-800">Real-time Updates</p>
                <p className="text-sm text-pink-600">Live (Server-Sent Events)</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
