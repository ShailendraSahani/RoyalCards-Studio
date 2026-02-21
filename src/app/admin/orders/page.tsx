'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, Edit, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  cardDesign: {
    name: string;
    price: number;
  };
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  deliveryDate?: string;
  recipientName?: string;
  type?: string;
}

export default function AdminOrders() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || (session.user as any)?.role !== 'admin') {
      router.push('/auth/signin');
    } else {
      fetchOrders();
      const interval = setInterval(fetchOrders, 10000); // Real-time updates every 10 seconds
      return () => clearInterval(interval);
    }
  }, [session, status, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-pink-100 text-pink-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'processing': return <Clock size={16} />;
      case 'shipped': return <CheckCircle size={16} />;
      case 'delivered': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      case 'paid': return <CheckCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

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
              <h1 className="text-2xl font-bold text-pink-900">Manage Orders</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-pink-300 rounded-md bg-white"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-pink-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-500 uppercase tracking-wider">
                    Card
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-pink-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-pink-900">
                      {order._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-pink-900">{order.user.name}</div>
                      <div className="text-sm text-pink-500">{order.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-pink-900">{order.cardDesign.name}</div>
                      <div className="text-sm text-pink-500">Qty: {order.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-900">
                      ₹{order.totalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Eye size={16} />
                        </button>
                        {order.status === 'paid' && (
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="text-xs border border-pink-300 rounded px-2 py-1"
                          >
                            <option value="paid">Paid</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
                        {order.status === 'processing' && (
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="text-xs border border-pink-300 rounded px-2 py-1"
                          >
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
                        {order.status === 'shipped' && (
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="text-xs border border-pink-300 rounded px-2 py-1"
                          >
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-pink-400 hover:text-pink-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-pink-700">Order ID</label>
                  <p className="text-sm text-pink-900">{selectedOrder._id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-pink-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-1 capitalize">{selectedOrder.status}</span>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-pink-700">Customer</label>
                <p className="text-sm text-pink-900">{selectedOrder.user.name}</p>
                <p className="text-sm text-pink-500">{selectedOrder.user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-pink-700">Card Details</label>
                <p className="text-sm text-pink-900">{selectedOrder.cardDesign.name}</p>
                <p className="text-sm text-pink-500">Quantity: {selectedOrder.quantity} × ₹{selectedOrder.cardDesign.price}</p>
                <p className="text-sm font-semibold text-pink-900">Total: ₹{selectedOrder.totalPrice}</p>
              </div>

              {selectedOrder.type === 'direct' && selectedOrder.recipientName && (
                <div>
                  <label className="block text-sm font-medium text-pink-700">Recipient Details</label>
                  <p className="text-sm text-pink-900">Name: {selectedOrder.recipientName}</p>
                  {selectedOrder.deliveryDate && (
                    <p className="text-sm text-pink-500">Delivery Date: {new Date(selectedOrder.deliveryDate).toLocaleDateString()}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-pink-700">Order Date</label>
                <p className="text-sm text-pink-500">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
