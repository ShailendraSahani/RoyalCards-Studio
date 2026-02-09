'use client';

import { motion } from 'framer-motion';

interface Booking {
  templateId: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  quantity: number;
  deliveryDate: string;
  message: string;
  specialInstructions: string;
  price: number;
}

interface CardDesign {
  _id: string;
  name: string;
  description: string;
  category: string;
  templateImage: string;
  price: number;
}

interface CardPreviewProps {
  booking: Booking;
  card: CardDesign;
}

export default function CardPreview({ booking, card }: CardPreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getThemeStyles = () => {
    // Default theme for general cards
    const color = '#D4AF37'; // Gold
    return {
      background: `linear-gradient(135deg, #f8f9fa, ${color}10)`,
      borderColor: color,
      textColor: '#2d3748',
      accentColor: color
    };
  };

  const styles = getThemeStyles();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto"
    >
      {/* Card Preview */}
      <div
        className="relative rounded-3xl shadow-2xl overflow-hidden border-4"
        style={{
          background: styles.background,
          borderColor: styles.borderColor,
          color: styles.textColor
        }}
      >
        {/* Header Section */}
        <div className="relative p-8 text-center">
          {/* Decorative Border */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4" style={{ borderColor: styles.accentColor }}></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4" style={{ borderColor: styles.accentColor }}></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4" style={{ borderColor: styles.accentColor }}></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4" style={{ borderColor: styles.accentColor }}></div>
          </div>

          {/* Main Title */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: styles.accentColor }}>
              🎉
            </h1>
            <h2 className="text-2xl md:text-4xl font-bold mb-2">
              Card Invitation
            </h2>
            <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: styles.accentColor }}></div>
          </motion.div>

          {/* Recipient Name */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h3 className="text-3xl md:text-5xl font-bold">
              {booking.recipientName}
            </h3>
          </motion.div>

          {/* Personal Message */}
          {booking.message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-6 text-lg italic"
            >
              {booking.message}
            </motion.div>
          )}
        </div>

        {/* Card Details */}
        <div className="px-8 pb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6"
          >
            <h4 className="text-xl font-bold mb-4 text-center">Card Details</h4>

            <div className="space-y-3 text-center">
              <div>
                <span className="font-semibold">Quantity: </span>
                {booking.quantity}
              </div>
              <div>
                <span className="font-semibold">Delivery Date: </span>
                {formatDate(booking.deliveryDate)}
              </div>
              {booking.specialInstructions && (
                <div>
                  <span className="font-semibold">Special Instructions: </span>
                  {booking.specialInstructions}
                </div>
              )}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-8 pt-6 border-t border-white/20 text-center"
          >
            <div className="text-sm opacity-80">
              <div className="font-semibold">Contact Information</div>
              <div>{booking.recipientEmail}</div>
              <div className="mt-2">{booking.recipientPhone}</div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div
          className="px-8 py-4 text-center text-sm opacity-70"
          style={{ backgroundColor: styles.accentColor + '20' }}
        >
          With Warm Regards
        </div>
      </div>

      {/* Template Info */}
      <div className="mt-6 text-center text-gray-600">
        <p className="text-sm">
          Template: <span className="font-medium">{card.name}</span> •
          Quantity: <span className="font-medium">{booking.quantity}</span> •
          Price: <span className="font-medium">₹{booking.price}</span>
        </p>
      </div>
    </motion.div>
  );
}
