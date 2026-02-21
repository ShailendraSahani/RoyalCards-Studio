'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Booking {
  _id: string;
  templateId: string;
  userId: string;
  aspirant: {
    name: string;
    relation: string;
    hostMessage: string;
    contactNumber: string;
  };
  groom: {
    fullName: string;
    fatherName: string;
    motherName: string;
    surname: string;
    photoUrl: string;
    education: string;
    profession: string;
  };
  bride: {
    fullName: string;
    fatherName: string;
    motherName: string;
    surname: string;
    photoUrl: string;
    education: string;
    profession: string;
  };
  wedding: {
    date: Date;
    time: string;
    venueName: string;
    fullAddress: string;
    city: string;
    state: string;
    googleMapLink: string;
    venueImage: string;
    weddingType: string;
  };
  events: Array<{
    eventName: string;
    eventDate: Date;
    eventTime: string;
    eventVenue: string;
  }>;
  messages: {
    familyInvitation: string;
    religiousQuote: string;
    specialMessage: string;
  };
  theme: {
    cardTheme: string;
    language: string;
    colorTheme: string;
    fontStyle: string;
    backgroundMusic: string;
  };
  contactDetails: {
    contactPersonName: string;
    mobileNumber: string;
    whatsappNumber: string;
  };
  privacySettings: {
    isPublic: boolean;
    password: string;
    expiryDate: Date | null;
  };
  price: number;
  paymentStatus: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  orderId: string;
  pdfUrl: string;
  shareSlug: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CardDesign {
  _id: string;
  name: string;
  price: number;
}

declare global {
  interface Window {
    Razorpay: new (options: any) => {
      open: () => void;
    };
  }
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [card, setCard] = useState<CardDesign | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchBookingDetails();
  }, [session, status, router, bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`);
      if (response.ok) {
        const bookingData = await response.json();
        setBooking(bookingData);

        // Fetch card details
        const cardResponse = await fetch(`/api/cards/${bookingData.templateId}`);
        if (cardResponse.ok) {
          const cardData = await cardResponse.json();
          setCard(cardData);
        }
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!booking || !card) return;

    setProcessing(true);

    try {
      // Create Razorpay order
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking._id,
          amount: booking.price,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order');
      }

      const orderData = await orderResponse.json();

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_your_key_here',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Card Booking',
        description: `Card - ${booking.aspirant.name}`,
        order_id: orderData.id,
        handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          // Verify payment
          const verifyResponse = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id,
            }),
          });

          if (verifyResponse.ok) {
            // Redirect to confirmation page
            router.push(`/confirmation/${booking._id}`);
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          contact: booking.aspirant?.contactNumber || '',
        },
        theme: {
          color: '#D4AF37',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

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

  if (!session || !booking || !card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-pink-800 mb-4">Booking Not Found</h2>
          <Link
            href="/cards"
            className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600"
          >
            Browse Cards
          </Link>
        </div>
      </div>
    );
  }

  if (booking.status === 'paid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-pink-800 mb-4">Already Paid</h2>
          <p className="text-pink-600 mb-6">This booking has already been paid for.</p>
          <Link
            href={`/confirmation/${booking._id}`}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            View Confirmation
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link
              href={`/preview/${booking._id}`}
              className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-2"
            >
              <ArrowLeft size={20} />
              <span>Back to Preview</span>
            </Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              Complete Payment
            </h1>
            <div></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-pink-800 mb-6 flex items-center">
              <CreditCard className="mr-3 text-indigo-600" size={24} />
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-pink-200">
                <div>
                  <h3 className="font-semibold text-pink-800">
                    {booking.aspirant.name}
                  </h3>
                  <p className="text-sm text-pink-600">Card</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-indigo-600">₹{booking.price}</p>
                  <p className="text-sm text-pink-500">Template: {card.name}</p>
                </div>
              </div>

              <div className="bg-pink-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-pink-800">Total Amount</span>
                  <span className="text-2xl font-bold text-green-600">₹{booking.price}</span>
                </div>
                <p className="text-xs text-pink-500 mt-1">Inclusive of all taxes</p>
              </div>
            </div>

            {/* Order Details */}
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-pink-600">Order ID:</span>
                <span className="font-mono text-pink-800">{booking.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-pink-600">Template:</span>
                <span className="text-pink-800">{card.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-pink-600">Status:</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                  {booking.status}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Payment Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-pink-800 mb-6 flex items-center">
              <Shield className="mr-3 text-green-600" size={24} />
              Secure Payment
            </h2>

            <div className="space-y-6">
              {/* Payment Methods */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <h3 className="font-semibold text-pink-800 mb-2">Accepted Payment Methods</h3>
                <div className="flex items-center space-x-4 text-sm text-pink-600">
                  <span>💳 Credit/Debit Cards</span>
                  <span>🏦 Net Banking</span>
                  <span>📱 UPI</span>
                  <span>📞 Wallets</span>
                </div>
              </div>

              {/* Security Features */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-pink-600">
                  <Shield size={16} className="text-green-600" />
                  <span>SSL Encrypted Payment</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-pink-600">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Secure Razorpay Gateway</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-pink-600">
                  <CheckCircle size={16} className="text-green-600" />
                  <span>Instant Payment Confirmation</span>
                </div>
              </div>

              {/* Pay Now Button */}
              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    <span>Pay ₹{booking.price} Now</span>
                  </>
                )}
              </button>

              {/* Terms */}
              <p className="text-xs text-pink-500 text-center">
                By proceeding with payment, you agree to our terms and conditions.
                All payments are processed securely through Razorpay.
              </p>
            </div>
          </motion.div>
        </div>

        {/* What You Get */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-white rounded-2xl shadow-xl p-8"
        >
          <h3 className="text-2xl font-bold text-pink-800 mb-6 text-center">What You Get</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">📄</div>
              <h4 className="font-semibold text-pink-800 mb-2">High-Quality PDF</h4>
              <p className="text-sm text-pink-600">Professional PDF card ready for printing</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🌐</div>
              <h4 className="font-semibold text-pink-800 mb-2">Shareable Link</h4>
              <p className="text-sm text-pink-600">Public link to share your card online</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎨</div>
              <h4 className="font-semibold text-pink-800 mb-2">Custom Design</h4>
              <p className="text-sm text-pink-600">Beautifully designed card with your personal details</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
