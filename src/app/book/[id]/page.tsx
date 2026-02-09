 'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CardDesign {
  _id: string;
  name: string;
  description: string;
  category: string;
  templateImage: string;
  price: number;
}

interface BookingDetails {
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  quantity: number;
  deliveryDate: string;
  message: string;
  specialInstructions: string;
  aspirant: {
    name: string;
    relation: string;
    contactNumber: string;
  };
  groom: {
    fullName: string;
    fatherName: string;
    motherName: string;
    photoUrl: string;
  };
  bride: {
    fullName: string;
    fatherName: string;
    motherName: string;
    photoUrl: string;
  };
  wedding: {
    date: string;
    time: string;
    venueName: string;
    fullAddress: string;
    city: string;
    state: string;
    googleMapLink: string;
  };
  events: Array<{
    eventName: string;
    eventDate: string;
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
    backgroundMusic: string;
  };
}

export default function CardBookingForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const templateId = params.id as string;

  const [card, setCard] = useState<CardDesign | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    quantity: 1,
    deliveryDate: '',
    message: '',
    specialInstructions: '',
    aspirant: {
      name: '',
      relation: '',
      contactNumber: '',
    },
    groom: {
      fullName: '',
      fatherName: '',
      motherName: '',
      photoUrl: '',
    },
    bride: {
      fullName: '',
      fatherName: '',
      motherName: '',
      photoUrl: '',
    },
    wedding: {
      date: '',
      time: '',
      venueName: '',
      fullAddress: '',
      city: '',
      state: '',
      googleMapLink: '',
    },
    events: [{
      eventName: 'Wedding Ceremony',
      eventDate: '',
      eventTime: '',
      eventVenue: '',
    }],
    messages: {
      familyInvitation: '',
      religiousQuote: '',
      specialMessage: '',
    },
    theme: {
      cardTheme: 'Royal',
      language: 'Hindi',
      colorTheme: '#D4AF37',
      backgroundMusic: '',
    },
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchCardDetails();
  }, [session, status, router, templateId]);

  const fetchCardDetails = async () => {
    try {
      const response = await fetch(`/api/cards/${templateId}`);
      if (response.ok) {
        const cardData = await response.json();
        setCard(cardData);
      }
    } catch (error) {
      console.error('Error fetching card:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    setBookingDetails(prev => {
      const updateNested = (obj: any, keys: string[], value: any): any => {
        if (keys.length === 1) {
          const key = keys[0];
          if (Array.isArray(obj)) {
            const index = parseInt(key);
            if (!isNaN(index)) {
              const newArray = [...obj];
              newArray[index] = value;
              return newArray;
            }
          }
          return { ...obj, [key]: value };
        }
        const key = keys[0];
        let current = obj[key];
        if (current === undefined) {
          const index = parseInt(key);
          if (!isNaN(index)) {
            current = [];
          } else {
            current = {};
          }
        }
        const updatedValue = updateNested(current, keys.slice(1), value);
        if (Array.isArray(obj)) {
          const index = parseInt(key);
          if (!isNaN(index)) {
            const newArray = [...obj];
            newArray[index] = updatedValue;
            return newArray;
          }
        }
        return { ...obj, [key]: updatedValue };
      };
      return updateNested(prev, keys, value);
    });
  };

  const totalPrice = useMemo(() => {
    if (!card) return 0;
    return card.price * bookingDetails.quantity;
  }, [card?.price, bookingDetails.quantity]);

  const handleBooking = async () => {
    if (!card) return;

    setBooking(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          ...bookingDetails,
          price: totalPrice,
          status: 'confirmed',
        }),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/checkout/${result._id}`);
      } else {
        const errorData = await response.json();
        alert(`Error creating booking: ${errorData.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error creating booking. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/cards" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Cards
            </Link>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Card Booking</h1>
            <p className="text-gray-600">Book your custom card</p>
          </div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Details</h2>

            <div className="space-y-8">
                {/* Aspirant Details */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Aspirant Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="aspirant.name"
                        value={bookingDetails.aspirant.name}
                        onChange={handleInputChange}
                        placeholder="Enter aspirant's name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relation
                      </label>
                      <input
                        type="text"
                        name="aspirant.relation"
                        value={bookingDetails.aspirant.relation}
                        onChange={handleInputChange}
                        placeholder="e.g., Son, Daughter"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        name="aspirant.contactNumber"
                        value={bookingDetails.aspirant.contactNumber}
                        onChange={handleInputChange}
                        placeholder="+91 9876543210"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Groom Details */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Groom Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="groom.fullName"
                        value={bookingDetails.groom.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter groom's full name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Father's Name
                      </label>
                      <input
                        type="text"
                        name="groom.fatherName"
                        value={bookingDetails.groom.fatherName}
                        onChange={handleInputChange}
                        placeholder="Enter father's name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mother's Name
                      </label>
                      <input
                        type="text"
                        name="groom.motherName"
                        value={bookingDetails.groom.motherName}
                        onChange={handleInputChange}
                        placeholder="Enter mother's name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Photo URL (Optional)
                      </label>
                      <input
                        type="url"
                        name="groom.photoUrl"
                        value={bookingDetails.groom.photoUrl}
                        onChange={handleInputChange}
                        placeholder="https://example.com/photo.jpg"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Bride Details */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Bride Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="bride.fullName"
                        value={bookingDetails.bride.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter bride's full name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Father's Name
                      </label>
                      <input
                        type="text"
                        name="bride.fatherName"
                        value={bookingDetails.bride.fatherName}
                        onChange={handleInputChange}
                        placeholder="Enter father's name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mother's Name
                      </label>
                      <input
                        type="text"
                        name="bride.motherName"
                        value={bookingDetails.bride.motherName}
                        onChange={handleInputChange}
                        placeholder="Enter mother's name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Photo URL (Optional)
                      </label>
                      <input
                        type="url"
                        name="bride.photoUrl"
                        value={bookingDetails.bride.photoUrl}
                        onChange={handleInputChange}
                        placeholder="https://example.com/photo.jpg"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Wedding Details */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Wedding Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wedding Date
                      </label>
                      <input
                        type="date"
                        name="wedding.date"
                        value={bookingDetails.wedding.date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wedding Time
                      </label>
                      <input
                        type="time"
                        name="wedding.time"
                        value={bookingDetails.wedding.time}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Venue Name
                      </label>
                      <input
                        type="text"
                        name="wedding.venueName"
                        value={bookingDetails.wedding.venueName}
                        onChange={handleInputChange}
                        placeholder="Enter venue name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="wedding.city"
                        value={bookingDetails.wedding.city}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="wedding.state"
                        value={bookingDetails.wedding.state}
                        onChange={handleInputChange}
                        placeholder="Enter state"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Google Map Link (Optional)
                      </label>
                      <input
                        type="url"
                        name="wedding.googleMapLink"
                        value={bookingDetails.wedding.googleMapLink}
                        onChange={handleInputChange}
                        placeholder="https://maps.google.com/..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Address
                      </label>
                      <textarea
                        name="wedding.fullAddress"
                        value={bookingDetails.wedding.fullAddress}
                        onChange={handleInputChange}
                        placeholder="Enter complete address"
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Events */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Wedding Events</h3>
                  {(bookingDetails.events || []).map((event, index) => (
                    <div key={index} className="mb-4 p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Event Name
                          </label>
                          <input
                            type="text"
                            name={`events.${index}.eventName`}
                            value={event.eventName}
                            onChange={handleInputChange}
                            placeholder="e.g., Wedding Ceremony"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Event Date
                          </label>
                          <input
                            type="date"
                            name={`events.${index}.eventDate`}
                            value={event.eventDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Event Time
                          </label>
                          <input
                            type="time"
                            name={`events.${index}.eventTime`}
                            value={event.eventTime}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Event Venue
                          </label>
                          <input
                            type="text"
                            name={`events.${index}.eventVenue`}
                            value={event.eventVenue}
                            onChange={handleInputChange}
                            placeholder="Enter event venue"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Messages */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Messages</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Family Invitation
                      </label>
                      <textarea
                        name="messages.familyInvitation"
                        value={bookingDetails.messages.familyInvitation}
                        onChange={handleInputChange}
                        placeholder="Enter family invitation message"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Religious Quote
                      </label>
                      <textarea
                        name="messages.religiousQuote"
                        value={bookingDetails.messages.religiousQuote}
                        onChange={handleInputChange}
                        placeholder="Enter religious quote"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Message
                      </label>
                      <textarea
                        name="messages.specialMessage"
                        value={bookingDetails.messages.specialMessage}
                        onChange={handleInputChange}
                        placeholder="Enter special message"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Theme */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Theme Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Theme
                      </label>
                      <select
                        name="theme.cardTheme"
                        value={bookingDetails.theme.cardTheme}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="Royal">Royal</option>
                        <option value="Traditional">Traditional</option>
                        <option value="Modern">Modern</option>
                        <option value="Elegant">Elegant</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        name="theme.language"
                        value={bookingDetails.theme.language}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="Hindi">Hindi</option>
                        <option value="English">English</option>
                        <option value="Bilingual">Bilingual</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color Theme
                      </label>
                      <input
                        type="color"
                        name="theme.colorTheme"
                        value={bookingDetails.theme.colorTheme}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Background Music URL (Optional)
                      </label>
                      <input
                        type="url"
                        name="theme.backgroundMusic"
                        value={bookingDetails.theme.backgroundMusic}
                        onChange={handleInputChange}
                        placeholder="https://example.com/music.mp3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Recipient Details */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recipient Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recipient Name
                      </label>
                      <input
                        type="text"
                        name="recipientName"
                        value={bookingDetails.recipientName}
                        onChange={handleInputChange}
                        placeholder="Enter recipient's full name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recipient Email
                      </label>
                      <input
                        type="email"
                        name="recipientEmail"
                        value={bookingDetails.recipientEmail}
                        onChange={handleInputChange}
                        placeholder="recipient@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recipient Phone
                      </label>
                      <input
                        type="tel"
                        name="recipientPhone"
                        value={bookingDetails.recipientPhone}
                        onChange={handleInputChange}
                        placeholder="+91 9876543210"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Quantity & Delivery */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        value={bookingDetails.quantity}
                        onChange={(e) => setBookingDetails(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Date
                      </label>
                      <input
                        type="date"
                        name="deliveryDate"
                        value={bookingDetails.deliveryDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Messages */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Messages</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Personal Message (Optional)
                      </label>
                      <textarea
                        name="message"
                        value={bookingDetails.message}
                        onChange={handleInputChange}
                        placeholder="Write a personal message for the card..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Instructions (Optional)
                      </label>
                      <textarea
                        name="specialInstructions"
                        value={bookingDetails.specialInstructions}
                        onChange={handleInputChange}
                        placeholder="Any special delivery instructions..."
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Total Price */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">Total Price:</span>
                    <span className="text-2xl font-bold text-indigo-600">₹{totalPrice}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {bookingDetails.quantity} × ₹{card?.price || 0} per card
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBooking}
                    disabled={booking || !bookingDetails.deliveryDate || !bookingDetails.recipientName || !bookingDetails.recipientEmail}
                    className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-lg hover:from-indigo-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {booking ? 'Processing...' : 'Proceed to Payment'}
                  </motion.button>
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
