'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Filter, Star, ChevronDown, Search } from 'lucide-react';

interface CardDesign {
  _id: string;
  name: string;
  description: string;
  category: string;
  templateImage: string;
  price: number;
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
      // Search filter
      if (searchQuery && !card.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Price filter
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
      return 0; // popular - keep original order
    });

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Wedding Cards</h1>
            <Link href="/" className="text-white hover:text-yellow-300 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and Sort Bar */}
        <div className="bg-white rounded-sm shadow-sm p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search wedding cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-pink-500"
              />
              <button className="absolute right-2 top-2 text-pink-500">
                <Search size={20} />
              </button>
            </div>

            {/* Sort and Filter Toggle */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-pink-500"
                >
                  <option value="popular">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-sm text-gray-700"
              >
                <Filter size={18} /> Filters
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-[240px] flex-shrink-0`}>
            <div className="bg-white rounded-sm shadow-sm p-4 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Filters</h3>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="text-pink-500 focus:ring-pink-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={priceRange === range.value}
                        onChange={() => setPriceRange(range.value)}
                        className="text-pink-500 focus:ring-pink-500"
                      />
                      <span className="text-sm text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Customer Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="text-pink-500 focus:ring-pink-500"
                      />
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                        <span className="text-sm text-gray-600">& Up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Cards Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 text-lg">{error}</p>
              </div>
            ) : filteredCards.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-sm shadow-sm">
                <p className="text-gray-500 text-lg">No cards found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 text-pink-500 hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Showing {filteredCards.length} results
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredCards.map((card, index) => (
                    <Link
                      key={card._id}
                      href={`/cards/${card._id}`}
                      className="group bg-white rounded-sm shadow-sm hover:shadow-md transition p-3"
                    >
                      <div className="relative mb-2">
                        <img
                          src={card.templateImage}
                          alt={card.name}
                          className="w-full h-36 object-cover rounded-sm"
                        />
                        <div className="absolute top-1 left-1 bg-pink-500 text-white text-xs px-1.5 py-0.5 rounded-sm">
                          {Math.floor(Math.random() * 20 + 40)}% OFF
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-sm text-gray-800 truncate">{card.name}</h3>
                        <p className="text-xs text-gray-500 mb-1">{card.category}</p>
                        
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-yellow-500 text-xs">★</span>
                          <span className="text-xs text-gray-600">{Math.random() * 2 + 3.5}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">₹{card.price}</span>
                          <span className="text-xs text-gray-400 line-through">₹{card.price + 100}</span>
                        </div>
                        <div className="text-xs text-green-600 font-medium">Free Shipping</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
