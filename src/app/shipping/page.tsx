'use client';

import { motion } from 'framer-motion';

export default function ShippingPage() {
  const shippingOptions = [
    {
      name: 'Standard Shipping',
      time: '5-7 business days',
      cost: '₹99',
      description: 'Reliable delivery for most orders',
      features: ['Free for orders above ₹500', 'Tracking included', 'Insurance coverage']
    },
    {
      name: 'Express Shipping',
      time: '2-3 business days',
      cost: '₹199',
      description: 'Faster delivery for urgent orders',
      features: ['Priority handling', 'Real-time tracking', 'Extended insurance']
    },
    {
      name: 'Overnight Shipping',
      time: '1 business day',
      cost: '₹399',
      description: 'Next business day delivery',
      features: ['Guaranteed delivery', 'Premium packaging', 'Full insurance coverage']
    }
  ];

  const deliveryAreas = [
    { city: 'Mumbai', pincode: '400001-400099', time: '1-2 days' },
    { city: 'Delhi', pincode: '110001-110099', time: '2-3 days' },
    { city: 'Bangalore', pincode: '560001-560099', time: '2-4 days' },
    { city: 'Chennai', pincode: '600001-600099', time: '2-4 days' },
    { city: 'Kolkata', pincode: '700001-700099', time: '3-5 days' },
    { city: 'Pune', pincode: '411001-411099', time: '1-2 days' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-pink-800 mb-4">
            Shipping Information
          </h1>
          <p className="text-xl text-pink-600 max-w-2xl mx-auto">
            Fast, reliable delivery for your wedding cards across India.
          </p>
        </motion.div>

        {/* Shipping Options */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-pink-800 text-center mb-8">Shipping Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {shippingOptions.map((option, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-pink-800 mb-2">{option.name}</h3>
                  <div className="text-3xl font-bold text-rose-600 mb-1">{option.cost}</div>
                  <p className="text-sm text-pink-600">{option.time}</p>
                </div>
                <p className="text-pink-600 mb-4 text-center">{option.description}</p>
                <ul className="space-y-2">
                  {option.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm text-pink-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Delivery Areas */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-pink-800 text-center mb-8">Delivery Areas</h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-pink-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-pink-800">City</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-pink-800">Pincode Range</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-pink-800">Delivery Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {deliveryAreas.map((area, index) => (
                    <tr key={index} className="hover:bg-pink-50">
                      <td className="px-6 py-4 text-sm text-pink-800 font-medium">{area.city}</td>
                      <td className="px-6 py-4 text-sm text-pink-600">{area.pincode}</td>
                      <td className="px-6 py-4 text-sm text-pink-600">{area.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Shipping Policy */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-pink-800 text-center mb-8">Shipping Policy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-pink-800 mb-4">📦 Order Processing</h3>
              <ul className="space-y-3 text-pink-600">
                <li>• Orders are processed within 24 hours</li>
                <li>• Production time: 2-3 business days</li>
                <li>• Quality check before shipping</li>
                <li>• Email confirmation with tracking</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-pink-800 mb-4">🚚 Delivery & Returns</h3>
              <ul className="space-y-3 text-pink-600">
                <li>• Free shipping on orders above ₹500</li>
                <li>• 7-day return window</li>
                <li>• Damaged items replaced free</li>
                <li>• Customer satisfaction guarantee</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Contact for Shipping */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-rose-500 to-yellow-500 rounded-xl shadow-lg p-8 text-white max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Questions About Shipping?</h3>
            <p className="text-lg opacity-90 mb-6">
              Our shipping team is here to help ensure your cards arrive on time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:shailendrasahani273209@gmail.com"
                className="bg-white text-rose-600 px-6 py-3 rounded-lg font-semibold hover:bg-pink-100 transition-colors"
              >
                Email Shipping Team
              </a>
              <a
                href="tel:+917388711487"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-rose-600 transition-colors"
              >
                Call: +91 73887 11487
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
