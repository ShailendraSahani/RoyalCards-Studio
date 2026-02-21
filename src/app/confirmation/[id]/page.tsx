'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Share2, Home, Eye } from 'lucide-react';
import Link from 'next/link';
import CardPreview from '@/components/CardPreview';

interface Booking {
  _id: string;
  templateId: string;
  orderId: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  quantity: number;
  deliveryDate: string;
  message: string;
  specialInstructions: string;
  price: number;
  status: string;
  pdfUrl: string;
  shareSlug: string;
}

interface CardDesign {
  _id: string;
  name: string;
  description: string;
  category: string;
  templateImage: string;
  price: number;
}

export default function ConfirmationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [card, setCard] = useState<CardDesign | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);

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

  const generatePDF = async () => {
    if (!booking) return;

    setGeneratingPDF(true);
    try {
      const response = await fetch(`/api/bookings/${booking._id}/pdf`, {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();
        // Refresh booking data to get updated PDF URL
        fetchBookingDetails();
        alert('PDF generated successfully!');
      } else {
        alert('Error generating PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const shareCard = async () => {
    if (!booking) return;

    const shareUrl = `${window.location.origin}/invite/${booking.shareSlug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Card for ${booking.recipientName}`,
          text: 'Check out this card!',
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-lg shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block"
            >
              <CheckCircle size={80} className="text-green-600 mx-auto mb-4" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2"
            >
              Payment Successful!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-pink-600"
            >
              Your card has been created successfully
            </motion.p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <CardPreview booking={booking} card={card} />
          </motion.div>

          {/* Booking Details & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            className="space-y-6"
          >
            {/* Booking Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-pink-800 mb-6">Booking Details</h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-pink-100">
                  <span className="text-pink-600">Order ID</span>
                  <span className="font-mono font-semibold text-pink-800">{booking.orderId}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-pink-100">
                  <span className="text-pink-600">Recipient</span>
                  <span className="font-semibold text-pink-800">{booking.recipientName}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-pink-100">
                  <span className="text-pink-600">Quantity</span>
                  <span className="font-semibold text-pink-800">{booking.quantity}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-pink-100">
                  <span className="text-pink-600">Delivery Date</span>
                  <span className="font-semibold text-pink-800">
                    {new Date(booking.deliveryDate).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-pink-100">
                  <span className="text-pink-600">Template</span>
                  <span className="font-semibold text-pink-800">{card.name}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-pink-100">
                  <span className="text-pink-600">Amount Paid</span>
                  <span className="font-bold text-green-600 text-lg">₹{booking.price}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-pink-600">Status</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-pink-800 mb-6">Your Card</h3>

              <div className="space-y-4">
                {booking.pdfUrl ? (
                  <a
                    href={booking.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                  >
                    <Download size={20} />
                    <span>Download PDF</span>
                  </a>
                ) : (
                  <button
                    onClick={generatePDF}
                    disabled={generatingPDF}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {generatingPDF ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download size={20} />
                        <span>Generate PDF</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={shareCard}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2"
                >
                  <Share2 size={20} />
                  <span>Share Invitation</span>
                </button>

                <Link
                  href={`/invite/${booking.shareSlug}`}
                  target="_blank"
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center space-x-2 block text-center"
                >
                  <Eye size={20} />
                  <span>View Public Page</span>
                </Link>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex space-x-4">
              <Link
                href="/dashboard"
                className="flex-1 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 flex items-center justify-center space-x-2"
              >
                <Home size={20} />
                <span>Go to Dashboard</span>
              </Link>

              <Link
                href="/cards"
                className="flex-1 bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 flex items-center justify-center space-x-2"
              >
                <span>Create Another Card</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-12 bg-white rounded-2xl shadow-xl p-8"
        >
          <h3 className="text-2xl font-bold text-pink-800 mb-6 text-center">What's Next?</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">📄</div>
              <h4 className="font-semibold text-pink-800 mb-2">Download & Print</h4>
              <p className="text-sm text-pink-600">
                Download your PDF and take it to any printing shop for high-quality prints
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">🌐</div>
              <h4 className="font-semibold text-pink-800 mb-2">Share Online</h4>
              <p className="text-sm text-pink-600">
                Share your unique invitation link on social media or via WhatsApp
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">📱</div>
              <h4 className="font-semibold text-pink-800 mb-2">Track Responses</h4>
              <p className="text-sm text-pink-600">
                Check your dashboard to see who has viewed your invitation
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-12 text-center text-pink-600"
        >
          <p className="text-sm">
            Need help? Contact our support team at{' '}
            <a href="mailto:shailendrasahani273209@gmail.com" className="text-indigo-600 hover:underline">
              shailendrasahani273209@gmail.com
            </a>
          </p>
          <p className="text-xs mt-2">
            Thank you for choosing Card Booking for your special occasion! 🎉
          </p>
        </motion.div>
      </div>
    </div>
  );
}
