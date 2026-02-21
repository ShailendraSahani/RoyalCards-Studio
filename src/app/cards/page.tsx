'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Filter, Star, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '@/components/Footer';

interface CardDesign {
  _id: string;
  name: string;
  description: string;
  category: string;
  templateImage: string;
  price: number;
  popularity?: number;
}

export default function CardsPage() {
  const [cards, setCards] = useState<CardDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState('');

  const categories = ['all', 'traditional', 'modern', 'elegant', 'fun', 'custom'];
  const priceRanges = [
    { label: 'All', value: 'all' },
    { label: 'Under ₹100', value: 'under100' },
    { label: '₹100 - ₹200', value: '100-200' },
    { label: '₹200 - ₹300', value: '200-300' },
    { label: '₹300 - ₹500', value: '300-500' },
    { label: 'Above ₹500', value: 'above500' },
  ];

  const fetchCards = async (category = 'all') => {
    try {
      setLoading(true);
      const url = category === 'all' ? '/api/cards' : `/api/cards?category=${category}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch cards');
      const data = await res.json();
      setCards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards(selectedCategory);
  }, [selectedCategory]);

  // Filter and sort cards
  const filteredCards = cards
    .filter(card => {
      if (searchQuery && !card.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (priceRange !== 'all') {
        if (priceRange === 'under100' && card.price >= 100) return false;
        if (priceRange === '100-200' && (card.price < 100 || card.price > 200)) return false;
        if (priceRange === '200-300' && (card.price < 200 || card.price > 300)) return false;
        if (priceRange === '300-500' && (card.price < 300 || card.price > 500)) return false;
        if (priceRange === 'above500' && card.price <= 500) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-yellow-50 to-pink-100">
      <header className="relative z-10 bg-gradient-to-r from-pink-500 via-yellow-400 to-pink-500 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Wedding Cards</h1>
              <p className="text-white/90 mt-1">Find the perfect card for your special day</p>
            </div>
            <Link href="/" className="flex items-center gap-2 text-white hover:text-yellow-200 font-medium transition">
              <span>← Back to Home</span>
            </Link>
          </motion.div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Search & Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-4 mb-6 shadow-lg border border-pink-200"
        >
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search wedding cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-yellow-400/50 bg-white rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:bg-white transition-all"
              />
              <button className="absolute right-2 top-3 text-pink-500" aria-label="Search">
                <Search size={20} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-700 text-sm">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-yellow-400/50 bg-white rounded-xl px-4 py-2 text-sm text-gray-800 focus:outline-none focus:border-yellow-500 focus:bg-white transition-all cursor-pointer"
                  aria-label="Sort options"
                >
                  <option value="popular" className="bg-white">Popularity</option>
                  <option value="price-low" className="bg-white">Price: Low to High</option>
                  <option value="price-high" className="bg-white">Price: High to Low</option>
                </select>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-2 border border-yellow-400/50 rounded-xl text-gray-800"
                aria-label="Toggle filters"
              >
                <Filter size={18} /> Filters
              </button>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`${showFilters ? 'block' : 'hidden'} md:block`}
              >
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 sticky top-24 w-[240px] shadow-lg border border-pink-200">
                  <h3 className="font-bold text-lg text-gray-800 mb-4">Filters</h3>

                  <div className="mb-6">
                    <h4 className="font-semibold text-sm text-pink-600 mb-3">Category</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label key={category} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="category"
                            checked={selectedCategory === category}
                            onChange={() => setSelectedCategory(category)}
                            className="w-4 h-4 text-pink-500 focus:ring-pink-500 accent-pink-500"
                          />
                          <span className="text-sm text-gray-600 group-hover:text-pink-600 transition">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-sm text-pink-600 mb-3">Price Range</h4>
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <label key={range.value} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="priceRange"
                            checked={priceRange === range.value}
                            onChange={() => setPriceRange(range.value)}
                            className="w-4 h-4 text-pink-500 focus:ring-pink-500 accent-pink-500"
                          />
                          <span className="text-sm text-gray-600 group-hover:text-pink-600 transition">{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-pink-600 mb-3">Customer Rating</h4>
                    <div className="space-y-2">
                      {[4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-pink-500 focus:ring-pink-500 accent-pink-500"
                          />
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-pink-300'}
                              />
                            ))}
                            <span className="text-sm text-gray-600">& Up</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Cards Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-pink-200">
                <p className="text-red-500 text-lg">{error}</p>
              </div>
            ) : filteredCards.length === 0 ? (
              <div className="text-center py-12 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-pink-200">
                <p className="text-pink-600 text-lg mb-4">No cards found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange('all');
                    setSearchQuery('');
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-pink-600 font-medium">
                  Showing {filteredCards.length} results
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filteredCards.map((card, idx) => (
                    <motion.div
                      key={card._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link
                        href={`/cards/${card._id}`}
                        className="group block"
                      >
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-pink-300/50 transition-all duration-300 border border-pink-200">
                          <div className="relative mb-3">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.3 }}
                            >
                              <img
                                src={card.templateImage}
                                alt={card.name}
                                className="w-full h-auto rounded-t-2xl"
                                style={{ minHeight: '180px', maxHeight: '300px' }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Wedding+Card';
                                }}
                              />
                            </motion.div>
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white text-xs px-3 py-1 rounded-full font-semibold">
                              {card.popularity && card.popularity > 10 ? 'Best Seller' : 'New'}
                            </div>
                          </div>

                          <div className="p-4 pt-0">
                            <h3 className="font-semibold text-gray-800 truncate text-lg mb-1">{card.name}</h3>
                            <p className="text-pink-500 text-sm capitalize mb-2">{card.category}</p>
                            
                            <div className="flex items-center gap-1 mb-2">
                              <span className="text-yellow-400 text-xs">★</span>
                              <span className="text-sm text-pink-500">{(card.popularity || 4.2).toFixed(1)}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-bold text-2xl text-pink-600">₹{card.price}</span>
                            </div>
                            <div className="text-xs text-green-600 font-medium mt-1">Free Shipping</div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
