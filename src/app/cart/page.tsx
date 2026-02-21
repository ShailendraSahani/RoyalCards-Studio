'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { useRealtime } from '@/hooks/useRealtime';

interface CartItem {
  _id: string;
  customization: {
    _id: string;
    cardDesign: {
      name: string;
      price: number;
    };
    previewImage: string;
  };
  quantity: number;
  totalPrice: number;
}

export default function Cart() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Use realtime hook for real-time updates
  const { isConnected, lastMessage } = useRealtime({
    endpoint: '/api/realtime',
    enabled: !!session,
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/auth/signin');
  }, [session, status, router]);

  // Listen for real-time updates (cart changes)
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'update' && 
        (lastMessage.collection === 'carts' || lastMessage.collection === 'customizations')) {
      console.log('Real-time cart update:', lastMessage);
      fetchCart();
    }
  }, [lastMessage]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdating(itemId);
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        fetchCart(); // Refresh cart
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCart(); // Refresh cart
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const proceedToCheckout = () => {
    router.push('/checkout');
  };

  if (status === 'loading' || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-pink-900">Shopping Cart</h1>
            <div className="flex items-center space-x-4">
              {/* Real-time connection indicator */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-xs text-pink-600">{isConnected ? 'Live' : 'Offline'}</span>
              </div>
              <Link
                href="/dashboard"
                className="text-indigo-600 hover:text-indigo-900"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-pink-500 text-lg mb-4">Your cart is empty.</p>
            <Link
              href="/cards"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
            >
              Browse Cards
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-pink-900 mb-4">Cart Items</h2>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex items-center space-x-4 border-b pb-4">
                        <img
                          src={item.customization.previewImage}
                          alt="Card Preview"
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-pink-900">
                            {item.customization.cardDesign.name}
                          </h3>
                          <p className="text-pink-700">₹{item.customization.cardDesign.price} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={updating === item._id}
                            className="px-2 py-1 border border-pink-300 rounded-md hover:bg-pink-50 disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 border border-pink-300 rounded-md">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            disabled={updating === item._id}
                            className="px-2 py-1 border border-pink-300 rounded-md hover:bg-pink-50 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-pink-900">
                            ₹{item.totalPrice}
                          </p>
                          <button
                            onClick={() => removeItem(item._id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-pink-900 mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="text-pink-900">₹{getTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-pink-900">₹50</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-pink-900">₹{getTotalPrice() + 50}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={proceedToCheckout}
                  className="w-full mt-6 bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 font-medium"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
