'use client';

import { motion } from 'framer-motion';

export default function SizeGuidePage() {
  const cardSizes = [
    {
      name: 'Standard Invitation',
      dimensions: '5" x 7"',
      description: 'Perfect for most wedding invitations. Fits standard envelopes.',
      uses: ['Wedding invitations', 'Save the dates', 'RSVP cards'],
      icon: '💒'
    },
    {
      name: 'Large Invitation',
      dimensions: '6" x 8"',
      description: 'For more elaborate designs with more space for customization.',
      uses: ['Luxury invitations', 'Destination weddings', 'Corporate events'],
      icon: '👑'
    },
    {
      name: 'Square Card',
      dimensions: '5.5" x 5.5"',
      description: 'Modern square format, great for contemporary designs.',
      uses: ['Modern weddings', 'Thank you cards', 'Birth announcements'],
      icon: '⬜'
    },
    {
      name: 'Folded Card',
      dimensions: '5" x 7" (folded)',
      description: 'Cards that fold to reveal more content inside.',
      uses: ['Detailed invitations', 'Multi-page designs', 'Photo inserts'],
      icon: '📖'
    }
  ];

  const paperTypes = [
    {
      name: 'Premium Cardstock',
      thickness: '300 GSM',
      description: 'High-quality, durable paper with a luxurious feel.',
      bestFor: 'Most invitations and formal cards'
    },
    {
      name: 'Matte Finish',
      thickness: '250 GSM',
      description: 'Smooth, non-shiny surface that&apos;s easy to write on.',
      bestFor: 'Traditional and elegant designs'
    },
    {
      name: 'Glossy Finish',
      thickness: '250 GSM',
      description: 'Shiny surface that makes colors pop and photos vibrant.',
      bestFor: 'Modern designs with photos'
    },
    {
      name: 'Recycled Paper',
      thickness: '200 GSM',
      description: 'Eco-friendly option made from recycled materials.',
      bestFor: 'Environmentally conscious couples'
    }
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
            Size Guide
          </h1>
          <p className="text-xl text-pink-600 max-w-2xl mx-auto">
            Choose the perfect size and paper type for your wedding cards.
          </p>
        </motion.div>

        {/* Card Sizes */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-pink-800 text-center mb-8">Card Sizes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {cardSizes.map((size, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{size.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-pink-800">{size.name}</h3>
                    <p className="text-rose-600 font-semibold">{size.dimensions}</p>
                  </div>
                </div>
                <p className="text-pink-600 mb-4">{size.description}</p>
                <div>
                  <h4 className="font-semibold text-pink-800 mb-2">Common uses:</h4>
                  <ul className="text-sm text-pink-600 space-y-1">
                    {size.uses.map((use, i) => (
                      <li key={i}>• {use}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Paper Types */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-pink-800 text-center mb-8">Paper Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {paperTypes.map((paper, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-pink-800 mb-2">{paper.name}</h3>
                <p className="text-rose-600 font-semibold mb-3">{paper.thickness}</p>
                <p className="text-pink-600 mb-3">{paper.description}</p>
                <p className="text-sm text-pink-500">
                  <strong>Best for:</strong> {paper.bestFor}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Size Comparison */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-pink-800 text-center mb-8">Size Comparison</h2>
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <div className="bg-pink-100 rounded-lg p-4 mb-4" style={{width: '100px', height: '140px', margin: '0 auto'}}>
                  <div className="bg-white border-2 border-pink-300 rounded" style={{width: '80px', height: '112px', margin: '14px auto'}}></div>
                </div>
                <h3 className="font-semibold text-pink-800">Standard</h3>
                <p className="text-sm text-pink-600">5" x 7"</p>
              </div>

              <div className="text-center">
                <div className="bg-pink-100 rounded-lg p-4 mb-4" style={{width: '120px', height: '160px', margin: '0 auto'}}>
                  <div className="bg-white border-2 border-pink-300 rounded" style={{width: '96px', height: '128px', margin: '16px auto'}}></div>
                </div>
                <h3 className="font-semibold text-pink-800">Large</h3>
                <p className="text-sm text-pink-600">6" &times; 8"</p>
              </div>

              <div className="text-center">
                <div className="bg-pink-100 rounded-lg p-4 mb-4" style={{width: '110px', height: '110px', margin: '0 auto'}}>
                  <div className="bg-white border-2 border-pink-300 rounded" style={{width: '88px', height: '88px', margin: '11px auto'}}></div>
                </div>
                <h3 className="font-semibold text-pink-800">Square</h3>
                <p className="text-sm text-pink-600">5.5" x 5.5"</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-rose-500 to-yellow-500 rounded-xl shadow-lg p-8 text-white max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">💡 Pro Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold mb-2">For Traditional Weddings:</h4>
                <p className="text-sm opacity-90">Choose standard size with matte finish for an elegant, timeless look.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">For Modern Weddings:</h4>
                <p className="text-sm opacity-90">Opt for square cards with glossy finish to showcase vibrant photos.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">For Luxury Feel:</h4>
                <p className="text-sm opacity-90">Large cards with premium cardstock create a sophisticated impression.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">For Eco-Friendly:</h4>
                <p className="text-sm opacity-90">Recycled paper options maintain quality while being environmentally conscious.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
