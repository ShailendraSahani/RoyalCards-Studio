"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ChevronRight, Star, Sparkles, Heart, Gift, PartyPopper, ArrowRight, Truck, Palette, Clock, BadgeIndianRupee } from 'lucide-react';
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

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 as const }
  }
};

export default function HomePage() {
  const [featuredCards, setFeaturedCards] = useState<CardDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{name: string, count: number, icon: string}[]>([]);
  const { data: session } = useSession();

  const fetchData = async () => {
    try {
      // Fetch cards and categories in parallel
      const [cardsResponse, categoriesResponse] = await Promise.all([
        fetch('/api/cards'),
        fetch('/api/categories')
      ]);

      if (cardsResponse.ok) {
        const data = await cardsResponse.json();
        setFeaturedCards(data.slice(0, 6));
      }

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        // Transform categories to include count and icon (API returns defaults if DB is empty)
        const categoryList = categoriesData.map((cat: { name: string; count: number; icon: string }) => ({
          name: cat.name,
          count: cat.count,
          icon: cat.icon || '📁'
        }));
        setCategories(categoryList);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Removed polling - real-time updates will come via useRealtime hook if needed
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Banner Strip */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <div className="bg-gradient-to-r from-pink-400 to-pink-500 py-3 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-6 overflow-x-auto pb-2">
              {[
                { img: "/banner/banner.png", alt: "Wedding Special" },
                { img: "/banner/banner1.png", alt: "New Designs" },
                { img: "/banner/ChatGPT Image Feb 21, 2026, 02_40_09 PM.png", alt: "Custom Cards" },
                { img: "/banner/Royal digital wedding experience.png", alt: "Premium Collection" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  className="flex-shrink-0 w-[160px] cursor-pointer"
                >
                  <div className="relative group">
                    <img 
                      src={item.img} 
                      alt={item.alt}
                      className="w-full h-[140px] object-cover rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-600/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                    <Sparkles className="absolute top-2 right-2 text-yellow-300 opacity-0 group-hover:opacity-100 animate-pulse" size={20} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Category Strip */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10"
      >
        <div className="bg-white shadow-md mx-4 -mt-2 rounded-2xl border border-pink-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-6 overflow-x-auto py-2">
              {categories.map((cat) => ({
                name: cat.name,
                icon: cat.icon || '📁',
                count: cat.count > 0 ? `${cat.count}+` : '0'
              })).map((category, idx) => (
                <motion.div
                  key={category.name}
                  whileHover={{ scale: 1.1, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    href={`/cards?category=${category.name.toLowerCase()}`}
                    className="flex flex-col items-center min-w-[80px] group"
                  >
                    <div className="relative">
                      <div className="text-4xl mb-2">
                        {category.icon}
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-pink-600">
                      {category.name}
                    </span>
                    <span className="text-xs text-pink-500 font-medium">{category.count}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="py-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Left Side - Cards */}
            <div className="flex-1">
              {/* Hero Message */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-8 text-center"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="text-pink-600">
                    Create Magical
                  </span>
                  <br />
                  <span className="text-yellow-600">Wedding Memories</span>
                </h1>
                <p className="text-pink-500 text-lg max-w-2xl mx-auto">
                  Handcrafted invitations that tell your love story
                </p>
              </motion.div>

              {/* Featured Cards Section */}
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-pink-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <Heart className="text-pink-500" size={24} />
                      <span className="text-pink-600">Trending Now</span>
                    </h2>
                    <p className="text-pink-400 text-sm">Discover our most beloved designs</p>
                  </div>
                  <Link 
                    href="/cards" 
                    className="group flex items-center gap-2 text-pink-500 font-semibold hover:text-pink-600 transition"
                  >
                    View All 
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {loading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {[1,2,3,4,5,6].map((i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-pink-50 rounded-xl p-3 animate-pulse"
                      >
                        <div className="w-full h-36 bg-pink-100 rounded-xl mb-3"></div>
                        <div className="h-5 bg-pink-100 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-pink-100 rounded w-1/2"></div>
                      </motion.div>
                    ))}
                  </div>
                ) : featuredCards.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 stagger-children">
                    {featuredCards.map((card, idx) => (
                      <motion.div
                        key={card._id}
                        variants={fadeInUp}
                        whileHover={{ scale: 1.03, rotate: 0.5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Link 
                          href={`/cards/${card._id}`}
                          className="group block"
                        >
                          <div className="relative mb-3 overflow-hidden rounded-xl">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.4 }}
                            >
                              <img 
                                src={card.templateImage} 
                                alt={card.name} 
                                className="w-full h-36 object-cover rounded-xl"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Wedding+Card';
                                }}
                              />
                            </motion.div>
                            <div className="absolute top-2 right-2 bg-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                              <Star size={12} className="fill-white" />
                              {(card.popularity || 4.2).toFixed(1)}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 truncate text-lg">{card.name}</h3>
                            <p className="text-pink-500 text-sm capitalize mb-2">{card.category}</p>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-2xl text-pink-600">₹{card.price}</span>
                              <span className="text-sm text-gray-400 line-through">₹{card.price + 100}</span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Sparkles className="mx-auto text-pink-500 mb-4" size={48} />
                    <p className="text-gray-500 mb-4 text-lg">No cards available yet.</p>
                    {session?.user?.role === 'admin' && (
                      <Link href="/admin/cards/add" className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition">
                        <Gift size={18} /> Add your first card
                      </Link>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Best Sellers & New Arrivals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['Best Sellers', 'New Arrivals'].map((title, idx) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-5 shadow-lg border border-pink-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                        {idx === 0 ? <Heart className="text-pink-500" size={20} /> : <Sparkles className="text-yellow-500" size={20} />}
                        <span className="text-pink-600">{title}</span>
                      </h3>
                      <Link href="/cards" className="text-pink-500 text-sm hover:text-pink-600 transition flex items-center gap-1">
                        See All <ChevronRight size={16} />
                      </Link>
                    </div>
                    {loading ? (
                      <div className="grid grid-cols-2 gap-3">
                        {[1,2,3,4].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="w-full h-28 bg-pink-50 rounded-xl mb-2"></div>
                            <div className="h-4 bg-pink-50 rounded w-3/4"></div>
                          </div>
                        ))}
                      </div>
                    ) : featuredCards.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {featuredCards.slice(0, 4).map((card, i) => (
                          <motion.div
                            key={card._id}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <Link href={`/cards/${card._id}`} className="group block">
                              <div className="relative mb-2 overflow-hidden rounded-xl">
                                <img 
                                  src={card.templateImage}
                                  alt={card.name}
                                  className="w-full h-28 object-cover group-hover:scale-110 transition-transform duration-300"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x150?text=Card';
                                  }}
                                />
                              </div>
                              <p className="font-semibold text-gray-800 text-sm truncate">{card.name}</p>
                              <p className="font-bold text-pink-500">₹{card.price}</p>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No cards available</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Side - Offers */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="hidden lg:block w-[280px] flex-shrink-0"
            >
              <div className="bg-white rounded-2xl p-5 sticky top-24 shadow-lg border border-pink-100">
                <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
                  <Gift className="text-pink-500" size={22} />
                  <span className="text-pink-600">Top Offers</span>
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: '🎁', title: 'Bank Offers', desc: '5% Instant Discount', color: 'from-pink-400 to-pink-500' },
                    { icon: '📱', title: 'Mobile Recharge', desc: 'Get 10% SuperCash', color: 'from-yellow-400 to-yellow-500' },
                    { icon: '🛒', title: 'Buy More Save More', desc: 'Up to 50% Off', color: 'from-pink-300 to-pink-400' },
                    { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹299', color: 'from-yellow-300 to-yellow-400' },
                  ].map((offer, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className={`p-4 rounded-xl bg-gradient-to-r ${offer.color} opacity-90 hover:opacity-100 cursor-pointer transition-all hover:shadow-lg`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{offer.icon}</span>
                        <div>
                          <p className="font-bold text-white">{offer.title}</p>
                          <p className="text-white/80 text-sm">{offer.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Link 
                  href="/cards"
                  className="block text-center mt-6 text-pink-500 font-semibold hover:text-pink-600 transition flex items-center justify-center gap-2"
                >
                  View All Offers <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-10 relative z-10 bg-pink-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              <span className="text-pink-600">Why Choose Us</span>
            </h2>
            <p className="text-pink-500">Premium quality, unbeatable prices</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Palette, title: 'Professional Designs', desc: 'Expert designers', color: 'from-pink-400 to-pink-500' },
              { icon: Clock, title: 'Instant Customization', desc: 'Real-time editing', color: 'from-yellow-400 to-yellow-500' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Quick production', color: 'from-pink-300 to-pink-400' },
              { icon: BadgeIndianRupee, title: 'Best Prices', desc: 'Quality at affordable rates', color: 'from-yellow-300 to-yellow-400' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`p-5 rounded-2xl bg-gradient-to-r ${feature.color} opacity-90 hover:opacity-100 transition-all hover:shadow-xl cursor-pointer group`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <feature.icon size={28} className="text-white" />
                  <p className="font-bold text-white text-lg">{feature.title}</p>
                </div>
                <p className="text-white/80 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
