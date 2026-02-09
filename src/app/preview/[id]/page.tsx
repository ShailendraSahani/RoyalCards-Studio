'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2, Edit } from 'lucide-react';
import Link from 'next/link';
import CardPreview from '@/components/CardPreview';

interface Booking {
  _id: string;
  templateId: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  quantity: number;
  deliveryDate: string;
  message: string;
  specialInstructions: string;
  price: number;
  status: string;
  shareSlug: string;
  pdfUrl?: string;
}

interface CardDesign {
  _id: string;
  name: string;
  description: string;
  category: string;
  templateImage: string;
  price: number;
}

export default function CardPreviewPage() {
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
      } else if (response.status === 404) {
        // If booking not found, redirect to create new booking
        router.push('/cards');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    setGeneratingPDF(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}/pdf`, {
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Not Found</h2>
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link
                href={`/book/${booking.templateId}`}
                className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-2"
              >
                <ArrowLeft size={20} />
                <span>Back to Edit</span>
              </Link>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                  Card Preview
                </h1>
                <p className="text-sm text-gray-600">
                  {booking.recipientName}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href={`/book/${booking.templateId}`}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                <Edit size={16} />
                <span>Edit Details</span>
              </Link>

              <button
                onClick={shareCard}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Share2 size={16} />
                <span>Share</span>
              </button>

              <button
                onClick={generatePDF}
                disabled={generatingPDF}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Download size={16} />
                <span>{generatingPDF ? 'Generating...' : 'Download PDF'}</span>
              </button>

              {booking.status !== 'paid' && (
                <Link
                  href={`/checkout/${booking._id}`}
                  className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-pink-700"
                >
                  <span>Complete Payment</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preview Section */}
          <div className="lg:col-span-2">
            <CardPreview booking={booking} card={card} />
          </div>

          {/* Details Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Booking Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'confirmed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Template:</span>
                  <span className="font-medium">{card.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-bold text-green-600">₹{booking.price}</span>
                </div>

                {booking.pdfUrl && (
                  <div className="pt-3 border-t">
                    <a
                      href={booking.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 block"
                    >
                      📄 View PDF
                    </a>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={generatePDF}
                  disabled={generatingPDF}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Download size={16} />
                  <span>{generatingPDF ? 'Generating PDF...' : 'Generate PDF'}</span>
                </button>

                <button
                  onClick={shareCard}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                >
                  <Share2 size={16} />
                  <span>Share Invitation</span>
                </button>

                <Link
                  href={`/invite/${booking.shareSlug}`}
                  target="_blank"
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2 block text-center"
                >
                  <span>🌐 View Public Page</span>
                </Link>
              </div>
            </motion.div>


          </div>
        </div>
      </main>
    </div>
  );
}
